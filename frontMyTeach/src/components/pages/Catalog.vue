<template>
    <TopBar />
    <div class="containerBody">
         <Filter @updateWithFilter="updateWithFilter" @searchExtra="searchExtra"/>
        <div class="content">
            <h1>Все курсы <img src="/src/assets/Icons/arrowBottom.svg" alt=""></h1>
            <div class="cards">
                <div class="card" v-for="(card, index) in cards" :key="index"
                    :style="{ background: getGradients(index) }">
                    <div class="lInfo">
                        <h4>{{ card.name }}</h4>
                        <ul>
                            <li v-for="(tag, index) in card.tags" :key="index">{{ tag.tag }}</li>
                        </ul>
                        <button>Подробнее</button>
                    </div>
                    <div class="rInfo">
                        <p class="rating">{{ card.rating_course.rating }} <img src="/src/assets/Icons/Star.svg" alt="">
                        </p>
                        <img :src="card.image_path" alt="">
                        <p class="author">{{ card.author_name }} <img src="/src/assets/Icons/Tap.svg" alt=""></p>
                    </div>
                </div>
            </div>
            <Paginate :paginateData="paginateData" @howPage="updatePage"/>
        </div>
    </div>
    <FooterBar />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import Filter from './CatalogLayouts/Filter.vue';
import axios from 'axios';
import { API_URL } from '@/config';
import Paginate from '../layouts/Paginate.vue';
import { useRoute } from 'vue-router';

const paginateData = ref([]);
const cards = ref({});
const gradients = [
    'linear-gradient(130deg,#11001D 30%,#B200FF 100%)',
    'linear-gradient(130deg,#11001D 30%,#00FFF2 100%)',
    'linear-gradient(130deg,#11001D 30%,#005EFF 100%)',
];
const route = useRoute();
const lastFilter = ref([]);
const filters = ref({
    isFree: null,
    category: [],
    ratingStart: null,
    ratingEnd: null,
    amountStart: null,
    amountEnd: null,
    hasCertificate: null   
});

const getGradients = (index) => {
    return gradients[index % gradients.length];
};

const searchExtra = async (id) => {
    const response = await axios.get(`${API_URL}/student/course/${id}`)
    cards.value = response.data.message
    paginateData.value = []
}

const updateWithFilter = async (filter) => {
    lastFilter.value = filter.value;
    const response = await axios.post(`${API_URL}/student/course/getByFilter`,filter.value);
    cards.value = response.data.data
    paginateData.value = {
        current_page: response.data.current_page,
        first_page_url: response.data.first_page_url,
        from: response.data.from,
        last_page: response.data.last_page,
        last_page_url: response.data.last_page_url,
        links: response.data.links,
        next_page_url: response.data.next_page_url,
        path: response.data.path,
        per_page: response.data.per_page,
        prev_page_url: response.data.prev_page_url,
        to: response.data.to,
        total: response.data.total
    }
}

