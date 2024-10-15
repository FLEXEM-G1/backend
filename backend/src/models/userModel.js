const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {type: String, require: true },
    password: {type: String, require: true },
    name: {type: String, require: false },
    phone: {type: String, require: false },
    address: {type: String, require: false }
},{
    timestamps: true,
    versionKey: false
});

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.isValidPassword = async function(password) {
    const match = await bcrypt.compare(password, this.password);
    console.log(`Password: ${password}, Hashed password: ${this.password}, Match: ${match}`);
    return match;
  };

const User = mongoose.model('User', userSchema);
module.exports = User;