import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";

// Import Icons
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import WidgetsIcon from "@mui/icons-material/Widgets";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import DiamondIcon from "@mui/icons-material/Diamond";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const tiers = [
    {
        id: 1,
        name: "BECA SPONSOR",
        amount: "6 LAKH",
        icon: <ChangeHistoryIcon />,
        focusColor: "#fbc02d",
        label: "BECA",
    }, // Green
    {
        id: 2,
        name: "ASSOCIATE SPONSOR",
        amount: "13 LAKH",
        icon: <WidgetsIcon />,
        focusColor: "#4caf50",
        label: "Associate",
    }, // Yellow/Gold
    { id: 3, name: "CO-SPONSOR", amount: "16 LAKH", icon: <AllInclusiveIcon />, focusColor: "#e91e63", label: "Co" }, // Pink
    { id: 4, name: "TITLE SPONSOR", amount: "19 LAKH", icon: <DiamondIcon />, focusColor: "#1a8fe3", label: "Title" }, // Blue
];

const perksData = {
    1: [
        "Logo on main stage, posters, digital",
        "Title sponsor at opening and closing ceremonies",
        "Dedicated space for product showcasing",
    ],
    2: [
        "Logo on banners and select digital platforms",
        "On stage mention as associate sponsor",
        "Brand representation at selected materials",
    ],
    3: [
        "Logo on posters and digital channels",
        "Verbal acknowledgement during event segments",
        "Shared area for engagement activities",
    ],
    4: [
        "Logo on cover and within the magazine",
        "Title sponsor on all promotion materials",
        "Opportunity for branding articles and content",
    ],
};

export default function SponsorsCategory() {
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box
            sx={{ width: "100%", maxWidth: 900, mx: "auto", mt: 4, boxShadow: 3, borderRadius: 2, overflow: "hidden" }}
        >
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    // This dynamically changes the indicator color based on the selected tab
                >
                    {tiers.map((tier, index) => (
                        <Tab
                            key={tier.id}
                            icon={tier.icon}
                            iconPosition="top"
                            label={tier.label}
                            sx={{
                                fontWeight: "bold",
                                fontSize: "0.7rem",
                                // Custom color logic
                                "&.Mui-selected": {
                                    color: tier.focusColor,
                                },
                                // Optional: hover effect
                                "&:hover": {
                                    color: tier.focusColor,
                                    opacity: 0.8,
                                },
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Content Area */}
            <Box sx={{ p: 2, bgcolor: "background.paper" }}>
                <h2 style={{ width: "100%", textAlign: "center", fontFamily: "var(--heading-font)", lineHeight: '1em' }}>
                    {tiers[value].name}
                </h2>
                <h1 style={{ color: tiers[value].focusColor }}>{tiers[value].amount}</h1>
                <Divider sx={{ my: 3 }}>
                    <Typography
                        variant="overline"
                        sx={{
                            fontWeight: "bold",
                            color: "text.secondary",
                            fontFamily: "var(--display-font)",
                            fontSize: "1rem",
                            m: 0,
                        }}
                    >
                        Perks & Benefits
                    </Typography>
                </Divider>

                <div className="benefits">
                    {perksData[tiers[value].id].map((perk, i) => {
                        return (
                            <div
                                className="perk"
                                style={{
                                    display: "flex",
                                    fontSize: "1.2rem",
                                    gap: "1rem",
                                    alignItems: "center",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                <CheckCircleOutlineIcon sx={{ color: tiers[value].focusColor }} />
                                {perk}
                            </div>
                        );
                    })}
                </div>
            </Box>
        </Box>
    );
}
