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

    updateUser: (id, body) => instance.patch(`/users/${id}`, body, {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

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

    createEvent: (newEvent) => instance.post("/events", newEvent, {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    deleteEvent: (id) => instance.delete(`/events/${id}`, {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    // === Event Attendees === //

    getEventAttendees: (id) => instance.get(`/events/${id}/attendees`,{headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    addAttendance: (id) => instance.post(`/events/${id}/attendees`, {}, {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    deleteAttendee: (id) => instance.delete(`/events/${id}/attendees`, {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    changeAttendeeStatus: (eventId, userId, status) => instance.patch(`/events/${eventId}/attendees/${userId}`, {status}, {headers: {"X-Authorization": sessionStorage.getItem("token")}}),

    // === Event Images === //

    getEventImage: function(eventId) {
        return `${SERVER_URL}/events/${eventId}/image`;
    },

    setEventImage: (id, image, imageHeaders) => instance.put(`/events/${id}/image`, {image}, {headers: imageHeaders}),




}