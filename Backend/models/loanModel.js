const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    loanName: { type: String, required: true },
    category: {
        type: String,
        enum: ['Home', 'Car', 'Education', 'Personal', 'Other'],
        default: 'Personal'
    },
    amount: { type: Number, required: true },
    rate: { type: Number, required: true },
    months: { type: Number, required: true },
    emi: { type: Number, required: true },
    totalInterest: { type: Number },
    totalAmount: { type: Number },
}, { timestamps: true });

const Loan = mongoose.model("Loan", loanSchema);

module.exports = { Loan };