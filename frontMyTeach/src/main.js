import './assets/main.css'

import axios from 'axios';
import VueCookies from 'vue-cookies';
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Auth from './components/auth/Login.vue';
import Register from './components/auth/Register.vue';

VueCookies.config('7d', '', '', false);
axios.interceptors.request.use(
  (config) => {
    const token = VueCookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const routes = [
  { path: '/', redirect: '/auth' },
  { path: '/auth', component: Auth },
  { path: '/register', component: Register }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.use(VueCookies);
app.mount('#app');

  