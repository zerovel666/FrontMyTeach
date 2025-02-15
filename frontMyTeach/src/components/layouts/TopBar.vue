<template>
    <div class="conteiner">
        <div class="content">
            <div class="l-cont">
                <img src="/src/assets/Icons/logo.svg" alt="" id="logo">
                <div class="searchContext">
                    <input class="searchInput" placeholder="Поиск...">
                    <button class="searchButton">
                        <img src="/src/assets/Icons/Vector.svg" alt="search">
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps()
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
}

.l-cont {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 40%;
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