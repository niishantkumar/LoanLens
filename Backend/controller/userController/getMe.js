const { User } = require("../../models/userModel.js");
const { status } = require("http-status");
const jwt = require("jsonwebtoken");


const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-hash -salt");
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getMe };