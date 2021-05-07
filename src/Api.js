import axios from 'axios';

const SERVER_URL = "http://localhost:4941/api/v1";

const instance = axios.create({
    baseURL: SERVER_URL,
});

export default {
    // === Users === //
    register: (firstName, lastName, email, password) => instance.post("/users/register", {firstName, lastName, email, password}),

    login: (email, password) => instance.post("/users/login", {email, password}),

    logout: () => instance.post("/users/logout", [],{headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    // === User Image === //
    setUserImage: (id, image, headers) => instance.put(`/users/${id}/image`, {image}, {headers: headers}),

    getUserImage: (id) => instance.get(`/users/${id}/image`, {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    // === Events === //

    getAllEvents: () => instance.get("/events", {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    // === Event Images === //

    getEventImage: function(eventId) {
        return `${SERVER_URL}/events/${eventId}/image`;
    },




}