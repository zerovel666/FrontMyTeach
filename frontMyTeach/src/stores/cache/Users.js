import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useUsersStore = defineStore('users', () => {
    const users = ref(null);

    async function getUsers() {
        if (!users.value) {
            // const response = await axios.get(`${API_URL}/admin/getAllUsers`);
            // users.value = response.data

            users.value = [
                {
                    "id": 1,
                    "email": "director@gmail.com",
                    "first_name": "Азизбек",
                    "last_name": "Сексембай",
                    "iin": "060606501096",
                    "organization_id": 1,
                    "group_id": null,
                    "is_active": true,
                    "created_at": "2025-05-13T09:54:57.000000Z",
                    "updated_at": "2025-05-13T09:54:57.000000Z",
                    "organization": {
                        "id": 1,
                        "name": "cic@gmail.kz",
                        "bin": 666666666,
                        "address": "Жарокова 132, Алмата",
                        "phone": "87755896603",
                        "email": "MyTeach@gmail.com",
                        "is_active": true,
                        "created_at": "2025-05-13T09:54:57.000000Z",
                        "updated_at": "2025-05-13T09:54:57.000000Z"
                    },
                    "group": null,
                    "client_infos": {
                        "id": 1,
                        "user_id": 1,
                        "has_courses": null,
                        "complete_course_count": null,
                        "complete_tasks": null,
                        "pastime": null,
                        "image_bg": "/storage/bgProfile/Капли.jpg",
                        "created_at": "2025-05-13T09:54:58.000000Z",
                        "updated_at": "2025-05-13T09:54:58.000000Z"
                    },
                    "user_image": {
                        "id": 1,
                        "user_id": 1,
                        "image_path": "/storage/userAvatars/default_avatars.jpg",
                        "created_at": "2025-05-13T09:54:58.000000Z",
                        "updated_at": "2025-05-13T09:54:58.000000Z"
                    },
                    "certificates": null,
                    "roles": [
                        {
                            "id": 4,
                            "name": "Директор",
                            "slug": "director",
                            "created_at": "2025-05-13T09:52:13.000000Z",
                            "updated_at": "2025-05-13T09:52:13.000000Z",
                            "pivot": {
                                "user_id": 1,
                                "role_id": 4
                            }
                        }
                    ]
                },
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
                    "organization": {
                        "id": 1,
                        "name": "cic@gmail.kz",
                        "bin": 666666666,
                        "address": "Жарокова 132, Алмата",
                        "phone": "87755896603",
                        "email": "MyTeach@gmail.com",
                        "is_active": true,
                        "created_at": "2025-05-13T09:54:57.000000Z",
                        "updated_at": "2025-05-13T09:54:57.000000Z"
                    },
                    "group": {
                        "id": 1,
                        "name": "MyCent",
                        "organization_id": 1,
                        "created_at": "2025-05-13T10:31:41.000000Z",
                        "updated_at": "2025-05-13T10:31:41.000000Z"
                    },
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
                    "user_image": {
                        "id": 2,
                        "user_id": 2,
                        "image_path": "/storage/userAvatars/default_avatars.jpg",
                        "created_at": "2025-05-13T10:37:03.000000Z",
                        "updated_at": "2025-05-13T10:37:03.000000Z"
                    },
                    "certificates": null,
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
                    "organization": {
                        "id": 1,
                        "name": "cic@gmail.kz",
                        "bin": 666666666,
                        "address": "Жарокова 132, Алмата",
                        "phone": "87755896603",
                        "email": "MyTeach@gmail.com",
                        "is_active": true,
                        "created_at": "2025-05-13T09:54:57.000000Z",
                        "updated_at": "2025-05-13T09:54:57.000000Z"
                    },
                    "group": {
                        "id": 1,
                        "name": "MyCent",
                        "organization_id": 1,
                        "created_at": "2025-05-13T10:31:41.000000Z",
                        "updated_at": "2025-05-13T10:31:41.000000Z"
                    },
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
                    "user_image": {
                        "id": 3,
                        "user_id": 3,
                        "image_path": "/storage/userAvatars/default_avatars.jpg",
                        "created_at": "2025-05-13T10:37:51.000000Z",
                        "updated_at": "2025-05-13T10:37:51.000000Z"
                    },
                    "certificates": null,
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
                    "is_active": true,
                    "created_at": "2025-05-13T12:29:08.000000Z",
                    "updated_at": "2025-05-13T12:29:08.000000Z",
                    "organization": {
                        "id": 1,
                        "name": "cic@gmail.kz",
                        "bin": 666666666,
                        "address": "Жарокова 132, Алмата",
                        "phone": "87755896603",
                        "email": "MyTeach@gmail.com",
                        "is_active": true,
                        "created_at": "2025-05-13T09:54:57.000000Z",
                        "updated_at": "2025-05-13T09:54:57.000000Z"
                    },
                    "group": {
                        "id": 1,
                        "name": "MyCent",
                        "organization_id": 1,
                        "created_at": "2025-05-13T10:31:41.000000Z",
                        "updated_at": "2025-05-13T10:31:41.000000Z"
                    },
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
                    "user_image": {
                        "id": 7,
                        "user_id": 7,
                        "image_path": "/storage/userAvatars/default_avatars.jpg",
                        "created_at": "2025-05-13T12:29:08.000000Z",
                        "updated_at": "2025-05-13T12:29:08.000000Z"
                    },
                    "certificates": null,
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
                },
                {
                    "id": 6,
                    "email": "master@gmail.com",
                    "first_name": "Мастер",
                    "last_name": "Мастерович",
                    "iin": "999999999999",
                    "organization_id": 2,
                    "group_id": null,
                    "is_active": true,
                    "created_at": "2025-05-13T11:33:00.000000Z",
                    "updated_at": "2025-05-13T11:33:00.000000Z",
                    "organization": {
                        "id": 2,
                        "name": "MyTeach",
                        "bin": 123456789,
                        "address": "Жарокова 132, Алмата",
                        "phone": "87755896603",
                        "email": "MyTeach@gmail.com",
                        "is_active": true,
                        "created_at": "2025-05-13T11:33:00.000000Z",
                        "updated_at": "2025-05-13T11:33:00.000000Z"
                    },
                    "group": null,
                    "client_infos": {
                        "id": 6,
                        "user_id": 6,
                        "has_courses": null,
                        "complete_course_count": null,
                        "complete_tasks": null,
                        "pastime": "29.533333333333",
                        "image_bg": "/storage/bgProfile/Капли.jpg",
                        "created_at": "2025-05-13T11:33:00.000000Z",
                        "updated_at": "2025-05-14T11:56:26.000000Z"
                    },
                    "user_image": {
                        "id": 6,
                        "user_id": 6,
                        "image_path": "/storage/userAvatars/default_avatars.jpg",
                        "created_at": "2025-05-13T11:33:00.000000Z",
                        "updated_at": "2025-05-13T11:33:00.000000Z"
                    },
                    "certificates": null,
                    "roles": [
                        {
                            "id": 1,
                            "name": "Админ",
                            "slug": "admin",
                            "created_at": "2025-05-13T09:52:13.000000Z",
                            "updated_at": "2025-05-13T09:52:13.000000Z",
                            "pivot": {
                                "user_id": 6,
                                "role_id": 1
                            }
                        }
                    ]
                }
            ]
        }
    }

    async function setUserById(userData, user_id) {
        if (userData && user_id) {
            const index = users.value.findIndex(user => user.id === user_id);
            if (index !== -1) {
                users.value[index] = { ...userData };
            }
        }
    }


    return {
        users,
        getUsers,
        setUserById
    };
});