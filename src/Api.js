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

    getUser: (id) => instance.get(`/users/${id}`, {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    // === User Image === //
    setUserImage: (id, image, headers) => instance.put(`/users/${id}/image`, {image}, {headers: headers}),

    getUserImage: function(id) {
        return `${SERVER_URL}/users/${id}/image`;
    },

    // === Events === //

    getAllEvents: () => instance.get("/events", {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    searchEvents: (queries) => instance.get("/events", {params: queries}),

    getEventCategories: () => instance.get("/events/categories"),

    getEvent: (id) => instance.get(`/events/${id}`),

    createEvent: (title, description, categoryIds, date, isOnline, url, venue, capacity, requiresAttendanceControl, fee) =>
        instance.post("/events",
            {title, description, categoryIds, date, isOnline, url, venue, capacity, requiresAttendanceControl, fee},
            {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    // === Event Attendees === //

    getEventAttendees: (id) => instance.get(`/events/${id}/attendees`,{headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    addAttendance: (id) => instance.post(`/events/${id}/attendees`, {}, {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    // === Event Images === //

    getEventImage: function(eventId) {
        return `${SERVER_URL}/events/${eventId}/image`;
    },




}