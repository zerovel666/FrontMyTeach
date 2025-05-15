import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useOrganizationsStore = defineStore('organizations', () => {
    const organizations = ref(null);

    async function getOrganizations() {
        if (!organizations.value) {
            // const response = await axios.get(`${API_URL}/organization/all`)
            // organizations.value = response.data
            organizations.value = [
                {
                    "id": 1,
                    "name": "cic@gmail.kz",
                    "bin": 666666666,
                    "address": "Жарокова 132, Алмата",
                    "phone": "87755896603",
                    "email": "MyTeach@gmail.com",
                    "is_active": true,
                    "created_at": "2025-05-13T09:54:57.000000Z",
                    "updated_at": "2025-05-13T09:54:57.000000Z",
                    "subscriptions": [
                        {
                            "id": 1,
                            "name": "Базовая подписка",
                            "description": "В базовую подписку входят самые оптимальные курсы и условия",
                            "price": "15000",
                            "currency": "KZT",
                            "interval": "month",
                            "course_ids": "[1]",
                            "max_users": 5,
                            "max_course": 1,
                            "is_active": true,
                            "non-standard": false,
                            "created_at": "2025-05-13T11:09:29.000000Z",
                            "updated_at": "2025-05-13T11:09:29.000000Z",
                            "pivot": {
                                "organization_id": 1,
                                "subscription_id": 1
                            }
                        }
                    ],
                    "groups": [
                        {
                            "id": 1,
                            "name": "MyCent",
                            "organization_id": 1,
                            "created_at": "2025-05-13T10:31:41.000000Z",
                            "updated_at": "2025-05-13T10:31:41.000000Z",
                            "users": [
                                {
                                    "id": 2,
                                    "email": "teacher@gmail.com",
                                    "first_name": "Азизбек",
                                    "last_name": "Сексембай",
                                    "iin": "123456789123",
                                    "organization_id": 1,
                                    "group_id": 1,
                                    "is_active": true,
                                    "created_at": "2025-05-13T10:37:03.000000Z",
                                    "updated_at": "2025-05-13T10:37:03.000000Z",
                                    "client_infos": {
                                        "id": 2,
                                        "user_id": 2,
                                        "has_courses": null,
                                        "complete_course_count": null,
                                        "complete_tasks": null,
                                        "pastime": null,
                                        "image_bg": "/storage/bgProfile/Капли.jpg",
                                        "created_at": "2025-05-13T10:37:03.000000Z",
                                        "updated_at": "2025-05-13T10:37:03.000000Z"
                                    },
                                    "roles": [
                                        {
                                            "id": 3,
                                            "name": "Преподаватель",
                                            "slug": "teacher",
                                            "created_at": "2025-05-13T09:52:13.000000Z",
                                            "updated_at": "2025-05-13T09:52:13.000000Z",
                                            "pivot": {
                                                "user_id": 2,
                                                "role_id": 3
                                            }
                                        }
                                    ]
                                },
                                {
                                    "id": 3,
                                    "email": "student@gmail.com",
                                    "first_name": "Азизбек",
                                    "last_name": "Сексембай",
                                    "iin": "123456789123",
                                    "organization_id": 1,
                                    "group_id": 1,
                                    "is_active": true,
                                    "created_at": "2025-05-13T10:37:51.000000Z",
                                    "updated_at": "2025-05-13T10:37:51.000000Z",
                                    "client_infos": {
                                        "id": 3,
                                        "user_id": 3,
                                        "has_courses": null,
                                        "complete_course_count": null,
                                        "complete_tasks": null,
                                        "pastime": "96.433333333333",
                                        "image_bg": "/storage/bgProfile/Капли.jpg",
                                        "created_at": "2025-05-13T10:37:51.000000Z",
                                        "updated_at": "2025-05-14T10:07:20.000000Z"
                                    },
                                    "roles": [
                                        {
                                            "id": 2,
                                            "name": "Студент",
                                            "slug": "student",
                                            "created_at": "2025-05-13T09:52:13.000000Z",
                                            "updated_at": "2025-05-13T09:52:13.000000Z",
                                            "pivot": {
                                                "user_id": 3,
                                                "role_id": 2
                                            }
                                        }
                                    ]
                                },
                                {
                                    "id": 7,
                                    "email": "student12@gmail.com",
                                    "first_name": "Азизбек",
                                    "last_name": "Сексембай",
                                    "iin": "123456789124",
                                    "organization_id": 1,
                                    "group_id": 1,
                                    "is_active": false,
                                    "created_at": "2025-05-13T12:29:08.000000Z",
                                    "updated_at": "2025-05-14T19:16:47.000000Z",
                                    "client_infos": {
                                        "id": 7,
                                        "user_id": 7,
                                        "has_courses": null,
                                        "complete_course_count": null,
                                        "complete_tasks": null,
                                        "pastime": "0.5",
                                        "image_bg": "/storage/bgProfile/Капли.jpg",
                                        "created_at": "2025-05-13T12:29:08.000000Z",
                                        "updated_at": "2025-05-13T12:29:08.000000Z"
                                    },
                                    "roles": [
                                        {
                                            "id": 2,
                                            "name": "Студент",
                                            "slug": "student",
                                            "created_at": "2025-05-13T09:52:13.000000Z",
                                            "updated_at": "2025-05-13T09:52:13.000000Z",
                                            "pivot": {
                                                "user_id": 7,
                                                "role_id": 2
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "MyTeach",
                    "bin": 123456789,
                    "address": "Жарокова 132, Алмата",
                    "phone": "87755896603",
                    "email": "MyTeach@gmail.com",
                    "is_active": true,
                    "created_at": "2025-05-13T11:33:00.000000Z",
                    "updated_at": "2025-05-13T11:33:00.000000Z",
                    "subscriptions": [],
                    "groups": []
                }
            ]
        }
    }


    return {
        organizations,
        getOrganizations,
    };
});