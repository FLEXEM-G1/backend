const ModelBank = require("../models/bankModel")

// Get All banks
module.exports.GET = async(req, res) =>{
    try {
        const banks = await ModelBank.find()
        res.json(banks)
    } catch{
        res.status(500).json({message: "Error al obtener los bancos"})
    }
}

// Get bank by ID
module.exports.GET_BY_ID = async (req, res) => {
    const { id } = req.params;

    try {
        const bank = await ModelBank.findById(id);

        if (!bank) {
            return res.status(404).json({ message: "Banco no encontrado" });
        }

        res.json(bank);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el banco" });
    }
};

// Get bank by ID
module.exports.GET_BY_ID_INT = async (req) => {
    const { id } = req.params;

    try {
        const bank = await ModelBank.findById(id);

        if (!bank) {
            return res.status(404).json({ message: "Banco no encontrado" });
        }

        return bank;
    } catch (error) {
        throw error;
    }
};

// Post bank
module.exports.POST = async (req, res) => {
    const { name, swiftCode, direction, phone, rateType, rate } = req.body;

    if (!name || !swiftCode || !direction || !phone || !rateType || !rate) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const newBank = new ModelBank({
        name,
        swiftCode,
        direction,
        phone,
        rateType,
        rate
    });

    try {
        const savedBank = await newBank.save();
        res.status(201).json(savedBank);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al guardar el banco" });
    }
};


// Put bank
module.exports.PUT = async (req, res) => {
    const { id } = req.params;
    const { name, swiftCode, direction, phone, rateType, rate } = req.body;

    if (!name || !swiftCode || !direction || !phone || !rateType || !rate) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        const updatedBank = await ModelBank.findByIdAndUpdate(
            id,
            { name, swiftCode, direction, phone, rateType, rate },
            { new: true, runValidators: true }
        );

        if (!updatedBank) {
            return res.status(404).json({ message: "Banco no encontrado" });
        }

        res.json(updatedBank);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el banco" });
    }
};

// Delete bank
module.exports.DELETE = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBank = await ModelBank.findByIdAndDelete(id);

        if (!deletedBank) {
            return res.status(404).json({ message: "Banco no encontrado" });
        }

        res.json({ message: "Banco eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el banco" });
    }
};