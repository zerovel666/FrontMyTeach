<template>
    <div class="container">
        <img src="/src/assets/Icons/LeftSwap.svg" alt="left" class="swapBannerButton" @click="prevBanner" />

        <Carousel v-if="banners.length" :autoplay="3000" :wrap-around="true" ref="carouselRef" class="banner-wrapper">
            <Slide v-for="(banner, index) in banners" :key="banner.image_path" class="banner">
                <img :src="banner.image_path" alt="image" />
            </Slide>
        </Carousel>

        <img src="/src/assets/Icons/RightSwap.svg" alt="right" class="swapBannerButton" @click="nextBanner" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import axios from 'axios';
import { API_URL } from '@/config';

const banners = ref([]);
const carouselRef = ref(null);

const getBanner = async () => {
    try {
        const response = await axios.get(API_URL + "/poster/all");
        banners.value = response.data;

        // const response = [
        //     {
        //         "image_path": "http://localhost:8083//storage/posters/6hR5JNOSvUBZEUj6DgZiCEC2KM7R1C0W8iuqxJgQ.svg"
        //     },
        //     {
        //         "image_path": "http://localhost:8083//storage/posters/fzDm4WPCjlQGbPZuf5eyzQufhBsFVlt0W9BNcl5g.svg"
        //     },
        //     {
        //         "image_path": "http://localhost:8083//storage/posters/iq2aHjIVe61IRqm2IDLKLJJ6hcGW6t7DK0nx5rvm.webp"
        //     }
        // ]
        // banners.value = response;
    } catch (error) {
        console.error(error);
    }
};

const prevBanner = () => {
    carouselRef.value?.prev();
};

const nextBanner = () => {
    carouselRef.value?.next();
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
    overflow: hidden;
}

.banner-wrapper {
    width: 66%;
    height: 100%;
    border: 1px solid black;
    border-radius: 350px;
    overflow: hidden;
    position: relative;
}

.banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
    border-radius: 350px;
}


.swapBannerButton {
    cursor: pointer;
    z-index: 10;
    margin: 10px;
}
</style>
