const invoiceBillModel = require("../models/invoiceBillModel")
const bankController = require('./bankController')
const exchangeRates = require('../services/exchange_rates.json')

// Get all invoice bills
module.exports.GET_ALL = async (req, res) => {
    try {
        const invoiceBills = await invoiceBillModel.find();
        res.json(invoiceBills);
    } catch (error) {
        res.status(500).json({ message: "Error al recuperar las facturas" });
    }
};

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
            return res.status(404).json({ message: "No se encontraron facturas para el portfolioId proporcionado" });
        }

        return invoiceBills;
    } catch (error) {
        console.log(error)
        throw error;
    }
};

// Post invoice bill
module.exports.POST = async (req, res) => {
    const { portfolioId, invoiceBillNumber, type, amount, currency, issueDate, expirationDate, state } = req.body;

    try {
        const newInvoiceBill = new invoiceBillModel({
            portfolioId,
            invoiceBillNumber,
            type,
            amount,
            currency,
            issueDate,
            expirationDate,
            state
        });

        const savedInvoiceBill = await newInvoiceBill.save();
        res.status(201).json(savedInvoiceBill);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la factura" });
    }
};

// Put invoice bill
module.exports.PUT = async (req, res) => {
    const { id } = req.params;
    const { portfolioId, invoiceBillNumber, type, amount, currency, issueDate, expirationDate, state } = req.body;

    try {
        const updatedInvoiceBill = await invoiceBillModel.findByIdAndUpdate(
            id,
            { portfolioId, invoiceBillNumber, type, amount, currency, issueDate, expirationDate, state },
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
        // Obtener la factura por ID
        const invoiceBill = await invoiceBillModel.findById(id);
        if (!invoiceBill) {
            return res.status(404).json({ message: "Factura o letra no encontrada" });
        }

        // Obtener el banco por ID
        const bank = await bankController.GET_BY_ID_INT({ params: { id: bankId } });
        if (!bank) {
            return res.status(404).json({ message: "Banco no encontrado" });
        }

        // Calcular el monto en base a la moneda
        const amount = invoiceBill.currency === 'USD' ? invoiceBill.amount * exchangeRates.rates.PEN : invoiceBill.amount;
        // Calcular la diferencia de días
        const daysDiff = (new Date(invoiceBill.expirationDate) - new Date(dateTcea)) / (1000 * 3600 * 24);
        // Calcular el factor de tasa y el exponente
        const rateFactor = bank.rateType === 'TNA' ? bank.rate / (100*360) : bank.rate / 100;
        const exponent = bank.rateType === 'TNA' ? daysDiff : daysDiff / 360;
        // Calcular el monto neto descontado
        const netAmount = amount / (1 + rateFactor) ** exponent;
        // Calcular el TCEA
        const tcea = ((amount / netAmount) ** (360 / daysDiff) - 1)*100;
        // Actualizar la factura con los nuevos valores
        invoiceBill.netDiscountedAmount = netAmount;
        invoiceBill.tcea = tcea;
        invoiceBill.dateTcea = dateTcea;

        // Guardar la factura actualizada
        await invoiceBill.save();
        // Enviar la respuesta con la factura actualizada
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

        res.json({ message: "Factura eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la factura" });
    }
};