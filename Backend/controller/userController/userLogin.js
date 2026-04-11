const { status } = require("http-status");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};


const userLogin = (req, res) => {
    try {
        const token = generateToken(req.user);
        res.status(status.OK).json({
            success: true,
            token,
            user: { username: req.user.username, email: req.user.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


module.exports = { userLogin };