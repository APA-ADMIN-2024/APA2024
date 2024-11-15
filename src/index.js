const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const userModel = require('./config');
const swal = require('sweetalert2');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config(); // To access environment variables
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "ejs");

// Logging the directory for debugging purposes
console.log(__dirname);

// Session management with MongoDB
app.use(session({
    secret: "secret", // Replace this with a strong secret in production
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // Use the MongoDB URI from .env
        collectionName: 'sessions', // Optional: Customize the collection name
    }),
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://APA2024.onrender.com/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes for Google OAuth
app.get("/auth/google", passport.authenticate('google', { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: "/" }), (req, res) => {
    res.redirect('/HomePage/index.html');
});

// Normal authentication routes
app.get("/", (req, res) => {
    res.render('login');
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register user on form submit
app.post("/signup", async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });

        if (existingUser) {
            // Email already exists
            res.render("signup", { error: "Email already exists" });
        } else if (req.body.password !== req.body.cnf_password) {
            // Passwords do not match
            res.render("signup", { error: "Passwords do not match" });
        } else {
            // Hash password and save user
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

            const createdUser = await userModel.create({
                email: req.body.email,
                password: hashedPassword,
            });

            res.redirect("HomePage/index.html");
            console.log(createdUser);
        }
    } catch (error) {
        console.error(error);
        res.render("signup", { error: "An error occurred. Please try again." });
    }
});

// Login user
app.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (user) {
            const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

            if (isPasswordCorrect) {
                res.redirect('HomePage/index.html');
            } else {
                // Incorrect password
                res.render("login", { error: "Incorrect password" });
            }
        } else {
            // User not found
            res.render("login", { error: "No user found with that email" });
        }
    } catch (error) {
        console.error(error);
        res.render("login", { error: "An error occurred. Please try again." });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running at port ${port}`);
});
