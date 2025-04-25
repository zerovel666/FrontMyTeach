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
import CourseInfo from './components/pages/CourseInfo.vue';
import { notification } from 'ant-design-vue';
import BibleOrganization from './components/pages/BibleOrganization.vue';
import { colProps } from 'ant-design-vue/es/grid/Col';
import OrganizationManual from './components/pages/OrganizationManual.vue';
import Subscription from './components/pages/Subscription.vue';
import SubscriptionPageById from './components/pages/SubscriptionPageById.vue';
import SubscriptionPayment from './components/pages/Payment/SubscriptionPayment.vue';
import TeachingBible from './components/pages/TeachingBible.vue';
import MainCourseEditor from './components/pages/MainCourseEditor.vue';

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
  { path: '/catalog', component: Catalog, name: 'catalog' },
  { path: '/aboutUs', component: AboutUs },
  { path: '/myProfile', component: MyProfile },
  { path: '/course/info/:id', component: CourseInfo },
  { path: '/bible/:organization_id', component: BibleOrganization },
  { path: '/organization', component: OrganizationManual },
  { path: '/subscription', component: Subscription },
  { path: '/subscription/:subscription_id', component: SubscriptionPageById },
  { path: '/subscription/pending/:uuid', component: SubscriptionPayment },
  { path: '/teaching', component: TeachingBible },
  { path: '/main/course/editor/:id', component: MainCourseEditor },
  { path: '/:pathMatch(.*)*', redirect: '/' },

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