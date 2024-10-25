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
    const { name, state, currency } = req.body;

    try {
        const newPortfolio = new portfolioModel({
            name,
            state,
            currency
        });

        const savedPortfolio = await newPortfolio.save();
        res.status(200).json(savedPortfolio);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el portfolio" });
    }
};

// Put portfolio
module.exports.PUT = async (req, res) => {
    const { id } = req.params;
    const { name, state, currency } = req.body;

    try {
        const portfolio = await portfolioModel.findById(id);

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio no encontrado" });
        }

        // Actualiza los campos del portafolio con los datos recibidos
        if (name) portfolio.name = name;
        if (state) portfolio.state = state;
        if (currency) portfolio.currency = currency;

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
        // Obtener portfolio y facturas en paralelo
        const [portfolio, invoiceBills] = await Promise.all([
            portfolioModel.findById(id),
            invoiceBillController.GET_BY_PORTFOLIO_ID_INT({ params: { id } })
        ]);

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio no encontrado" });
        }

        if (!invoiceBills?.length) {
            return res.status(404).json({ 
                message: "No se encontraron facturas para el portfolioId proporcionado" 
            });
        }

        // Actualizar TCEAs y calcular valores
        const updatedInvoices = await Promise.all(
            invoiceBills.map(({ _id }) => 
                invoiceBillController.PUT_TCEA({
                    params: { id: _id },
                    body: { dateTcea, bankId }
                }, {})
            )
        );

        const isUSD = portfolio.currency === 'USD';
        const { netDiscountedValue, tceaValues, amount } = calculatePortfolioValues(updatedInvoices, isUSD);

        // Actualizar portfolio
        const updatedPortfolio = await portfolioModel.findByIdAndUpdate(
            id,
            {
                bankId,
                tcea: tceaValues.den !== 0 ? (tceaValues.nom / tceaValues.den) * 100 : 0,
                netDiscountedAmount: netDiscountedValue,
                netDiscountedAmountPen: isUSD ? netDiscountedValue * exchangeRates.rates.PEN : netDiscountedValue,
                dateTcea,
                amount: amount
            },
            { new: true }
        );

        res.json(updatedPortfolio);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al calcular el TCEA", error: error });
    }
};

// Función auxiliar para cálculos
const calculatePortfolioValues = (invoices, isUSD) => {
    return invoices.reduce((acc, invoice) => {
        // Calcular monto neto descontado
        acc.netDiscountedValue += isUSD ? 
            invoice.netDiscountedAmount : 
            invoice.netDiscountedAmountPen;

        // Calcular valores para TCEA
        const amountInSoles = invoice.currency === 'USD' ? 
            invoice.amount * exchangeRates.rates.PEN : 
            invoice.amount;
            
        acc.tceaValues.nom += amountInSoles * (invoice.tcea / 100);
        acc.tceaValues.den += amountInSoles;
        
        acc.amount += invoice.amount;

        return acc;
    }, { 
        netDiscountedValue: 0, 
        tceaValues: { nom: 0, den: 0 },
        amount: 0
    });
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

