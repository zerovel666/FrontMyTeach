<template>
    <TopBar />
    <div class="containerBody">
        <div class="content">
            <div class="statsContainer">
                <div class="statCard">
                    <div class="statIcon">
                        <img src="/src/assets/Icons/Course.svg" alt="">
                    </div>
                    <div class="statInfo">
                        <div class="statValue">{{ count_courses }}</div>
                        <div class="statLabel">Всего курсов</div>
                    </div>
                </div>

                <div class="statCard">
                    <div class="statIcon">
                        <img src="/src/assets/Icons/Task.svg" alt="">
                    </div>
                    <div class="statInfo">
                        <div class="statValue">{{ count_tasks }}</div>
                        <div class="statLabel">Всего заданий</div>
                    </div>
                </div>
            </div>

            <div class="coursesSection">
                <h2 class="sectionTitle">
                    Опубликованные курсы
                    <span class="countBadge">{{ publishCourses.length }}</span>
                </h2>

                <div class="coursesGrid">
                    <div v-for="course in publishCourses" :key="course.id" class="courseCard"
                        @click="pushById(course.id)">
                        <div class="courseImage" :style="{ backgroundImage: `url(${course.image_path})` }">
                            <div class="courseRating">
                                {{ course.rating || '0' }} <img src="/src/assets/Icons/Star.svg" alt="">
                            </div>
                        </div>
                        <div class="courseContent">
                            <h3 class="courseTitle">{{ course.name }}</h3>
                            <div class="courseCategory">{{ course.category }}</div>

                            <div class="courseMeta">
                                <div class="metaItem">
                                    {{ course.task_count }} заданий
                                </div>
                                <div class="metaItem" v-if="course.relUsersCourses && course.relUsersCourses.length">
                                    {{ course.relUsersCourses.length }} студентов
                                </div>
                            </div>

                            <div class="tagsContainer">
                                <span v-for="tag in course.tags.slice(0, 3)" :key="tag.id" class="tag">
                                    #{{ tag.tag }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="coursesSection">
                <h2 class="sectionTitle">Неопубликованные курсы<span class="countBadge">{{ noPublishCourses.length
                        }}</span>
                </h2>

                <div class="coursesGrid">
                    <div v-for="course in noPublishCourses" :key="course.id" class="courseCard draft">
                        <div class="courseImage" :style="{ backgroundImage: `url(${course.image_path})` }">
                            <div class="draftBadge">Черновик</div>
                            <div class="statusIcon">{{course.status}}</div>
                        </div>
                        <div class="courseContent">
                            <h3 class="courseTitle">{{ course.name }}</h3>
                            <div class="courseCategory">{{ course.category }}</div>

                            <div class="courseMeta">
                                <div class="metaItem">{{ course.task_count }} заданий</div>
                            </div>

                            <div class="tagsContainer">
                                <span v-for="tag in course.tags.slice(0, 3)" :key="tag.id" class="tag">#{{ tag.tag
                                    }}</span>
                            </div>

                            <div class="courseActions">
                                <button class="actionButton edit" @click="goToEdit(course.id)">Редактировать</button>
                                <button class="actionButton publish" @click="publish(course.id)">Опубликовать</button>
                            </div>
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
import axios from 'axios';
import { API_URL } from '@/config';
import { useRouter } from 'vue-router';

const router = useRouter();
const publishCourses = ref([]);
const noPublishCourses = ref([]);
const count_courses = ref(0);
const count_tasks = ref(0);

