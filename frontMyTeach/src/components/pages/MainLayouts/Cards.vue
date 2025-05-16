<template>
    <header>Популярное</header>
    <Carousel :wrap-around="true" ref="carouselRef" :items-to-show="mobile ? 1.1 : 1.7" snapAlign="center"
        @wheel="onScroll" v-if="cards.length" :autoplay="3000" @update:modelValue="activeIndex = $event"
        class="carousel">
        <Slide v-for="(card, index) in cards" :key="index" class="slide"
            :class="{ 'active-slide': index === activeIndex, 'small-slide': index !== activeIndex }">
            <div class="card" @mouseenter="isHovered = true" @mouseleave="isHovered = false"
                :style="{ background: getGradient(index) }">
                <div class="l-cont-card">
                    <h1>{{ card.name }}</h1>
                    <div class="list">
                        <ul>
                            <ul v-for="(tag, key) in card.tags" :key="index"><img src="/src/assets/Icons/BulletList.svg"
                                    alt="">{{ tag.tag }}</ul>
                        </ul>
                    </div>
                    <button @click="goToCourseInfo(card.id)">Подробнее</button>
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import axios from 'axios';
import { API_URL } from '@/config';
import { useRouter } from 'vue-router';

const carouselRef = ref(null);
const isHovered = ref(false);
const activeIndex = ref(0);
const cards = ref([]);
const router = useRouter();
const windowWidth = ref(window.innerWidth);

const mobile = computed(() => windowWidth.value <= 500);

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

const goToCourseInfo = async (id) => {
    router.push(`/course/info/${id}`);
}

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

const handleResize = () => {
    windowWidth.value = window.innerWidth;
};

const getCards = async () => {
    // const response = await axios.get(`${API_URL}/course/rating/getBest`);
    // cards.value = response.data;

    cards.value = [
        {
            "id": 1,
            "name": "Быстрый курс по Laravel + Vue3: MVC API Микросервис",
            "image_path": "http://localhost:8082//storage/logoCourse/oHo9XUt5tlwXp12KzFcXUHySEqOKBfr36ANz0Fzt.png",
            "author_id": "2",
            "category_id": 3,
            "is_active": true,
            "amount": 2000,
            "send_check": false,
            "checked": true,
            "has_certificate": true,
            "certificate_id": null,
            "created_at": "2025-05-13T11:36:35.000000Z",
            "updated_at": "2025-05-15T11:21:28.000000Z",
            "rating": "0",
            "author_name": "Азизбек Сексембай",
            "tags": [
                {
                    "id": 1,
                    "course_id": 1,
                    "tag": "Laravel",
                    "created_at": "2025-05-13T11:37:22.000000Z",
                    "updated_at": "2025-05-13T11:37:22.000000Z"
                },
                {
                    "id": 2,
                    "course_id": 1,
                    "tag": "Vite",
                    "created_at": "2025-05-13T11:37:22.000000Z",
                    "updated_at": "2025-05-13T11:37:22.000000Z"
                }
            ]
        },{
            "id": 1,
            "name": "Быстрый курс по Laravel + Vue3: MVC API Микросервис",
            "image_path": "http://localhost:8082//storage/logoCourse/oHo9XUt5tlwXp12KzFcXUHySEqOKBfr36ANz0Fzt.png",
            "author_id": "2",
            "category_id": 3,
            "is_active": true,
            "amount": 2000,
            "send_check": false,
            "checked": true,
            "has_certificate": true,
            "certificate_id": null,
            "created_at": "2025-05-13T11:36:35.000000Z",
            "updated_at": "2025-05-15T11:21:28.000000Z",
            "rating": "0",
            "author_name": "Азизбек Сексембай",
            "tags": [
                {
                    "id": 1,
                    "course_id": 1,
                    "tag": "Laravel",
                    "created_at": "2025-05-13T11:37:22.000000Z",
                    "updated_at": "2025-05-13T11:37:22.000000Z"
                },
                {
                    "id": 2,
                    "course_id": 1,
                    "tag": "Vite",
                    "created_at": "2025-05-13T11:37:22.000000Z",
                    "updated_at": "2025-05-13T11:37:22.000000Z"
                }
            ]
        },{
            "id": 1,
            "name": "Быстрый курс по Laravel + Vue3: MVC API Микросервис",
            "image_path": "http://localhost:8082//storage/logoCourse/oHo9XUt5tlwXp12KzFcXUHySEqOKBfr36ANz0Fzt.png",
            "author_id": "2",
            "category_id": 3,
            "is_active": true,
            "amount": 2000,
            "send_check": false,
            "checked": true,
            "has_certificate": true,
            "certificate_id": null,
            "created_at": "2025-05-13T11:36:35.000000Z",
            "updated_at": "2025-05-15T11:21:28.000000Z",
            "rating": "0",
            "author_name": "Азизбек Сексембай",
            "tags": [
                {
                    "id": 1,
                    "course_id": 1,
                    "tag": "Laravel",
                    "created_at": "2025-05-13T11:37:22.000000Z",
                    "updated_at": "2025-05-13T11:37:22.000000Z"
                },
                {
                    "id": 2,
                    "course_id": 1,
                    "tag": "Vite",
                    "created_at": "2025-05-13T11:37:22.000000Z",
                    "updated_at": "2025-05-13T11:37:22.000000Z"
                }
            ]
        },{
            "id": 1,
            "name": "Быстрый курс по Laravel + Vue3: MVC API Микросервис",
            "image_path": "http://localhost:8082//storage/logoCourse/oHo9XUt5tlwXp12KzFcXUHySEqOKBfr36ANz0Fzt.png",
            "author_id": "2",
            "category_id": 3,
            "is_active": true,
            "amount": 2000,
            "send_check": false,
            "checked": true,
            "has_certificate": true,
            "certificate_id": null,
            "created_at": "2025-05-13T11:36:35.000000Z",
            "updated_at": "2025-05-15T11:21:28.000000Z",
            "rating": "0",
            "author_name": "Азизбек Сексембай",
            "tags": [
                {
                    "id": 1,
                    "course_id": 1,
                    "tag": "Laravel",
                    "created_at": "2025-05-13T11:37:22.000000Z",
                    "updated_at": "2025-05-13T11:37:22.000000Z"
                },
                {
                    "id": 2,
                    "course_id": 1,
                    "tag": "Vite",
                    "created_at": "2025-05-13T11:37:22.000000Z",
                    "updated_at": "2025-05-13T11:37:22.000000Z"
                }
            ]
        },  
    ]
}

