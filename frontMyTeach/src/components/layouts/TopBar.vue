<template>
    <div class="conteiner">
        <div class="content">
            <div class="l-cont">
                <img src="/src/assets/Icons/logo.svg" alt="" id="logo">
                <div class="searchContext">
                    <input class="searchInput" placeholder="Поиск...">
                    <button class="searchButton">
                        <img src="/src/assets/Icons/Search.svg" alt="search">
                    </button>
                </div>
            </div>

            <div class="r-cont">
                <button class="buttonNav" :class="{isSelected : isMain}">Главная</button>
                <button class="buttonNav" :class="{isMyCourse : isSelected}">Мои курсы</button>
                <button class="buttonNav" :class="{isCatalog : isSelected}">Каталог</button>
                <button class="buttonNav" :class="{isAboutUs : isSelected}">О нас</button>
                <div class="user">
                    <img src="/src/assets/Icons/NavIcon.svg" alt="" id="navIcon">
                    <img src="/src/assets/images/auth/avatars.png" alt="" id="avatar">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps()

const isMain = computed(() => route.path === "/")
const isMyCourse = computed(() => route.path === "/")
const isCatalog = computed(() => route.path === "/")
const isAboutUs = computed(() => route.path === "/")


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
.r-cont{
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 60%;
    gap: 20px;
}
.buttonNav{
    height: 30px;
    border-radius: 15px;
    font-size: 75%;
    letter-spacing: 3pxs;
    padding-left: 30px;
    padding-right: 30px;
    background-color: #5A217C;
    color: white;
    box-shadow: inset 0px 0px 7px rgb(255, 255, 255);
}

.isSelected{
    background-color: #6800A5;
    box-shadow: inset 0px 0px 7px rgb(255, 255, 255), 0px 0px 10px rgb(255, 255, 255);
}
.user{
    display: flex;
    gap: 10px;
}
#navIcon{
    cursor: pointer;
}
#avatar{
    width: 50px;
    height: 50px;
    border-radius: 100%;
    border: 2px solid #fff;
}
#logo {
    width: 100px;
    height: 100px;
}

.searchContext {
    position: relative;
    display: flex;
    align-items: center;
    width: 70%;
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
</style>