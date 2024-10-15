const portfolioModel = require("../models/portfolioModel")
const invoiceBillController = require('./invoiceBillController')
const exchangeRates = require('../services/exchange_rates.json')


// Get All portfolios
module.exports.GET = async(req, res) =>{
    try {
        const portfolios = await portfolioModel.find()
        res.json(portfolios)
    } catch{
        res.status(500).json({message: "Error al obtener los portfolios"})
    }
}

// Get portfolio by ID
module.exports.GET_BY_ID = async (req, res) => {
    const { id } = req.params;

    try {
        const portfolio = await portfolioModel.findById(id);

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio no encontrado" });
        }

        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el portfolio" });
    }
};

// Post portfolio
module.exports.POST = async (req, res) => {
    const { name, state } = req.body;

    try {
        const newPortfolio = new portfolioModel({
            name,
            state
        });

        const savedPortfolio = await newPortfolio.save();
        res.status(201).json(savedPortfolio);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el portfolio" });
    }
};

// Put portfolio
module.exports.PUT = async (req, res) => {
    const { id } = req.params;
    const { name, state } = req.body;

    try {
        const portfolio = await portfolioModel.findById(id);

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio no encontrado" });
        }

        // Actualiza los campos del portafolio con los datos recibidos
        if (name) portfolio.name = name;
        if (state) portfolio.state = state;

        portfolio.bankId = null;
        portfolio.tcea = null;
        portfolio.netDiscountedValue = null;
        portfolio.dateTcea = null;
        portfolio.amount = null;
        
        const updatedPortfolio = await portfolio.save();

        res.json(updatedPortfolio);
    } catch (error) {
        console.error("Error al actualizar el portfolio:", error);
        res.status(500).json({ message: "Error al actualizar el portfolio" });
    }
};

// Put calculate tcea portfolio
module.exports.PUT_TCEA = async (req, res) => {
    const { id } = req.params;
    const { bankId, dateTcea  } = req.body;

    try {
        // Obtén el portafolio por ID
        const portfolio = await portfolioModel.findById(id);
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio no encontrado" });
        }
        
       // Crear un objeto req simulado para GET_BY_PORTFOLIO_ID_INT
       const invoiceBills = await invoiceBillController.GET_BY_PORTFOLIO_ID_INT({ params: { id: portfolio._id } });

        if (!invoiceBills || invoiceBills.length === 0) {
            return res.status(404).json({ message: "No se encontraron facturas para el portfolioId proporcionado" });
        }

         // Ejecutar PUT_TCEA para todas las facturas sin pasar el objeto res
         const updatePromises = invoiceBills.map(async (element) => {
            try {
                return await invoiceBillController.PUT_TCEA({
                    params: { id: element._id },
                    body: { dateTcea, bankId: bankId }
                },{});
            } catch (error) {
                console.error(`Error al actualizar TCEA de factura ${element._id}:`, error);
                throw error; // Permitir que los errores se propaguen
            }
        });

        // Espera a que todas las promesas se resuelvan
        const updatedInvoices = await Promise.all(updatePromises);

        // Calcula el monto neto descontado usando reduce
        const netDiscountedValue = updatedInvoices.reduce((accumulator, invoice) => {
            return accumulator + invoice.netDiscountedAmount;
        }, 0);

        // Calcula el TCEA
        const { nom, den } = updatedInvoices.reduce((acc, invoice) => {
            const amountInSoles = invoice.currency === 'USD' ? invoice.amount * exchangeRates.rates.PEN : invoice.amount;
            acc.nom += amountInSoles * (invoice.tcea / 100);
            acc.den += amountInSoles;
            return acc;
        }, { nom: 0, den: 0 });

        const tcea = (den !== 0) ? (nom / den) * 100 : 0;

        portfolio.bankId = bankId;
        portfolio.tcea = tcea;
        portfolio.netDiscountedAmount = netDiscountedValue;
        portfolio.dateTcea = dateTcea;
        portfolio.amount = den;

        const updatedPortfolio = await portfolio.save();

        res.json(updatedPortfolio);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al calcular el TCEA" });
    }
};


// Delete portfolio
module.exports.DELETE = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPortfolio = await portfolioModel.findByIdAndDelete(id);

        if (!deletedPortfolio) {
            return res.status(404).json({ message: "Portfolio no encontrado" });
        }

        res.status(200);
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el portfolio" });
    }
};

