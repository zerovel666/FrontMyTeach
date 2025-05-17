<template>
    <TopBar />
    <div class="containerBody">
        <div class="content" v-if="cards.length > 0">
            <div class="card" v-for="(card, index) in cards" :key="index" :style="{ background: getGradient(index) }">
                <div class="cardBgImg" :style="{ backgroundImage: `url(${getBgImage(index)})` }">
                    <div class="cardInfo">
                        <div class="lInfo">
                            <h1>{{ card.course.name }}</h1>
                            <ul>
                                <ul v-for="(tag, key) in card.course.tags">
                                    {{ tag.tag }}
                                </ul>
                            </ul>
                            <p class="author_name">{{ card.course.author_name }} <img src="/src/assets/Icons/Tap.svg"
                                    alt=""></p>
                            <button @click="goCourse(card.course_id)">Продолжить</button>
                        </div>
                        <div class="rInfo">
                            <p class="ratingNum">{{ card.course?.rating_course?.rating || 0 }}
                                <img src="/src/assets/Icons/Star.svg" alt="">
                            </p>
                            <img :src="card.course.image_path" alt="" class="courseImage">
                        </div>
                    </div>
                    <div class="percentCompletesCont">
                        <div class="lineCont">
                            <div class="line" :style="{ width: card.percentCompleted + '%' }"></div>
                        </div>
                        <div class="pCont">
                            {{ card.percentCompleted }}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="no-content">
            <h1>
                У вас нет курсов, которые вы можете продолжить. <br>
                Пожалуйста, выберите желаемые курсы и начните обучение.
            </h1>
            <button @click="goCatalog()">Перейти в каталог</button>
        </div>
    </div>
    <FooterBar />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import axios from 'axios';
import { API_URL } from '@/config';
import { useRouter } from 'vue-router';

const cards = ref([]);
const router = useRouter();

const getCards = async () => {
    const response = await axios.get(`${API_URL}/student/course/allMe`);
    cards.value = response.data;
}

const gradients = [
    "linear-gradient(120deg, #11001D, #FF006A 100%)",
    "linear-gradient(120deg, #11001D, #0080FF 100%)",
    "linear-gradient(120deg, #11001D, #8800FF 100%)"
];

const bgImages = [
    'src/assets/images/cardsMyCourse/bgElemRed.svg',
    'src/assets/images/cardsMyCourse/bgElemGreen.svg',
    'src/assets/images/cardsMyCourse/bgElemPurple.svg',
];

const getGradient = (index) => {
    return gradients[index % gradients.length];
};

const getBgImage = (index) => {
    return bgImages[index % bgImages.length];
}

const goCatalog = async => {
    router.push('/catalog')
}

const goCourse = async (id) => {
    router.push(`/course/info/${id}`)
}

onMounted(getCards);
</script>

<style scoped>
.containerBody {
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
}

.card {
    width: 100%;
    height: 100%;
    max-height: 500px;
    margin: 40px 0;
    border-radius: 30px;
    overflow: hidden;
    border: 1px solid #0022FF;
    box-shadow: 0 10px 30px rgba(0, 34, 255, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 34, 255, 0.3);
}

