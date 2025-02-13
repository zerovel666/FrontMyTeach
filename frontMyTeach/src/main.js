import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import Auth from './components/auth/Login.vue';
import Register from './components/auth/Register.vue';

const routes = [
    {path: '/', redirect: '/auth'},
    {path: '/auth', component: Auth},
    {path: '/register', component: Register}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App).use(router).mount('#app')