onMounted(() => {
    document.addEventListener('wheel', disablePageScroll, { passive: false });
    window.addEventListener('resize', handleResize);
    getCards();
});

onUnmounted(() => {
    document.removeEventListener('wheel', disablePageScroll);
    window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.carousel__slide {
    display: flex;
    justify-content: center;
}

header {
    margin: 20px;
    margin-top: 100px;
    margin-bottom: 50px;
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

.small-slide .card .r-cont-card img {
    width: 200px;
    height: 200px;
}

.small-slide .card .r-cont-card .author_name img {
    width: 13px;
    height: 13px;
}

.small-slide .card .r-cont-card .rating img {
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

.author_name {
    font-size: 15px !important;
    cursor: pointer;
}

.author_name img {
    width: 13px;
    height: 13px;
}

.rating {
    display: flex;
    justify-content: center;
    align-items: center;
}

.rating img {
    width: 20px;
    height: 20px;
    margin-right: 3px;
}

/* Мобильные стили */
@media (max-width: 500px) {
    header {
        margin-top: 50px;
        margin-bottom: 50px;
        font-size: 32px;
    }

    .card {
        flex-direction: column;
        height: auto;
        width: 280px !important;
        padding: 20px;
    }

    .active-slide .card,
    .small-slide .card {
        width: 280px !important;
        height: auto;
        opacity: 1;
        transform: none;
        font-size: 14px;
    }

    .l-cont-card,
    .r-cont-card {
        width: 100%;
        padding: 0;
    }

    .l-cont-card {
        margin-bottom: 20px;
    }

    .l-cont-card h1 {
        font-size: 20px;
        text-align: center;
    }

    .l-cont-card button {
        position: relative;
        left: auto;
        transform: none;
        width: 100%;
        margin-top: 15px;
        font-size: 16px;
    }

    .l-cont-card button:hover {
        transform: none;
    }

    .list {
        max-height: none;
    }

    .l-cont-card ul {
        padding: 10px 0;
    }

    .r-cont-card {
        align-items: center;
    }

    .r-cont-card img {
        max-width: 150px;
        height: 150px;
        margin: 10px 0;
    }

    .r-cont-card p {
        font-size: 16px;
    }

    .rating img {
        width: 16px;
        height: 16px;
    }

    .author_name {
        font-size: 12px !important;
    }

    .author_name img {
        width: 10px;
        height: 10px;
    }
}
</style>