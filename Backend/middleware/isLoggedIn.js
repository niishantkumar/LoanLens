const { status } = require("http-status");

module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(req.user)
        return next();
    }
    return res.status(status.UNAUTHORIZED).json({
        success: false,
        message: "Please login first to manage loans."
    });
};