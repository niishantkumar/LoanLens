const { status } = require("http-status");

const userLogin = (req, res) => {
    try {
        return res.status(status.OK).json({
            success: true,
            message: "Login successful",
            user: {
                username: req.user.username,
                email: req.user.email
            }
        });

    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { userLogin };