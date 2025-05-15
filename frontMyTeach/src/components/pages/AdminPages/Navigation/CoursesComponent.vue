<template>
    <div class="courses-admin">
        <h1>Управление курсами</h1>
        
        <div class="controls">
            <div class="search-container">
                <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Поиск по названию, тегам или автору..."
                    class="search-input"
                >
            </div>
            
            <div class="filter-buttons">
                <button 
                    @click="filterActive = null"
                    :class="{ active: filterActive === null }"
                >
                    Все
                </button>
                <button 
                    @click="filterActive = true"
                    :class="{ active: filterActive === true }"
                >
                    Активные
                </button>
                <button 
                    @click="filterActive = false"
                    :class="{ active: filterActive === false }"
                >
                    Неактивные
                </button>
            </div>
        </div>
        
        <div class="content" v-if="store.courses">
            <div class="course-card" v-for="(course, index) in filteredCourses" :key="course.id">
                <div class="course-summary" @click="toggleCourseDetails(index)">
                    <div class="course-image">
                        <img :src="course.image_path" alt="Course Image" class="image">
                        <span class="course-status" :class="course.is_active ? 'active' : 'inactive'">
                            {{ course.is_active ? 'Активен' : 'Неактивен' }}
                        </span>
                    </div>
                    <div class="course-info">
                        <h3>{{ course.name }}</h3>
                        <div class="course-meta">
                            <span class="price">{{ course.amount }} ₸</span>
                            <span class="certificate" v-if="course.has_certificate">Сертификат</span>
                        </div>
                        <div class="tags" v-if="course.tags.length > 0">
                            <span class="tag" v-for="tag in course.tags" :key="tag.id">
                                {{ tag.tag }}
                            </span>
                        </div>
                    </div>
                    <div class="course-toggle">
                        <button class="toggle-details">
                            {{ expandedCourses[index] ? '▲' : '▼' }}
                        </button>
                    </div>
                </div>
                
                <div class="course-details" v-if="expandedCourses[index]">
                    <div class="details-section">
                        <h4>Основная информация</h4>
                        <div class="details-grid">
                            <div>
                                <p><strong>ID:</strong> {{ course.id }}</p>
                                <p><strong>Автор:</strong> ID {{ course.author_id }}</p>
                                <p><strong>Категория:</strong> ID {{ course.category_id }}</p>
                            </div>
                            <div>
                                <p><strong>Дата создания:</strong> {{ formatDate(course.created_at) }}</p>
                                <p><strong>Обновлен:</strong> {{ formatDate(course.updated_at) }}</p>
                                <p><strong>Чек:</strong> {{ course.send_check ? 'Требуется' : 'Не требуется' }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button 
                            class="status-btn"
                            :class="{'deactivate': course.is_active, 'activate': !course.is_active}"
                            @click="changeStatusCourse(course)"
                        >
                            {{ course.is_active ? 'Деактивировать' : 'Активировать' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-else class="loading">
            <div class="spinner"></div>
            <p>Загрузка курсов...</p>
        </div>
    </div>
</template>

<script setup>
import { API_URL } from '@/config';
import { useCoursesStore } from '@/stores/cache/Courses';
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';

const store = useCoursesStore();
const searchQuery = ref('');
const filterActive = ref(null);
const expandedCourses = ref([]);

onMounted(() => {
    store.getCourses().then(() => {
        expandedCourses.value = new Array(store.courses.length).fill(false);
    });
});

const toggleCourseDetails = (index) => {
    expandedCourses.value[index] = !expandedCourses.value[index];
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
};

const changeStatusCourse = async (course) => {
    if (course.is_active){
        course.is_active = false
        course.send_check = false
    } else {
        course.is_active = true
        course.checked = true
    }

    await axios.put(`${API_URL}/course/${course.id}`,{
        is_active : course.is_active,
        send_check : course.send_check
    });
    store.setCourseById(course,course.id);
};

const filteredCourses = computed(() => {
    if (!store.courses) return [];
    
    return store.courses.filter(course => {
        // Фильтр по поиску
        const matchesSearch = 
            course.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            course.tags.some(tag => 
                tag.tag.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        
        // Фильтр по активности
        const matchesFilter = filterActive.value === null || 
                            course.is_active === filterActive.value;
        
        return matchesSearch && matchesFilter;
    });
});

</script>

<style scoped>
.courses-admin {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #fff;
}

h1 {
    color: #fff;
    margin-bottom: 30px;
    font-size: 2rem;
}

.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 30px;
    justify-content: space-between;
    align-items: center;
}

.search-container {
    position: relative;
    flex-grow: 1;
    max-width: 500px;
}

.search-input {
    width: 100%;
    padding: 12px 20px 12px 40px;
    border: 1px solid #444;
    border-radius: 30px;
    font-size: 1rem;
    background-color: #222;
    color: #fff;
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    border-color: #b14788;
    box-shadow: 0 0 10px rgba(177, 71, 136, 0.5);
}

.search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #777;
}

.filter-buttons {
    display: flex;
    gap: 10px;
}

.filter-buttons button {
    padding: 8px 16px;
    border-radius: 20px;
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-buttons button.active {
    background-color: #b14788;
    color: #fff;
}

.filter-buttons button:hover {
    background-color: #444;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.course-card {
    border-radius: 10px;
    overflow: hidden;
    background-color: #222;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.course-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.course-summary {
    display: flex;
    align-items: center;
    padding: 20px;
    cursor: pointer;
    gap: 20px;
}

.course-image {
    position: relative;
    flex-shrink: 0;
    width: 120px;
    height: 80px;
}

.image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

.course-status {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 3px 8px;
    border-radius: 15px;
    font-size: 0.7rem;
    font-weight: bold;
}

.active {
    background-color: #2e7d32;
    color: #fff;
}

.inactive {
    background-color: #c62828;
    color: #fff;
}

.course-info {
    flex-grow: 1;
}

.course-info h3 {
    margin: 0;
    color: #fff;
    font-size: 1.2rem;
}

.course-meta {
    display: flex;
    gap: 15px;
    margin: 8px 0;
}

.price {
    color: #b14788;
    font-weight: bold;
}

.certificate {
    background-color: #6a1b9a;
    color: #fff;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
}

.tag {
    background-color: #333;
    color: #ddd;
    padding: 3px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
}

.course-toggle {
    display: flex;
    align-items: center;
}

.toggle-details {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #777;
    transition: all 0.3s ease;
}

.toggle-details:hover {
    color: #b14788;
}

.course-details {
    padding: 20px;
    background-color: #333;
    border-top: 1px solid #444;
}

.details-section {
    margin-bottom: 20px;
}

.details-section h4 {
    margin: 0 0 15px;
    color: #b14788;
    font-size: 1.1rem;
}

.details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    color: #ddd;
}

.details-grid p {
    margin: 5px 0;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #444;
}

.status-btn{
    padding: 8px 20px;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.status-btn {
    background-color: transparent;
    border: 1px solid #ddd;
}

.deactivate {
    color: #ff5252;
    border-color: #ff5252;
}

.activate {
    color: #4caf50;
    border-color: #4caf50;
}

.deactivate:hover {
    background-color: rgba(255, 82, 82, 0.1);
}

.activate:hover {
    background-color: rgba(76, 175, 80, 0.1);
}


.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;
    color: #777;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-top-color: #b14788;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .controls {
        flex-direction: column;
    }
    
    .search-container {
        width: 100%;
        max-width: 100%;
    }
    
    .course-summary {
        flex-wrap: wrap;
    }
    
    .details-grid {
        grid-template-columns: 1fr;
    }
    
    .action-buttons {
        flex-direction: column;
    }
}
</style>