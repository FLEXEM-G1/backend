const userModel = require('../models/userModel');

// Create a new user
exports.SIGN_UP = async (req, res) => {
    const {email , password, name, phone, address } = req.body;

    if(!email || !password){
        return res.status(400).send({error: 'Email y password son requeridos'});
    }

    const newUser = new userModel({
        email , password, name, phone, address
    })


    try {
        const saveUser = await newUser.save();
        res.status(200).send(saveUser);
    } catch (error) {
        res.status(400).send({ error: 'Error al crear el usuario', details: error });
    }
};

exports.SIGN_IN = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).send({error: 'Email y password son requeridos'});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({error: 'Usuario no encontrado'});
        }

        const isValid = await user.isValidPassword(password);
        if(!isValid){
            return res.status(401).send({error: 'Contraseña incorrecta'});
        }
        
        res.status(200).json({ message: 'Login successful', id: user._id });
    } catch (error) {
        res.status(500).send({ error: 'Error en el servidor', details: error });
    }
}

// Read a user by ID
exports.GET_BY_ID = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a user by ID
exports.PUT = async (req, res) => {
    const { id } = req.params;
    const { email, password, name, phone, address } = req.body;

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).send();
        }

        if(email) user.email = email;
        if(password) user.password = password;
        if(name) user.name = name;
        if(phone) user.phone = phone;
        if(address) user.address = address;

        const updateUser = await user.save();
        res.send(updateUser);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

// Delete a user by ID
exports.DELETE = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200);
    } catch (error) {
        res.status(500).send(error);
    }
};