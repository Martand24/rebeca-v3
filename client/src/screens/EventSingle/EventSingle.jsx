import React, { useEffect, useState } from "react";
import "./EventSingle.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import RoundCard from "./RoundCard";
import { Alert, ButtonGroup, Button, Chip } from "@mui/material";
import { CheckCircleRounded, Tag, Warning } from "@mui/icons-material";
import CustomAvatar from "../../components/CustomAvatar/CustomAvatar";
import PageNotFound from "../PageNotFound/PageNotFound";
import GavelIcon from "@mui/icons-material/Gavel";
import { Person2Rounded } from "@mui/icons-material";

export const extractFullDate = (isoString, removeYear = false) => {
    if (!isoString) return "";

    // If input already looks like a human-friendly schedule string, return it.
    if (typeof isoString === "string" && /Day\s*\d+/i.test(isoString)) return isoString;

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString || "";

    const day = date.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
    const year = date.getFullYear();

    const startTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    let ordinalSuffix = "th";
    if (day % 10 === 1 && day !== 11) {
        ordinalSuffix = "st";
    } else if (day % 10 === 2 && day !== 12) {
        ordinalSuffix = "nd";
    } else if (day % 10 === 3 && day !== 13) {
        ordinalSuffix = "rd";
    }

    const formattedTime = `${day}${ordinalSuffix} ${month}${removeYear ? "" : " " + year}, ${startTime}`;

    return formattedTime;
};

function isGoogleForm(url) {
    if (!url) return false;
    const googleFormPattern = /^https:\/\/docs\.google\.com\/forms\/d\/e\/[^\/]+\/viewform/;
    const googleShortFormPattern = /^https:\/\/forms\.gle\/[a-zA-Z0-9]+/;

    return googleFormPattern.test(url) || googleShortFormPattern.test(url);
}

const EventSingle = () => {
    const navigate = useNavigate();
    const { eventSlug } = useParams();
    const { allEvents, user, userRegs } = useAuth();
    const [isReg, setIsReg] = useState(false);
    const [loading, setLoading] = useState(false);
    const oneEvent = allEvents.find((ev) => ev.slug === eventSlug);

    // Ensure allEvents is available before filtering
    if (!allEvents || allEvents.length === 0) {
        return <div style={{ height: "100vh", width: "100vw" }}>Loading...</div>;
    }

    if (!oneEvent) {
        return <PageNotFound />;
    }

    return (
        oneEvent && (
            <div className="event-single-container">
                {/* Background Image with Overlay */}
                <div
                    className="event-single-banner"
                    style={{
                        position: `relative`,
                        width: `100%`,
                        minHeight: `300px`,
                        // background: `url("${oneEvent?.thumbnail}") no-repeat`,
                        background: `url("/assets/imgs/tempo-thumb.webp") no-repeat`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="event-single-overlay">
                        <div className="eposter">
                            {oneEvent.regfee ? <div className="regfee">Fee ₹ {oneEvent.regfee}</div> : <></>}
                            <img src={oneEvent.poster} alt={"Poster"} />
                        </div>
                        <div className="event-single-header">
                            {oneEvent.type !== "performance" && (
                                <span className="event-single-badge">{oneEvent?.type}</span>
                            )}
                            <h1 className="event-single-title">{oneEvent?.name}</h1>
                            {oneEvent?.type !== "performance" && (
                                <ButtonGroup variant="contained" size="large">
                                    {userRegs.some(reg => reg.event === eventSlug) ? (
                                        <Button
                                            startIcon={<CheckCircleRounded />}
                                            color="success"
                                            disableElevation
                                            disableRipple
                                            disableFocusRipple
                                        >
                                            Registered
                                        </Button>
                                    ) : (
                                        <Button startIcon={<Person2Rounded />} onClick={() => navigate("register")}>
                                            Register
                                        </Button>
                                    )}
                                    {oneEvent?.rulesdoc && (
                                        <Button
                                            endIcon={<GavelIcon />}
                                            href={oneEvent?.rulesdoc}
                                            color="warning"
                                            target="_blank"
                                            disabled={!oneEvent?.rulesdoc}
                                        >
                                            View Rules
                                        </Button>
                                    )}
                                </ButtonGroup>
                            )}
                            <div className="eposter-mobile">
                                {oneEvent?.regfee ? <div className="regfee">Fee ₹ {oneEvent.regfee}</div> : <></>}
                                <img src={oneEvent.poster} alt={"Poster"} />
                            </div>
                        </div>

                        {/* {oneEvent?.rulesDocURL && <div className="event-single-buttons">
                        <Button
                            innerText={isGoogleForm(oneEvent?.rulesDocURL) ? "Google Form" : "View Rules"}
                            onClick={() => window.open(oneEvent?.rulesDocURL, "_blank")}
                        />
                        {!isGoogleForm(oneEvent?.rulesDocURL) && (
                            <Link to={`/events/${eventSlug}/register`}>
                                <Button innerText="Register" disabled={!user || !user.college} />
                            </Link>
                        )}
                    </div>}
                    {!user && (
                        <Alert
                            className="event-alert"
                            variant="outlined"
                            severity="warning"
                            color="warning"
                            sx={{ mt: 1 }}
                        >
                            You need to Log in to Register for any event.
                        </Alert>
                    )}
                    {isReg && (
                        <Alert
                            className="event-alert"
                            variant="outlined"
                            severity="success"
                            color="success"
                            sx={{ mt: 1 }}
                        >
                            You Have Successfully been registered for this event
                        </Alert>
                    )}
                    {user && !user?.college && (
                        <Alert
                            className="event-alert"
                            variant="outlined"
                            severity="warning"
                            color="warning"
                            sx={{ mt: 1 }}
                        >
                            Please complete your profile information to be able to register. For details, go to{" "}
                            <Link to="/profile">My profile</Link>.
                        </Alert>
                    )}

                    {isGoogleForm(oneEvent?.rulesDocURL) && (
                        <Alert
                            className="event-alert"
                            variant="outlined"
                            severity="info"
                            color="info"
                            sx={{ mt: 1 }}
                        >
                            This event accepts registration only through <b>google forms</b>.
                        </Alert>
                    )} */}
                        {/* <Alert className="event-alert" variant="outlined" severity="info" color="info" sx={{ mt: 1 }}>
                        Event has concluded.
                    </Alert> */}
                    </div>
                </div>

                {/* Content Below */}
                <div className="event-single-content">
                    <p className="event-single-description">{oneEvent.desc}</p>
                    {oneEvent.rounds.length > 0 && <h2 className="schedule-title">Schedule</h2>}

                    <div className="prelims-container">
                        {oneEvent?.rounds?.map((round, i) => {
                            return (
                                <RoundCard
                                    name={oneEvent.type === "performance" ? "Details" : `Round ${i + 1}`}
                                    start={extractFullDate(round.start || round.startTime || oneEvent.startTime)}
                                    end={extractFullDate(round.end || round.endTime || "")}
                                    venue={round.venue}
                                    key={i}
                                    i={i}
                                    hideHeading={!oneEvent?.rulesdoc}
                                />
                            );
                        })}
                    </div>
                </div>

                {oneEvent.coords.length ? (
                    <div className="coordinators event-single-content" style={{ paddingTop: 0 }}>
                        <h2 className="schedule-title">Coordinators</h2>
                        <div className="coords-list">
                            {oneEvent.coords.map((e, i) => {
                                return (
                                    <CustomAvatar
                                        title={e.name}
                                        subtitle={e.role}
                                        phone={e.phone}
                                        src={e.image}
                                        key={i}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        )
    );
};

export default EventSingle;
