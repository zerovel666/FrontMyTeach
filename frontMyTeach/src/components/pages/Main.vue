<template>
    <TopBar />
    <Banner />
    <Categories />
</template>

<script setup>
import { onMounted } from 'vue';
import TopBar from '@/components/layouts/TopBar.vue';
import Banner from './MainLayouts/Banner.vue';
import Categories from './MainLayouts/Categories.vue';
import axios from 'axios';
import VueCookies from "vue-cookies"; 

onMounted(() => {
  axios.interceptors.request.use(config => {
    const token = VueCookies.get("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => Promise.reject(error));
});
</script>

    