const getCourses = async () => {
    try {
        const response = await axios.get(`${API_URL}/teacher/allMyInfo`);
        publishCourses.value = response.data.courses.publish;
        noPublishCourses.value = response.data.courses.noPublish;
        count_courses.value = response.data.count_courses;
        count_tasks.value = response.data.count_tasks;

        // const response = {
        //     "count_courses": 20,
        //     "count_tasks": 500,
        //     "courses": {
        //         "publish": [
        //             {
        //                 "id": 1,
        //                 "name": "Курс по PHP",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/javaLogo.webp",
        //                 "category": "C#",
        //                 "rating": "1",
        //                 "tags": [
        //                     {
        //                         "id": 1,
        //                         "course_id": 1,
        //                         "tag": "praesentium",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 2,
        //                         "course_id": 1,
        //                         "tag": "earum",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 3,
        //                         "course_id": 1,
        //                         "tag": "ut",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 2,
        //                 "name": "Курс по Java",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/laravelLogo.png",
        //                 "category": "Django",
        //                 "rating": "1",
        //                 "tags": [
        //                     {
        //                         "id": 4,
        //                         "course_id": 2,
        //                         "tag": "quis",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 5,
        //                         "course_id": 2,
        //                         "tag": "ut",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 6,
        //                         "course_id": 2,
        //                         "tag": "architecto",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 3,
        //                 "name": "Курс по C++",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/vueLogo.png",
        //                 "category": "C++",
        //                 "rating": "1",
        //                 "tags": [
        //                     {
        //                         "id": 7,
        //                         "course_id": 3,
        //                         "tag": "temporibus",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 8,
        //                         "course_id": 3,
        //                         "tag": "dolorum",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 9,
        //                         "course_id": 3,
        //                         "tag": "adipisci",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 7,
        //                 "name": "Курс по Vue.js",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/javaLogo.webp",
        //                 "category": "C#",
        //                 "rating": "4",
        //                 "tags": [
        //                     {
        //                         "id": 19,
        //                         "course_id": 7,
        //                         "tag": "amet",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 20,
        //                         "course_id": 7,
        //                         "tag": "qui",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 21,
        //                         "course_id": 7,
        //                         "tag": "sit",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 8,
        //                 "name": "Курс по Vue.js",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/laravelLogo.png",
        //                 "category": "C++",
        //                 "rating": "5",
        //                 "tags": [
        //                     {
        //                         "id": 22,
        //                         "course_id": 8,
        //                         "tag": "facere",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 23,
        //                         "course_id": 8,
        //                         "tag": "ut",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 24,
        //                         "course_id": 8,
        //                         "tag": "maxime",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 9,
        //                 "name": "Курс по HTML&CSS",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/vueLogo.png",
        //                 "category": "HTML&CSS",
        //                 "rating": "5",
        //                 "tags": [
        //                     {
        //                         "id": 25,
        //                         "course_id": 9,
        //                         "tag": "alias",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 26,
        //                         "course_id": 9,
        //                         "tag": "fugit",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 27,
        //                         "course_id": 9,
        //                         "tag": "reiciendis",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 10,
        //                 "name": "Курс по Python",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/laravelLogo.png",
        //                 "category": "C#",
        //                 "rating": "3",
        //                 "tags": [
        //                     {
        //                         "id": 28,
        //                         "course_id": 10,
        //                         "tag": "vel",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 29,
        //                         "course_id": 10,
        //                         "tag": "quaerat",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 30,
        //                         "course_id": 10,
        //                         "tag": "cumque",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 11,
        //                 "name": "Курс по C#",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/laravelLogo.png",
        //                 "category": "HTML&CSS",
        //                 "rating": "5",
        //                 "tags": [
        //                     {
        //                         "id": 31,
        //                         "course_id": 11,
        //                         "tag": "accusamus",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 32,
        //                         "course_id": 11,
        //                         "tag": "in",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 33,
        //                         "course_id": 11,
        //                         "tag": "sed",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 12,
        //                 "name": "Курс по JS",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/javaLogo.webp",
        //                 "category": "HTML&CSS",
        //                 "rating": "0",
        //                 "tags": [
        //                     {
        //                         "id": 34,
        //                         "course_id": 12,
        //                         "tag": "labore",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 35,
        //                         "course_id": 12,
        //                         "tag": "quibusdam",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 36,
        //                         "course_id": 12,
        //                         "tag": "qui",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 13,
        //                 "name": "Курс по Java",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/vueLogo.png",
        //                 "category": "C++",
        //                 "rating": "1",
        //                 "tags": [
        //                     {
        //                         "id": 37,
        //                         "course_id": 13,
        //                         "tag": "deleniti",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 38,
        //                         "course_id": 13,
        //                         "tag": "sed",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 39,
        //                         "course_id": 13,
        //                         "tag": "fugiat",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 14,
        //                 "name": "Курс по HTML&CSS",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/javaLogo.webp",
        //                 "category": "PHP",
        //                 "rating": "4",
        //                 "tags": [
        //                     {
        //                         "id": 40,
        //                         "course_id": 14,
        //                         "tag": "recusandae",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 41,
        //                         "course_id": 14,
        //                         "tag": "neque",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 42,
        //                         "course_id": 14,
        //                         "tag": "dicta",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 15,
        //                 "name": "Курс по SpringBoot",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/laravelLogo.png",
        //                 "category": "C#",
        //                 "rating": "4",
        //                 "tags": [
        //                     {
        //                         "id": 43,
        //                         "course_id": 15,
        //                         "tag": "fugiat",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 44,
        //                         "course_id": 15,
        //                         "tag": "sed",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     },
        //                     {
        //                         "id": 45,
        //                         "course_id": 15,
        //                         "tag": "omnis",
        //                         "created_at": "2025-04-09T13:56:03.000000Z",
        //                         "updated_at": "2025-04-09T13:56:03.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 16,
        //                 "name": "Курс по Python",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/laravelLogo.png",
        //                 "category": "C#",
        //                 "rating": "5",
        //                 "tags": [
        //                     {
        //                         "id": 46,
        //                         "course_id": 16,
        //                         "tag": "a",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     },
        //                     {
        //                         "id": 47,
        //                         "course_id": 16,
        //                         "tag": "voluptatem",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     },
        //                     {
        //                         "id": 48,
        //                         "course_id": 16,
        //                         "tag": "odio",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 17,
        //                 "name": "Курс по Java",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/javaLogo.webp",
        //                 "category": "C#",
        //                 "rating": "1",
        //                 "tags": [
        //                     {
        //                         "id": 49,
        //                         "course_id": 17,
        //                         "tag": "ad",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     },
        //                     {
        //                         "id": 50,
        //                         "course_id": 17,
        //                         "tag": "et",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     },
        //                     {
        //                         "id": 51,
        //                         "course_id": 17,
        //                         "tag": "ea",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 18,
        //                 "name": "Курс по PHP",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/javaLogo.webp",
        //                 "category": "HTML&CSS",
        //                 "rating": "4",
        //                 "tags": [
        //                     {
        //                         "id": 52,
        //                         "course_id": 18,
        //                         "tag": "debitis",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     },
        //                     {
        //                         "id": 53,
        //                         "course_id": 18,
        //                         "tag": "est",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     },
        //                     {
        //                         "id": 54,
        //                         "course_id": 18,
        //                         "tag": "dignissimos",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 19,
        //                 "name": "Курс по C#",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/javaLogo.webp",
        //                 "category": "Django",
        //                 "rating": "2",
        //                 "tags": [
        //                     {
        //                         "id": 55,
        //                         "course_id": 19,
        //                         "tag": "ad",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     },
        //                     {
        //                         "id": 56,
        //                         "course_id": 19,
        //                         "tag": "ut",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     },
        //                     {
        //                         "id": 57,
        //                         "course_id": 19,
        //                         "tag": "ut",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 20,
        //                 "name": "Курс по Vue.js",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/javaLogo.webp",
        //                 "category": "C#",
        //                 "rating": "2",
        //                 "tags": [
        //                     {
        //                         "id": 58,
        //                         "course_id": 20,
        //                         "tag": "enim",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     },
        //                     {
        //                         "id": 59,
        //                         "course_id": 20,
        //                         "tag": "mollitia",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     },
        //                     {
        //                         "id": 60,
        //                         "course_id": 20,
        //                         "tag": "aut",
        //                         "created_at": "2025-04-09T13:56:04.000000Z",
        //                         "updated_at": "2025-04-09T13:56:04.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": []
        //             },
        //             {
        //                 "id": 4,
        //                 "name": "Курс по JS",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/laravelLogo.png",
        //                 "category": "HTML&CSS",
        //                 "rating": "5",
        //                 "tags": [
        //                     {
        //                         "id": 10,
        //                         "course_id": 4,
        //                         "tag": "explicabo",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 11,
        //                         "course_id": 4,
        //                         "tag": "nostrum",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 12,
        //                         "course_id": 4,
        //                         "tag": "quae",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     }
        //                 ],
        //                 "task_count": 25,
        //                 "relUsersCourses": [
        //                     {
        //                         "id": 1,
        //                         "course_id": 4,
        //                         "is_completed": false,
        //                         "percentCompleted": 0,
        //                         "user_info": {
        //                             "id": 2,
        //                             "email": "student@gmail.com",
        //                             "first_name": "Pete",
        //                             "last_name": "Deckow",
        //                             "iin": "668555715520",
        //                             "organization_id": 1,
        //                             "group_id": 1,
        //                             "is_active": true,
        //                             "created_at": "2025-04-17T07:05:23.000000Z",
        //                             "updated_at": "2025-04-17T07:05:23.000000Z"
        //                         }
        //                     }
        //                 ]
        //             }
        //         ],
        //         "noPublish": [
        //             {
        //                 "id": 5,
        //                 "name": "Курс по PHP",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/laravelLogo.png",
        //                 "tags": [
        //                     {
        //                         "id": 13,
        //                         "course_id": 5,
        //                         "tag": "est",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 14,
        //                         "course_id": 5,
        //                         "tag": "possimus",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 15,
        //                         "course_id": 5,
        //                         "tag": "voluptatum",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     }
        //                 ],
        //                 "category": "C++",
        //                 "status": "В работе",
        //                 "task_count": 25
        //             },
        //             {
        //                 "id": 6,
        //                 "name": "Курс по .NET",
        //                 "image_path": "http://localhost:8082/storage/logoCourse/laravelLogo.png",
        //                 "tags": [
        //                     {
        //                         "id": 16,
        //                         "course_id": 6,
        //                         "tag": "corrupti",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 17,
        //                         "course_id": 6,
        //                         "tag": "nam",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     },
        //                     {
        //                         "id": 18,
        //                         "course_id": 6,
        //                         "tag": "ipsum",
        //                         "created_at": "2025-04-09T13:56:02.000000Z",
        //                         "updated_at": "2025-04-09T13:56:02.000000Z"
        //                     }
        //                 ],
        //                 "category": "PHP",
        //                 "status": "Проверяется",
        //                 "task_count": 25
        //             }
        //         ]
        //     }
        // }
        // publishCourses.value = response.courses.publish;
        // noPublishCourses.value = response.courses.noPublish;
        // count_courses.value = response.count_courses;
        // count_tasks.value = response.count_tasks;

    } catch (error) {
        console.error('Error fetching courses:', error);
    }
};

