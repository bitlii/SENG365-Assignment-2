import axios from 'axios';

const SERVER_URL = "http://localhost:4941/api/v1";

const instance = axios.create({
    baseURL: SERVER_URL,
});

export default {
    // Users
    register: (firstName, lastName, email, password) => instance.post("/users/register", {firstName, lastName, email, password}),

    login: (email, password) => instance.post("/users/login", {email, password}),

    // User Image
    setUserImage: (id, image, imageHeader) => instance.put(`/users/${id}/image`, {image}, {headers: imageHeader},),


    // Other
    setAuthHeader(token) {
        instance.defaults.headers.common['X-Authorization'] = token;
    },
}