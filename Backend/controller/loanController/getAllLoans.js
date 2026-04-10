const { Loan } = require("../../models/loanModel.js");
const { status } = require("http-status");


const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(status.OK).json({ success: true, loans });
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message });
    }
};

module.exports = { getAllLoans };