const getCards = async () => {
    const response = {
        "current_page": 1,
        "data": [
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
                ],
                "rating_course": {
                    "id": 1,
                    "course_id": 1,
                    "rating": "3",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                }
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
                ],
                "rating_course": {
                    "id": 2,
                    "course_id": 2,
                    "rating": "2",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                }
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
                ],
                "rating_course": {
                    "id": 3,
                    "course_id": 3,
                    "rating": "2",
                    "created_at": "2025-03-27T08:10:31.000000Z",
                    "updated_at": "2025-03-27T08:10:31.000000Z"
                }
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
                ],
                "rating_course": {
                    "id": 4,
                    "course_id": 4,
                    "rating": "4",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
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
                ],
                "rating_course": {
                    "id": 5,
                    "course_id": 5,
                    "rating": "4",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
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
                ],
                "rating_course": {
                    "id": 6,
                    "course_id": 6,
                    "rating": "4",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
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
                ],
                "rating_course": {
                    "id": 7,
                    "course_id": 7,
                    "rating": "5",
                    "created_at": "2025-03-27T08:10:40.000000Z",
                    "updated_at": "2025-03-27T08:10:40.000000Z"
                }
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
                ],
                "rating_course": {
                    "id": 8,
                    "course_id": 8,
                    "rating": "3",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                }
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
                ],
                "rating_course": {
                    "id": 9,
                    "course_id": 9,
                    "rating": "3",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                }
            }
        ],
        "first_page_url": "http://localhost:8080/api/student/course/all?page=1",
        "from": 1,
        "last_page": 2,
        "last_page_url": "http://localhost:8080/api/student/course/all?page=2",
        "links": [
            {
                "url": "http://localhost:8080/api/student/course/all?",
                "label": "&laquo; Previous",
                "active": false
            },
            {
                "url": "http://localhost:8080/api/student/course/all?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": "http://localhost:8080/api/student/course/all?page=2",
                "label": "2",
                "active": false
            },
            {
                "url": "http://localhost:8080/api/student/course/all?page=2",
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "next_page_url": "http://localhost:8080/api/student/course/all?page=2",
        "path": "http://localhost:8080/api/student/course/all",
        "per_page": 9,
        "prev_page_url": null,
        "to": 9,
        "total": 15
    }
    cards.value = response.data
    paginateData.value = {
        current_page: response.current_page,
        first_page_url: response.first_page_url,
        from: response.from,
        last_page: response.last_page,
        last_page_url: response.last_page_url,
        links: response.links,
        next_page_url: response.next_page_url,
        path: response.path,
        per_page: response.per_page,
        prev_page_url: response.prev_page_url,
        to: response.to,
        total: response.total
    }
    // const response = await axios.get(`${API_URL}/student/course/all`);
    // cards.value = response.data.data
    // paginateData.value = {
    //     current_page: response.data.current_page,
    //     first_page_url: response.data.first_page_url,
    //     from: response.data.from,
    //     last_page: response.data.last_page,
    //     last_page_url: response.data.last_page_url,
    //     links: response.data.links,
    //     next_page_url: response.data.next_page_url,
    //     path: response.data.path,
    //     per_page: response.data.per_page,
    //     prev_page_url: response.data.prev_page_url,
    //     to: response.data.to,
    //     total: response.data.total
    // }
}

const updatePage = async (url) => {
    const response = await axios.get(url)
    cards.value = response.data.data
    paginateData.value = {
        current_page: response.data.current_page,
        first_page_url: response.data.first_page_url,
        from: response.data.from,
        last_page: response.data.last_page,
        last_page_url: response.data.last_page_url,
        links: response.data.links,
        next_page_url: response.data.next_page_url,
        path: response.data.path,
        per_page: response.data.per_page,
        prev_page_url: response.data.prev_page_url,
        to: response.data.to,
        total: response.data.total
    }
};

onMounted(() => {
    getCards();
    const category = route.query.category;
    if (category){
        filters.value.category.push(category)
        updateWithFilter(filters)

    }
})
</script>

<style scoped>
.content h1 {
    font-size: 48px;
    font-weight: 300;
}

.content h1 img {
    width: 30px;
}

.content {
    margin-top: 40px;
}

.cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.card {
    width: 400px;
    height: 240px;
    border-radius: 35px;
    display: flex;
    justify-content: space-between;
    padding: 20px;
}

.lInfo {
    font-size: 17px;
    display: flex;
    flex-direction: column;
    width: 50%;
    position: relative;
}

.lInfo ul li {
    padding: 0;
    padding-top: 5px;
}

.lInfo ul {
    padding: 0 18px;
}

.lInfo button {
    font-size: 17px !important;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    height: 30px;
    padding: 3px 20px;
    border-radius: 20px;
    border: 1px solid #B14788;
    background: none;
    font-size: 22px;
    color: white;
    transition: transform 0.3s;
    cursor: pointer;
}

.lInfo button:hover {
    transform: translateX(-50%) scale(1.1);
}

.rInfo {
    width: 50%;
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: center;
    align-items: center;
}

.rInfo img {
    width: 150px;
    height: 150px;
    border-radius: 100%;
    object-fit: cover;
}

.rating {
    position: absolute;
    top: 0;
    margin: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    gap: 3px;
}

.rating img {
    width: 20px;
    height: 20px;
}

.author {
    position: absolute;
    bottom: 0;
    margin: 0;
    font-size: 12px;
    right: 0;
}

.author img {
    width: 14px;
    height: 14px;
}
</style>