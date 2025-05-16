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
    padding: 0 20px;
}

.textContent {
    margin-bottom: 80px;
    text-align: center;
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
    width: 100%;
    max-width: 1200px;
    height: 100%;
}

.categories {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.category-item {
    padding: 15px;
    border: 1px solid #B14788;
    border-radius: 10px;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-item:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.category-item p {
    color: #B14788;
    font-size: 16px;
}

.category-item img {
    width: 20px;
    height: 20px;
}

/* Медиа-запросы для адаптивности */
@media (max-width: 1200px) {
    #p1 {
        font-size: 72px;
    }
}

@media (max-width: 992px) {
    #p1 {
        font-size: 60px;
    }
    
    .categories {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }
}

@media (max-width: 768px) {
    .container {
        margin-top: 60px;
    }
    
    #p1 {
        font-size: 48px;
    }
    
    #p2 {
        font-size: 18px;
    }
    
    .textContent {
        margin-bottom: 50px;
    }
    
    .categories {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 15px;
    }
}

@media (max-width: 576px) {
    #p1 {
        font-size: 36px;
    }
    
    #p2 {
        font-size: 16px;
    }
    
    .textContent {
        margin-bottom: 30px;
    }
    
    .categories {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
    }
    
    .category-item {
        padding: 10px;
    }
    
    .category-item p {
        font-size: 14px;
    }
    
    .category-item img {
        width: 16px;
        height: 16px;
    }
}
</style>