const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { createUser } = require("./userController");
const sendEmail = require("../utils/email");

// --- Keep your existing signToken and createSendToken functions here ---
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
    });
};

// Create and send Cookie ->
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("jwt", token, cookieOptions);
    res.status(statusCode).json({
        message: "success",
        token,
        data: {
            user,
        },
    });
};

exports.googleAuth = catchAsync(async (req, res, next) => {
    // 1. Get the ID Token (credential) from the request body
    const { credential } = req.body;

    if (!credential) {
        return next(new AppError("Google authentication failed. No token provided.", 400));
    }

    // 2. Verify the Google ID Token
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID, // Ensures the token is for YOUR app
    });

    // 3. Extract user info from the payload (No Axios call needed!)
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // 4. Find or Create the Admin in MongoDB
    let user = await User.findOne({ email });
    let statusCode = 200;

    if (!user) {
        user = createUser({
            name: name,
            email: email,
            image: picture,
            googleId: sub,
        });
        statusCode = 201; // Created
        await sendEmail('welcome', email, {
            name: name,
        });
    }

    // 5. Send your custom App JWT via Cookie (The Jonas Way)
    console.log("Sending token for user:", user);
    createSendToken(user, statusCode, res);
});

// This is a simple helper to send user data back
exports.getMe = (req, res, next) => {
    res.status(200).json({
        status: "success",
        data: {
            user: req.user, // req.user is set by the protect middleware
        },
    });
};

//logout
exports.logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ status: "success" });
};
