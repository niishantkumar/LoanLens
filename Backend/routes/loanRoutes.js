const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn.js");
const { addLoan } = require("../controller/loanController/addLoan.js");
const { getAllLoans } = require("../controller/loanController/getAllLoans.js");
const { getLoanById } = require("../controller/loanController/getLoanById.js");
const { deleteLoan } = require("../controller/loanController/deleteLoan.js");
const { updateLoan } = require("../controller/loanController/updateLoan.js")


router.post("/add", isLoggedIn, addLoan);
router.get("/all", isLoggedIn, getAllLoans);
router.put("/update/:id", isLoggedIn, updateLoan);
router.delete("/delete/:id", isLoggedIn, deleteLoan);
router.get("/:id", getLoanById);

module.exports = { loanRouter: router };