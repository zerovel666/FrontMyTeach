<template>
    <TopBar />
    <div class="containerBody">
        <div class="contButtonDownload">
            <button class="downloadBible" @click="addAllMe">Добавить все в личную библеотеку</button>
        </div>
        <div class="course-list">
            <div v-for="(card, index) in cards" :key="card.id" class="course-card"
                :style="{ background: gradients[index % gradients.length] }" @click="getCourseInfo(card.id)">
                <div class="card-bg" :style="{ backgroundImage: `url(${bgImages[index % bgImages.length]})` }">
                    <img :src="bgImages[index % bgImages.length]" class="bg-image" alt="" aria-hidden="true" />

                    <div class="card-content">
                        <div class="left-section">
                            <h2 class="course-title">{{ card.name }}</h2>

                            <div class="course-details">
                                <p class="preview-text">{{ card.preview.title }}</p>

                                <ul v-if="card.tags.length" class="tags-list">
                                    <li v-for="tag in card.tags" :key="tag.id">
                                        {{ tag.tag }}
                                    </li>
                                </ul>
                            </div>

                            <div class="author">
                                <span class="author-name">{{ card.author_name }}</span>
                                <img src="/src/assets/Icons/Tap.svg" />
                            </div>

                            <button class="details-button">Подробнее</button>
                        </div>

                        <div class="right-section">
                            <div class="rating">
                                <span class="rating-value">{{ card.rating }}</span>
                                <img src="/src/assets/Icons/Star.svg" alt="Рейтинг" />
                            </div>

                            <img :src="card.image_path" :alt="`Обложка курса ${card.name}`" class="course-image" />
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!cards.length" class="empty-state">
                <h1>Курсов нет</h1>
            </div>
        </div>
    </div>
    <FooterBar />

    <Notification ref="notificationRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TopBar from '../layouts/TopBar.vue';
import FooterBar from '../layouts/FooterBar.vue';
import Notification from '../Notification.vue';
import axios from 'axios';
import { API_URL } from '@/config';

const router = useRouter();
const cards = ref([]);
const notificationRef = ref(null);
const route = useRoute();

const gradients = [
    "linear-gradient(120deg, #11001D, #FF006A 100%)",
    "linear-gradient(120deg, #11001D, #0080FF 100%)",
    "linear-gradient(120deg, #11001D, #8800FF 100%)"
];

const bgImages = [
    new URL('@/assets/images/cardsMyCourse/bgElemRed.svg', import.meta.url).href,
    new URL('@/assets/images/cardsMyCourse/bgElemGreen.svg', import.meta.url).href,
    new URL('@/assets/images/cardsMyCourse/bgElemPurple.svg', import.meta.url).href
];

const getCourseInfo = (id) => {
    router.push(`/course/info/${id}`);
};

const getCards = async () => {
    try {
        const response = await axios.get(`${API_URL}/student/course/bible/${route.params.organization_id}`)
        cards.value = response.data;
    } catch (error) {
        notificationRef.value.showNotification(`Непредвиденная ошибка:` + error?.response?.data?.message ?? error.message)
    }
};

async function addAllMe() {
    try {
        const response = await axios.get(`${API_URL}/student/course/getMeByAllBible/${route.params.organization_id}`);
        notificationRef.value.showNotification('Курс организации успешно добавлены в вашу библеотеку')
    } catch (error) {
        notificationRef.value.showNotification("Ошибка: " + error?.response?.data?.error ?? "неизвестная ошибка");
    }
}

onMounted(getCards);
</script>

<style scoped>
.containerBody {
    display: flex;
    flex-direction: column;
}

.contButtonDownload{
    display: flex;
    align-items: center;
    justify-content: center;
}

.downloadBible {
    padding: 20px 40px;
    background-color: #59008E;
    margin-top: 40px;
    border-radius: 10px;
    border: none;
    transition: all 0.2s;
    cursor: pointer;
}

.downloadBible:hover {
    box-shadow: 0 0 10px #B14788;
}


.course-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 2rem 0;
}

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}

.empty-state h1 {
    font-size: 1.5rem;
    color: #666;
}

.course-card {
    border-radius: 2.5rem;
    overflow: hidden;
    border: 1px solid #0022FF;
    cursor: pointer;
}


.card-bg {
    position: relative;
    padding: 2rem;
    height: 100%;
}

.bg-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    opacity: 0.8;
}

.card-content {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    color: white;
}

.left-section {
    flex: 1;
    max-width: 50%;
    display: flex;
    flex-direction: column;
}

.course-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    line-height: 1.3;
}

.course-details {
    margin-bottom: 1rem;
    max-height: 12rem;
    overflow-y: auto;
}

.preview-text {
    font-size: 1rem;
    margin-bottom: 1rem;
    line-height: 1.5;
}

.tags-list {
    list-style-type: none;
    padding-left: 0.5rem;
}

.tags-list li {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    position: relative;
    padding-left: 1rem;
}

.tags-list li::before {
    content: '•';
    position: absolute;
    left: 0;
}

.author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.8rem;
    color: #219fda;
}

.author img {
    width: 0.8rem;
    height: 0.8rem;
}

.details-button {
    align-self: flex-start;
    background: transparent;
    border: 1px solid #B14788;
    border-radius: 0.5rem;
    padding: 0.5rem 1.5rem;
    font-size: 1.1rem;
    color: white;
    cursor: pointer;
    transition: background 0.2s ease;
}

.details-button:hover {
    background: rgba(255, 255, 255, 0.1);
}

.right-section {
    flex: 1;
    max-width: 50%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.rating {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-bottom: 1rem;
}

.rating-value {
    font-size: 1rem;
}

.rating img {
    width: 1rem;
    height: 1rem;
}

.course-image {
    width: 100%;
    max-width: 18rem;
    height: auto;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
    .card-content {
        flex-direction: column;
    }

    .left-section,
    .right-section {
        max-width: 100%;
    }

    .right-section {
        align-items: flex-start;
        margin-top: 1rem;
    }

    .course-image {
        max-width: 100%;
    }
}
</style>