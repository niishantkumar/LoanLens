const express = require("express");
const router = express.Router();

// 1. FIX: Destructure isLoggedIn because your middleware file likely 
// exports it as { isLoggedIn }
const { isLoggedIn } = require("../middleware/isLoggedIn.js");

// 2. IMPORT controllers
const { addLoan } = require("../controller/loanController/addLoan.js");
const { getAllLoans } = require("../controller/loanController/getAllLoans.js");
const { getLoanById } = require("../controller/loanController/getLoanById.js");
const { deleteLoan } = require("../controller/loanController/deleteLoan.js");
const { updateLoan } = require("../controller/loanController/updateLoan.js");

// 3. DEFINE routes
router.post("/add", isLoggedIn, addLoan);
router.get("/all", isLoggedIn, getAllLoans);
router.put("/update/:id", isLoggedIn, updateLoan);
router.delete("/delete/:id", isLoggedIn, deleteLoan);
router.get("/:id", isLoggedIn, getLoanById); // Added isLoggedIn here too for safety

// 4. FIX: Export the router directly (Do not wrap it in an object)
module.exports = { loanRoutes: router };