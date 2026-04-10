const { Loan } = require("../../models/loanModel.js");
const { status } = require("http-status");

const deleteLoan = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLoan = await Loan.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!deletedLoan) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "Loan not found or unauthorized."
            });
        }

        return res.status(status.OK).json({
            success: true,
            message: "Loan deleted successfully."
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { deleteLoan };