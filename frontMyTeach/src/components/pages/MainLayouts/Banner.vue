<template>
    <div class="container">
        <img src="/src/assets/Icons/LeftSwap.svg" alt="left" class="swapBannerButton" @click="prevBanner" />

        <div class="banner-wrapper">
            <transition-group name="swap" tag="div" class="banner-container">
                <div v-for="(banner, index) in visibleBanners" :key="banner.image_path" class="banner">
                    <img :src="banner.image_path" alt="image" />
                </div>
            </transition-group>
        </div>

        <img src="/src/assets/Icons/RightSwap.svg" alt="right" class="swapBannerButton" @click="nextBanner" />
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { API_URL } from '@/config';
import VueCookies from 'vue-cookies';

const token = VueCookies.get('token');
const banners = ref([]);
const currentIndex = ref(0);

const getBanner = async () => {
    try {
        // const response = await axios.get(API_URL + "/poster/all");

        // Мокаем данные
        const response = [
            { "image_path": "http://localhost:8083/storage/posters/drMH3uHm2TNSo2woCe9ZiY7pXfdHOp4PG6kI6mXq.svg" },
            { "image_path": "http://localhost:8083/storage/posters/z9ZMKDbeiTNr36quZBcbJ49n2eT44mY0BD9nKzhx.svg" },
        ];
        banners.value = response;
    } catch (error) {
        console.error(error);
    }
};

const visibleBanners = computed(() => {
    return [
        banners.value[currentIndex.value],
        banners.value[(currentIndex.value + 1) % banners.value.length]
    ].filter(Boolean);
});

const nextBanner = () => {
    if (banners.value.length > 1) {
        currentIndex.value = (currentIndex.value + 1) % banners.value.length;
    }
};

const prevBanner = () => {
    if (banners.value.length > 1) {
        currentIndex.value = (currentIndex.value - 1 + banners.value.length) % banners.value.length;
    }
};

onMounted(getBanner);
</script>

<style scoped>
.container {
    height: 500px;
    border-radius: 35px;
    margin: 10px;
    background: linear-gradient(90deg, #11001C, #59008E);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.banner-wrapper {
    overflow: hidden;
    width: 66%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.banner-container {
    display: flex;
    position: relative;
    width: 100%;
}

.banner {
    margin-top: 5px;
    flex: 0 0 100%;
    transition: transform 0.5s ease-in-out;
}

.banner img {
    width: 100%;
    border-radius: 15px;
}

.swapBannerButton {
    cursor: pointer;
    z-index: 10;
    margin: 10px;
}

.swap-enter-active, .swap-leave-active {
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.swap-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.swap-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}
</style>
