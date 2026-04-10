require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');

const { User } = require("./models/userModel.js");

if (!process.env.DB_URL || !process.env.SESSION_SECRET) {
    console.error("Missing required environment variables");
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.DB_URL;


const originUrl = process.env.originURL || "http://localhost:5173";

app.set("trust proxy", 1);

const corsOptions = {
    origin: originUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({
        mongoUrl: url,
        collectionName: "sessions",
        ttl: 6 * 24 * 60 * 60
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 6
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const { userRouter } = require("./routes/userRoutes.js");
const { loanRouter } = require("./routes/loanRoutes.js");

app.use("/user", userRouter);
app.use("/user/loan", loanRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong" });
});

const startServer = async () => {
    try {
        await mongoose.connect(url);
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
        });
    } catch (err) {
        console.error("Could not connect to MongoDB", err);
        process.exit(1);
    }
};

startServer();