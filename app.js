require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));

// Setup view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static folder for CSS, JS, images, etc.
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection string
const mongoURI =
  "mongodb+srv://hildaho:W0EKXw8UcGRwIVJX@mubo1.cl0bb.mongodb.net/?retryWrites=true&w=majority&appName=Mubo1";

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Express session middleware should be before passport
app.use(
  session({
    secret: "your-secret-key", // Replace with a real secret key
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Create session even if it's not modified
    cookie: { secure: false }, // Set to `true` in production when using HTTPS
  })
);

// Flash messages middleware
app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

// Use Routes
app.use("/", authRoutes);
app.use("/tasks", taskRoutes);

// Listen on port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
