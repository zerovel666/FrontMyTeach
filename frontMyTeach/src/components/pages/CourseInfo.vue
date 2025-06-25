<template>
    <TopBar />
    <div class="containerBody">
        <div class="content" v-if="courseInfo.course_id">
            <div class="top-card-info">
                <div class="l-info">
                    <h1>{{ courseInfo.course_name }}</h1>
                    <p>{{ courseInfo.previews }}</p>
                    <p>Количество задач: {{ courseInfo.task_count }}</p>
                    <p>Учащихся: {{ courseInfo.has_course_count }}</p>
                    <h2>Тэги</h2>
                    <ul class="tags">
                        <li v-for="(tag, index) in courseInfo.tags" :key="index">{{ tag.tag }}</li>
                    </ul>
                    <button @click="showLike = true">Оценить</button>
                </div>
                <div class="r-info">
                    <img :src="courseInfo.image_path" alt="" id="courseImage">
                    <div class="rating">
                        {{ courseInfo.rating }}
                        <img src="/src/assets/Icons/Star.svg" alt="">
                    </div>
                </div>
            </div>
            <div class="obj-info">
                <div class="l-obj-info">
                    <h2>О курсе</h2>
                    <p v-for="(description, index) in courseInfo.description" :key="index">{{ description.str_value }}
                    </p>
                    <div class="modul-cont">
                        <h2>Программа обучения</h2>
                        <div class="line"></div>
                        <div v-for="(modul, index) in courseInfo.modules" :key="index" class="modules">
                            <h4>Модуль: {{ modul.str_value }}</h4>
                            <ol>
                                <li v-for="(task, key) in modul.tasks" :key="key">
                                    {{ task.type === 'task' ? 'Задача' : 'Лекция' }}: {{ task.name }}
                                </li>
                            </ol>
                            <div class="line"></div>
                        </div>
                    </div>
                </div>
                <div class="r-obj-info">
                    <div class="authorInfo">
                        <div class="bg">
                            <img :src="courseInfo.author_image_path" alt="">
                            <div class="text">
                                <h3>Автор</h3>
                                <p id="author_name">{{ courseInfo.author_name }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="buy-cont">
                        <h2>{{ courseInfo.course_amount === null ? 'Цена: Бесплатно' : `Цена:
                            ${courseInfo.course_amount}KZT` }}
                        </h2>
                        <button class="btn-buy" @click="buy()" v-if="'buyed' in courseInfo">{{ courseInfo.buyed ?
                            "Продолжить" : "Приобрести"
                            }}</button>
                        <div class="fastInfoCourse">
                            <div class="line"></div>
                            <div class="row">
                                <p>Категория:</p>
                                <p>{{ courseInfo.category_name }}</p>
                            </div>
                            <div class="row">
                                <p>Курс:</p>
                                <p>
                                    {{ courseInfo.course_name.length > 20
                                    ? courseInfo.course_name.slice(0, 20) + '..'
                                    : courseInfo.course_name }}
                                </p>
                            </div>
                            <div class="row">
                                <p>Учащихся</p>
                                <p>{{ courseInfo.has_course_count }}</p>
                            </div>
                            <div class="row">
                                <p>Время прохождения:</p>
                                <p>{{ Math.round(courseInfo.task_count *
                                    courseInfo.modules.length * 20 / 60) }}ч</p>
                            </div>
                            <div class="row">
                                <p>Количество модулей:</p>
                                <p>{{ courseInfo.modules.length }}</p>
                            </div>
                            <div class="row">
                                <p>Количество задач:</p>
                                <p>{{ courseInfo.task_count }}</p>
                            </div>
                            <div class="row">
                                <p>Выдача сертификат:</p>
                                <p>{{ courseInfo.hasCertificate === true ? "Да" : "Нет" }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <LikeComponent v-if="showLike" @close="showLike = false" @rated="handleRated" />
    <Notification ref="notificationRef" />
    <FooterBar />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/config';
import Notification from '../Notification.vue';
import VueCookies from 'vue-cookies';
import LikeComponent from '../layouts/LikeComponent.vue';


const notificationRef = ref(null);
const route = useRoute();
const courseInfo = ref([]);
const router = useRouter();

const buy = async () => {
    try {
        if (!courseInfo.value.buyed) {
            const response = await axios.post(`${API_URL}/student/course/${route.params.id}`)
            if (response.data.uuid) {
                router.push(`/pay/course/${response.data.uuid}`);
            } else {
                courseInfo.value.buyed = true
                notificationRef.value.showNotification(response.data.message ?? 'Этот курс уже был приобретен вами');
            }
        } else {
            router.push(`/task/${route.params.id}/${courseInfo.value.modules[0].tasks[0].id}`);
        }
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при приобретении курса. ' + error.response?.data?.error ?? "Пожалуйста, попробуйте позже");
    }
}

const getCourseInfo = async () => {

    let response = null;
    if (VueCookies.get('token') && (VueCookies.get('role') == 'student' || VueCookies.get('role') == 'admin')) {
        response = await axios.get(`${API_URL}/student/course/${route.params.id}`);
    } else (
        response = await axios.get(`${API_URL}/student/course/noAuth/${route.params.id}`)
    )
    courseInfo.value = response.data;

}

const showLike = ref(false);

const handleRated = async (rating) => {
    const data = {
        course_id : route.params.id,
        estimation : rating
    }
    await axios.post(`${API_URL}/student/course/like`,data);
    notificationRef.value.showNotification("Спасибо за оценку)");
};

onMounted(() => {
    getCourseInfo();
})
</script>

<style scoped>
:root {
    --primary: #59008E;
    --primary-light: #7824a9;
    --secondary: #B14788;
    --dark: #1A1A1A;
    --gray: #3D3D3D;
    --light-gray: #6D6D6D;
    --border: #4D4D4D;
    --danger: #D32F2F;
    --success: #388E3C;
}

.content {
    margin-top: 1rem;
    color: #E0E0E0;
    padding: 0 1rem;
}

.top-card-info {
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #59008E 0%, #6a1b9a 100%);
    border-radius: 12px;
    padding: 1.5rem;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.l-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    color: white;
    position: relative;
}

.l-info button {
    background-color: #9900f1;
    border: none;
    width: 200px;
    height: 40px;
    position: absolute;
    bottom: 0;
    cursor: pointer;
    border-radius: 10px;
}

.l-info h1 {
    font-size: 1.5rem;
    margin: 0;
    color: white;
}

.l-info p {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
    font-size: 0.9rem;
}

.r-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    order: -1;
}

#courseImage {
    width: 100%;
    max-width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid var(--secondary);
}

