<template>
    <div class="container">
        <div class="content">
            <div class="textContent">
                <p id="p1">START TODAY</p>
                <p id="p2">PROFESSIONAL TRAINING</p>
            </div>
            <div class="categories">
                <div v-for="(category, index) in categories" :key="index" class="category-item">
                    <p>{{ category.category }}</p>
                    <img src="/src/assets/Icons/CategoryGetIcon.svg" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { API_URL } from '@/config';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const categories = ref([]);

const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/course/category/all`);
        // const response = [{"id":1,"category":"Backend","created_at":"2025-01-31T12:28:37.000000Z","updated_at":"2025-01-31T12:29:47.000000Z"},{"id":3,"category":"Power BI","created_at":"2025-02-17T03:32:15.000000Z","updated_at":"2025-02-17T03:32:15.000000Z"},{"id":4,"category":"Designer","created_at":"2025-02-17T03:32:15.000000Z","updated_at":"2025-02-17T03:32:15.000000Z"},{"id":5,"category":"Cyber defender","created_at":"2025-02-17T03:32:15.000000Z","updated_at":"2025-02-17T03:32:15.000000Z"},{"id":6,"category":"Scram","created_at":"2025-02-17T03:32:15.000000Z","updated_at":"2025-02-17T03:32:15.000000Z"},{"id":7,"category":"DevOps","created_at":"2025-02-17T03:32:15.000000Z","updated_at":"2025-02-17T03:32:15.000000Z"},{"id":8,"category":"Frontend","created_at":"2025-02-17T03:32:15.000000Z","updated_at":"2025-02-17T03:32:15.000000Z"}];

        categories.value = response.data;
    } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
    }
};

onMounted(getCategories);
</script>

<style scoped>
.container {
    margin-top: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.textContent{
    margin-bottom: 80px;
}
p {
    margin: 0;
    padding: 0;
    line-height: 1;
}

#p1 {
    font-size: 96px;
}

#p2 {
    font-size: 20px;
}

.content {
    width: 80%;
    height: 100%;
}

.categories {
    display: grid;
    grid-template-columns: repeat(4, 1fr); 
    gap: 70px;
    margin: 20px ; 
}
.category-item {
    padding: 10px;
    border: 1px solid #B14788;
    border-radius: 10px;
    text-align: left;
    display: flex;
    justify-content: space-between;
    transition: transform 0.3s ease, box-shadow 0.3s ease; 

}
.category-item:hover {
    transform: scale(1.1); 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
    cursor: pointer;
}
.category-item p{
    color: #B14788;
}
</style>
