const mongoose = require('mongoose');

const invoiceBillSchema = new mongoose.Schema({
    portfolioId: {type: String, require: true},
    invoiceBillNumber: {type: String, require: true},
    type: {type: String, require: true, enum:['Invoice', 'Bill']},
    amount: {type: Number, require: true},
    currency: { type: String, required: true, enum: ['USD', 'PEN'] },
    issueDate: {type: Date, require: true},
    expirationDate: {type: Date, require: true},
    state: {type: String, require: true, enum:['Pending', 'Payte','Expired']},
    netDiscountedAmount: {type: Number, require: false},
    tcea: {type: Number, require: false},
    dateTcea: {type: Date, require: false },
},{
    timestamps: true,
    versionKey: false
});

const InvoiceBill = mongoose.model('InvoiceBill', invoiceBillSchema);
module.exports = InvoiceBill