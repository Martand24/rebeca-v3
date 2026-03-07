const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Register = require("../models/RegisterModel");
const sendEmail = require("../utils/email");

exports.createReg = catchAsync(async (req, res, next) => {
    console.log("Register Creation");
    try {
        const regData = req.body;
        const creation = await Register.create(regData);
        await sendEmail('event-registration', req.user.email, {
            name: req.user.name,
            eventName: req.body.event,
        });
        res.status(200).json({
            status: "success",
            message: "Registration Created successfully.",
            data: { creation: creation },
        });
    } catch (err) {
        console.log("error registering: ", err);
        next(err);
    }
});

exports.updateReg = catchAsync(async (req, res, next) => {
    console.log("Reg updation");
    try {
        const updation = req.body;
        const Id = req.body.id;
        const upd = await Register.findByIdAndUpdate(Id, updation, { new: true, runValidators: true });
        console.log("Reg Upd success");
        res.status(200).json({
            status: "success",
            message: "Registration Updation successfully performed",
            data: { reg: upd },
        });
    } catch (err) {
        console.log("Reg update err: ", err);
        next(err);
    }
});

exports.getAllUserRegs = catchAsync(async (req, res, next) => {
    console.log("Fetching all registrations for user...");

    try {
        console.log(req.user)
        const { id } = req.user;
        console.log("Id in a string: ", id)
        const regs = await Register.find({ userId: id }).sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            results: regs.length,
            data: {
                regs: regs,
            },
        });
    } catch (err) {
        console.log("getAllUserRegs err: ", err);
        next(err);
    }
});

exports.getAllReg = catchAsync(async (req, res, next) => {
    console.log("getallreg api");
    try {
        const allRegs = await Register.find().populate("userId", "name email phone").sort({ createdAt: -1 });

        // Check if we actually found anything
        if (!allRegs || allRegs.length === 0) {
            return res.status(200).json({
                status: "success",
                results: 0,
                data: [],
            });
        }

        res.status(200).json({
            status: "success",
            results: allRegs.length,
            data: {
                regs: allRegs,
            },
        });
    } catch (err) {
        console.error("Error in getAllRegistrations:", err);
        next(err);
    }
});

exports.deleteReg = catchAsync(async (req, res, next) => {
    console.log("deleteReg: ");
    try {
        const { id } = req.params;
        const delReg = await Register.findByIdAndDelete(id);
        if (!delReg) {
            return res.status(404).json({
                status: "fail",
                message: "No registration found with that ID",
            });
        }
        console.log("Deletion success");
        res.status(200).json({
            status: "success",
            message: "Reg deleted successfully",
            data: delReg,
        });
    } catch (err) {
        console.log("deleteReg err:", err);
        next(err);
    }
});
