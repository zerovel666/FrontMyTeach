import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useCoursesStore = defineStore('courses', () => {
    const courses = ref(null);

    async function getCourses() {
        console.log(courses.value)
        if (!courses.value) {
            // const response = await axios.get(`${API_URL}/course/all`);
            // courses.value = response.data

            courses.value = [
                {
                    "id": 1,
                    "name": "Быстрый курс по Laravel + Vue3: MVC API Микросервис",
                    "image_path": "/storage/logoCourse/oHo9XUt5tlwXp12KzFcXUHySEqOKBfr36ANz0Fzt.png",
                    "author_id": "2",
                    "category_id": 3,
                    "is_active": true,
                    "amount": 2000,
                    "send_check": false,
                    "checked": true,
                    "has_certificate": true,
                    "certificate_id": null,
                    "created_at": "2025-05-13T11:36:35.000000Z",
                    "updated_at": "2025-05-13T18:12:58.000000Z",
                    "tags": [
                        {
                            "id": 1,
                            "course_id": 1,
                            "tag": "Laravel",
                            "created_at": "2025-05-13T11:37:22.000000Z",
                            "updated_at": "2025-05-13T11:37:22.000000Z"
                        },
                        {
                            "id": 2,
                            "course_id": 1,
                            "tag": "Vite",
                            "created_at": "2025-05-13T11:37:22.000000Z",
                            "updated_at": "2025-05-13T11:37:22.000000Z"
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "Тест курс",
                    "image_path": "/storage/logoCourse/oHo9XUt5tlwXp12KzFcXUHySEqOKBfr36ANz0Fzt.png",
                    "author_id": "2",
                    "category_id": 3,
                    "is_active": false,
                    "amount": 2000,
                    "send_check": true,
                    "checked": false,
                    "has_certificate": true,
                    "certificate_id": null,
                    "created_at": "2025-05-13T11:36:35.000000Z",
                    "updated_at": "2025-05-13T18:12:58.000000Z",
                    "tags": []
                }
            ]


        }
    }

    async function setCourseById(courseData, course_id) {
        if (courseData && course_id) {
            const index = courses.value.findIndex(course => course.id === course_id);
            if (index !== -1) {
                courses.value[index] = { ...courseData };
            }
        }
    }


    return {
        courses,
        getCourses,
        setCourseById
    };
});