const pushById = async (id) => {
    router.push(`/course/info/${id}`)
}

const goToEdit = async (id) => {
    //write logic
}

const publish = async (id) => {
    await axios.post(`${API_URL}/course/sendAdminForCheck/${id}`)
    await getCourses();
}

onMounted(() => {
    getCourses();
});
</script>

<style scoped>
.containerBody {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: calc(100vh - 120px);
}

.content {
    padding: 20px 0;
}

.sectionTitle {
    font-size: 1.5rem;
    color: #E0E0E0;
    margin: 30px 0 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.countBadge {
    background: #6800A5;
    color: white;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.9rem;
    margin-left: 10px;
}

.statsContainer {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.statCard {
    background: #5A217C;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    border-left: 4px solid #5A217C;
}

.statIcon {
    width: 50px;
    height: 50px;
    background: #3D005C;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.statIcon img {
    width: 20px;
    height: 20px;
}

.statInfo {
    flex: 1;
}

.statValue {
    font-size: 2rem;
    font-weight: bold;
    color: #E0E0E0;
    line-height: 1;
}

.statLabel {
    font-size: 0.9rem;
    color: #B0B0B0;
    margin-top: 5px;
}

.coursesGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
}

.courseCard {
    background: #252525;
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #333;
    cursor: pointer;
}

.courseCard:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    border-color: #6800A5;
}

