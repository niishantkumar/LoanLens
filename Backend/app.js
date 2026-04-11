require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { MongoStore } = require('connect-mongo');

const { User } = require("./models/userModel.js");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ TRUST PROXY (REQUIRED FOR RENDER)
app.set("trust proxy", 1);

// ✅ CORS (ALLOW FRONTEND + LOCALHOST)
app.use(cors({
    origin: [
        "https://loanlens-7fet.onrender.com",
        "http://localhost:5173"
    ],
    credentials: true
}));

// ✅ FORCE CREDENTIAL HEADERS (IMPORTANT)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ SESSION (FINAL FIX)
app.use(session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
    }),
    cookie: {
        httpOnly: true,
        secure: true,        // HTTPS (Render)
        sameSite: "lax",     // ✅ KEY FIX
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// ✅ PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ DEBUG (REMOVE LATER)
app.use((req, res, next) => {
    console.log("---- REQUEST ----");
    console.log("Session ID:", req.sessionID);
    console.log("User:", req.user);
    console.log("Auth:", req.isAuthenticated());
    next();
});

// ✅ ROUTES
const { userRouter } = require("./routes/userRoutes.js");
const { loanRouter } = require("./routes/loanRoutes.js");

app.use("/user", userRouter);
app.use("/user/loan", loanRouter);

// ✅ 404
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("ERROR:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

// ✅ START SERVER
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("Database Connected");
        app.listen(PORT, () => {
            console.log(`Live on port ${PORT}`);
        });
    })
    .catch(err => console.error(err));