<template>
    <TopBar />
    <div class="containerBody">
        <div class="content" v-if="courseInfo.id">
            <div class="top-card-info">
                <div class="l-info">
                    <h1>{{ courseInfo.name }}</h1>
                    <p>{{ courseInfo.previews }}</p>
                    <p>Количество задач: {{ courseInfo.task_count }}</p>
                    <p>Учащихся: {{ courseInfo.has_course_count ?? "-" }}</p>
                    <h2>Тэги</h2>
                    <ul class="tags">
                        <li v-for="(tag, index) in courseInfo.tags" :key="index">{{ tag.tag }}</li>
                    </ul>
                    <div class="courseMainAction">
                        <button @click="showCardCourseModal = true">
                            Редактировать
                        </button>
                        <button @click="showConfrimModal = true">
                            Удалить курс
                        </button>
                    </div>
                </div>
                <div class="r-info">
                    <img :src="courseInfo.image_path" alt="" id="courseImage">
                </div>
            </div>
            <div class="obj-info">
                <div class="l-obj-info">
                    <h2>О курсе</h2>
                    <p v-for="(description, index) in courseInfo.description ?? []" :key="index">
                        {{ description.str_value ?? '-' }}
                    </p>
                    <div class="modul-cont">
                        <h2>Программа обучения</h2>
                        <div class="line"></div>
                        <div v-for="(modul, index) in courseInfo.modules ?? []" :key="index" class="modules">
                            <h4>Модуль: {{ modul.str_value ?? '-' }}</h4>
                            <ol>
                                <li v-for="(task, key) in modul.tasks ?? []" :key="key">
                                    {{ task.type === 'task' ? 'Задача' : 'Лекция' }}: {{ task.name ?? '-' }}
                                </li>
                            </ol>
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
                        <h2>Цена: {{ courseInfo.course_amount ? courseInfo.course_amount + ' KZT' : '-' }}</h2>

                        <button class="btn-buy" @click="buy()">Приобрести</button>
                        <div class="fastInfoCourse">
                            <div class="line"></div>
                            <p>Учащихся: {{ courseInfo.has_course_count ?? '-' }}</p>
                            <p>Количество задач: {{ courseInfo.task_count ?? '-' }}</p>
                            <p>Категория: {{ courseInfo.category?.category ?? '-' }}</p>
                            <p>Курс: {{ courseInfo.name ?? '-' }}</p>
                            <p>Примерное время прохождения: {{
                                courseInfo.task_count && courseInfo.modules?.length
                                    ? Math.round(courseInfo.task_count * courseInfo.modules.length * 20 / 60) + 'ч'
                                    : '-'
                            }}</p>
                            <p>Количество модулей: {{ courseInfo.modules?.length ?? '-' }}</p>
                            <p>Выдача сертификат: {{ courseInfo.hasCertificate === true ? 'Да' :
                                (courseInfo.hasCertificate === false ? 'Нет' : '-') }}</p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ConfirmCourseModal :showModal="showConfrimModal" title="Удаление курса"
        message="Вы точно хотите удалить этот курс?" @confirm="handleConfirmDeleteCourse"
        @cancel="showConfrimModal = false" />
    <CardCourseModal :showModal="showCardCourseModal" :cardBody="cardBody" @confirm="handleConfirmEditCardCourse"
        @cancel="showCardCourseModal = false" />

    <Notification ref="notificationRef" />

    <FooterBar />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import axios from 'axios';
import { API_URL } from '@/config';
import { useRoute } from 'vue-router';
import ConfirmCourseModal from './CourseEditorLayouts/ConfirmCourseModal.vue';
import CardCourseModal from './CourseEditorLayouts/CardCourseModal.vue';
import Notification from '../Notification.vue';

const courseInfo = ref([]);
const showConfrimModal = ref(false)
const showCardCourseModal = ref(false)
const cardBody = ref({});
const route = useRoute();
const notificationRef = ref(null);


const getCourseInfo = async () => {
    const response = await axios.get(`${API_URL}/course/${route.params.id}`);
    courseInfo.value = response.data;


    cardBody.value = {
        name: courseInfo.value.name,
        image_path: courseInfo.value.image_path,
        category: courseInfo.value.category,
        tags: courseInfo.value.tags
    };

    console.log(cardBody.value);
}

function handleConfirmDeleteCourse() {
    showConfrimModal.value = false
}

async function handleConfirmEditCardCourse(newValue) {
    console.log(newValue);

    try {
        const { image_path, ...dataToSend } = newValue; 
        const response = await axios.post(`${API_URL}/course/card/${route.params.id}`, dataToSend);
        
        showCardCourseModal.value = false;
        courseInfo.value = response.data;
        notificationRef.value.showNotification('Успешно обновлено');
        console.log('Успешно обновлено:', response.data);
        
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка ${error.message}`);
        console.error('Ошибка при обновлении:', error);
    }
}


onMounted(() => {
    getCourseInfo();
});
</script>

<style scoped>
.content {
    margin-top: 30px;
}

.top-card-info {
    display: flex;
    background-color: #59008E;
    height: 450px;
    padding: 30px;
    border-radius: 20px;
}

.courseMainAction {
    display: flex;
    flex-direction: column;
    max-width: 250px;
    gap: 15px;
}

.courseMainAction button {
    padding: 5px;
    border-radius: 10px;
    border: none;
    transition: transform 0.3s;
    background: #7824a9;
    border: 1px solid #bfbfbf;
    cursor: pointer;
}

.l-info {
    width: 60%;
    color: white;
    overflow-y: auto;
}

.r-info {
    width: 40%;
    display: flex;
    justify-content: right;
    align-items: center;
    position: relative;
}

#courseImage {
    width: 350px;
    height: 350px;
    object-fit: cover;
    border-radius: 100%;
}

.tags {
    padding-left: 20px;
}

.tags li {
    margin-top: 10px;
}

.obj-info {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    gap: 30px;
}

.r-obj-info {
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.authorInfo {
    background-color: #59008E;
    height: 200px;
    border-radius: 20px;
    overflow: hidden;
}

.bg {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    text-align: center;
    background-image: url('/src/assets/images/layouts/BgProfile.svg');
    padding: 30px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.authorInfo img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 100%;
    border: 2px solid white;
}

#author_name {
    color: white;
    font-size: 25px;
}

.text p {
    margin: 5px;
}

.modul-cont {
    margin-top: 50px;
}

.buy-cont {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #59008E;
    padding: 30px;
    border-radius: 20px;
}

.buy-cont h2 {
    margin: 0;
}

.btn-buy {
    cursor: pointer;
    height: 40px;
    border-radius: 15px;
    padding-left: 30px;
    padding-right: 30px;
    background-color: #7824a9;
    color: white;
    box-shadow: inset 0px 0px 7px rgb(255, 255, 255);
    border: none;
    transition: background 0.3s ease;
}

.btn-buy:hover {
    background-color: #611e88;
}

.l-obj-info {
    width: 60%;
    border: 1px solid #B14788;
    box-shadow: 0px 0px 7px #B14788;
    height: auto;
    border-radius: 20px;
    padding: 30px;
    display: flex;
    flex-direction: column;
}

.line {
    width: 100%;
    height: 2px;
    background-color: white;
    margin-bottom: 20px;
    margin-top: 20px;
}

.modules {
    margin-top: 20px;
}

.modules ol li {
    margin-top: 20px;
}

.modules ol {
    margin: 40px 0;
}
</style>