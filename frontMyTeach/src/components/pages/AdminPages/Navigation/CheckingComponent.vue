<template>
    <div class="checking-course-page">
        <h1>Курсы на проверке</h1>
        
        <div class="course-list" v-if="store.checkings && store.checkings.length > 0">
            <div class="course-card" v-for="course in store.checkings" :key="course.id">
                <div class="course-header">
                    <img :src="course.image_path" alt="Course Image" class="course-image">
                    <div class="course-meta">
                        <h2>{{ course.name }}</h2>
                        <div class="author-info">
                            <img :src="course.author_image_path" alt="Author" class="author-avatar">
                            <span>{{ course.author_name }}</span>
                        </div>
                        <div class="price">Цена: {{ course.amount }} ₸</div>
                        <div class="status-badge">
                            {{ course.status }}
                        </div>
                    </div>
                </div>
                
                <div class="course-details">
                    <div class="details-section">
                        <h3>Описание курса</h3>
                        <p v-for="(desc, idx) in course.descriptions" :key="idx">{{ desc.str_value }}</p>
                    </div>
                    
                    <div class="details-section">
                        <h3>Категория</h3>
                        <p>{{ course.category.category }}</p>
                    </div>
                    
                    <div class="details-section">
                        <h3>Теги</h3>
                        <div class="tags">
                            <span class="tag" v-for="tag in course.tags" :key="tag.id">{{ tag.tag }}</span>
                        </div>
                    </div>
                    
                </div>
                
                <div class="course-actions">
                    <button class="btn review-btn" @click="navigateToReview(course.id)">
                        Перейти к проверке
                    </button>
                    
                    <div class="action-buttons">
                        <div class="reject-section" v-if="showRejectForm === course.id">
                            <textarea 
                                v-model="rejectionReason" 
                                placeholder="Укажите причину отказа..."
                                class="reject-reason"
                            ></textarea>
                            <button 
                                class="btn reject-confirm" 
                                @click="rejectCourse(course.id)"
                                :disabled="!rejectionReason"
                            >
                                Подтвердить отказ
                            </button>
                            <button 
                                class="btn cancel-reject" 
                                @click="showRejectForm = null"
                            >
                                Отмена
                            </button>
                        </div>
                        
                        <button 
                            class="btn reject-btn" 
                            @click="initiateReject(course.id)"
                            v-if="showRejectForm !== course.id"
                        >
                            Отклонить
                        </button>
                        
                        <button 
                            class="btn approve-btn" 
                            @click="approveCourse(course.id)"
                            :disabled="showRejectForm === course.id"
                        >
                            Одобрить
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-else-if="store.checkings && store.checkings.length === 0" class="no-courses">
            Нет курсов, ожидающих проверки
        </div>
        
        <div v-else class="loading">
            Загрузка данных...
        </div>
    </div>

    <Notification ref="notificationRef" />
</template>

<script setup>
import Notification from '@/components/Notification.vue';
import { API_URL } from '@/config';
import { useCheckingsStore } from '@/stores/cache/Checking';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const store = useCheckingsStore();
const router = useRouter();
const showRejectForm = ref(null);
const rejectionReason = ref('');
const notificationRef = ref(null);

onMounted(() => {
    store.getCheckings();
});

const navigateToReview = async (courseId) => {
    try{
        await axios.get(`${API_URL}/admin/getCourse/${courseId}`);
        router.push(`/course/info/${courseId}`);
    }catch(error){
        notificationRef.value.showNotification("Ошибка: " + error?.response?.data?.error ?? error)
    }
};

const initiateReject = (courseId) => {
    showRejectForm.value = courseId;
    rejectionReason.value = '';
};

const rejectCourse = async (courseId) => {
    if (!rejectionReason.value.trim()) return;
    
    try {
        const course = store.checkings.find(c => c.id === courseId);
        if (course) {
            course.status = 'Отклонен';
            await axios.put(`${API_URL}/admin/changeChecked/${courseId}`,{
                checked : true,
                is_active: false,
                send_check: false,
                message: rejectionReason.value,
                status : "cancel"
            });
            notificationRef.value.showNotification("Курс не прошел проверку!")
        }
        
        showRejectForm.value = null;
        rejectionReason.value = '';
    } catch (error) {
        notificationRef.value.showNotification("Ошибка: " + error?.response?.data?.error ?? error)
    }
};

const approveCourse = async (courseId) => {
    try {
        const course = store.checkings.find(c => c.id === courseId);
        if (course) {
            await axios.put(`${API_URL}/admin/changeChecked/${courseId}`,{
                checked : true,
                is_active: true,
                send_check: false,
                status : "checked"
            });
            notificationRef.value.showNotification("Курс одобрен")
            course.status = 'Одобрен';
        }
    } catch (error) {
        notificationRef.value.showNotification("Ошибка: " + error?.response?.data?.error ?? error)
    }
};
</script>

<style scoped>
.course-list {
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin-top: 40px;
}

.course-card {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #b14788;
    box-shadow: 0 0 10px #b14788;
}

.course-header {
    display: flex;
    padding: 20px;
    border-bottom: 1px solid #eee;
}

.course-image {
    width: 200px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 20px;
}

.course-meta {
    flex: 1;
}

.course-meta h2 {
    margin: 0 0 10px;
}

.author-info {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.author-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
}

.price {
    font-weight: bold;
    margin-bottom: 10px;
}

.status-badge {
    display: inline-block;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
}

.course-details {
    padding: 20px;
}

.details-section {
    margin-bottom: 20px;
}

.details-section h3 {
    margin: 0 0 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag {
    background-color: #4e4e4e;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
}

.course-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-top: 1px solid #eee;
}

.btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.review-btn {
    background-color: #6a1b9a;
    color: white;
}

.review-btn:hover {
    background-color: #7e18be;
}

.action-buttons {
    display: flex;
    gap: 10px;
    align-items: center;
}

.reject-btn {
    background-color: #6a1b9a;
    color: white;
}

.reject-btn:hover {
    background-color: #7e18be;
}

.approve-btn {
    background-color: #6a1b9a;
    color: white;
}

.approve-btn:hover {
    background-color: #7e18be;
}

.reject-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 300px;
}

.reject-reason {
    padding: 10px;
    border-radius: 4px;
    min-height: 80px;
    resize: vertical;
    outline: none;
    background-color: #6a1b9a;
}

.reject-reason::placeholder{
    color: #a1a1a1;
}

.reject-confirm {
    background-color: #6a1b9a;
    color: white;
}

.reject-confirm:hover {
    background-color: #7e18be;
}

.reject-confirm:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
}

.cancel-reject {
    background-color: #95a5a6;
    color: white;
}

.cancel-reject:hover {
    background-color: #7f8c8d;
}

.no-courses, .loading {
    text-align: center;
    padding: 40px;
    font-size: 1.2rem;
    color: #7f8c8d;
}

@media (max-width: 768px) {
    .course-header {
        flex-direction: column;
    }
    
    .course-image {
        width: 100%;
        height: auto;
        margin-right: 0;
        margin-bottom: 15px;
    }
    
    .course-actions {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
    }
    
    .reject-section {
        width: 100%;
    }
    
    .action-buttons {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>