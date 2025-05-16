<template>
    <TopBar />
    <div class="containerBody">
        <Filter @updateWithFilter="updateWithFilter" @searchExtra="searchExtra" />
        <div class="content">
            <h1>Все курсы <img src="/src/assets/Icons/arrowBottom.svg" alt="" /></h1>
            <div class="cards">
                <div class="card" v-for="(card, index) in cards" :key="index"
                    :style="{ background: getGradients(index)}">
                    <div class="lInfo">
                        <h4>{{ card.name ? card.name : card.course_name }}</h4>
                        <ul>
                            <li v-for="(tag, i) in card.tags" :key="i">{{ tag.tag ? tag.tag : '—' }}</li>
                        </ul>
                        <button @click="goCourseInfo(card.id)">Подробнее</button>
                    </div>
                    <div class="rInfo">
                        <p class="rating">
                            {{
                                card.rating_course && card.rating_course.rating
                                    ? card.rating_course.rating
                                    : card.rating
                                        ? card.rating
                                        : '—'
                            }}
                            <img src="/src/assets/Icons/Star.svg" alt="" />
                        </p>
                        <img :src="card.image_path" alt="" />
                        <p class="author">
                            {{ card.author_name ? card.author_name : 'Неизвестный автор' }}
                            <img src="/src/assets/Icons/Tap.svg" alt="" />
                        </p>
                    </div>
                </div>
            </div>
            <Paginate :paginateData="paginateData" @howPage="updatePage" />
        </div>
    </div>
    <FooterBar />
</template>


<script setup>
import { onMounted, ref, watch } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import Filter from './CatalogLayouts/Filter.vue';
import axios from 'axios';
import { API_URL } from '@/config';
import Paginate from '../layouts/Paginate.vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const paginateData = ref([]);
const cards = ref([]);
const gradients = [
    'linear-gradient(130deg,#11001D 30%,#B200FF 100%)',
    'linear-gradient(130deg,#11001D 30%,#00FFF2 100%)',
    'linear-gradient(130deg,#11001D 30%,#005EFF 100%)',
];
const route = useRoute();
const lastFilter = ref({});
const filters = ref({
    isFree: null,
    category: [],
    ratingStart: null,
    ratingEnd: null,
    amountStart: null,
    amountEnd: null,
    hasCertificate: null
});
const extraSeacrhCourse_id = ref(null);

const getGradients = (index) => {
    return gradients[index % gradients.length];
};

watch(() => route.query.course_id,
    (newVal, oldVal) => {
        if (newVal) {
            searchExtra(newVal)
        }
    },
)

const searchExtra = async (id) => {
    const response = await axios.get(`${API_URL}/student/course/${id}`);
    cards.value = [response.data]

    paginateData.value = []
}

const updateWithFilter = async (filter) => {
    lastFilter.value = filter.value;
    const response = await axios.post(`${API_URL}/student/course/getByFilter`, filter.value);
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
    const response = await axios.get(`${API_URL}/student/course/all`);
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

async function goCourseInfo(id) {
    router.push(`/course/info/${id}`)
}

onMounted(() => {
    const category = route.query.category;
    const course_id = route.query.course_id;
    if (category) {
        filters.value.category.push(category)
        updateWithFilter(filters)
    } else if (course_id) {
        extraSeacrhCourse_id.value = course_id
        searchExtra(course_id);
    }else {
        getCards();
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