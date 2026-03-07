import {
    Container,
    MenuItem,
    Paper,
    Typography,
    TextField,
    Avatar,
    Button,
    IconButton,
    Grid2,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert,
    AlertTitle,
    InputAdornment,
    Card,
    CardContent,
} from "@mui/material";
import { Person, Email, School, Engineering, CalendarToday, Save, PersonSearch } from "@mui/icons-material";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateUser } from "../../services/api";

const NoUser = () => {
    const navigate = useNavigate();
    return (
        <Card sx={{ width: "min(100%, 400px)", pt: '4rem' }}>
            <CardContent style={{ display: "flex", alignItems: "center", flexDirection: "column", width: "100%" }}>
                <PersonSearch color="error" sx={{ width: "6rem", height: "6rem" }} />
                <Typography variant="h5">No User found</Typography>
                <Typography variant="body1" color="grey" sx={{ mb: 2, textAlign: "center" }}>
                    No User Found. Please log in to see your details
                </Typography>
                <Button onClick={() => navigate("/")} variant="contained" color="primary">
                    Go to Home
                </Button>
            </CardContent>
        </Card>
    );
};

const ProfileDashboard = () => {
    const { user, setUser } = useAuth(); // Assuming API is now 'updateUser'
    const [dopen, setDopen] = useState(false);
    const [popup, setPopUp] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("info");
    const [messageTitle, setMessageTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [changes, setChanges] = useState(false)

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        dept: "",
        passout_year: "",
        id: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setUserData({
                name: user.name || "",
                email: user.email,
                phone: user.phone || "",
                college: user.college || (user.email?.endsWith("iiests.ac.in") ? "IIEST Shibpur" : ""),
                dept: user.dept || "",
                passout_year: user.passout_year || "",
                id: user._id,
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (user[name] !== value) setChanges(true)
        else setChanges(false)
        // Phone number restriction logic
        if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const onFinish = async () => {
        setLoading(true);
        try {
            // Filter only changed fields to send to API
            const updatePayload = {name: user.name, email: user.email};

            Object.keys(userData).forEach((key) => {
                if (userData[key] !== user[key]) {
                    updatePayload[key] = userData[key];
                    console.log("changes: ", key, userData[key], user[key])
                    setChanges(true)
                }
            });

            if (!changes) {
                showToast("No Changes Found", "No modifications were detected.", "warning");
                return;
            }
            console.log("changes: ", changes)

            // Call the renamed API
            const upd = await updateUser(updatePayload);
        
            showToast("Success!", "Profile updated successfully.", "success");
        } catch (err) {
            const detailed = err?.response?.data?.message || err.message;
            showToast("Error", detailed, "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (title, msg, sev) => {
        setMessageTitle(title);
        setMessage(msg);
        setSeverity(sev);
        setPopUp(true);
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ pt: "5rem", display: "flex", justifyContent: "center" }}>
                <NoUser />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ pt: "5rem", color: "#fff" }}>
            <Paper sx={{ p: 4, borderRadius: 2, bgcolor: "rgb(19, 8, 39)", color: "#fff" }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Profile Dashboard
                </Typography>

                <Grid2 container spacing={4} sx={{ pt: 2 }}>
                    {/* User Image - Read Only */}
                    <Grid2 size={{ xs: 12 }} align="center">
                        <Avatar
                            src={user?.image}
                            sx={{ width: 180, height: 180, border: "3px solid #a65cec" }}
                        />
                        <Typography variant="caption" sx={{ mt: 1, display: "block", color: "gray" }}>
                            Complete your profile to take part in events!
                        </Typography>
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            slotProps={{ input: { startAdornment: <Person sx={{ mr: 1 }} /> } }}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <TextField
                            disabled
                            fullWidth
                            label="Email"
                            name="email"
                            value={userData.email}
                            slotProps={{ input: { startAdornment: <Email sx={{ mr: 1 }} /> } }}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            error={userData.phone.length > 0 && userData.phone.length !== 10}
                            helperText={
                                userData.phone.length > 0 && userData.phone.length !== 10 ? "10 digits required" : ""
                            }
                            slotProps={{
                                input: { startAdornment: <InputAdornment position="start">+91</InputAdornment> },
                            }}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="College"
                            name="college"
                            value={userData.college}
                            onChange={handleInputChange}
                            slotProps={{ input: { startAdornment: <School sx={{ mr: 1 }} /> } }}
                            disabled={user?.email.endsWith("iiests.ac.in")}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Department"
                            name="dept"
                            value={userData.dept}
                            onChange={handleInputChange}
                            slotProps={{ input: { startAdornment: <Engineering sx={{ mr: 1 }} /> } }}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Passout Year"
                            name="passout_year"
                            value={userData.passout_year}
                            onChange={handleInputChange}
                            slotProps={{ input: { startAdornment: <CalendarToday sx={{ mr: 1 }} /> } }}
                            select
                        >
                            {Array.from({ length: 21 }, (_, i) => 2020 + i).map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid2>

                    <Grid2 size={{ xs: 12 }} align="center" sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={() => setDopen(true)}
                            loading={loading}
                            endIcon={<Save />}
                            disabled={userData.phone.length !== 10 || !userData.name || !changes}
                        >
                            Save Changes
                        </Button>
                    </Grid2>
                </Grid2>
            </Paper>

            {/* Confirmation Dialog */}
            <Dialog open={dopen} onClose={() => setDopen(false)} fullWidth>
                <DialogTitle>Confirm Update</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to update your profile information?</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDopen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setDopen(false);
                            onFinish();
                        }}
                        variant="contained"
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={popup}
                autoHideDuration={5000}
                onClose={() => setPopUp(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={severity} variant="filled" onClose={() => setPopUp(false)}>
                    <AlertTitle>{messageTitle}</AlertTitle>
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProfileDashboard;
