<template>
    <Notification ref="notificationRef" />
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
                <button class="buttonNav" :class="{ isSelected: isMyCourse, notAuth: !$cookies.get('token') }"
                    @click="goMyCourse">Мои курсы</button>
                <button class="buttonNav" :class="{ isSelected: isCatalog }" @click=goCatalog>Каталог</button>
                <button class="buttonNav" :class="{ isSelected: isAboutUs }" @click="goAboutUs">О нас</button>
                <div class="user">
                    <div class="showMenu">
                        <img src="/src/assets/Icons/NavIcon.svg" alt="" id="navIcon" @click="changeShowMenu"
                            :style="{ transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)' }">
                        <ul v-if="showMenu">
                            <div v-if="VueCookies.get('token')">
                                <div v-if="VueCookies.get('role') === 'student'">
                                    <li @click="goMyProfile">Мой профиль</li>
                                    <li @click="goSetting">Настройки</li>
                                    <li @click="goBibleCourse">Библеотека курсов</li>
                                    <li @click="logout">Выйти из аккаунта</li>
                                </div>
                                <div v-else-if="VueCookies.get('role') === 'director'">
                                    <li @click="goMyProfile">Мой профиль</li>
                                    <li @click="goSubscription">Подписки</li>
                                    <li @click="goMyOrganization">Организация</li>
                                    <li @click="goSetting">Настройки</li>
                                    <li @click="logout">Выйти из аккаунта</li>
                                </div>
                                <div v-else-if="VueCookies.get('role') === 'teacher'">
                                    <li @click="goMyProfile">Мой профиль</li>
                                    <li @click="goSetting">Настройки</li>
                                    <li @click="goTeaching">Преподавание</li>
                                    <li @click="goBibleCourse">Библеотека курсов</li>
                                    <li @click="logout">Выйти из аккаунта</li>
                                </div>
                            </div>
                            <div v-else>
                                <li @click="goAuth">Войти в аккаунт</li>
                            </div>
                        </ul>
                    </div>
                    <img :src="userInfo?.user_image?.image_path ? userInfo.user_image.image_path : '/src/assets/images/auth/noAuthAvatars.jpg'"
                        alt="" id="avatar" @click="goMyProfile" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { API_URL } from '@/config';
import axios from 'axios';
import { ref, computed, onMounted, onUnmounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';
import Notification from '../Notification.vue';

const userInfo = inject('userInfo');
const route = useRoute();
const router = useRouter();
const isSelected = ref('');
const showMenu = ref(false);
const options = ref([]);
const inputValue = ref('');
const showOption = ref(false);
const searchContainer = ref(null);
const notificationRef = ref(null);
const isMain = computed(() => route.path === "/");
const isMyCourse = computed(() => route.path === "/mycourse");
const isCatalog = computed(() => route.path === "/catalog");
const isAboutUs = computed(() => route.path === "/aboutUs");

const goHome = async () => {
    router.push('/');
}
const goMyCourse = async () => {
    if (VueCookies.get('token')) {
        router.push('/mycourse')
        return
    }
    notificationRef.value.showNotification('Для доступа к этой странице необходимо войти в аккаунт')
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

const goTeaching = async () => {
    router.push('/teaching')
}

const logout = async () => {
    VueCookies.remove('token');
    router.push('/auth')
}

const goAuth = async () => {
    router.push('/auth')
}

const goMyOrganization = async () => {
    router.push('/organization')
}

const goSubscription = async () => {
    router.push('/subscription')
}

const goBibleCourse = async () => {
    if (userInfo?.value?.organization_id) {
        router.push(`/bible/${userInfo.value.organization_id}`)
    }
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
    router.push({ name: "catalog", query: { course_id: isSelected.value } })
}

const getOptions = async () => {
    // const response = await axios.get(`${API_URL}/student/course/list`);
    // options.value = response.data.data;

    const response = [
        {
            "id": 1,
            "name": "Курс по PHP"
        },
        {
            "id": 2,
            "name": "Курс по Java"
        },
        {
            "id": 3,
            "name": "Курс по C++"
        },
        {
            "id": 5,
            "name": "Курс по PHP"
        },
        {
            "id": 6,
            "name": "Курс по .NET"
        },
        {
            "id": 7,
            "name": "Курс по Vue.js"
        },
        {
            "id": 8,
            "name": "Курс по Vue.js"
        },
        {
            "id": 9,
            "name": "Курс по HTML&CSS"
        },
        {
            "id": 10,
            "name": "Курс по Python"
        },
        {
            "id": 11,
            "name": "Курс по C#"
        },
        {
            "id": 12,
            "name": "Курс по JS"
        },
        {
            "id": 13,
            "name": "Курс по Java"
        },
        {
            "id": 14,
            "name": "Курс по HTML&CSS"
        },
        {
            "id": 15,
            "name": "Курс по SpringBoot"
        },
        {
            "id": 16,
            "name": "Курс по Python"
        },
        {
            "id": 17,
            "name": "Курс по Java"
        },
        {
            "id": 18,
            "name": "Курс по PHP"
        },
        {
            "id": 19,
            "name": "Курс по C#"
        },
        {
            "id": 20,
            "name": "Курс по Vue.js"
        },
        {
            "id": 4,
            "name": "Курс по JS"
        }
    ]

    options.value = response;
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

.notAuth {
    background-color: #5A217C;
    box-shadow: inset 0px 0px 7px rgb(255, 255, 255);
    color: #ccc;
    opacity: 0.5;
}

.notAuth:hover {
    transform: scale(1);
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