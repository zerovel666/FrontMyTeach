<template>
    <div class="container">
        <div class="content">
            <div class="textContent">
                <p id="p1">START TODAY</p>
                <p id="p2">PROFESSIONAL TRAINING</p>
            </div>
            <div class="categories">
                <div v-for="(category, index) in categories" :key="index" class="category-item"
                    @click="extraSearchCategories(category)">
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
import { useRouter } from 'vue-router';

const categories = ref([]);
const router = useRouter();
const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/course/category/all`);
        categories.value = response.data;
        // const response = [
        //     {
        //         "id": 1,
        //         "category": "Python",
        //         "created_at": "2025-03-27T08:10:30.000000Z",
        //         "updated_at": "2025-03-27T08:10:30.000000Z"
        //     },
        //     {
        //         "id": 2,
        //         "category": "PHP",
        //         "created_at": "2025-03-27T08:10:30.000000Z",
        //         "updated_at": "2025-03-27T08:10:30.000000Z"
        //     },
        //     {
        //         "id": 3,
        //         "category": "C#",
        //         "created_at": "2025-03-27T08:10:30.000000Z",
        //         "updated_at": "2025-03-27T08:10:30.000000Z"
        //     },
        //     {
        //         "id": 4,
        //         "category": "React.js",
        //         "created_at": "2025-03-27T08:10:36.000000Z",
        //         "updated_at": "2025-03-27T08:10:36.000000Z"
        //     },
        //     {
        //         "id": 5,
        //         "category": "C#",
        //         "created_at": "2025-03-27T08:10:36.000000Z",
        //         "updated_at": "2025-03-27T08:10:36.000000Z"
        //     },
        //     {
        //         "id": 6,
        //         "category": "Django",
        //         "created_at": "2025-03-27T08:10:36.000000Z",
        //         "updated_at": "2025-03-27T08:10:36.000000Z"
        //     },
        //     {
        //         "id": 7,
        //         "category": "PHP",
        //         "created_at": "2025-03-27T08:10:40.000000Z",
        //         "updated_at": "2025-03-27T08:10:40.000000Z"
        //     },
        //     {
        //         "id": 8,
        //         "category": "React.js",
        //         "created_at": "2025-03-27T08:10:40.000000Z",
        //         "updated_at": "2025-03-27T08:10:40.000000Z"
        //     },
        //     {
        //         "id": 9,
        //         "category": "HTML&CSS",
        //         "created_at": "2025-03-27T08:10:40.000000Z",
        //         "updated_at": "2025-03-27T08:10:40.000000Z"
        //     },
        //     {
        //         "id": 10,
        //         "category": "Java",
        //         "created_at": "2025-03-27T08:10:45.000000Z",
        //         "updated_at": "2025-03-27T08:10:45.000000Z"
        //     },
        //     {
        //         "id": 11,
        //         "category": "PHP",
        //         "created_at": "2025-03-27T08:10:45.000000Z",
        //         "updated_at": "2025-03-27T08:10:45.000000Z"
        //     },
        //     {
        //         "id": 12,
        //         "category": "C#",
        //         "created_at": "2025-03-27T08:10:45.000000Z",
        //         "updated_at": "2025-03-27T08:10:45.000000Z"
        //     },
        //     {
        //         "id": 13,
        //         "category": "Vue.js",
        //         "created_at": "2025-03-27T08:10:49.000000Z",
        //         "updated_at": "2025-03-27T08:10:49.000000Z"
        //     },
        //     {
        //         "id": 14,
        //         "category": "Java",
        //         "created_at": "2025-03-27T08:10:49.000000Z",
        //         "updated_at": "2025-03-27T08:10:49.000000Z"
        //     },
        //     {
        //         "id": 15,
        //         "category": "HTML&CSS",
        //         "created_at": "2025-03-27T08:10:49.000000Z",
        //         "updated_at": "2025-03-27T08:10:49.000000Z"
        //     }
        // ]
        // categories.value = response;
    } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
    }
};

const extraSearchCategories = (category) => {
    router.push({ name: 'catalog', query: { category: category.category } });
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

.textContent {
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
    margin: 20px;
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

.category-item p {
    color: #B14788;
}
</style>
