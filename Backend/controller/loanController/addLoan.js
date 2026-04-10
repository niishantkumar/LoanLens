const { Loan } = require("../../models/loanModel.js");
const { status } = require("http-status");

const addLoan = async (req, res) => {
    try {
        const { loanName, category, amount, rate, months } = req.body;

        const P = Number(amount);
        const r = Number(rate) / 12 / 100;
        const n = Number(months);
        const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

        const newLoan = new Loan({
            userId: req.user._id,
            loanName,
            category,
            amount: P,
            rate: Number(rate),
            months: n,
            emi: emi,
            totalAmount: emi * n,
            totalInterest: (emi * n) - P
        });

        await newLoan.save();
        res.status(status.CREATED).json({ success: true, loan: newLoan });
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message });
    }
};



module.exports = { addLoan };