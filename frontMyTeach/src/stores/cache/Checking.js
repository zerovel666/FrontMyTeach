import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useCheckingsStore = defineStore('checkings', () => {
    const checkings = ref(null);

    async function getCheckings() {
        if (!checkings.value) {
            // const response = await axios.get(`${API_URL}/admin/getForChecked`)
            // checkings.value = response.data

            checkings.value = [
                {
                    "id": 1,
                    "name": "Быстрый курс по Laravel + Vue3: MVC API Микросервис",
                    "image_path": "http://localhost:8082//storage/logoCourse/oHo9XUt5tlwXp12KzFcXUHySEqOKBfr36ANz0Fzt.png",
                    "is_active": false,
                    "amount": 2000,
                    "category": {
                        "id": 3,
                        "category": "Vite",
                        "created_at": null,
                        "updated_at": null
                    },
                    "has_certificate": true,
                    "author_name": "Азизбек Сексембай",
                    "author_image_path": "http://localhost:8081/storage/userAvatars/default_avatars.jpg",
                    "status": "Проверяется",
                    "preview": {
                        "id": 1,
                        "title": "Превью"
                    },
                    "descriptions": [
                        {
                            "id": 1,
                            "queue": 1,
                            "str_value": "Описание",
                            "preview_id": 1,
                            "created_at": "2025-05-13T11:37:56.000000Z",
                            "updated_at": "2025-05-13T11:37:56.000000Z"
                        }
                    ],
                    "task_count": 5,
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
                    ],
                    "modules": [
                        {
                            "id": 1,
                            "queue": 1,
                            "str_value": "Модуль",
                            "course_id": 1,
                            "created_at": "2025-05-13T11:38:09.000000Z",
                            "updated_at": "2025-05-13T11:38:09.000000Z",
                            "tasks": [
                                {
                                    "id": 2,
                                    "name": "1 из нескольких",
                                    "order_id": 2,
                                    "type": "task",
                                    "module_id": 1,
                                    "course_id": 1,
                                    "created_at": "2025-05-13T11:38:37.000000Z",
                                    "updated_at": "2025-05-13T11:38:37.000000Z"
                                },
                                {
                                    "id": 3,
                                    "name": "множество из нескольких",
                                    "order_id": 3,
                                    "type": "task",
                                    "module_id": 1,
                                    "course_id": 1,
                                    "created_at": "2025-05-13T11:38:53.000000Z",
                                    "updated_at": "2025-05-13T11:38:53.000000Z"
                                },
                                {
                                    "id": 4,
                                    "name": "код",
                                    "order_id": 4,
                                    "type": "task",
                                    "module_id": 1,
                                    "course_id": 1,
                                    "created_at": "2025-05-13T11:39:04.000000Z",
                                    "updated_at": "2025-05-13T11:39:04.000000Z"
                                },
                                {
                                    "id": 5,
                                    "name": "цифра или слово",
                                    "order_id": 5,
                                    "type": "task",
                                    "module_id": 1,
                                    "course_id": 1,
                                    "created_at": "2025-05-13T11:39:15.000000Z",
                                    "updated_at": "2025-05-13T11:39:15.000000Z"
                                },
                                {
                                    "id": 1,
                                    "name": "Лекция",
                                    "order_id": 1,
                                    "type": "lecture",
                                    "module_id": 1,
                                    "course_id": 1,
                                    "created_at": "2025-05-13T11:38:20.000000Z",
                                    "updated_at": "2025-05-13T11:39:50.000000Z"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }


    return {
        checkings,
        getCheckings,
    };
});