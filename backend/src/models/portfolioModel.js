const mongoose = require('mongoose')

const portfolioSchema = new mongoose.Schema({
    bankId: {type: String, require: false},
    name: {type: String, require: true },
    state: {type: String, require: true},
    tcea: {type: Number, require: false},
    netDiscountedAmount : {type: Number, require: false},
    dateTcea: {type: Date, require: false },
    amount: {type: Number, require: false},
},{
    timestamps: true,
    versionKey: false
})

const Portfolio = mongoose.model('Portfolio', portfolioSchema)
module.exports = Portfolio