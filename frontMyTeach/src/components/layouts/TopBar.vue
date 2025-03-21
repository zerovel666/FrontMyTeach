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
                            <img src="/src/assets/Icons/Search.svg" alt="search">
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
                <button class="buttonNav" :class="{ isSelected: isMain }">Главная</button>
                <button class="buttonNav" :class="{ isMyCourse: isSelected }">Мои курсы</button>
                <button class="buttonNav" :class="{ isCatalog: isSelected }">Каталог</button>
                <button class="buttonNav" :class="{ isAboutUs: isSelected }">О нас</button>
                <div class="user">
                    <img src="/src/assets/Icons/NavIcon.svg" alt="" id="navIcon">
                    <img src="/src/assets/images/auth/avatars.png" alt="" id="avatar">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { API_URL } from '@/config';
import axios from 'axios';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isSelected = ref('');

const isMain = computed(() => route.path === "/");
const isMyCourse = computed(() => route.path === "/");
const isCatalog = computed(() => route.path === "/");
const isAboutUs = computed(() => route.path === "/");

const goHome = async () => {
    router.push('/');
}

const options = ref([]);
const inputValue = ref('');
const showOption = ref(false);
const searchContainer = ref(null);

const filteredOptions = computed(() => {
    if (!inputValue.value) return options.value;
    return options.value.filter(option =>
        option.name.toLowerCase().includes(inputValue.value.toLowerCase())
    );
});

const selectOption = (option) => {
    inputValue.value = option.name;
    showOption.value = false;
};

const getOptions = async () => {
    // const response = await axios.get(`${API_URL}/student/course/all`);
    const response = [
        {
            "id": 2,
            "name": "Курс по Java",
            "image_path": "storage/logoCourse/vueLogo.png",
            "author_id": "4",
            "category_id": 3,
            "isActive": true,
            "amount": null,
            "sendCheck": false,
            "checked": true,
            "created_at": "2025-03-18T14:15:27.000000Z",
            "updated_at": "2025-03-18T14:15:27.000000Z",
            "tags": [
                {
                    "id": 4,
                    "course_id": 2,
                    "tag": "SDK",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 5,
                    "course_id": 2,
                    "tag": "MAVEN",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 6,
                    "course_id": 2,
                    "tag": "JVM",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                }
            ]
        },
        {
            "id": 3,
            "name": "Курс по C#",
            "image_path": "storage/logoCourse/laravelLogo.png",
            "author_id": "9",
            "category_id": 3,
            "isActive": true,
            "amount": null,
            "sendCheck": false,
            "checked": true,
            "created_at": "2025-03-18T14:15:27.000000Z",
            "updated_at": "2025-03-18T14:15:27.000000Z",
            "tags": [
                {
                    "id": 7,
                    "course_id": 3,
                    "tag": "OOP",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 8,
                    "course_id": 3,
                    "tag": "DOT.NET",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 9,
                    "course_id": 3,
                    "tag": "WebServlet",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                }
            ]
        },
        {
            "id": 1,
            "name": "Курс по Laravel:Laravel: Искусство Бэкенда",
            "image_path": "storage/logoCourse/javaLogo.webp",
            "author_id": "10",
            "category_id": 3,
            "isActive": true,
            "amount": null,
            "sendCheck": false,
            "checked": true,
            "created_at": "2025-03-18T14:15:27.000000Z",
            "updated_at": "2025-03-18T14:15:27.000000Z",
            "tags": [
                {
                    "id": 1,
                    "course_id": 1,
                    "tag": "Middleware",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 3,
                    "course_id": 1,
                    "tag": "Eloquent",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 2,
                    "course_id": 1,
                    "tag": "Migration",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                }
            ]
        }
    ];
    options.value = response;
};

const handleClickOutside = (event) => {
    if (searchContainer.value && !searchContainer.value.contains(event.target)) {
        showOption.value = false;
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
    height: 30px;
    border-radius: 15px;
    font-size: 75%;
    letter-spacing: 3pxs;
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
}

#navIcon {
    cursor: pointer;
}

#avatar {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    border: 2px solid #fff;
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
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-top: none;
    overflow-y: auto;
    margin-top: 10px;
    z-index: 100;
    padding: 10px;
    font-size: 16px;
    border-radius: 10px;
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