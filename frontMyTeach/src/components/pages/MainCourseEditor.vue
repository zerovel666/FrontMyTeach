<template>
    <TopBar />
    <div class="containerBody">
        <div class="content" v-if="courseInfo.id">
            <div class="top-card-info">
                <div class="l-info">
                    <h1>{{ courseInfo.name }}</h1>
                    <p>{{ courseInfo.previews }}</p>
                    <p>Количество задач: {{ courseInfo.task_count }}</p>
                    <p>Учащихся: {{ courseInfo.has_course_count }}</p>
                    <h2>Тэги</h2>
                    <ul class="tags">
                        <li v-for="(tag, index) in courseInfo.tags" :key="index">{{ tag.tag }}</li>
                    </ul>
                    <div class="courseMainAction">
                        <button>
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
    <ConfirmCourseModal :visible="showConfrimModal" title="Удаление курса" message="Вы точно хотите удалить этот курс?"
        @confirm="handleConfirm" @cancel="handleCancel" />
    <FooterBar />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import axios from 'axios';
import { API_URL } from '@/config';
import { useRoute } from 'vue-router';
import ConfirmCourseModal from './CourseEditorLayouts/ConfrimCourseModal.vue';

const courseInfo = ref([]);
const showConfrimModal = ref(false)
const route = useRoute();