.rating {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    position: absolute;
    bottom: -1rem;
    right: 1rem;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 0.4rem 0.8rem;
    border-radius: 2rem;
    color: white;
    font-size: 0.9rem;
}

.rating img {
    width: 16px;
    height: 16px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-left: 0;
    list-style: none;
    margin-top: 0.5rem;
}

.tags li {
    background-color: #a200ff;
    padding: 0.2rem 0.6rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    color: #ffffff;
}

.obj-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.l-obj-info {
    border: 1px solid var(--dark);
    box-shadow: 0 0 8px rgba(177, 71, 136, 0.3);
    border-radius: 12px;
    padding: 1.5rem;
    background-color: #1A1A1A;
}

.r-obj-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.authorInfo {
    background: linear-gradient(135deg, #59008E 0%, #6a1b9a 100%);
    border-radius: 12px;
    overflow: hidden;
}

.bg {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
        url('/src/assets/images/layouts/BgProfile.svg');
    background-size: cover;
    background-position: center;
}

.authorInfo img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid white;
    object-fit: cover;
}

.text h3 {
    margin: 0 0 0.2rem 0;
    font-size: 0.9rem;
    opacity: 0.8;
    color: white;
}

#author_name {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 500;
    color: white;
}

.buy-cont {
    background: linear-gradient(135deg, #59008E 0%, #6a1b9a 100%);
    border-radius: 12px;
    padding: 1.2rem;
    color: white;
}

.buy-cont h2 {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
}

.btn-buy {
    width: 100%;
    padding: 0.7rem;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 1rem;
    background-color: #9900f1;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-buy:hover {
    background-color: #730ab0;
}

.fastInfoCourse {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    font-size: 0.9rem;
}

.fastInfoCourse p {
    margin: 0;
    display: flex;
    justify-content: space-between;
}

.row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
}

.modul-cont {
    margin-top: 1.5rem;
}

.line {
    width: 100%;
    height: 1px;
    background-color: white;
    margin: 1rem 0;
    opacity: 0.3;
}

.modules {
    margin-bottom: 1.5rem;
}

.modules h4 {
    font-size: 1.1rem;
    margin: 0 0 0.8rem 0;
    color: white;
}

.modules ol {
    padding-left: 1rem;
    margin: 1rem 0;
}

.modules ol li {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px dashed var(--border);
    color: white;
    font-size: 0.9rem;
}

.modules ol li:last-child {
    border-bottom: none;
}

@media (min-width: 768px) {
    .content {
        margin-top: 1.5rem;
        padding: 0 1.5rem;
    }

    .top-card-info {
        flex-direction: row;
        padding: 2rem;
        gap: 2rem;
        min-height: 300px;
    }

    .r-info {
        width: 300px;
        order: 1;
    }

    #courseImage {
        max-width: 300px;
        height: 300px;
    }

    .rating {
        bottom: -1rem;
        right: -1rem;
        font-size: 1rem;
    }

    .rating img {
        width: 18px;
        height: 18px;
    }

    .obj-info {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 2rem;
    }

    .authorInfo img {
        width: 100px;
        height: 100px;
    }
}

@media (min-width: 1024px) {
    .content {
        max-width: 1200px;
        margin: 2rem auto 0;
        padding: 0 2rem;
    }

    .top-card-info {
        border-radius: 16px;
        padding: 2.5rem;
        gap: 3rem;
        min-height: 350px;
    }

    .l-info h1 {
        font-size: 2rem;
    }

    .r-info {
        width: 350px;
    }

    #courseImage {
        max-width: 350px;
        height: 350px;
    }

    .obj-info {
        grid-template-columns: 1fr 350px;
    }

    .l-obj-info {
        border-radius: 16px;
        padding: 2rem;
    }

    .authorInfo img {
        width: 120px;   height: 120px;
    }

    #author_name {
        font-size: 1.4rem;
    }

    .btn-buy {
        padding: 0.8rem;
        font-size: 1rem;
    }
}
</style>