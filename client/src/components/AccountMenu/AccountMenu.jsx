import * as React from "react";
import { Avatar, Menu, MenuItem, Button, ListItemIcon, Divider, IconButton, Tooltip, Typography, Box } from "@mui/material";
import { Settings, Logout } from "@mui/icons-material"; // Import icons
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import LoginIcon from "@mui/icons-material/Login";

import "./AccountMenu.css";

export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { user, handleLoginSuccess, handleLogout, userLoad } = useAuth();
    const navigate = useNavigate();

    // Boolean to check if menu is open based on anchor element existence
    const open = Boolean(anchorEl);

    // --- Handlers ---
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditProfile = () => {
        handleClose();
        navigate("/userUpdate");
    };

    const handleLogoutClick = () => {
        handleClose();
        handleLogout();
    };

    const handleSuccess = (response) => {
        handleLoginSuccess(response);
        setTimeout(() => navigate("/"), 500);
    };

    const login = useGoogleLogin({
        onSuccess: handleSuccess,
        onError: () => console.log("Login Failed"),
    });

    // --- Render ---
    return user ? (
        <React.Fragment>
            {/* The Trigger Button */}
            <Tooltip title={`Hi, ${user.name}`}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                >
                    <Avatar
                        sx={{ width: 40, height: 40, border: "2px solid var(--accent1)" }}
                        src={user.image}
                        alt={user.name}
                    >
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </Avatar>
                </IconButton>
            </Tooltip>

            {/* The Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {/* Section 1: User Details (Non-clickable/Header style) */}
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" noWrap sx={{ fontWeight: "bold" }}>
                        {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {user.email}
                    </Typography>
                </Box>

                <Divider />

                {/* Section 2: Actions */}
                <MenuItem onClick={handleEditProfile}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Edit Profile
                </MenuItem>

                <MenuItem onClick={() => navigate("/my-registrations")}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    My Registrations
                </MenuItem>

                <MenuItem onClick={handleLogoutClick}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment>
    ) : (
        <React.Fragment>
            {/* The Trigger Button */}
            <Tooltip title={`Log In`}>
                {/* <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    sx={{bgcolor: '#ffffff39', p: 1, border: '1px solid #fff'}}
                >
                    <LoginIcon color="primary"/>
                </IconButton> */}
                <Button
                    variant="contained"
                    endIcon={<LoginIcon />}
                    sx={{ textDecoration: "none", textTransform: "none", fontFamily: 'var(--display-font)' }}
                    onClick={handleClick}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                >
                    Log in
                </Button>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" noWrap>
                        Log in to take part in events!!
                    </Typography>
                </Box>

                <Divider />
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => console.error("Login Failed")}
                    disabled={userLoad}
                    theme="filled_black"
                    logo_alignment="center"
                    shape="circle"
                    text="signin"
                />
            </Menu>
        </React.Fragment>
    );
}
