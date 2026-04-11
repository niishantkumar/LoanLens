const express = require("express");
const router = express.Router();
const passport = require("passport");

const { userSignup } = require("../controller/userController/userSignup.js");
const { userLogin } = require("../controller/userController/userLogin.js");
const { getMe } = require("../controller/userController/getMe.js");
const { isLoggedIn } = require("../middleware/isLoggedIn.js");

router.post("/signup", userSignup);

// session: false is key here
router.post("/login", passport.authenticate("local", { session: false }), userLogin);

router.get("/me", isLoggedIn, getMe);

module.exports = { userRoutes: router };