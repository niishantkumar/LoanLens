const { User } = require("../../models/userModel.js");
const { status } = require("http-status");

const userSignup = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Email already exists"
            });
        }

        let newUser = new User({ username, email });

        let registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return res.status(status.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: err.message
                });
            }

            return res.status(status.CREATED).json({
                success: true,
                message: "User registered successfully",
                user: {
                    username: registeredUser.username,
                    email: registeredUser.email
                }
            });
        });

    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { userSignup };