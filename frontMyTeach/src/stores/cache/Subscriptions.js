import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useSubscriptionStore = defineStore('subscription', () => {
    const subscription = ref(null);
    const courses = ref(null)

    async function getSubscription() {
        if (!subscription.value) {
            const response = await axios.get(`${API_URL}/subscription/all`);
            subscription.value = response.data
        }
    }

    async function getCourses(params) {
        // const response = await axios.get(`${API_URL}/course/all`)
        // courses.value = response.data

        courses.value = [
            {
                "id": 2,
                "name": "Тест курс",
                "image_path": "http://localhost:8082//storage/logoCourse/oHo9XUt5tlwXp12KzFcXUHySEqOKBfr36ANz0Fzt.png",
                "author_id": "2",
                "category_id": 3,
                "is_active": false,
                "amount": 2000,
                "send_check": false,
                "checked": false,
                "has_certificate": true,
                "certificate_id": null,
                "created_at": "2025-05-13T11:36:35.000000Z",
                "updated_at": "2025-05-13T18:12:58.000000Z",
                "tags": []
            },
            {
                "id": 1,
                "name": "Быстрый курс по Laravel + Vue3: MVC API Микросервис",
                "image_path": "http://localhost:8082//storage/logoCourse/oHo9XUt5tlwXp12KzFcXUHySEqOKBfr36ANz0Fzt.png",
                "author_id": "2",
                "category_id": 3,
                "is_active": true,
                "amount": 2000,
                "send_check": false,
                "checked": true,
                "has_certificate": true,
                "certificate_id": null,
                "created_at": "2025-05-13T11:36:35.000000Z",
                "updated_at": "2025-05-15T11:21:28.000000Z",
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
            }
        ]

    }

    return {
        subscription,
        courses,
        getCourses,
        getSubscription,
    };
});