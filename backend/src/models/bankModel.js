const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
    name: { type: String, required: true},
    type: { type: String, required: true, enum:['PayF','PayE','Withholding '] },
    amount: { type: Number, required: true }
});

const bankSchema = new mongoose.Schema({
    name: {type: String, require: true },
    swiftCode: {type: String, require: true },
    direction: {type: String, require: true },
    phone: {type: String, require: true },
    rateType: {type: String, require: true, enum: ['TNA', 'TEA'] },
    rate: {type: Number, require: true },
    commissions: { type: [commissionSchema], default: [] }
},{
    timestamps: true,
    versionKey: false
});

const Bank = mongoose.model('Bank', bankSchema);
module.exports = Bank;