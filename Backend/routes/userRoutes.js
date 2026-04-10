const express = require("express");
const router = express.Router();
const passport = require("passport");


const { userSignup } = require("../controller/userController/userSignup.js");
const { userLogin } = require("../controller/userController/userLogin.js");

// SIGNUP
router.post("/signup", userSignup);

// LOGIN
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        // 1. Handle system errors
        if (err) {
            return next(err);
        }

        // 2. Handle authentication failure (wrong password, user not found)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: info && info.message ? info.message : "Invalid username or password"
            });
        }

        // 3. Manually log the user in
        req.logIn(user, (err) => {
            if (err) return next(err);

            // 4. Success! Call your userLogin controller
            return userLogin(req, res);
        });
    })(req, res, next);
});

// LOGOUT
router.get("/logout", (req, res) => {
    req.logout(() => {
        res.json({ message: "Logged out successfully" });
    });
});

//isLoggedin
router.get("/me", (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({
            success: true,
            user: {
                username: req.user.username,
                email: req.user.email
            }
        });
    }

    return res.status(401).json({
        success: false,
        message: "Not authenticated"
    });
});

module.exports = { userRouter: router };