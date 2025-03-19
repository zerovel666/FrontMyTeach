<template>
        <header>Популярное</header>
        <Carousel :wrap-around="true" ref="carouselRef" :items-to-show="1.7" snapAlign="center" @wheel="onScroll" v-if="cards.length"
            :autoplay="3000" @update:modelValue="activeIndex = $event" class="carousel">
            <Slide v-for="(card, index) in cards" :key="index" class="slide"
                :class="{ 'active-slide': index === activeIndex, 'small-slide': index !== activeIndex }">
                <div class="card" @mouseenter="isHovered = true" @mouseleave="isHovered = false"
                    :style="{ background: getGradient(index) }">
                    <div class="l-cont-card">
                        <h1>{{ card.name }}</h1>
                        <div class="list">
                            <ul>
                                <ul v-for="(tag, key) in card.tags" :key="index"><img
                                        src="/src/assets/Icons/BulletList.svg" alt="">{{ tag.tag }}</ul>
                            </ul>
                        </div>
                        <button>Подробнее</button>
                    </div>
                    <div class="r-cont-card">
                        <p class="rating"><img src="/src/assets/Icons/Star.svg" alt="">{{ card.rating }}</p>
                        <img alt="" :src="card.image_path">
                        <p class="author_name">{{ card.author_name }} <img src="/src/assets/Icons/Tap.svg" alt=""></p>

                    </div>
                </div>
            </Slide>
        </Carousel>
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
const cards = ref([]);

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

const getGradient = (index) => {
    const colors = [
        'linear-gradient(125deg, #11001D 40%, #00FFF2)',
        'linear-gradient(125deg, #11001D 40%, #6F00FF)',
        'linear-gradient(125deg, #11001D 40%, #FF1100)'
    ];
    return colors[index % colors.length];
}
const disablePageScroll = (event) => {
    if (isHovered.value) {
        event.preventDefault();
    }
};
const getCards = async () => {
    // const response = await axios.get(`${API_URL}/course/rating/getBest`);
    const response = [
        {
            "id": 2,
            "name": "Курс по Java",
            "image_path": "http://localhost:8082/storage/logoCourse/vueLogo.png",
            "author_id": "4",
            "category_id": 3,
            "isActive": true,
            "amount": null,
            "sendCheck": false,
            "checked": true,
            "created_at": "2025-03-18T14:15:27.000000Z",
            "updated_at": "2025-03-18T14:15:27.000000Z",
            "rating": "3",
            "author_name": "Antonio Banderes",
            "tags": [
                {
                    "id": 4,
                    "course_id": 2,
                    "tag": "SDK",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 5,
                    "course_id": 2,
                    "tag": "MAVEN",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 6,
                    "course_id": 2,
                    "tag": "JVM",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                }
            ]
        },
        {
            "id": 3,
            "name": "Курс по C#",
            "image_path": "http://localhost:8082/storage/logoCourse/laravelLogo.png",
            "author_id": "9",
            "category_id": 3,
            "isActive": true,
            "amount": null,
            "sendCheck": false,
            "checked": true,
            "created_at": "2025-03-18T14:15:27.000000Z",
            "updated_at": "2025-03-18T14:15:27.000000Z",
            "rating": "2",
            "author_name": "Leonardo Di Kaprio",
            "tags": [
                {
                    "id": 7,
                    "course_id": 3,
                    "tag": "OOP",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 8,
                    "course_id": 3,
                    "tag": "DOT.NET",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 9,
                    "course_id": 3,
                    "tag": "WebServlet",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                }
            ]
        },
        {
            "id": 1,
            "name": "Курс по Laravel:Laravel: Искусство Бэкенда",
            "image_path": "http://localhost:8082/storage/logoCourse/javaLogo.webp",
            "author_id": "10",
            "category_id": 3,
            "isActive": true,
            "amount": null,
            "sendCheck": false,
            "checked": true,
            "created_at": "2025-03-18T14:15:27.000000Z",
            "updated_at": "2025-03-18T14:15:27.000000Z",
            "rating": "1",
            "author_name": "Lana Rouz",
            "tags": [
                {
                    "id": 1,
                    "course_id": 1,
                    "tag": "Middleware",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 3,
                    "course_id": 1,
                    "tag": "Eloquent",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 2,
                    "course_id": 1,
                    "tag": "Migration",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                }
            ]
        }
    ];
    cards.value = response;
}

onMounted(() => {
    document.addEventListener('wheel', disablePageScroll, { passive: false });
    getCards();
});

onUnmounted(() => {
    document.removeEventListener('wheel', disablePageScroll);
});


</script>

<style scoped>
.container {
    height: 400px;
    text-align: center;
    padding: 20px;
}
.carousel__slide {
    display: flex;
    justify-content: center;
}

header {
    margin: 20px;
    font-size: 52px;
    text-align: center;
}

.slide {
    overflow: hidden; 
    transition: transform 0.3s ease-in-out;
}


.card {
    display: flex;
    justify-content: space-between;
    height: 400px;
    width: 800px;
    border-radius: 33px;
    padding: 30px;
    color: white;
    overflow: hidden;
    position: relative;
    border: 1px solid #6306ED;
}


.active-slide .card {
    width: 800px;
    height: 400px;
    opacity: 1;
}

.small-slide .card {
    transform: scale(0.85);
    transition: transform 0.3s ease-in-out, opacity 0.3s;
    width: 600px;
    height: 300px;
    opacity: 0.7;
    font-size: 13px;
}
.small-slide .card .r-cont-card img{
    width: 200px;
    height: 200px;
}

.small-slide .card .r-cont-card .author_name img{
    width: 13px;
    height: 13px;
}
.small-slide .card .r-cont-card .rating img{
    width: 20px;
    height: 20px; 
    margin-right: 3px;
}

.l-cont-card {
    position: relative;
    width: 50%;
    padding: 0px 20px;
}

.l-cont-card button {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 200px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid #B14788;
    background: none;
    font-size: 22px;
    color: white;
    transition: transform 0.3s;
    cursor: pointer;
}

.l-cont-card button:hover {
    transform: translateX(-50%) scale(1.1);
}

.l-cont-card h1 {
    margin: 0;
}

.list {
    max-height: 200px;
    height: 100%;
}

.l-cont-card ul {
    padding: 20px 0px;
}

.l-cont-card ul ul {
    text-align: left;
    padding: 5px;
}

.l-cont-card ul ul img {
    margin-right: 10px;
}

.r-cont-card {
    margin: 0;
    width: 50%;
    padding: 0px 20px;
    text-align: right;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
}

.r-cont-card img {
    width: 100%;
    max-width: 280px;
    height: 280px;
    object-fit: cover;
    border-radius: 100%;
}


.r-cont-card p {
    font-size: 22px;
    margin: 0;
}
.author_name{
    font-size: 15px !important;
    cursor: pointer;
}
.author_name img{
    width: 13px;
    height: 13px;
}
.rating{
    display: flex;
    justify-content: center;
    align-items: center;
}
.rating img{
    width: 20px;
    height: 20px; 
    margin-right: 3px;
}
</style>
