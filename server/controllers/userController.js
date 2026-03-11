const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const uploadToCloudinary = require("../utils/cloudinary").uploadToCloudinary;
const deleteFromCloudinary = require("../utils/cloudinary").deleteFromCloudinary;
// const sendEmail = require("../utils/email");

exports.createUser = async (userData) => {
    const user = await User.create({
        name: userData.name,
        email: userData.email,
        image: userData.image,
        googleId: userData.googleId,
    });
    return user; 
};

exports.updateUser = catchAsync(async (req, res, next) => {
    console.log("request for user update received");
    console.log("Req.body:", req.body);
    console.log("Req.file:", req.file);
    try {
        // user profile image is not needed as of now
        // if (req.file) {
        //     // delete old image from cloudinary if it exists and is a cloudinary URL
        //     if (req.body.oldImage) {
        //         console.log("Existing image found, preparing to delete from Cloudinary:", req.body.oldImage);
        //         // Extract Public ID: Get the part between the last '/' and the file extension
        //         const publicId = req.body.oldImage.split("/").pop().split(".")[0];
        //         const folderPath = "admin_profiles/";
        //         await deleteFromCloudinary(`${folderPath}${publicId}`);
        //     }
        //     console.log("File received for upload:", req.file.buffer);
        //     const result = await uploadToCloudinary(req.file.buffer, "admin_profiles");
        //     console.log("Image uploaded to Cloudinary:", result);
        //     req.body.image = result;
        // }
        const Id = req.body.id;
        const updation = await User.findByIdAndUpdate(Id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updation) {
            return next(new AppError("No user found with that ID", 404));
        }
        // setImmediate(async () => {
        //     try {
        //         await sendEmail('account-update', req.body.email, {
        //             name: req.body.name
        //             });
        //         console.log(`Email sent successfully to ${req.user.email}`);
        //     } catch (err) {
        //         // Log it to a service like Sentry or a log file so you know it failed
        //         console.error("BACKGROUND EMAIL ERROR:", err.message);
        //     }
        // });


        res.status(200).json({
            status: "success",
            data: {
                user: updation,
            },
        });
    } catch (err) {
        console.log("Error during user update:", err);
        res.status(500).json({
            status: "error",
            message: err || "An error occurred while updating the admin profile.",
        });
    }
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    console.log("GetAllUsers request received");
    try {
        const users = await User.find();
        res.status(200).json({
            status: "success",
            users: users,
        });
    } catch (err) {
        next(err);
    }
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return next(new AppError("No user found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        data: {
            user,
        },
    });
});
