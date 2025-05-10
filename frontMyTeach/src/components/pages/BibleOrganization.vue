<template>
    <TopBar />
    <div class="containerBody">
        <div class="content">
            <div class="card" v-for="(card, index) in cards" :key="index" :style="{ background: getGradient(index) }" v-if="cards.length > 0">
                <div class="cardBgImg" :style="{ backgroundImage: `url(${getBgImage(index)})` }">
                    <img :src="getBgImage(index)" class="bgImg" alt="bg" />
                    <div class="cardInfo">
                        <div class="lInfo">
                            <h1>{{ card.name }}</h1>
                            <div class="detailInfo">
                                <p>{{ card.preview.title }}</p>
                                <ul>
                                    <li v-for="(tag, key) in card.tags">
                                        {{ tag.tag }}
                                    </li>
                                </ul>
                            </div>
                            <p class="author_name">{{ card.author_name }} <img src="/src/assets/Icons/Tap.svg" alt="">
                            </p>
                            <button @click="getCourseInfo(card.id)">Подробнее</button>
                        </div>
                        <div class="rInfo">
                            <p class="ratingNum">{{ card.rating }}
                                <img src="/src/assets/Icons/Star.svg" alt="">
                            </p>
                            <img :src="card.image_path" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <h1 style="text-align: center; margin-top: 100px;">Курсов нет</h1>
            </div>
        </div>
    </div>
    <FooterBar />
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/config';
// import bgRed from '@/assets/images/cardsMyCourse/bgElemRed.svg';
// import bgGreen from '@/assets/images/cardsMyCourse/bgElemGreen.svg';
// import bgPurple from '@/assets/images/cardsMyCourse/bgElemPurple.svg';

// const bgImages = [bgRed, bgGreen, bgPurple];
const route = useRoute();
const router = useRouter();
const cards = ref([]);

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
}

const getGradient = (index) => {
    return gradients[index % gradients.length];
};

const getBgImage = (index) => {
    console.log(bgImages[index % bgImages.length]);
    return bgImages[index % bgImages.length];
}

const getCards = async () => {
    const response = await axios.get(`${API_URL}/student/course/bible/${route.params.organization_id}`)
    cards.value = response.data.data;

    // cards.value = response.data;
}

onMounted(() => {
    getCards();
})
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
}

.cardBgImg {
  position: relative;
  overflow: hidden;
  padding: 30px 60px;
}

.bgImg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}


.cardInfo {
    position: relative;
    z-index: 1;
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
    width: 400px;
    height: 400px;
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
.detailInfo{
    max-height: 200px;
    overflow-y: auto;
}
</style>