const getCourseInfo = async () => {
    // const response = await axios.get(`${API_URL}/course/${route.params.id}`);
    // courseInfo.value = response.data;

    courseInfo.value = {
        "id": 5,
        "name": "Курс по Python",
        "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
        "is_active": true,
        "category": {
            "id": 2,
            "category": "SpringBoot",
            "created_at": "2025-04-25T07:49:29.000000Z",
            "updated_at": "2025-04-25T07:49:29.000000Z"
        },
        "has_certificate": false,
        "author_name": "Jovany Marvin",
        "author_image_path": "http://localhost:8081/storage/userAvatars/default_avatars.jpg",
        "status": "Отклонен",
        "preview": {
            "id": 5,
            "title": "Architecto fuga repellendus ut eos recusandae voluptas porro cupiditate necessitatibus voluptatum aperiam ipsam unde et neque maiores aliquam."
        },
        "descriptions": [
            {
                "id": 5,
                "queue": 1,
                "str_value": "Blanditiis temporibus et quis unde recusandae quis et vel eos voluptates voluptas hic reiciendis enim.",
                "preview_id": 5,
                "created_at": "2025-04-25T07:49:30.000000Z",
                "updated_at": "2025-04-25T07:49:30.000000Z"
            }
        ],
        "task_count": 25,
        "tags": [
            {
                "id": 13,
                "course_id": 5,
                "tag": "nam",
                "created_at": "2025-04-25T07:49:30.000000Z",
                "updated_at": "2025-04-25T07:49:30.000000Z"
            },
            {
                "id": 14,
                "course_id": 5,
                "tag": "sint",
                "created_at": "2025-04-25T07:49:30.000000Z",
                "updated_at": "2025-04-25T07:49:30.000000Z"
            },
            {
                "id": 15,
                "course_id": 5,
                "tag": "aspernatur",
                "created_at": "2025-04-25T07:49:30.000000Z",
                "updated_at": "2025-04-25T07:49:30.000000Z"
            }
        ],
        "modules": [
            {
                "id": 21,
                "queue": 1,
                "str_value": "Ipsa rerum non corporis enim aut quasi illum repellendus sunt iure et laudantium voluptas libero.",
                "course_id": 5,
                "created_at": "2025-04-25T07:49:30.000000Z",
                "updated_at": "2025-04-25T07:49:30.000000Z",
                "tasks": [
                    {
                        "id": 101,
                        "name": "et",
                        "order_id": 1,
                        "type": "task",
                        "module_id": 21,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 102,
                        "name": "expedita",
                        "order_id": 2,
                        "type": "task",
                        "module_id": 21,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 103,
                        "name": "libero",
                        "order_id": 3,
                        "type": "task",
                        "module_id": 21,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 104,
                        "name": "ut",
                        "order_id": 4,
                        "type": "task",
                        "module_id": 21,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 105,
                        "name": "quod",
                        "order_id": 5,
                        "type": "task",
                        "module_id": 21,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    }
                ]
            },
            {
                "id": 22,
                "queue": 2,
                "str_value": "Et expedita sed ut amet provident aut cumque.",
                "course_id": 5,
                "created_at": "2025-04-25T07:49:30.000000Z",
                "updated_at": "2025-04-25T07:49:30.000000Z",
                "tasks": [
                    {
                        "id": 106,
                        "name": "porro",
                        "order_id": 6,
                        "type": "task",
                        "module_id": 22,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 107,
                        "name": "inventore",
                        "order_id": 7,
                        "type": "task",
                        "module_id": 22,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 108,
                        "name": "velit",
                        "order_id": 8,
                        "type": "task",
                        "module_id": 22,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 109,
                        "name": "quia",
                        "order_id": 9,
                        "type": "task",
                        "module_id": 22,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 110,
                        "name": "aut",
                        "order_id": 10,
                        "type": "task",
                        "module_id": 22,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    }
                ]
            },
            {
                "id": 23,
                "queue": 3,
                "str_value": "Provident molestias quaerat sit reiciendis et voluptates doloremque nihil aut velit.",
                "course_id": 5,
                "created_at": "2025-04-25T07:49:30.000000Z",
                "updated_at": "2025-04-25T07:49:30.000000Z",
                "tasks": [
                    {
                        "id": 111,
                        "name": "ab",
                        "order_id": 11,
                        "type": "task",
                        "module_id": 23,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 112,
                        "name": "magni",
                        "order_id": 12,
                        "type": "task",
                        "module_id": 23,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 113,
                        "name": "tempora",
                        "order_id": 13,
                        "type": "task",
                        "module_id": 23,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 114,
                        "name": "tempora",
                        "order_id": 14,
                        "type": "task",
                        "module_id": 23,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 115,
                        "name": "et",
                        "order_id": 15,
                        "type": "task",
                        "module_id": 23,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    }
                ]
            },
            {
                "id": 24,
                "queue": 4,
                "str_value": "Pariatur quia et sint esse ipsa quam.",
                "course_id": 5,
                "created_at": "2025-04-25T07:49:30.000000Z",
                "updated_at": "2025-04-25T07:49:30.000000Z",
                "tasks": [
                    {
                        "id": 116,
                        "name": "amet",
                        "order_id": 16,
                        "type": "task",
                        "module_id": 24,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 117,
                        "name": "est",
                        "order_id": 17,
                        "type": "task",
                        "module_id": 24,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 118,
                        "name": "maxime",
                        "order_id": 18,
                        "type": "task",
                        "module_id": 24,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 119,
                        "name": "ipsum",
                        "order_id": 19,
                        "type": "task",
                        "module_id": 24,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 120,
                        "name": "eum",
                        "order_id": 20,
                        "type": "task",
                        "module_id": 24,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    }
                ]
            },
            {
                "id": 25,
                "queue": 5,
                "str_value": "Voluptate eos dolorem dolorem hic consequatur occaecati voluptas laudantium impedit suscipit nemo eum iusto.",
                "course_id": 5,
                "created_at": "2025-04-25T07:49:30.000000Z",
                "updated_at": "2025-04-25T07:49:30.000000Z",
                "tasks": [
                    {
                        "id": 121,
                        "name": "ut",
                        "order_id": 21,
                        "type": "task",
                        "module_id": 25,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 122,
                        "name": "non",
                        "order_id": 22,
                        "type": "task",
                        "module_id": 25,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 123,
                        "name": "optio",
                        "order_id": 23,
                        "type": "task",
                        "module_id": 25,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 124,
                        "name": "quidem",
                        "order_id": 24,
                        "type": "task",
                        "module_id": 25,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    },
                    {
                        "id": 125,
                        "name": "et",
                        "order_id": 25,
                        "type": "task",
                        "module_id": 25,
                        "course_id": 5,
                        "created_at": "2025-04-25T07:49:30.000000Z",
                        "updated_at": "2025-04-25T07:49:30.000000Z"
                    }
                ]
            }
        ]
    }
}

function handleConfirm() {
    showConfrimModal.value = false
}

function handleCancel() {
    showConfrimModal.value = false
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