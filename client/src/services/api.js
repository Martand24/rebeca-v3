import axios from "axios";
import events from "../data/events.json";
import teams from "../data/teams.json";
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// check auth with google
export const checkAuthStatus = () => api.get("/auth/checkStatus");
export const logoutUser = () => {
    // Clear the header from your axios instance
    delete api.defaults.headers.common["Authorization"];
    api.get("/auth/logout");
};
export const loginWithGoogle = (idToken) =>
    api.post("/auth/google-login", {
        credential: idToken,
    });

// fetch events
export const getAllEvents = () => events;
export const getAllTeams = () => teams;

// user api
export const updateUser = (data) =>
    api.patch("/user", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
export const getAllUsers = () => api.get("/user");

// event registration api
export const createReg = (data) => api.post("/evregister", data);
export const getAllUserRegs = () => api.get("/evregister");
