const jwt = require("jsonwebtoken");
const { status } = require("http-status");

const isLoggedIn = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(status.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded contains {_id, username}
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(status.UNAUTHORIZED).json({
            success: false,
            message: "Session expired, please login again."
        });
    }
};

module.exports = { isLoggedIn };