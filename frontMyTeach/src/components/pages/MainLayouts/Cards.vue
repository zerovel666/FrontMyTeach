<template>
    <div class="container">
        <p>Популярное</p>
        <Carousel :wrap-around="true" ref="carouselRef" :items-to-show="1.7" snapAlign="center" @wheel="onScroll"
            :autoplay="3000" @update:modelValue="activeIndex = $event">

            <Slide v-for="(card, index) in cards" :key="index" class="slide"
                :class="{ 'active-slide': index === activeIndex, 'small-slide': index !== activeIndex }">
                <div class="card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
                    <img :src="card.image_path" alt="Course Image" class="card-image" />
                    <p>{{ card.name }}</p>
                </div>
            </Slide>
        </Carousel>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import axios from 'axios';
import { API_URL } from '@/config';

const carouselRef = ref(null);
const isHovered = ref(false);
const activeIndex = ref(0);

const onScroll = (event) => {
    if (!carouselRef.value || !isHovered.value) return;

    event.preventDefault();
    event.stopPropagation();

    if (event.deltaY > 0) {
        carouselRef.value.next();
    } else {
        carouselRef.value.prev();
    }

};

const disablePageScroll = (event) => {
    if (isHovered.value) {
        event.preventDefault();
    }
};

onMounted(() => {
    document.addEventListener('wheel', disablePageScroll, { passive: false });
});

onUnmounted(() => {
    document.removeEventListener('wheel', disablePageScroll);
});

const cards = ref([
    { "id": 1, "name": "Python", "image_path": "/storage/logoCourse/BKU56sqN8z8vooFzJeeeDWUynFncBTCPrOUtthdP.svg" },
    { "id": 2, "name": "JavaScript", "image_path": "/storage/logoCourse/JSlogo.svg" },
    { "id": 3, "name": "Vue.js", "image_path": "/storage/logoCourse/Vuelogo.svg" }
]);

</script>

<style scoped>
.container {
    height: 400px;
    text-align: center;
    padding: 20px;
}

p {
    font-size: 64px;
    margin: 40px;
}

.slide {
    transition: transform 0.3s ease-in-out;
}

.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(128, 89, 89);
    height: 400px;
    width: 800px;
    border-radius: 33px;
    padding: 20px;
    color: white;
}

.active-slide .card {
    width: 800px;
    height: 400px;
    opacity: 1;
}

.small-slide .card {
    width: 600px;
    height: 300px;
    opacity: 0.7;
}

.card-image {
    max-width: 100%;
    height: auto;
    border-radius: 15px;
}
</style>
