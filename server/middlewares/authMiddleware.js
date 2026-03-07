const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const checkAuth = async (req, res, next) => {
    const token = req.cookies.jwt; // Get the JWT from cookies
    if (!token) {
        console.log("There was no token");
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!token || token === "loggedout") {
        return res.status(401).json({ status: "error", message: "No active session detected" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = await User.findById(decoded.id); // Attach user info(_id) to the request
        next(); // Proceed to the next middleware or route
    } catch (err) {
        console.log("Error in status check middleware: " + err.message);
        next(err);
    }
};

module.exports = checkAuth;
