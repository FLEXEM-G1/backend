const invoiceBillModel = require("../models/invoiceBillModel")
const bankController = require('./bankController')
const exchangeRates = require('../services/exchange_rates.json')
const portfolioModel = require("../models/portfolioModel");

// Get all invoice bills
module.exports.GET_ALL = async (req, res) => {
    try {
        const invoiceBills = await invoiceBillModel.find();
        res.json(invoiceBills);
    } catch (error) {
        res.status(500).json({ message: "Error al recuperar las facturas" });
    }
};

// Get general tcea 
module.exports.GET_TCEA = async (req, res) => {
    try{
        console.log("GET_TCEA function called");
        const invoiceBills = await invoiceBillModel.find();
        console.log("Invoice Bills:", invoiceBills);
        
        let nom = 0;
        let den = 0;

        if (invoiceBills.length > 0) {
            const result = invoiceBills.reduce((acc, i) => {
                if (i.state === 'Capitalized') {
                    acc.nom += (i.tcea / 100) * i.netDiscountedAmountPen;
                    acc.den += i.netDiscountedAmountPen;
                }
                return acc;
            }, { nom: 0, den: 0 });

            nom = result.nom;
            den = result.den;
        }

        const tceaGeneral = den !== 0 ? nom / den : 0;
        console.log("TCEA General:", tceaGeneral);
        res.json(tceaGeneral);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al calcular el tcea general", error: error });
    }
}

// Get invoice bill by ID
module.exports.GET_BY_ID = async (req, res) => {
    const { id } = req.params;

    try {
        const invoiceBill = await invoiceBillModel.findById(id);

        if (!invoiceBill) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }

        res.json(invoiceBill);
    } catch (error) {
        res.status(500).json({ message: "Error al recuperar la factura" });
    }
};
// Get invoice bills by portfolioId
module.exports.GET_BY_PORTFOLIO_ID = async (req, res) => {
    const { id } = req.params;

    try {
        const invoiceBills = await invoiceBillModel.find({ portfolioId: id });

        if (invoiceBills.length === 0) {
            return res.status(404).json({ message: "No se encontraron facturas para el portfolioId proporcionado" });
        }

        res.json(invoiceBills);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al recuperar las facturas" });
    }
};

// Get invoice bills by portfolioId
module.exports.GET_BY_PORTFOLIO_ID_INT = async (req) => {
    const { id } = req.params;

    try {
        const invoiceBills = await invoiceBillModel.find({ portfolioId: id });

        if (invoiceBills.length === 0) {
            return new Error("No se encontraron facturas para el portfolioId proporcionado");
        }

        return invoiceBills;
    } catch (error) {
        console.log(error)
        throw error;
    }
};

// Post invoice bill
module.exports.POST = async (req, res) => {
    const { portfolioId,
        invoiceBillNumber,
        rucDni,
        razSocNam,
        type,
        amount,
        currency,
        issueDate,
        expirationDate,
        state } = req.body;

    try {
        // Verificar si existe un portafolio con el ID proporcionado
        const portfolio = await portfolioModel.findById(portfolioId);
        if (!portfolio) {
            return res.status(404).json({ message: "Portafolio no encontrado" });
        }

        if(portfolio.currency != currency){
            return res.status(400).json({ message: "La moneda de la factura no coincide con la moneda del portafolio" });
        }

        const newInvoiceBill = new invoiceBillModel({
            portfolioId,
            invoiceBillNumber,
            rucDni,
            razSocNam,
            type,
            amount,
            currency,
            issueDate,
            expirationDate,
            state
        });

        const savedInvoiceBill = await newInvoiceBill.save();
        res.status(200).json(savedInvoiceBill);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la factura", error: error });
    }
};

// Put invoice bill
module.exports.PUT = async (req, res) => {
    const { id } = req.params;
    const { portfolioId,
        invoiceBillNumber,
        rucDni,
        razSocNam,
        type,
        amount,
        currency,
        issueDate,
        expirationDate,
        state } = req.body;

    try {
        // Verificar si existe un portafolio con el ID proporcionado
        const portfolio = await portfolioModel.findById(portfolioId);
        if (!portfolio) {
            return res.status(404).json({ message: "Portafolio no encontrado" });
        }

        if(portfolio.currency != currency){
            return res.status(400).json({ message: "La moneda de la factura no coincide con la moneda del portafolio" });
        }
        const updatedInvoiceBill = await invoiceBillModel.findByIdAndUpdate(
            id,
            { portfolioId,
                invoiceBillNumber,
                rucDni,
                razSocNam,
                type,
                amount,
                currency,
                issueDate,
                expirationDate,
                state },
            { new: true }
        );

        if (!updatedInvoiceBill) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }

        res.json(updatedInvoiceBill);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la factura" });
    }
};


// Put tcea and netDiscountedAmount
module.exports.PUT_TCEA = async (req) => {
    const { id } = req.params;
    const { dateTcea, bankId } = req.body;

    try {
        const [invoiceBill, bank] = await Promise.all([
            invoiceBillModel.findById(id),
            bankController.GET_BY_ID_INT({ params: { id: bankId } })
        ]);

        if (!invoiceBill) throw new Error("Factura o letra no encontrada");
        if (!bank) throw new Error("Banco no encontrado");

        // Calcular totales de comisiones
        const totals = bank.commissions.reduce((acc, { type, amount }) => {
            if (acc.hasOwnProperty(type)) acc[type] += amount;
            return acc;
        }, { PayF: 0, PayE: 0, Withholding: 0 });

        const { amount, currency } = invoiceBill;
        const isUSD = currency === 'USD';
        const daysDiff = (new Date(invoiceBill.expirationDate) - new Date(dateTcea)) / (1000 * 3600 * 24);

        // Cálculos de tasa
        const rateFactor = bank.rateType === 'TNA'
            ? bank.rate / (100 * 360)
            : bank.rate / 100;
        const exponent = bank.rateType === 'TNA' ? daysDiff : daysDiff / 360;

        // Factores ajustados por moneda
        const currencyAdjust = isUSD ? 1/exchangeRates.rates.PEN : 1;
        const withholdingFactor = (totals.Withholding / 100) * amount * currencyAdjust;
        const payEFactor = totals.PayE * currencyAdjust;
        const payFFactor = totals.PayF * currencyAdjust;

        // Cálculos finales
        const netAmount = (amount / (1 + rateFactor) ** exponent) - payFFactor - withholdingFactor;
        const tcea = (((amount + payEFactor - withholdingFactor) / netAmount) ** (360 / daysDiff) - 1) * 100;
        const netAmountPen = isUSD ? netAmount*exchangeRates.rates.PEN : netAmount;

        // Actualizar y guardar
        Object.assign(invoiceBill, { netDiscountedAmount: netAmount, netDiscountedAmountPen: netAmountPen, tcea, dateTcea, state: 'Capitalized' });
        await invoiceBill.save();

        return invoiceBill;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


// Delete invoice bill
module.exports.DELETE = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedInvoiceBill = await invoiceBillModel.findByIdAndDelete(id);

        if (!deletedInvoiceBill) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }

        res.status(200);
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la factura" });
    }
};

// Delete invoice bill by portfolioId
module.exports.DELETE_BY_PORTFOLIO_ID = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await invoiceBillModel.deleteMany({ portfolioId: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Facturas no encontradas" });
        }

        res.status(200).json("Facturas eliminadas correctamente");
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar las facturas" });
    }
}