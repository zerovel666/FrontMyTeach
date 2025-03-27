<template>
    <header>Популярное</header>
    <Carousel :wrap-around="true" ref="carouselRef" :items-to-show="1.7" snapAlign="center" @wheel="onScroll"
        v-if="cards.length" :autoplay="3000" @update:modelValue="activeIndex = $event" class="carousel">
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
    // cards.value = response.data
    const response = [
        {
            "id": 13,
            "name": "Курс по JS",
            "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
            "author_id": "4",
            "category_id": 10,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:49.000000Z",
            "updated_at": "2025-03-27T08:10:49.000000Z",
            "rating": "5",
            "author_name": "Antonio Banderes",
            "tags": [
                {
                    "id": 37,
                    "course_id": 13,
                    "tag": "sunt",
                    "created_at": "2025-03-27T08:10:49.000000Z",
                    "updated_at": "2025-03-27T08:10:49.000000Z"
                },
                {
                    "id": 38,
                    "course_id": 13,
                    "tag": "molestiae",
                    "created_at": "2025-03-27T08:10:49.000000Z",
                    "updated_at": "2025-03-27T08:10:49.000000Z"
                },
                {
                    "id": 39,
                    "course_id": 13,
                    "tag": "excepturi",
                    "created_at": "2025-03-27T08:10:49.000000Z",
                    "updated_at": "2025-03-27T08:10:49.000000Z"
                }
            ]
        },
        {
            "id": 11,
            "name": "Курс по SpringBoot",
            "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
            "author_id": "9",
            "category_id": 8,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:45.000000Z",
            "updated_at": "2025-03-27T08:10:45.000000Z",
            "rating": "5",
            "author_name": "Leonardo Di Kaprio",
            "tags": [
                {
                    "id": 31,
                    "course_id": 11,
                    "tag": "nemo",
                    "created_at": "2025-03-27T08:10:45.000000Z",
                    "updated_at": "2025-03-27T08:10:45.000000Z"
                },
                {
                    "id": 32,
                    "course_id": 11,
                    "tag": "itaque",
                    "created_at": "2025-03-27T08:10:45.000000Z",
                    "updated_at": "2025-03-27T08:10:45.000000Z"
                },
                {
                    "id": 33,
                    "course_id": 11,
                    "tag": "voluptates",
                    "created_at": "2025-03-27T08:10:45.000000Z",
                    "updated_at": "2025-03-27T08:10:45.000000Z"
                }
            ]
        },
        {
            "id": 7,
            "name": "Курс по SpringBoot",
            "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
            "author_id": "4",
            "category_id": 5,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:40.000000Z",
            "updated_at": "2025-03-27T08:10:40.000000Z",
            "rating": "5",
            "author_name": "Antonio Banderes",
            "tags": [
                {
                    "id": 19,
                    "course_id": 7,
                    "tag": "non",
                    "created_at": "2025-03-27T08:10:40.000000Z",
                    "updated_at": "2025-03-27T08:10:40.000000Z"
                },
                {
                    "id": 20,
                    "course_id": 7,
                    "tag": "qui",
                    "created_at": "2025-03-27T08:10:40.000000Z",
                    "updated_at": "2025-03-27T08:10:40.000000Z"
                },
                {
                    "id": 21,
                    "course_id": 7,
                    "tag": "dolor",
                    "created_at": "2025-03-27T08:10:40.000000Z",
                    "updated_at": "2025-03-27T08:10:40.000000Z"
                }
            ]
        },
        {
            "id": 15,
            "name": "Курс по PHP",
            "image_path": "http://localhost:8082//storage/logoCourse/laravelLogo.png",
            "author_id": "10",
            "category_id": 11,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:49.000000Z",
            "updated_at": "2025-03-27T08:10:49.000000Z",
            "rating": "5",
            "author_name": "Lana Rouz",
            "tags": [
                {
                    "id": 43,
                    "course_id": 15,
                    "tag": "alias",
                    "created_at": "2025-03-27T08:10:50.000000Z",
                    "updated_at": "2025-03-27T08:10:50.000000Z"
                },
                {
                    "id": 44,
                    "course_id": 15,
                    "tag": "labore",
                    "created_at": "2025-03-27T08:10:50.000000Z",
                    "updated_at": "2025-03-27T08:10:50.000000Z"
                },
                {
                    "id": 45,
                    "course_id": 15,
                    "tag": "beatae",
                    "created_at": "2025-03-27T08:10:50.000000Z",
                    "updated_at": "2025-03-27T08:10:50.000000Z"
                }
            ]
        },
        {
            "id": 5,
            "name": "Курс по HTML&CSS",
            "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
            "author_id": "9",
            "category_id": 4,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:36.000000Z",
            "updated_at": "2025-03-27T08:10:36.000000Z",
            "rating": "4",
            "author_name": "Leonardo Di Kaprio",
            "tags": [
                {
                    "id": 13,
                    "course_id": 5,
                    "tag": "velit",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                },
                {
                    "id": 14,
                    "course_id": 5,
                    "tag": "quam",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                },
                {
                    "id": 15,
                    "course_id": 5,
                    "tag": "sed",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
            ]
        },
        {
            "id": 10,
            "name": "Курс по HTML&CSS",
            "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
            "author_id": "9",
            "category_id": 5,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:45.000000Z",
            "updated_at": "2025-03-27T08:10:45.000000Z",
            "rating": "4",
            "author_name": "Leonardo Di Kaprio",
            "tags": [
                {
                    "id": 28,
                    "course_id": 10,
                    "tag": "tenetur",
                    "created_at": "2025-03-27T08:10:45.000000Z",
                    "updated_at": "2025-03-27T08:10:45.000000Z"
                },
                {
                    "id": 29,
                    "course_id": 10,
                    "tag": "sit",
                    "created_at": "2025-03-27T08:10:45.000000Z",
                    "updated_at": "2025-03-27T08:10:45.000000Z"
                },
                {
                    "id": 30,
                    "course_id": 10,
                    "tag": "non",
                    "created_at": "2025-03-27T08:10:45.000000Z",
                    "updated_at": "2025-03-27T08:10:45.000000Z"
                }
            ]
        },
        {
            "id": 6,
            "name": "Курс по Laravel",
            "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
            "author_id": "10",
            "category_id": 1,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:36.000000Z",
            "updated_at": "2025-03-27T08:10:36.000000Z",
            "rating": "4",
            "author_name": "Lana Rouz",
            "tags": [
                {
                    "id": 16,
                    "course_id": 6,
                    "tag": "doloribus",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                },
                {
                    "id": 17,
                    "course_id": 6,
                    "tag": "ipsam",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                },
                {
                    "id": 18,
                    "course_id": 6,
                    "tag": "dolorem",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
            ]
        },
        {
            "id": 4,
            "name": "Курс по Python",
            "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
            "author_id": "10",
            "category_id": 1,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:36.000000Z",
            "updated_at": "2025-03-27T08:10:36.000000Z",
            "rating": "4",
            "author_name": "Lana Rouz",
            "tags": [
                {
                    "id": 10,
                    "course_id": 4,
                    "tag": "placeat",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                },
                {
                    "id": 11,
                    "course_id": 4,
                    "tag": "a",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                },
                {
                    "id": 12,
                    "course_id": 4,
                    "tag": "quia",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
            ]
        },
        {
            "id": 8,
            "name": "Курс по JS",
            "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
            "author_id": "10",
            "category_id": 3,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:40.000000Z",
            "updated_at": "2025-03-27T08:10:40.000000Z",
            "rating": "3",
            "author_name": "Lana Rouz",
            "tags": [
                {
                    "id": 22,
                    "course_id": 8,
                    "tag": "quam",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                },
                {
                    "id": 23,
                    "course_id": 8,
                    "tag": "nisi",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                },
                {
                    "id": 24,
                    "course_id": 8,
                    "tag": "quo",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                }
            ]
        },
        {
            "id": 1,
            "name": "Курс по Django",
            "image_path": "http://localhost:8082//storage/logoCourse/laravelLogo.png",
            "author_id": "9",
            "category_id": 1,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:30.000000Z",
            "updated_at": "2025-03-27T08:10:30.000000Z",
            "rating": "3",
            "author_name": "Leonardo Di Kaprio",
            "tags": [
                {
                    "id": 1,
                    "course_id": 1,
                    "tag": "quia",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                },
                {
                    "id": 2,
                    "course_id": 1,
                    "tag": "rerum",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                },
                {
                    "id": 3,
                    "course_id": 1,
                    "tag": "ducimus",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                }
            ]
        },
        {
            "id": 9,
            "name": "Курс по SpringBoot",
            "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
            "author_id": "9",
            "category_id": 7,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:40.000000Z",
            "updated_at": "2025-03-27T08:10:40.000000Z",
            "rating": "3",
            "author_name": "Leonardo Di Kaprio",
            "tags": [
                {
                    "id": 25,
                    "course_id": 9,
                    "tag": "facilis",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                },
                {
                    "id": 26,
                    "course_id": 9,
                    "tag": "maiores",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                },
                {
                    "id": 27,
                    "course_id": 9,
                    "tag": "architecto",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                }
            ]
        },
        {
            "id": 12,
            "name": "Курс по Laravel",
            "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
            "author_id": "4",
            "category_id": 5,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:45.000000Z",
            "updated_at": "2025-03-27T08:10:45.000000Z",
            "rating": "3",
            "author_name": "Antonio Banderes",
            "tags": [
                {
                    "id": 34,
                    "course_id": 12,
                    "tag": "voluptatem",
                    "created_at": "2025-03-27T08:10:45.000000Z",
                    "updated_at": "2025-03-27T08:10:45.000000Z"
                },
                {
                    "id": 35,
                    "course_id": 12,
                    "tag": "alias",
                    "created_at": "2025-03-27T08:10:45.000000Z",
                    "updated_at": "2025-03-27T08:10:45.000000Z"
                },
                {
                    "id": 36,
                    "course_id": 12,
                    "tag": "porro",
                    "created_at": "2025-03-27T08:10:45.000000Z",
                    "updated_at": "2025-03-27T08:10:45.000000Z"
                }
            ]
        },
        {
            "id": 14,
            "name": "Курс по .NET",
            "image_path": "http://localhost:8082//storage/logoCourse/laravelLogo.png",
            "author_id": "10",
            "category_id": 15,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:49.000000Z",
            "updated_at": "2025-03-27T08:10:49.000000Z",
            "rating": "3",
            "author_name": "Lana Rouz",
            "tags": [
                {
                    "id": 40,
                    "course_id": 14,
                    "tag": "aut",
                    "created_at": "2025-03-27T08:10:50.000000Z",
                    "updated_at": "2025-03-27T08:10:50.000000Z"
                },
                {
                    "id": 41,
                    "course_id": 14,
                    "tag": "tenetur",
                    "created_at": "2025-03-27T08:10:50.000000Z",
                    "updated_at": "2025-03-27T08:10:50.000000Z"
                },
                {
                    "id": 42,
                    "course_id": 14,
                    "tag": "porro",
                    "created_at": "2025-03-27T08:10:50.000000Z",
                    "updated_at": "2025-03-27T08:10:50.000000Z"
                }
            ]
        },
        {
            "id": 2,
            "name": "Курс по Vue.js",
            "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
            "author_id": "9",
            "category_id": 3,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:30.000000Z",
            "updated_at": "2025-03-27T08:10:30.000000Z",
            "rating": "2",
            "author_name": "Leonardo Di Kaprio",
            "tags": [
                {
                    "id": 4,
                    "course_id": 2,
                    "tag": "iste",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                },
                {
                    "id": 5,
                    "course_id": 2,
                    "tag": "voluptatem",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                },
                {
                    "id": 6,
                    "course_id": 2,
                    "tag": "maiores",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                }
            ]
        },
        {
            "id": 3,
            "name": "Курс по HTML&CSS",
            "image_path": "http://localhost:8082//storage/logoCourse/laravelLogo.png",
            "author_id": "9",
            "category_id": 1,
            "is_active": true,
            "amount": null,
            "send_check": false,
            "checked": true,
            "has_certificate": false,
            "certificate_id": null,
            "created_at": "2025-03-27T08:10:30.000000Z",
            "updated_at": "2025-03-27T08:10:30.000000Z",
            "rating": "2",
            "author_name": "Leonardo Di Kaprio",
            "tags": [
                {
                    "id": 7,
                    "course_id": 3,
                    "tag": "quibusdam",
                    "created_at": "2025-03-27T08:10:31.000000Z",
                    "updated_at": "2025-03-27T08:10:31.000000Z"
                },
                {
                    "id": 8,
                    "course_id": 3,
                    "tag": "perspiciatis",
                    "created_at": "2025-03-27T08:10:31.000000Z",
                    "updated_at": "2025-03-27T08:10:31.000000Z"
                },
                {
                    "id": 9,
                    "course_id": 3,
                    "tag": "provident",
                    "created_at": "2025-03-27T08:10:31.000000Z",
                    "updated_at": "2025-03-27T08:10:31.000000Z"
                }
            ]
        }
    ]
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
.carousel__slide {
    display: flex;
    justify-content: center;
}

header {
    margin: 20px;
    margin-top: 100px;
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
</style>
