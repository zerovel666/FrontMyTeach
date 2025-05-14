<template>
    <div class="header-navigation">
        <p @click="changePage('main')">Главная</p>
        <p @click="changePage('users')">Пользователи</p>
        <p @click="changePage('course')">Курсы</p>
        <p @click="changePage('checking')">На проверку</p>
        <p @click="changePage('organization')">Организации</p>
        <p @click="changePage('banners')">Баннеры</p>
        <p @click="changePage('bgImage')">Изображения профиля</p>
        <p @click="changePage('interface')">Пользовательский интерфейс</p>
    </div>
</template>

<script setup>
const emit = defineEmits(['changePage']);

async function changePage(page) {
    emit('changePage',page)
}
</script>

<style scoped>
h1,h2,h3,h4,h5,h6,p{
    margin: 0;
}
.header-navigation{
    background: linear-gradient(#59008E,#3f0063);
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 50px;
    font-size: 22px;
    height: 100vh;
    max-width: 415px;
    overflow-y: auto;
}

.header-navigation p{
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid #b14788;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    background-color: #4f007d;
}

.header-navigation p:hover{
    box-shadow: 0 0 10px #b14788;
}
</style>