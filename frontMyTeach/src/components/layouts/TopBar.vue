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
                    <div v-if="showOption" class="dropdown">
                        <div v-for="(option, index) in filteredOptions" :key="index" @click="selectOption(option)" class="option">
                            {{ option.name }}
                        </div>
                    </div>
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
                                    <li @click="goBibleCourse">Библеотека курсов</li>
                                    <li @click="logout">Выйти из аккаунта</li>
                                </div>
                                <div v-else-if="VueCookies.get('role') === 'director'">
                                    <li @click="goMyProfile">Мой профиль</li>
                                    <li @click="goSubscription">Подписки</li>
                                    <li @click="goMyOrganization">Организация</li>
                                    <li @click="logout">Выйти из аккаунта</li>
                                </div>
                                <div v-else-if="VueCookies.get('role') === 'teacher'">
                                    <li @click="goMyProfile">Мой профиль</li>
                                    <li @click="goToCreateCourse">Создать курс</li>
                                    <li @click="goTeaching">Преподавание</li>
                                    <li @click="goBibleCourse">Библеотека курсов</li>
                                    <li @click="logout">Выйти из аккаунта</li>
                                </div>
                                <div v-else-if="VueCookies.get('role') === 'admin'">
                                    <li @click="goAdminPage">Админ панель</li>
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

    <CreatorCouresModal :showModal="showModal" @close="showModal = false" @created="handleCourseCreated" />

</template>

<script setup>
import { API_URL } from '@/config';
import axios from 'axios';
import { ref, computed, onMounted, onUnmounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';
import Notification from '../Notification.vue';
import CreatorCouresModal from './CreatorCouresModal.vue';

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
const showModal = ref(false);

const goToCreateCourse = async () => {
    try {
        showModal.value = true;
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при подготовке создания курса' + error?.response?.data?.error || "Неизвестная ошибка");
        console.error(error);
    }
}

const handleCourseCreated = (newCourse) => {
    notificationRef.value.showNotification('Курс успешно создан!');
    router.push(`/main/course/editor/${newCourse.data.id}`)
}

const goHome = async () => {
    router.push('/');
}

const goAdminPage = async () => {
    router.push('/admin/page')
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
    options.value = [
        {
            "id": 1,
            "name": "Быстрый курс по Laravel + Vue3: MVC API Микросервис"
        }
    ]
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
    height: auto;
    padding: 10px;
    margin: 5px;
    background: linear-gradient(90deg, #11001C, #59008E);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 35px;
}

.content {
    width: 85%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 5px 0;
}

.l-cont,
.r-cont {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.l-cont {
    flex-direction: column;
}

.r-cont {
    flex-wrap: wrap;
}

#logo {
    width: 80px;
    height: 80px;
    cursor: pointer;
    transition: transform 0.3s;
}

#logo:hover {
    transform: scale(1.05);
}

.searchContainer {
    width: 100%;
    max-width: 500px;
    position: relative;
}

.searchContext {
    display: flex;
    align-items: center;
    height: 36px;
    border-radius: 36px;
    overflow: hidden;
    background-color: #f5f5f5;
    border: 2px solid #ccc;
}

.searchInput {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 20px;
    font-size: 14px;
    background-color: transparent;
    color: black;
}

.searchButton {
    width: 32px;
    height: 32px;
    margin-right: 2px;
    border: none;
    background-color: #59008E;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
}

.searchButton:hover {
    background-color: #7A00B5;
    transform: scale(1.05);
}

.searchButton img {
    width: 16px;
    height: 16px;
    filter: invert(1);
}

.dropdown {
    width: 100%;
    max-height: 200px;
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow-y: auto;
    margin-top: 5px;
    z-index: 100;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.option {
    padding: 10px;
    margin: 10px;
    color: #333;
    cursor: pointer;
    transition: background 0.2s;
}

.option:hover {
    background: #dbdbdb;
}

.buttonNav {
    cursor: pointer;
    height: 36px;
    min-width: 60px;
    border-radius: 18px;
    padding: 0 15px;
    font-size: 14px;
    font-weight: 500;
    background-color: #5A217C;
    color: white;
    border: none;
    transition: all 0.3s;
    box-shadow: inset 0 0 7px rgba(255, 255, 255, 0.5);
    white-space: nowrap;
}

.buttonNav:hover {
    transform: scale(1.05);
    box-shadow: inset 0 0 7px rgba(255, 255, 255, 0.8);
}

.isSelected {
    background-color: #6800A5;
    box-shadow: inset 0 0 7px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.5);
}

.notAuth {
    opacity: 0.7;
    color: #ddd;
}

.notAuth:hover {
    transform: none;
    cursor: not-allowed;
}

.user {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    order: 1;
}

#avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #fff;
    cursor: pointer;
    object-fit: cover;
    transition: transform 0.3s;
}

#avatar:hover {
    transform: scale(1.05);
}

#navIcon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    transition: transform 0.3s;
}

.showMenu {
    position: relative;
}

.showMenu ul {
    position: absolute;
    right: 0;
    width: 200px;
    max-height: 400px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    margin-top: 10px;
    padding: 10px 0;
    font-size: 14px;
    z-index: 100;
}

.showMenu ul li {
    padding: 10px 20px;
    color: #333;
    cursor: pointer;
    transition: background 0.2s;
}

.showMenu ul li:hover {
    background-color: #f5f5f5;
}

@media (min-width: 768px) {
    .content {
        flex-direction: row;
        justify-content: space-between;
        padding: 0 20px;
    }

    .l-cont {
        flex-direction: row;
        justify-content: flex-start;
        width: auto;
        gap: 30px;
    }

    .r-cont {
        justify-content: flex-end;
        flex-wrap: nowrap;
        width: auto;
        gap: 15px;
    }

    .user {
        order: 0;
    }

    .searchContainer {
        width: 300px;
    }
}

@media (min-width: 1024px) {
    .content {
        gap: 50px;
    }

    .searchContainer {
        width: 400px;
    }

    .buttonNav {
        padding: 0 20px;
        font-size: 15px;
    }
}

@media (max-width: 480px) {
    #logo {
        width: 70px;
        height: 70px;
    }

    .buttonNav {
        padding: 0 12px;
        font-size: 13px;
        height: 32px;
    }

    #avatar {
        width: 45px;
        height: 45px;
    }

    .showMenu ul {
        width: 180px;
        right: -20px;
    }
}
</style>