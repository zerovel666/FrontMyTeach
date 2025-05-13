<template>
    <TopBar />
    <div class="containerBody">
        <div class="subscription-header">
            <h1>{{ subscription.name }}</h1>
            <div class="price-tag">
                {{ subscription.price }} {{ subscription.currency }} / {{ subscription.interval }}
            </div>
        </div>
        
        <div class="subscription-content">
            <div class="features-section">
                <h2>Особенности подписки</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">👥</div>
                        <div class="feature-text">
                            <strong>Макс. пользователей:</strong> {{ subscription.max_users }}
                        </div>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📚</div>
                        <div class="feature-text">
                            <strong>Макс. курсов:</strong> {{ subscription.max_course }}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="courses-section">
                <h2>Доступные курсы</h2>
                <div class="courses-list">
                    <div 
                        v-for="course in subscription.courses" 
                        :key="course.id" 
                        class="course-card"
                    >
                        <div class="course-name">{{ course.name }}</div>
                        <div v-if="course.has_certificate" class="certificate-badge">
                            🏅 Сертификат
                        </div>
                    </div>
                </div>
            </div>
            
            <button class="subscribe-button" @click="openPay">
                Оформить подписку
            </button>
        </div>
    </div>
    <FooterBar />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import axios from 'axios';
import { API_URL } from '@/config';
import { useRoute } from 'vue-router';

const route = useRoute();
const subscription = ref([]);

const openPay = async () => {
    const response = await axios.get(`${API_URL}/subscription/getUrlForPay/${route.params.subscription_id}`);
    window.open(`http://localhost:5173/subscription/pending/${response.data.uuid}`);
};

const getSubscriptionById = async (id) => {
    const response = await axios.get(`${API_URL}/subscription/getById/${id}`)
    subscription.value = response.data
}

onMounted(() => {
    getSubscriptionById(route.params.subscription_id)
})
</script>

<style scoped>
.containerBody {
    margin-top: 50px;
    padding: 20px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    color: #11001C;
}

.subscription-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 20px;
    background: linear-gradient(135deg, #B14788, #8100CC);
    color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(129, 0, 204, 0.2);
}

.subscription-header h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
}

.price-tag {
    font-size: 1.8rem;
    margin-top: 10px;
    background-color: rgba(255, 255, 255, 0.2);
    display: inline-block;
    padding: 8px 20px;
    border-radius: 30px;
    font-weight: 600;
}

.subscription-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.features-section h2, .courses-section h2 {
    color: #59008E;
    font-size: 1.8rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #B14788;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.feature-card {
    color: white;
    background: #59008E;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 15px;
    transition: transform 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 2rem;
}

.feature-text {
    font-size: 1.1rem;
}

.courses-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
}

.course-card {
    background: #59008E;
    color: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    transition: all 0.3s;
}

.course-card:hover {
    background-color: #8100CC;
    box-shadow: 0 6px 15px rgba(129, 0, 204, 0.15);
}

.course-name {
    font-weight: 500;
}

.certificate-badge {
    background-color: #59008E;
    color: white;
    padding: 10px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
}

.subscribe-button {
    background: linear-gradient(135deg, #B14788, #8100CC);
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    margin: 30px auto;
    display: block;
    width: fit-content;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(129, 0, 204, 0.3);
}

.subscribe-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(129, 0, 204, 0.4);
}

@media (max-width: 768px) {
    .subscription-header h1 {
        font-size: 2rem;
    }
    
    .price-tag {
        font-size: 1.4rem;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
}
</style>