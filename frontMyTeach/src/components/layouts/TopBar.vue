<template>
    <div class="conteiner">
        <div class="content">
            <div class="l-cont">
                <img src="/src/assets/Icons/logo.svg" alt="" id="logo" @click="goHome">
                <div class="searchContainer" ref="searchContainer">
                    <div class="searchContext">
                        <input class="searchInput" placeholder="Поиск..." v-model="inputValue"
                            @focus="showOption = true">
                        <button class="searchButton">
                            <img src="/src/assets/Icons/Search.svg" alt="search" @click="extraSearch">
                        </button>
                    </div>
                    <ul v-if="showOption" class="dropdown">
                        <li v-for="(option, index) in filteredOptions" :key="index" @click="selectOption(option)">
                            {{ option.name }}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="r-cont">
                <button class="buttonNav" :class="{ isSelected: isMain }" @click="goHome">Главная</button>
                <button class="buttonNav" :class="{ isSelected: isMyCourse }" @click="goMyCourse">Мои курсы</button>
                <button class="buttonNav" :class="{ isSelected: isCatalog }" @click=goCatalog>Каталог</button>
                <button class="buttonNav" :class="{ isSelected: isAboutUs }" @click="goAboutUs">О нас</button>
                <div class="user">
                    <div class="showMenu">
                        <img src="/src/assets/Icons/NavIcon.svg" alt="" id="navIcon" @click="changeShowMenu"
                            :style="{ transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)' }">
                        <ul v-if="showMenu">
                            <li @click="goMyProfile">Мой профиль</li>
                            <li @click="goSetting">Настройки</li>
                            <li @click="logout">Выйти из аккаунта</li>
                        </ul>
                    </div>
                    <img :src="userInfo.user_image.image_path" alt="" id="avatar" @click="goMyProfile">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { API_URL } from '@/config';
