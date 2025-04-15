<template>
    <TopBar />
    <div class="containerBody">
        <div class="content" v-if="cards">
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
                            <p class="ratingNum">{{ card.course.rating_course.rating }}
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
                Пожалуйста, выберите желаемые курс и начните обучение.
            </h1>
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

const cards = ref([]);
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

onMounted(getCards);
</script>

<style scoped>
.containerBody {
    min-height: 200px;
}

.card {
    width: 100%;
    height: 100%;
    max-height: 500px;
    margin: 60px 0;
    border-radius: 40px;
    overflow: hidden;
    border: 1px solid #0022FF;
}

.cardBgImg {
    padding: 30px 60px;
}

.cardInfo {
    position: relative;
    display: flex;
    justify-content: space-between;
}



.lInfo {
    width: 50%;
}

.lInfo ul {
    padding-left: 10px;
}

.lInfo li {
    margin: 10px;
    text-align: left;
    font-size: 23px;
}

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
}

.author_name img {
    width: 14px;
    height: 14px;
    margin-left: 5px;
}

.author_name {
    font-size: 14px;
    cursor: pointer;
    color: #219fda;
}

.lInfo button {
    background: none;
    border: 1px solid #B14788;
    border-radius: 10px;
    padding: 7.5px 30px;
    font-size: 28px;
    cursor: pointer;
    transition: transform ease 0.3s;
    margin-top: 50px;
    color: white;

}

.lInfo button:hover {
    transform: scale(1.1);
}

.ratingNum {
    position: absolute;
    right: 0;
    display: flex;
    justify-content: space-between;
    gap: 5px;
}

.ratingNum img {
    width: 20px;
    height: 20px;
}

.percentCompletesCont {
    width: 100%;
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.lineCont {
    background-color: #E58FFF;
    width: 100%;
    height: 50px;
    padding: 8px 5px;
    border-radius: 10px;
}

.line {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #2B0052 70%, #8200F4);
    border-radius: 10px;
}

.pCont {
    background-color: #1a282e00;
    height: 50px;
    font-size: 32px;
    display: flex;
    align-items: center;
}

.no-content {
    text-align: center;
    margin-top: 150px;
}
</style>