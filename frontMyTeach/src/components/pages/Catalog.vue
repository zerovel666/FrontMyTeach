<template>
    <div class="catalog-wrapper">
        <TopBar />
        <div class="containerBody">
            <Filter @updateWithFilter="updateWithFilter" @searchExtra="searchExtra" />
            <div class="content">
                <h1>Все курсы <img src="/src/assets/Icons/arrowBottom.svg" alt=""></h1>
                <div class="cards">
                    <div class="card" v-for="(card, index) in cards" :key="index"
                        :style="{ background: getGradients(index) }" @click="goCourseInfo(card.id)">
                        <div class="card-content">
                            <div class="course-image-wrapper">
                                <img :src="card.image_path" alt="" class="course-image" />
                                <p class="rating">
                                    {{ card.rating_course?.rating ?? card.rating ?? '—' }}
                                    <img src="/src/assets/Icons/Star.svg" alt="" />
                                </p>
                            </div>
                            <div class="course-info">
                                <h4>{{ card.name || card.course_name }}</h4>
                                <div class="tags">
                                    <span v-for="(tag, i) in card.tags" :key="i" class="tag">
                                        {{ tag.tag || '—' }}
                                    </span>
                                </div>
                                <div class="course-footer">
                                    <p class="author">
                                        {{ card.author_name || 'Неизвестный автор' }}
                                    </p>
                                    <button class="details-btn" @click.stop="goCourseInfo(card.id)">
                                        Подробнее
                                        <img src="/src/assets/Icons/Tap.svg" alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Paginate :paginateData="paginateData" @howPage="updatePage" />
            </div>
        </div>
        <FooterBar />
    </div>
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
    } else {
        getCards();
    }
})
</script>

<style scoped>
/* Базовые стили */
.catalog-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.containerBody {
    flex: 1;
    padding: 0 16px;
}

.content h1 {
    font-size: 28px;
    font-weight: 300;
    margin: 24px 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.content h1 img {
    width: 20px;
    height: 20px;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.card {
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-4px);
}

.card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.course-image-wrapper {
    position: relative;
    height: 160px;
    overflow: hidden;
}

.course-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.card:hover .course-image {
    transform: scale(1.05);
}

.rating {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
}

.rating img {
    width: 14px;
    height: 14px;
}

.course-info {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.course-info h4 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.3;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
}

.tag {
    background: rgba(255, 255, 255, 0.1);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    line-height: 1;
}

.course-footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.author {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
}

.details-btn {
    background: none;
    border: 1px solid #B14788;
    color: white;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.details-btn:hover {
    background: rgba(177, 71, 136, 0.2);
}

.details-btn img {
    width: 12px;
    height: 12px;
}

/* Адаптив для мобильных */
@media (max-width: 500px) {
    .containerBody {
        padding: 0 12px;
    }

    .content h1 {
        font-size: 24px;
        margin: 16px 0;
    }

    .cards {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .course-image-wrapper {
        height: 140px;
    }

    .course-info {
        padding: 12px;
    }

    .course-info h4 {
        font-size: 16px;
    }

    .tag {
        font-size: 11px;
        padding: 3px 6px;
    }

    .author {
        font-size: 13px;
    }

    .details-btn {
        padding: 5px 10px;
        font-size: 13px;
    }
}

/* Адаптив для очень маленьких экранов */
@media (max-width: 350px) {
    .course-image-wrapper {
        height: 120px;
    }

    .details-btn {
        padding: 4px 8px;
        font-size: 12px;
    }
}
</style>