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
                                <li v-for="(tag, key) in card.course.tags">
                                    {{ tag.tag }}
                                </li>
                            </ul>
                            <p class="author_name">{{ card.course.author_name }} <img src="/src/assets/Icons/Tap.svg"
                                    alt=""></p>
                            <button>Продолжить</button>
                        </div>
                        <div class="rInfo">
                            <p class="ratingNum">{{ card.course?.rating_course?.rating || 0 }}
                                <img src="/src/assets/Icons/Star.svg" alt="">
                            </p>
                            <img :src="card.course.image_path" alt="">
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

onMounted(getCards);
</script>

<style scoped>
.card {
    width: 100%;
    height: 100%;
    max-height: 500px;
    margin: 60px 0;
    border-radius: 40px;
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
    padding: 40px 60px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* Стили для информации в карточке */
.cardInfo {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
}

.lInfo {
    width: 50%;
    color: white;
    display: flex;
    flex-direction: column;
}

.lInfo h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.lInfo ul {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    width: auto;
    gap: 10px;
    margin-bottom: 20px;
    max-width: 300px;
}

.lInfo li {
    background: rgba(255, 255, 255, 0.1);
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 1rem;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.author_name {
    font-size: 1rem;
    color: #219fda;
    display: inline-flex;
    align-items: center;
    margin-bottom: 30px;
}

.author_name img {
    width: 14px;
    height: 14px;
    margin-left: 5px;
    filter: invert(76%) sepia(29%) saturate(6880%) hue-rotate(176deg) brightness(98%) contrast(83%);
}

/* Кнопка продолжить */
.lInfo button {
    background: rgba(177, 71, 136, 0.2);
    border: 1px solid #B14788;
    border-radius: 10px;
    padding: 12px 30px;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    backdrop-filter: blur(5px);
}

.lInfo button:hover {
    transform: scale(1.05);
    background: rgba(177, 71, 136, 0.4);
    box-shadow: 0 0 15px rgba(177, 71, 136, 0.5);
}

/* Правая часть карточки */
.rInfo {
    position: relative;
    width: 50%;
    text-align: right;
}

.rInfo img {
    width: 350px;
    height: 350px;
    object-fit: cover;
    border-radius: 100%;
    border: 5px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

.ratingNum {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 1.1rem;
}

.ratingNum img {
    width: 20px;
    height: 20px;
}

.percentCompletesCont {
    width: 100%;
    margin-top: 40px;
    display: flex;
    align-items: center;
    gap: 20px;
}

.lineCont {
    background-color: rgba(229, 143, 255, 0.2);
    width: 100%;
    height: 30px;
    border-radius: 8px;
    overflow: hidden;
    backdrop-filter: blur(5px);
    padding: 5px;
    border: 1px solid #A03D7A;
}

.line {
    height: 100%;
    background: linear-gradient(90deg, #2B0052 70%, #8200F4);
    border-radius: 8px;
    transition: width 0.5s ease;
}

.pCont {
    font-size: 1.5rem;
    font-weight: bold;
    min-width: 80px;
    text-align: right;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Стили для отсутствия контента */
.no-content {
    text-align: center;
    margin-top: 150px;
    color: white;
}

.no-content h1 {
    font-size: 2rem;
    line-height: 1.5;
    margin-bottom: 30px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.no-content button {
    margin-top: 30px;
    background: linear-gradient(90deg, #8200F4, #B14788);
    padding: 15px 40px;
    border-radius: 10px;
    font-size: 1.5rem;
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

/* Адаптивность */
@media (max-width: 1200px) {
    .cardBgImg {
        padding: 30px;
    }

    .cardInfo {
        flex-direction: column;
    }

    .lInfo,
    .rInfo {
        width: 100%;
    }

    .rInfo {
        text-align: center;
        margin-top: 30px;
    }

    .rInfo img {
        width: 250px;
        height: 250px;
    }

    .ratingNum {
        top: -50px;
        right: 50%;
        transform: translateX(50%);
    }
}

@media (max-width: 768px) {
    .lInfo h1 {
        font-size: 1.8rem;
    }

    .no-content h1 {
        font-size: 1.5rem;
    }

    .no-content button {
        font-size: 1.2rem;
        padding: 12px 30px;
    }
}
</style>