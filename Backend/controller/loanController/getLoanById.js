const { Loan } = require("../../models/loanModel.js");
const { status } = require("http-status");

const getLoanById = async (req, res) => {
    try {
        const { id } = req.params;

        const loan = await Loan.findOne({ _id: id, userId: req.user._id });

        if (!loan) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "Loan not found or you don't have permission to view it."
            });
        }

        return res.status(status.OK).json({
            success: true,
            loan: loan
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `Server Error: ${err.message}`
        });
    }
};

module.exports = { getLoanById };