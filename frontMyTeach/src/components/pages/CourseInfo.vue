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
                        <button class="btn-buy" @click="buy()">Приобрести</button>
                        <div class="fastInfoCourse">
                            <div class="line"></div>
                            <p>Категория: {{ courseInfo.category_name }}</p>
                            <p>Курс: {{ courseInfo.course_name }}</p>
                            <p>Учащихся: {{ courseInfo.has_course_count }}</p>
                            <p>Примерное время прохождения: {{ Math.round(courseInfo.task_count *
                                courseInfo.modules.length * 20 / 60) }}ч</p>
                            <p>Количество модулей: {{ courseInfo.modules.length }}</p>
                            <p>Количество задач: {{ courseInfo.task_count }}</p>
                            <p>Выдача сертификат: {{ courseInfo.hasCertificate === true ? "Да" : "Нет" }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <FooterBar />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/config';

const route = useRoute();
const courseInfo = ref([]);

const getCourseInfo = async () => {
    const response = await axios.get(`${API_URL}/student/course/${route.params.id}`);
    courseInfo.value = response.data[0];

    // courseInfo.value = {
    //     "data": {
    //         "category_id": 1,
    //         "category_name": "HTML&CSS",
    //         "course_id": 4,
    //         "course_name": "Курс по JS",
    //         "course_amount": null,
    //         "image_path": "http://localhost:8082//storage/logoCourse/laravelLogo.png",
    //         "author_id": "1",
    //         "author_name": "Antonio Banderes",
    //         "author_image_path": "http://localhost:8081/storage/userAvatars/default_avatars.jpg",
    //         "rating": "5",
    //         "tags": [
    //             {
    //                 "id": 10,
    //                 "course_id": 4,
    //                 "tag": "explicabo",
    //                 "created_at": "2025-04-09T13:56:02.000000Z",
    //                 "updated_at": "2025-04-09T13:56:02.000000Z"
    //             },
    //             {
    //                 "id": 11,
    //                 "course_id": 4,
    //                 "tag": "nostrum",
    //                 "created_at": "2025-04-09T13:56:02.000000Z",
    //                 "updated_at": "2025-04-09T13:56:02.000000Z"
    //             },
    //             {
    //                 "id": 12,
    //                 "course_id": 4,
    //                 "tag": "quae",
    //                 "created_at": "2025-04-09T13:56:02.000000Z",
    //                 "updated_at": "2025-04-09T13:56:02.000000Z"
    //             }
    //         ],
    //         "previews": "In est quisquam ullam nihil et facere magnam enim et ad repellendus eum.",
    //         "description": [
    //             {
    //                 "id": 4,
    //                 "queue": 1,
    //                 "str_value": "Voluptatum laudantium porro ea maxime laborum facere unde aut adipisci rerum quae iste illum. Voluptatum laudantium porro ea maxime laborum facere unde aut adipisci rerum quae iste illum.",
    //                 "preview_id": 4,
    //                 "created_at": "2025-04-09T13:56:02.000000Z",
    //                 "updated_at": "2025-04-09T13:56:02.000000Z"
    //             },
    //             {
    //                 "id": 22,
    //                 "queue": 2,
    //                 "str_value": "Ratione odit qui cupiditate ullam consequatur facere non alias architecto ab aut.",
    //                 "preview_id": 4,
    //                 "created_at": "2025-04-09T13:56:02.000000Z",
    //                 "updated_at": "2025-04-09T13:56:02.000000Z"
    //             },
    //             {
    //                 "id": 23,
    //                 "queue": 3,
    //                 "str_value": "Et dolores eaque temporibus saepe provident qui voluptatem sapiente corrupti explicabo consequatur tenetur ipsam ipsa.",
    //                 "preview_id": 4,
    //                 "created_at": "2025-04-09T13:56:02.000000Z",
    //                 "updated_at": "2025-04-09T13:56:02.000000Z"
    //             }
    //         ],
    //         "modules": [
    //             {
    //                 "id": 16,
    //                 "queue": 1,
    //                 "str_value": "Nemo dicta praesentium facere et voluptatibus rerum deleniti explicabo animi ex vitae hic.",
    //                 "course_id": 4,
    //                 "created_at": "2025-04-09T13:56:02.000000Z",
    //                 "updated_at": "2025-04-09T13:56:02.000000Z",
    //                 "tasks": [
    //                     {
    //                         "id": 76,
    //                         "name": "rerum",
    //                         "order_id": 1,
    //                         "type": "task",
    //                         "module_id": 16,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 77,
    //                         "name": "ratione",
    //                         "order_id": 2,
    //                         "type": "task",
    //                         "module_id": 16,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 78,
    //                         "name": "dolorum",
    //                         "order_id": 3,
    //                         "type": "task",
    //                         "module_id": 16,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 79,
    //                         "name": "qui",
    //                         "order_id": 4,
    //                         "type": "task",
    //                         "module_id": 16,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 80,
    //                         "name": "facilis",
    //                         "order_id": 5,
    //                         "type": "task",
    //                         "module_id": 16,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "id": 17,
    //                 "queue": 2,
    //                 "str_value": "Ullam rerum laboriosam perspiciatis et repellendus qui et.",
    //                 "course_id": 4,
    //                 "created_at": "2025-04-09T13:56:02.000000Z",
    //                 "updated_at": "2025-04-09T13:56:02.000000Z",
    //                 "tasks": [
    //                     {
    //                         "id": 81,
    //                         "name": "dicta",
    //                         "order_id": 6,
    //                         "type": "task",
    //                         "module_id": 17,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 82,
    //                         "name": "cupiditate",
    //                         "order_id": 7,
    //                         "type": "task",
    //                         "module_id": 17,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 83,
    //                         "name": "fugit",
    //                         "order_id": 8,
    //                         "type": "task",
    //                         "module_id": 17,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 84,
    //                         "name": "et",
    //                         "order_id": 9,
    //                         "type": "task",
    //                         "module_id": 17,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 85,
    //                         "name": "ratione",
    //                         "order_id": 10,
    //                         "type": "task",
    //                         "module_id": 17,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "id": 18,
    //                 "queue": 3,
    //                 "str_value": "Dolorem vitae officiis ad neque et reiciendis quaerat dolores autem.",
    //                 "course_id": 4,
    //                 "created_at": "2025-04-09T13:56:02.000000Z",
    //                 "updated_at": "2025-04-09T13:56:02.000000Z",
    //                 "tasks": [
    //                     {
    //                         "id": 86,
    //                         "name": "veritatis",
    //                         "order_id": 11,
    //                         "type": "task",
    //                         "module_id": 18,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 87,
    //                         "name": "et",
    //                         "order_id": 12,
    //                         "type": "task",
    //                         "module_id": 18,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 88,
    //                         "name": "consequatur",
    //                         "order_id": 13,
    //                         "type": "task",
    //                         "module_id": 18,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 89,
    //                         "name": "est",
    //                         "order_id": 14,
    //                         "type": "task",
    //                         "module_id": 18,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 90,
    //                         "name": "qui",
    //                         "order_id": 15,
    //                         "type": "task",
    //                         "module_id": 18,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "id": 19,
    //                 "queue": 4,
    //                 "str_value": "Provident commodi est nobis non earum distinctio excepturi iusto.",
    //                 "course_id": 4,
    //                 "created_at": "2025-04-09T13:56:02.000000Z",
    //                 "updated_at": "2025-04-09T13:56:02.000000Z",
    //                 "tasks": [
    //                     {
    //                         "id": 91,
    //                         "name": "animi",
    //                         "order_id": 16,
    //                         "type": "task",
    //                         "module_id": 19,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 92,
    //                         "name": "non",
    //                         "order_id": 17,
    //                         "type": "task",
    //                         "module_id": 19,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 93,
    //                         "name": "voluptas",
    //                         "order_id": 18,
    //                         "type": "task",
    //                         "module_id": 19,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 94,
    //                         "name": "sit",
    //                         "order_id": 19,
    //                         "type": "task",
    //                         "module_id": 19,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 95,
    //                         "name": "quae",
    //                         "order_id": 20,
    //                         "type": "task",
    //                         "module_id": 19,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "id": 20,
    //                 "queue": 5,
    //                 "str_value": "Illum delectus animi in nostrum distinctio quibusdam ut consectetur nobis eius.",
    //                 "course_id": 4,
    //                 "created_at": "2025-04-09T13:56:02.000000Z",
    //                 "updated_at": "2025-04-09T13:56:02.000000Z",
    //                 "tasks": [
    //                     {
    //                         "id": 96,
    //                         "name": "quia",
    //                         "order_id": 21,
    //                         "type": "task",
    //                         "module_id": 20,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 97,
    //                         "name": "qui",
    //                         "order_id": 22,
    //                         "type": "task",
    //                         "module_id": 20,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 98,
    //                         "name": "voluptatibus",
    //                         "order_id": 23,
    //                         "type": "task",
    //                         "module_id": 20,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 99,
    //                         "name": "aut",
    //                         "order_id": 24,
    //                         "type": "task",
    //                         "module_id": 20,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     },
    //                     {
    //                         "id": 100,
    //                         "name": "a",
    //                         "order_id": 25,
    //                         "type": "task",
    //                         "module_id": 20,
    //                         "course_id": 4,
    //                         "created_at": "2025-04-09T13:56:02.000000Z",
    //                         "updated_at": "2025-04-09T13:56:02.000000Z"
    //                     }
    //                 ]
    //             }
    //         ],
    //         "task_count": 25,
    //         "has_course_count": 1,
    //         "likes": 1,
    //         "hasCertificate": true,
    //         "created_at": "09-04-2025"
    //     }
    // }.data
}

onMounted(() => {
    getCourseInfo();
})
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

.rating {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;
    position: absolute;
    bottom: 0;
    right: 0;
}

.rating img {
    width: 20px;
    height: 20px;
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