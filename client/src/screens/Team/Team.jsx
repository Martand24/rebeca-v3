import React from "react";
import "./Team.css";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Container,
    Button,
    Box,
    Divider
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomAvatar from "../../components/CustomAvatar/CustomAvatar";
import { useAuth } from "../../AuthContext";
import { teamIcons } from "../../AuthContext";
import { East, Favorite } from "@mui/icons-material";
import Heading from "../../components/Headingv2/Headingv2";

const profs = [
    { name: "Dr. Sekhar Mandal", position: "Chairman", img: "./assets/imgs/Faculty/sekhar_mandal.webp" },
    { name: "Dr. Rajib Chakraborty", position: "Joint Convenor", img: "./assets/imgs/Faculty/rajibchakraborty.webp" },
    { name: "Dr. Dipankana Bhattacherjee", position: "Joint Convenor", img: "./assets/imgs/Faculty/dipanka_bhattacherjee.webp" },
    { name: "Dr. Ujjal Bhattacherjee", position: "Treasurer", img: "./assets/imgs/Faculty/ujjal_bhattacharjee.webp" },
];


function ProfessorsList() {
    return (
        <Container
            sx={{
                maxWidth: "1200px",
                padding: "5rem 2rem",
                margin: "0 2rem",
                gap: 5,
                borderRadius: "5px",
                bgcolor: "#c234ff36",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "start",
            }}
        >
            {profs.map((professor, i) => {
                return (
                    <CustomAvatar
                        title={professor.name}
                        src={professor.img}
                        subtitle={professor.position}
                        icon={teamIcons["Secretary General"]}
                    />
                );
            })}
        </Container>
    );
}

const Team = () => {
    const { allTeams } = useAuth();

    return (
        allTeams && (
            <div className="team">
                <Heading title={"MEET OUR TEAM"}/>
                <ProfessorsList />
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: "100%",
                    margin: "2rem 0",
                    borderRadius: "5px"
                }}>
                    <Typography textAlign={"center"} sx={{fontSize: "1.2rem", maxWidth: '70ch', fontFamily: 'var(--body-font)'}} color="text.secondary">
                    We are excited to invite you to be a part of REBECA as a <b>volunteer</b>! This is your chance to contribute, gain hands-on experience, and be a part of an incredible event. Whether you're interested in event management, social media, technical support, or hospitality, there's a place for you on our team!
                    </Typography>
                    <Button
                        size="large"
                        variant="contained"
                        startIcon={<Favorite />}
                        endIcon={<East />}
                        onClick={() => window.open("https://forms.gle/qnceaoaaTiBTJ3627", "_blank")}
                        sx = {{mt: 2}}
                        color="secondary"
                    >
                        Join as Volunteer
                    </Button>
                </Box>
                <Container className="team-container">
                    {allTeams.map((teamData, i) => {
                        if (teamData.members.length === 0) return;
                        return (
                            <Accordion
                                sx={{ m: 0, p: 0 }}
                                slotProps={{ heading: { component: "h2" } }}
                                disableGutters
                                elevation={3}
                                key={i}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <div className="accordion-h">
                                        <div>{teamIcons[teamData.team]}</div>
                                        {teamData.team}
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Container
                                        sx={{
                                            p: 5,
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 2,
                                            bgcolor: "#171717",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        {teamData.members.map((member, ki) => {
                                            return (
                                                <CustomAvatar
                                                    title={member.name}
                                                    src={`/assets/imgs/team_target_images/${member.name.toLowerCase().replaceAll(" ","").replaceAll(".", "")}.webp`}
                                                    subtitle={member.position}
                                                    phone={member.phone}
                                                    icon={teamIcons[teamData.team]}
                                                    key={ki}
                                                />
                                            );
                                        })}
                                    </Container>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Container>
            </div>
        )
    );
};

export default Team;