.courseCard.draft {
    border-left: 4px solid #FFA500;
}

.courseImage {
    height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
}

.courseRating {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: gold;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.courseRating img {
    width: 15px;
    height: 15px;
}

.draftBadge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #FFA500;
    color: #333;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
}

.statusIcon {
    position: absolute;
    top: 40px;
    left: 10px;
    background: #FFA500;
    color: #333;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
}

.courseContent {
    padding: 15px;
    background: #6800A5;
}

.courseTitle {
    font-size: 1.1rem;
    color: #E0E0E0;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.courseCategory {
    font-size: 0.8rem;
    color: #dcdcdc;
    margin-bottom: 10px;
}

.courseMeta {
    display: flex;
    gap: 15px;
    margin: 10px 0;
    font-size: 0.8rem;
    color: #dcdcdc;
}

.tagsContainer {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 10px;
}

.tag {
    background: #1E1E1E;
    color: #B0B0B0;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
}

.courseActions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.actionButton {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 5px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.actionButton.edit {
    background: #333;
    color: #E0E0E0;
}

.actionButton.edit:hover {
    background: #444;
}

.actionButton.publish {
    background: #5A217C;
    color: white;
}

.actionButton.publish:hover {
    background: #6800A5;
}

@media (max-width: 768px) {
    .statsContainer {
        grid-template-columns: 1fr;
    }

    .coursesGrid {
        grid-template-columns: 1fr;
    }

    .courseActions {
        flex-direction: column;
    }
}
</style>