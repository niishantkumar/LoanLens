require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { MongoStore } = require("connect-mongo");

const { User } = require("./models/userModel.js");

const app = express();
const port = process.env.PORT || 3000;


app.set("trust proxy", 1);


const FRONTEND_URL = process.env.originURL;


if (!process.env.DB_URL || !process.env.SESSION_SECRET || !FRONTEND_URL) {
    console.error("Missing ENV variables (DB_URL / SESSION_SECRET / originURL)");
    process.exit(1);
}


app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));

app.options("*", cors({
    origin: FRONTEND_URL,
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,

    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        collectionName: "sessions"
    }),
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
const { userRouter } = require("./routes/userRoutes.js");
const { loanRouter } = require("./routes/loanRoutes.js");

app.use("/user", userRouter);
app.use("/user/loan", loanRouter);


app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
});

//server
async function start() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database Connected");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

start();