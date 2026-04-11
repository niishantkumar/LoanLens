const { User } = require("../../models/userModel.js");
const { status } = require("http-status");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const userSignup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        const token = generateToken(registeredUser);
        res.status(status.CREATED).json({
            success: true,
            token,
            user: { username: registeredUser.username, email: registeredUser.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};



module.exports = { userSignup };