import axios from 'axios';
import { ref, computed, onMounted, onUnmounted,inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';

const userInfo = inject('userInfo');
const route = useRoute();
const router = useRouter();
const isSelected = ref('');
const showMenu = ref(false);
const options = ref([]);
const inputValue = ref('');
const showOption = ref(false);
const searchContainer = ref(null);

const isMain = computed(() => route.path === "/");
const isMyCourse = computed(() => route.path === "/mycourse");
const isCatalog = computed(() => route.path === "/catalog");
const isAboutUs = computed(() => route.path === "/aboutUs");

const goHome = async () => {
    router.push('/');
}
const goMyCourse = async () => {
    router.push('/mycourse')
}

const goCatalog = async () => {
    router.push('/catalog')
}

const goAboutUs = async () => {
    router.push('/aboutUs')
}

const goMyProfile = async () => {
    router.push('/myProfile')
}
const goSetting = async () => {
    router.push('/setting')
}
const logout = async () => {
    VueCookies.remove('token');
    router.push('/auth')
}

const changeShowMenu = () => {
    if (showMenu.value == false) {
        showMenu.value = true
    } else {
        showMenu.value = false
    }
}

const filteredOptions = computed(() => {
    if (!inputValue.value) return options.value;
    return options.value.filter(option =>
        option.name.toLowerCase().includes(inputValue.value.toLowerCase())
    );
});

const selectOption = (option) => {
    inputValue.value = option.name;
    isSelected.value = option.id
    showOption.value = false;
};

const extraSearch = async () => {
    //write logic
}

const getOptions = async () => {
    // const response = await axios.get(`${API_URL}/student/course/all`);
    // options.value = response.data.data;

    const response = {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "name": "Курс по Django",
                "image_path": "http://localhost:8082//storage/logoCourse/laravelLogo.png",
                "author_id": "9",
                "category_id": 1,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:30.000000Z",
                "updated_at": "2025-03-27T08:10:30.000000Z",
                "author_name": "Leonardo Di Kaprio",
                "tags": [
                    {
                        "id": 1,
                        "course_id": 1,
                        "tag": "quia",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    },
                    {
                        "id": 2,
                        "course_id": 1,
                        "tag": "rerum",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    },
                    {
                        "id": 3,
                        "course_id": 1,
                        "tag": "ducimus",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 1,
                    "course_id": 1,
                    "rating": "3",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                }
            },
            {
                "id": 2,
                "name": "Курс по Vue.js",
                "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
                "author_id": "9",
                "category_id": 3,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:30.000000Z",
                "updated_at": "2025-03-27T08:10:30.000000Z",
                "author_name": "Leonardo Di Kaprio",
                "tags": [
                    {
                        "id": 4,
                        "course_id": 2,
                        "tag": "iste",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    },
                    {
                        "id": 5,
                        "course_id": 2,
                        "tag": "voluptatem",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    },
                    {
                        "id": 6,
                        "course_id": 2,
                        "tag": "maiores",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 2,
                    "course_id": 2,
                    "rating": "2",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                }
            },
            {
                "id": 3,
                "name": "Курс по HTML&CSS",
                "image_path": "http://localhost:8082//storage/logoCourse/laravelLogo.png",
                "author_id": "9",
                "category_id": 1,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:30.000000Z",
                "updated_at": "2025-03-27T08:10:30.000000Z",
                "author_name": "Leonardo Di Kaprio",
                "tags": [
                    {
                        "id": 7,
                        "course_id": 3,
                        "tag": "quibusdam",
                        "created_at": "2025-03-27T08:10:31.000000Z",
                        "updated_at": "2025-03-27T08:10:31.000000Z"
                    },
                    {
                        "id": 8,
                        "course_id": 3,
                        "tag": "perspiciatis",
                        "created_at": "2025-03-27T08:10:31.000000Z",
                        "updated_at": "2025-03-27T08:10:31.000000Z"
                    },
                    {
                        "id": 9,
                        "course_id": 3,
                        "tag": "provident",
                        "created_at": "2025-03-27T08:10:31.000000Z",
                        "updated_at": "2025-03-27T08:10:31.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 3,
                    "course_id": 3,
                    "rating": "2",
                    "created_at": "2025-03-27T08:10:31.000000Z",
                    "updated_at": "2025-03-27T08:10:31.000000Z"
                }
            },
            {
                "id": 4,
                "name": "Курс по Python",
                "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
                "author_id": "10",
                "category_id": 1,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:36.000000Z",
                "updated_at": "2025-03-27T08:10:36.000000Z",
                "author_name": "Lana Rouz",
                "tags": [
                    {
                        "id": 10,
                        "course_id": 4,
                        "tag": "placeat",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 11,
                        "course_id": 4,
                        "tag": "a",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 12,
                        "course_id": 4,
                        "tag": "quia",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 4,
                    "course_id": 4,
                    "rating": "4",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
            },
            {
                "id": 5,
                "name": "Курс по HTML&CSS",
                "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
                "author_id": "9",
                "category_id": 4,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:36.000000Z",
                "updated_at": "2025-03-27T08:10:36.000000Z",
                "author_name": "Leonardo Di Kaprio",
                "tags": [
                    {
                        "id": 13,
                        "course_id": 5,
                        "tag": "velit",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 14,
                        "course_id": 5,
                        "tag": "quam",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 15,
                        "course_id": 5,
                        "tag": "sed",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 5,
                    "course_id": 5,
                    "rating": "4",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
            },
            {
                "id": 6,
                "name": "Курс по Laravel",
                "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
                "author_id": "10",
                "category_id": 1,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:36.000000Z",
                "updated_at": "2025-03-27T08:10:36.000000Z",
                "author_name": "Lana Rouz",
                "tags": [
                    {
                        "id": 16,
                        "course_id": 6,
                        "tag": "doloribus",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 17,
                        "course_id": 6,
                        "tag": "ipsam",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 18,
                        "course_id": 6,
                        "tag": "dolorem",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 6,
                    "course_id": 6,
                    "rating": "4",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
            },
            {
                "id": 7,
                "name": "Курс по SpringBoot",
                "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
                "author_id": "4",
                "category_id": 5,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:40.000000Z",
                "updated_at": "2025-03-27T08:10:40.000000Z",
                "author_name": "Antonio Banderes",
                "tags": [
                    {
                        "id": 19,
                        "course_id": 7,
                        "tag": "non",
                        "created_at": "2025-03-27T08:10:40.000000Z",
                        "updated_at": "2025-03-27T08:10:40.000000Z"
                    },
                    {
                        "id": 20,
                        "course_id": 7,
                        "tag": "qui",
                        "created_at": "2025-03-27T08:10:40.000000Z",
                        "updated_at": "2025-03-27T08:10:40.000000Z"
                    },
                    {
                        "id": 21,
                        "course_id": 7,
                        "tag": "dolor",
                        "created_at": "2025-03-27T08:10:40.000000Z",
                        "updated_at": "2025-03-27T08:10:40.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 7,
                    "course_id": 7,
                    "rating": "5",
                    "created_at": "2025-03-27T08:10:40.000000Z",
                    "updated_at": "2025-03-27T08:10:40.000000Z"
                }
            },
            {
                "id": 8,
                "name": "Курс по JS",
                "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
                "author_id": "10",
                "category_id": 3,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:40.000000Z",
                "updated_at": "2025-03-27T08:10:40.000000Z",
                "author_name": "Lana Rouz",
                "tags": [
                    {
                        "id": 22,
                        "course_id": 8,
                        "tag": "quam",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    },
                    {
                        "id": 23,
                        "course_id": 8,
                        "tag": "nisi",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    },
                    {
                        "id": 24,
                        "course_id": 8,
                        "tag": "quo",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 8,
                    "course_id": 8,
                    "rating": "3",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                }
            },
            {
                "id": 9,
                "name": "Курс по SpringBoot",
                "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
                "author_id": "9",
                "category_id": 7,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:40.000000Z",
                "updated_at": "2025-03-27T08:10:40.000000Z",
                "author_name": "Leonardo Di Kaprio",
                "tags": [
                    {
                        "id": 25,
                        "course_id": 9,
                        "tag": "facilis",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    },
                    {
                        "id": 26,
                        "course_id": 9,
                        "tag": "maiores",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    },
                    {
                        "id": 27,
                        "course_id": 9,
                        "tag": "architecto",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 9,
                    "course_id": 9,
                    "rating": "3",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                }
            }
        ],
        "first_page_url": "http://localhost:8080/api/student/course/all?page=1",
        "from": 1,
        "last_page": 2,
        "last_page_url": "http://localhost:8080/api/student/course/all?page=2",
        "links": [
            {
                "url": "http://localhost:8080/api/student/course/all?",
                "label": "&laquo; Previous",
                "active": false
            },
            {
                "url": "http://localhost:8080/api/student/course/all?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": "http://localhost:8080/api/student/course/all?page=2",
                "label": "2",
                "active": false
            },
            {
                "url": "http://localhost:8080/api/student/course/all?page=2",
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "next_page_url": "http://localhost:8080/api/student/course/all?page=2",
        "path": "http://localhost:8080/api/student/course/all",
        "per_page": 9,
        "prev_page_url": null,
        "to": 9,
        "total": 15
    }

    options.value = response.data;
};

const handleClickOutside = (event) => {
    if (searchContainer.value && !searchContainer.value.contains(event.target)) {
        showOption.value = false;
    }
    if (showMenu.value && !event.target.closest(".showMenu")) {
        showMenu.value = false;
    }
};

onMounted(() => {
    getOptions();
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});

</script>


<style scoped>
.conteiner {
    height: 80px;
    background-color: #f5f5f5;
    border-radius: 35px;
    margin: 10px;
    background: linear-gradient(90deg, #11001C, #59008E);
    display: flex;
    justify-content: center;
    align-items: center;
}

.content {
    max-width: 80%;
    width: 100%;
    height: 100%;
    display: flex;
    gap: 80px;
}

.l-cont {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 40%;
}

.r-cont {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 60%;
    gap: 20px;
}

.buttonNav {
    cursor: pointer;
    height: 30px;
    border-radius: 15px;
    font-size: 75%;
    padding-left: 30px;
    padding-right: 30px;
    background-color: #5A217C;
    color: white;
    box-shadow: inset 0px 0px 7px rgb(255, 255, 255);
    border: none;
    transition: transform 0.3s;
}

.buttonNav:hover {
    transform: scale(1.2);
}

.isSelected {
    background-color: #6800A5;
    box-shadow: inset 0px 0px 7px rgb(255, 255, 255), 0px 0px 10px rgb(255, 255, 255);
}

.user {
    display: flex;
    gap: 10px;
    position: relative;
}

.showMenu {
    display: flex;
    position: relative;
}

.showMenu img {
    width: 100%;
    transition: transform 0.5s;
}

.showMenu ul {
    left: -80px;
    width: 100%;
    width: 200px;
    max-height: 400px;
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-top: none;
    overflow-y: auto;
    margin-top: 50px;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    color: black;
    z-index: 100;
}

.showMenu ul li {
    padding: 8px;
    color: black;
    cursor: pointer;
}

.showMenu ul li:hover {
    background-color: #ededed;
}

#navIcon {
    cursor: pointer;
}

#avatar {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    border: 2px solid #fff;
    cursor: pointer;
}

#logo {
    width: 100px;
    height: 100px;
    cursor: pointer;
}

.searchContainer {
    width: 70%;
    height: 30px;
    position: relative;
}

.searchContext {
    position: relative;
    display: flex;
    align-items: center;
    height: 30px;
    border-radius: 30px;
    overflow: hidden;
    background-color: #f5f5f5;
    border: 2px solid #ccc;
}

.searchInput {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 10px 50px 10px 20px;
    font-size: 16px;
    background-color: transparent;
    color: #333;
}

.searchButton {
    position: absolute;
    right: 5px;
    border: none;
    background-color: #59008E;
    border-radius: 50%;
    width: 27px;
    height: 27px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s;
}

.searchButton img {
    width: 16px;
    height: 16px;
    filter: invert(1);
}

.searchButton:hover {
    background-color: #7A00B5;
}

.dropdown {
    width: 100%;
    max-height: 200px;
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-top: none;
    overflow-y: auto;
    margin-top: 10px;
    z-index: 100;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
}

.dropdown li {
    padding: 8px;
    color: black;
    cursor: pointer;
}

.dropdown li:hover {
    background: #f0f0f0;
}
</style>