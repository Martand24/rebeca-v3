import React from "react";
import "./Team.css";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    Container,
    Button,
    Box,
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
                bgcolor: "#ffffff27",
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
                        key={i}
                    />
                );
            })}
        </Container>
    );
}

const Team = () => {
    const { allTeams } = useAuth();
    const phone = window.innerWidth <= 450

    return (
        allTeams && (
            <div className="team">
                <div className="backdrop">
                    <img src={"/assets/imgs/Faculty/backdrop.webp"} />
                </div>
                <h1>Meet our Team</h1>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: "100%",
                    margin: "2rem 0",
                    borderRadius: "5px"
                }}>
                    <Typography textAlign={"center"} sx={{fontSize: "1.2rem", maxWidth: '70ch', fontFamily: 'var(--body-font)', p: 2}} >
                    Meet the diverse teams behind Rebeca — a collective of passionate students across various domains, working alongside our respected professors. Each team plays a vital role in shaping the fest, bringing together creativity, coordination, and dedication to deliver a seamless and memorable experience for everyone who takes part in the celebration.
                    </Typography>
                    {/* <Button
                        size="large"
                        variant="contained"
                        startIcon={<Favorite />}
                        endIcon={<East />}
                        onClick={() => window.open("https://forms.gle/qnceaoaaTiBTJ3627", "_blank")}
                        sx = {{mt: 2}}
                        color="secondary"
                    >
                        Join as Volunteer
                    </Button> */}
                </Box>
                <ProfessorsList />
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
                                            p: phone ? 1:5,
                                            display: "flex",
                                            justifyContent: 'center',
                                            alignItems: 'start',
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
