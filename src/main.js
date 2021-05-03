import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router';
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import axios from 'axios';
import Register from "@/components/Register";
import User from "@/components/User";
import "./assets/styles.css" // Global CSS

// todo: default path to login.
const routes = [
    {
        path: "/",
        component: Register
    },
    {
        path: "/user",
        component: User
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
