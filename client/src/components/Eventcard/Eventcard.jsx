import { React, useState, useEffect } from "react";
import "./Eventcard.css";
import { Link, useNavigate } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import NewReleasesTwoToneIcon from '@mui/icons-material/NewReleasesTwoTone';
import Groups2TwoToneIcon from '@mui/icons-material/Groups2TwoTone';
import RunCircleTwoToneIcon from '@mui/icons-material/RunCircleTwoTone';
import { Tooltip } from "@mui/material";

const EventTypeIcon = ({ type, f = 24 }) => {
    const badgeStyle = { fontSize: f };
    switch (type) {
        case "single":
            return <RunCircleTwoToneIcon sx={badgeStyle} color="success" />;
        case "team":
            return <Groups2TwoToneIcon sx={badgeStyle} color="warning" />;
        default:
            return <NewReleasesTwoToneIcon sx={{ fontSize: f }} color="info" />;
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
                <div className="img"><img src="/assets/imgs/tempo-thumb.webp" alt="event-icon" /></div>
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
