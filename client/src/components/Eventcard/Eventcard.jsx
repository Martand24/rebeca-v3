import { React, useState, useEffect } from "react";
import "./Eventcard.css";
import { Link, useNavigate } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import GroupsIcon from "@mui/icons-material/Groups";
import RunCircleIcon from "@mui/icons-material/RunCircle";
import { Tooltip } from "@mui/material";

const EventTypeIcon = ({ type, f = 24 }) => {
    const badgeStyle = { fontSize: f };
    switch (type) {
        case "single":
            return <RunCircleIcon sx={badgeStyle} color="success" />;
        case "team":
            return <GroupsIcon sx={badgeStyle} color="warning" />;
        default:
            return <NewReleasesIcon sx={{ fontSize: f }} color="info" />;
    }
};

const Eventpanel = ({ value, index, day, show, handle }) => {
    return (
        <div key={index} className={`event-data ${show && "expand"}`}>
            <div className="data-body">
                {show && (
                    <Tooltip title={`${value?.type} event`} arrow>
                        <div className="event-badge">
                            <EventTypeIcon type={value?.type} f={64} />
                        </div>
                    </Tooltip>
                )}
                <div className="img">{/* <img src="/assets/imgs/Schedule/images.png" alt="event-icon" /> */}</div>
                {show && (
                    <div className="desc">
                        {value?.desc}
                        {/* <Link to={`/events/` + value?.slug}>
              <Button variant={"filled"} innerText={"Learn more"}></Button>
              </Link> */}
                    </div>
                )}
            </div>
            <div onClick={() => handle(index)} className="data-header">
                <div className="evname">
                    {value?.name} {show && <LaunchIcon />}{" "}
                    {!show && (
                        <Tooltip title={`${value?.type} event`} arrow>
                            <div className="event-badge">
                                <EventTypeIcon type={value?.type}/>
                            </div>
                        </Tooltip>
                    )}
                </div>
                <p>{value.startTime?.split("T")[1].substring(0, 5)}</p>
            </div>
        </div>
    );
};

const Eventcard = ({ Eventdata, Eventday }) => {
    const [expand, setexpand] = useState(0);
    const navigate = useNavigate();
    const handleExpand = (idx) => {
        if (idx === expand) {
            navigate(`/events/` + Eventdata[idx].slug);
        }
        setexpand(idx);
    };
    return (
        <div className="event-card-container">
            <div className="section-event">
                <div className="event-card">
                    {Eventdata.map((value, index) => (
                        <Eventpanel
                            key={index}
                            value={value}
                            day={Eventday}
                            index={index}
                            show={expand === index}
                            handle={handleExpand}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Eventcard;
