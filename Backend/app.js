require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { MongoStore } = require('connect-mongo');
const { status } = require("http-status");

const { User } = require("./models/userModel.js");


const url = process.env.DB_URL;
const secret = process.env.SESSION_SECRET;
const originUrl = process.env.originURL || "http://localhost:5173";

if (!url || !secret) {
    console.error("Missing DB_URL or SESSION_SECRET. Fix this in Render Environment settings.");
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;


app.set("trust proxy", 1);


const corsOptions = {
    origin: originUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({
        mongoUrl: url,
        collectionName: "sessions"
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 6
    }
}));

// 5. Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log("---- REQUEST ----");
    console.log("Session ID:", req.sessionID);
    console.log("User:", req.user);
    console.log("Auth:", req.isAuthenticated());
    next();
});

// 6. Routes
const { userRouter } = require("./routes/userRoutes.js");
const { loanRouter } = require("./routes/loanRoutes.js");

app.use("/user", userRouter);
app.use("/user/loan", loanRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: "Internal Server Error" });
});


async function start() {
    try {
        await mongoose.connect(url);
        console.log("Database Connected");
        app.listen(port, () => {
            console.log(`Live on port ${port}`);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

start();