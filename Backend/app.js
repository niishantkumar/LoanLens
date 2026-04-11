const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { User } = require("./models/userModel.js");
require("dotenv").config();

// import routes
const { userRoutes } = require("./routes/userRoutes.js");
const { loanRoutes } = require("./routes/loanRoutes.js");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// passport config
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes
app.use("/user", userRoutes);
app.use("/user/loan", loanRoutes);

// server
const server = async () => {
    try {
        // 1. Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        // 2. Start the Express Server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("CRITICAL ERROR DURING SERVER STARTUP:");
        console.error(err.message);
        process.exit(1);
    }
};


server();