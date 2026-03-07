const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const router = require("./routes/routes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const regRouter = require("./routes/registerRoutes");
const AppError = require("./utils/appError");
const { getAllUserRegs } = require("./controllers/registerController");

const app = express();

dotenv.config({ path: "./.env" }); // <- connecting the enviroment variables

// GLOBAL MIDDLEWARE SETUP

// Trust proxy and logging
app.set("trust proxy", 1);

// SECURITY & CORS MIDDLEWARE
const ADMIN_URL = process.env.ADMIN_URL;
const SERV_URL = process.env.SERV_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const allowedOrigins = [ADMIN_URL, SERV_URL, CLIENT_URL];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            const error = new Error("Not allowed by CORS");
            console.log(error);
            console.log(origin);
            callback(error);
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// LOGGING MIDDLEWARE
app.use(morgan("dev")); // <- Logs res status code and time taken

// RATE LIMITING MIDDLEWARE
const limiter = rateLimit({
    // <- Limits the number of api calls that can be made per IP address
    max: 1000, // max number of times per windowMS
    windowMs: 60 * 60 * 1000,
    message: "!!! Too many requests from this IP, Please try again in 1 hour !!!",
});

app.use("/api/v3", limiter);

// REQUEST PROCESSING MIDDLEWARE
// // Request timestamp and cookie logging
app.use((req, res, next) => {
    // <- Serves req time and cookies
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    if (req.cookies) console.log(req.cookies);
    next();
});

// Set response content type
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

// Parse incoming data
app.use(express.json({ limit: "100mb" })); // <- Parses Json data
app.use(express.urlencoded({ extended: true, limit: "100mb" })); // <- Parses URLencoded data

// DATA SANITIZATION MIDDLEWARE
// app.use(mongoSanitize()); // <- Data Sanitization against NoSQL query Injection (Causes issues with newer Express versions)
// app.use(xss()); // <- Data Sanitization against XSS

// COMPRESSION MIDDLEWARE
app.use(compression());

// ROUTES
app.use("/api/v3/", router); // <- Calling the router
app.use("/api/v3/auth", authRouter); // <- Auth routes
app.use("/api/v3/user", userRouter); // <- User routes
app.use("/api/v3/evregister", regRouter); // <- Event Register routes

// ERROR HANDLING MIDDLEWARE
// Handle non-existing routes
app.all("/", (req, res, next) => {
    // <- Middleware to handle Non-existing Routes
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

module.exports = app;
