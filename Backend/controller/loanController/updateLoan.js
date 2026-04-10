const { Loan } = require("../../models/loanModel.js");
const { status } = require("http-status");

const updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, loanName, category } = req.body;

        const updatedLoan = await Loan.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { amount, loanName, category },
            { new: true }
        );

        if (!updatedLoan) return res.status(404).json({ success: false, message: "Loan not found" });

        return res.status(200).json({ success: true, loan: updatedLoan });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { updateLoan };