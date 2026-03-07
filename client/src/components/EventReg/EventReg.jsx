import React, { useState, useEffect } from "react";
import {
    Stepper,
    Step,
    StepLabel,
    Typography,
    TextField,
    Box,
    Paper,
    IconButton,
    Divider,
    Stack,
    Card,
    CardContent,
    CircularProgress,
    Button,
    Alert,
    AlertTitle,
} from "@mui/material";
import { AddCircleOutline, DeleteOutline, CheckCircle, NoteAlt, HelpCenterRounded } from "@mui/icons-material";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "./EventReg.css";
import { createReg } from "../../services/api";

const steps = ["Verify Details", "Team & Assets", "Payment", "Success"];

const FinishMessage = () => {
    return (
        <Card>
            <CardContent style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <NoteAlt color="primary" sx={{ width: "6rem", height: "6rem" }} />
                <Typography variant="h5">Final Submit</Typography>
                <Typography variant="body1" color="grey" sx={{ mb: 2, textAlign: "center" }}>
                    Submit your Data. It will be reviewed by the respective event coordinators. You will receive a mail
                    about the status of your event registration shortly.
                </Typography>
            </CardContent>
        </Card>
    );
};
const CompletedContent = () => {
    const navigate = useNavigate();
    return (
        <Card sx={{ width: "min(100%, 400px)" }}>
            <CardContent style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <CheckCircle color="success" sx={{ width: "6rem", height: "6rem" }} />
                <Typography variant="h5">Congratulations!</Typography>
                <Typography variant="body1" color="grey" sx={{ mb: 2, textAlign: 'center' }}>
                    Your registration has been received. The registration will be viewed by the event coordinators shortly.
                </Typography>
                <Button onClick={() => navigate("/events")} variant="contained">Go to Events</Button>
            </CardContent>
        </Card>
    );
};
const NoUserLoggedIn = () => {
    const navigate = useNavigate();
    return (
        <div className="no-user">
            <Card sx={{ width: "min(100%, 400px)" }}>
                <CardContent style={{ display: "flex", alignItems: "center", flexDirection: "column", width: "100%" }}>
                    <HelpCenterRounded color="warning" sx={{ width: "6rem", height: "6rem" }} />
                    <Typography variant="h5">User Not Found</Typography>
                    <Typography variant="body1" color="grey" sx={{ mb: 2, textAlign: "center" }}>
                        If you want to proceed with the registration, please log in first
                    </Typography>
                    <Button onClick={() => navigate("/events")} variant="contained" color="primary">
                        Go to Events
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
const NoSuchEvent = () => {
    return (
        <div className="no-event">
            <Card sx={{ width: "min(100%, 400px)" }}>
                <CardContent style={{ display: "flex", alignItems: "center", flexDirection: "column", width: "100%" }}>
                    <HelpCenterRounded color="warning" sx={{ width: "6rem", height: "6rem" }} />
                    <Typography variant="h5">No Such Event Exists</Typography>
                    <Typography variant="body1" color="grey" sx={{ mb: 2, textAlign: "center" }}>
                        Possibly there is a problem in the URL.
                    </Typography>
                    <Button onClick={() => navigate("/events")} variant="contained" color="primary">
                        Go to Events
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default function EventRegister() {
    const navigate = useNavigate();
    const { user, allEvents, userRegs, handleAllUserRegs, showNotification } = useAuth();
    const { eventSlug } = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const [isreg, setIsreg] = useState(false);
    const [errors, setErrors] = useState({});
    const curEvent = allEvents.filter((ev) => ev.slug === eventSlug)[0];
    const takePay = (curEvent?.regfee !== 0) && (!user?.email.endsWith("iiests.ac.in"));
    const canMoveForward = user && (user.phone && user.dept && user.college && user.passout_year);

    const [formData, setFormData] = useState({
        userId: user?._id,
        teamName: "",
        assetUpload: "",
        teamMem: [], // Start with one empty member
        paymentSS: "",
        event: eventSlug,
    });

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                userId: user?._id || "",
                event: eventSlug || "",
            }));
        }
    }, [user]);

    // --- HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleMemberChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedMem = [...prev.teamMem];
            // Immutable update: create a new object for the specific member
            updatedMem[index] = { ...updatedMem[index], [field]: value };
            return { ...prev, teamMem: updatedMem };
        });
        // Clear error if it exists
        if (errors[`${field}_${index}`]) {
            setErrors((prev) => ({ ...prev, [`${field}_${index}`]: "" }));
        }
    };

    const addMember = () => {
        setFormData((prev) => ({
            ...prev,
            teamMem: [...prev.teamMem, { name: "", phone: "" }],
        }));
    };

    const removeMember = (index) => {
        setFormData((prev) => ({
            ...prev,
            teamMem: prev.teamMem.filter((_, i) => i !== index),
        }));
    };

    const validate = () => {
        let tempErrors = {};
        
        // 1. Team Name Validation (only if it's a team event)
        if (curEvent?.type === "team" && !formData.teamName.trim()) {
            tempErrors.teamName = "Team Name is required";
        }
    
        // 2. Asset Link Validation
        // Logic: Only validate if curEvent.asset exists (is not empty/null)
        if (curEvent?.asset && !formData.assetUpload.trim()) {
            tempErrors.assetUpload = "Asset link is required for this event";
        }
    
        // 3. Team Members & Phone Validation
        // 3.1 Team member length validation
        var teamLen = formData.teamMem.length+1; // +1 to account for the user themselves
        if (teamLen < curEvent.minTeamSize || teamLen > curEvent.maxTeamSize) {
            tempErrors.teamMem = `Team Members must be within ${curEvent.minTeamSize} and ${curEvent.maxTeamSize}`
        }
        // 3.2 Indian phone regex: starts with 6-9 and has 10 digits total
        const phoneRegex = /^[6-9]\d{9}$/;
    
        formData.teamMem.forEach((m, i) => {
            // Name check
            if (!m.name.trim()) {
                tempErrors[`name_${i}`] = "Required";
            }
            
            // Phone check
            const phone = m.phone.trim();
            if (!phone) {
                tempErrors[`phone_${i}`] = "Required";
            } else if (!phoneRegex.test(phone)) {
                tempErrors[`phone_${i}`] = "Invalid 10-digit number";
            }
        });
    
        setErrors(tempErrors);
        return !!!Object.keys(tempErrors).some((e) => tempErrors[e].length > 0)
    };

    const handleNext = async () => {
        if (activeStep === 0 && !canMoveForward) {
            showNotification("Please update your profile details first.", "error");
            return;
        }
        validate()
        console.log("total errors: ", errors)
        // Step 1 -> 2 Validation
        if (curEvent.type === "team" && activeStep === 1 && !validate()) {
            Object.entries(errors).forEach(([key, value]) => {
                showNotification(`${key}: ${value}`, 'error');
              });
            // showNotification(errors, 'error')
            return
        }

        // Step 2 -> 3 (Final Submission)
        if (activeStep === 2) {
            setIsreg(true);
            try {
                console.log("Submitting Data:", formData);
                // Simulate an API call
                const res = await createReg(formData);
                setActiveStep(3);
                showNotification(`Successfully Registered`, "success");
                handleAllUserRegs()
            } catch (err) {
                console.error("Registration failed", err);
                showNotification(`Err: ${err.message}`, "error");
            } finally {
                setIsreg(false);
            }
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    // Guard Clause for Logged Out Users
    if (!user) {
        return (
            <NoUserLoggedIn />
        );
    }

    if (userRegs?.includes(eventSlug)) {
        return (
            <Box className="no-user" sx={{ pt: 12, display: "flex", justifyContent: "center" }}>
                <CompletedContent />
            </Box>
        );
    }

    if (!allEvents.map((e) => e.slug).includes(eventSlug)) {
        return <NoSuchEvent />
    }

    return (
        <Box sx={{ maxWidth: 650, mx: "auto", p: 2, pt: 12 }}>
            <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* --- STEP 0: VERIFY DETAILS --- */}
                {activeStep === 0 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Verify Your Identity
                        </Typography>
                        {/* ADD THIS ALERT */}
                        {!canMoveForward && (
                            <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
                                <AlertTitle>Incomplete Profile</AlertTitle>
                                Please complete your profile details (Phone, Department, College, Passout Year) to proceed with registration.
                            </Alert>
                        )}
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField fullWidth label="Your Name" value={user?.name || "User"} disabled />
                            <TextField fullWidth label="Registered Email" value={user?.email || ""} disabled />
                            <TextField fullWidth label="Contact details" value={user?.phone || ""} disabled />
                            <Typography variant="caption" color="text.secondary">
                                * To change these, please go to{" "}
                                <Link
                                    to="/userUpdate"
                                    style={{ color: "var(--accent1)", textDecoration: "none", fontWeight: "bold" }}
                                >
                                    profile settings
                                </Link>
                                .
                            </Typography>
                        </Stack>
                    </Box>
                )}

                {/* --- STEP 1: REGISTRATION FORM --- */}
                {activeStep === 1 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Team Registration
                        </Typography>
                        {curEvent.type === "team" && (
                            <TextField
                                fullWidth
                                label="Team Name"
                                name="teamName"
                                value={formData.teamName}
                                onChange={handleInputChange}
                                error={!!errors.teamName}
                                helperText={errors.teamName}
                                sx={{ mb: 3 }}
                            />
                        )}
                        {curEvent.type === "team" && (
                            <>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Team Members
                                </Typography>
                                {formData.teamMem.map((member, index) => (
                                    <Box key={index} sx={{ display: "flex", gap: 1, mb: 2, alignItems: "flex-start" }}>
                                        <TextField
                                            label="Member Name"
                                            size="small"
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                                            error={!!errors[`name_${index}`]}
                                        />
                                        <TextField
                                            label="Phone Number"
                                            size="small"
                                            value={member.phone}
                                            onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                                            error={!!errors[`phone_${index}`]}
                                        />
                                        {formData.teamMem.length > 1 && (
                                            <IconButton color="error" onClick={() => removeMember(index)}>
                                                <DeleteOutline />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}
                                <Button startIcon={<AddCircleOutline />} onClick={addMember} sx={{ mb: 3 }}>
                                    Add Member
                                </Button>
                            </>
                        )}

                        {curEvent.asset && (
                            <>
                                <Typography variant="body1">{curEvent.asset || "Upload"}</Typography>
                                <TextField
                                    fullWidth
                                    label="Assets Link (Google Drive)"
                                    name="assetUpload"
                                    variant="filled"
                                    value={formData.assetUpload}
                                    onChange={handleInputChange}
                                    error={!!errors.assetUpload}
                                    helperText={errors.assetUpload}
                                    sx={{ mb: 4 }}
                                />
                            </>
                        )}

                        {!curEvent.asset && curEvent.type !== "team" && (
                            <Alert color="secondary">
                                <AlertTitle>Team & Asset details is not required</AlertTitle>
                                All the data we need is pre-filled, event doesn't require team registrations or Asset uploads. Click on
                                next to complete payment (if required)
                            </Alert>
                        )}
                    </Box>
                )}

                {/* --- STEP 2: PAYMENT --- */}
                {activeStep === 2 && (
                    <Box sx={{ py: 2 }}>
                        {takePay ? (
                            <>
                                <Typography variant="h6">Payment Details</Typography>
                                <Typography variant="body2" sx={{ my: 2 }}>
                                    Scan QR to pay <b>₹{curEvent?.regfee}</b> for <b>{curEvent.name}</b>
                                </Typography>
                                <img
                                    src={`/assets/payment-qr.webp`}
                                    alt="QR"
                                    style={{ borderRadius: "8px", border: "1px solid #eee", marginBottom: "2rem", width: "100%" }}
                                />
                                <TextField
                                    fullWidth
                                    label="Payment ScreenShot (Google Drive)"
                                    name="paymentSS"
                                    value={formData.paymentSS}
                                    onChange={handleInputChange}
                                    error={!!errors.paymentSS}
                                    helperText={errors.paymentSS}
                                    sx={{ mb: 4 }}
                                />
                            </>
                        ) : (
                            <Alert color="secondary">
                                <AlertTitle>No Payment needed</AlertTitle>
                                {curEvent.regfee === 0
                                    ? "Event needs no Payment to register"
                                    : "Registration is Free for IIESTians"}
                            </Alert>
                        )}
                    </Box>
                )}

                {/* --- STEP 3: SUCCESS --- */}
                {activeStep === 3 && (
                    <Box sx={{ textAlign: "center", py: 5 }}>
                        <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h5">Success!</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Your team <b>{formData.teamName}</b> is registered.
                        </Typography>
                        <Button sx={{ mt: 3 }} variant="outlined" onClick={() => navigate("/events")}>
                            Back to Events
                        </Button>
                    </Box>
                )}

                {/* --- NAVIGATION --- */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                    <Button disabled={activeStep === 0 || activeStep === 3 || isreg} onClick={handleBack}>
                        Back
                    </Button>

                    {activeStep < 3 && (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={isreg || (activeStep === 0 && !canMoveForward)}
                            startIcon={isreg ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isreg ? "Registering..." : activeStep === 2 ? "Finish & Register" : "Next"}
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
