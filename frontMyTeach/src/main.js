import './assets/main.css';

import axios from 'axios';
import VueCookies from 'vue-cookies';
import { createApp, reactive } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Auth from './components/auth/Login.vue';
import Register from './components/auth/Register.vue';
import Main from './components/pages/Main.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import MyCourse from './components/pages/MyCourse.vue';
import Catalog from './components/pages/Catalog.vue';
import AboutUs from './components/pages/AboutUs.vue';
import MyProfile from './components/pages/MyProfile.vue';

VueCookies.config('7d', '', '', false);

const loading = reactive({ active: false });

axios.interceptors.request.use(
  (config) => {
    loading.active = true;
    const token = VueCookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    loading.active = false;
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    loading.active = false;
    return response;
  },
  (error) => {
    loading.active = false;
    return Promise.reject(error);
  }
);

const routes = [
  { path: '/', component: Main },
  { path: '/auth', component: Auth },
  { path: '/register', component: Register },
  { path: '/mycourse', component: MyCourse },
  { path: '/catalog', component: Catalog , name: 'catalog' },
  { path: '/aboutUs', component: AboutUs },
  { path: '/myProfile', component: MyProfile }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.config.globalProperties.$loading = loading;
app.use(router);
app.use(VueCookies);
app.use(Antd);
app.mount('#app');


document.body.classList.add('bg-custom');