.cardBgImg {
    padding: 30px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.cardInfo {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.lInfo {
    width: 100%;
    color: white;
    display: flex;
    flex-direction: column;
    order: 2;
}

.lInfo h1 {
    font-size: 1.8rem;
    margin-bottom: 15px;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.lInfo ul {
    padding-left: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 15px;
    max-width: 100%;
}

.lInfo ul ul {
    background: rgba(255, 255, 255, 0.1);
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.9rem;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.author_name {
    font-size: 0.9rem;
    color: #219fda;
    display: inline-flex;
    align-items: center;
    margin-bottom: 20px;
}

.author_name img {
    width: 12px;
    height: 12px;
    margin-left: 5px;
    filter: invert(76%) sepia(29%) saturate(6880%) hue-rotate(176deg) brightness(98%) contrast(83%);
}

.lInfo button {
    background: rgba(177, 71, 136, 0.2);
    border: 1px solid #B14788;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    backdrop-filter: blur(5px);
    max-width: 200px;
}

.lInfo button:hover {
    transform: scale(1.05);
    background: rgba(177, 71, 136, 0.4);
    box-shadow: 0 0 15px rgba(177, 71, 136, 0.5);
}

.rInfo {
    position: relative;
    width: 100%;
    text-align: center;
    order: 1;
    margin-bottom: 20px;
}

.rInfo img.courseImage {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.ratingNum {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.9rem;
    z-index: 2;
}

.ratingNum img {
    width: 16px;
    height: 16px;
}

.percentCompletesCont {
    width: 100%;
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.lineCont {
    background-color: rgba(229, 143, 255, 0.2);
    width: 100%;
    height: 20px;
    border-radius: 6px;
    overflow: hidden;
    backdrop-filter: blur(5px);
    padding: 3px;
    border: 1px solid #A03D7A;
}

.line {
    height: 100%;
    background: linear-gradient(90deg, #2B0052 70%, #8200F4);
    border-radius: 6px;
    transition: width 0.5s ease;
}

.pCont {
    font-size: 1.1rem;
    font-weight: bold;
    min-width: 60px;
    text-align: right;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.no-content {
    text-align: center;
    margin-top: 100px;
    color: white;
    padding: 0 20px;
}

.no-content h1 {
    font-size: 1.5rem;
    line-height: 1.4;
    margin-bottom: 25px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.no-content button {
    margin-top: 25px;
    background: linear-gradient(90deg, #8200F4, #B14788);
    padding: 12px 30px;
    border-radius: 8px;
    font-size: 1.2rem;
    border: none;
    cursor: pointer;
    color: white;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(130, 0, 244, 0.3);
}

.no-content button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(130, 0, 244, 0.4);
    background: linear-gradient(90deg, #7200d5, #A03D7A);
}

/* Медиа-запросы для адаптации */
@media (min-width: 768px) {
    .containerBody {
        padding: 30px;
    }

    .card {
        margin: 50px 0;
        border-radius: 35px;
    }

    .cardBgImg {
        padding: 40px;
    }

    .lInfo {
        width: 60%;
        order: 1;
    }

    .lInfo h1 {
        font-size: 2rem;
    }

    .lInfo button {
        padding: 12px 25px;
        font-size: 1.1rem;
    }

    .rInfo {
        width: 40%;
        order: 2;
        margin-bottom: 0;
    }

    .rInfo img.courseImage {
        width: 250px;
        height: 250px;
    }

    .percentCompletesCont {
        margin-top: 30px;
    }
}

@media (min-width: 992px) {
    .cardInfo {
        flex-wrap: nowrap;
        gap: 30px;
    }

    .lInfo h1 {
        font-size: 2.3rem;
    }

    .lInfo ul {
        flex-wrap: nowrap;
        flex-direction: column;
    }

    .rInfo img.courseImage {
        width: 300px;
        height: 300px;
    }

    .no-content h1 {
        font-size: 1.8rem;
    }

    .no-content button {
        font-size: 1.3rem;
        padding: 14px 35px;
    }
}

@media (min-width: 1200px) {
    .card {
        max-height: 500px;
        margin: 60px 0;
        border-radius: 40px;
    }

    .cardBgImg {
        padding: 40px 60px;
    }

    .lInfo h1 {
        font-size: 2.5rem;
    }

    .lInfo button {
        padding: 12px 30px;
        font-size: 1.25rem;
    }

    .rInfo img.courseImage {
        width: 350px;
        height: 350px;
    }

    .percentCompletesCont {
        margin-top: 40px;
    }

    .lineCont {
        height: 30px;
        border-radius: 8px;
    }

    .pCont {
        font-size: 1.5rem;
    }

    .no-content h1 {
        font-size: 2rem;
    }

    .no-content button {
        font-size: 1.5rem;
    }
}

@media (max-width: 500px) {
    .card {
        margin: 20px 0;
        border-radius: 20px;
    }

    .cardBgImg {
        padding: 20px;
    }

    .cardInfo {
        gap: 15px;
    }

    .lInfo h1 {
        font-size: 1.3rem;
        margin-bottom: 10px;
    }

    .lInfo ul {
        gap: 6px;
        font-size: 0.85rem;
    }

    .lInfo ul ul {
        font-size: 0.8rem;
    }

    .lInfo button {
        font-size: 0.9rem;
        padding: 8px 16px;
        max-width: 100%;
    }

    .rInfo img.courseImage {
        height: 140px;
        border-radius: 10px;
    }

    .ratingNum {
        font-size: 0.8rem;
        padding: 4px 10px;
    }

    .ratingNum img {
        width: 14px;
        height: 14px;
    }

    .percentCompletesCont {
        gap: 10px;
    }

    .lineCont {
        height: 16px;
    }

    .pCont {
        font-size: 1rem;
        min-width: 50px;
    }

    .no-content {
        margin-top: 60px;
    }

    .no-content h1 {
        font-size: 1.2rem;
    }

    .no-content button {
        font-size: 1rem;
        padding: 10px 20px;
    }
}
</style>