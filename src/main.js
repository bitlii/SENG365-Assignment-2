import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router';
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import axios from 'axios';
import "./assets/styles.css" // Global CSS
import Register from "@/components/Register";
import Login from "@/components/Login";
import User from "@/components/User";
import EventSearch from "@/components/EventSearch";


const routes = [
    {
        path: "/",
        component: Login
    },
    {
        path: "/register",
        component: Register
    },
    {
        path: "/user",
        component: User
    },
    {
        path: "/events",
        component: EventSearch
    }
];

const app = createApp(App);

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
});
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.axios = axios;

app.mount('#app')
