<template>
    <TopBar />
    <div class="containerBody">
        <div class="header-section">
            <h1>Доступные подписки</h1>
            <p class="subtitle">Выберите подходящий вариант для вашего обучения</p>
        </div>
        
        <div class="cards" v-if="subscriptions">
            <div 
                class="card" 
                v-for="(subscription, index) in subscriptions" 
                :key="index"
            >
                <div class="card-header">
                    <h2>{{ subscription.name }}</h2>
                    <div class="price">
                        {{ subscription.price }} {{ subscription.currency }}
                        <span>/ {{ subscription.interval === 'year' ? 'год' : 'месяц' }}</span>
                    </div>
                </div>
                
                <div class="card-body">
                    <p class="description">{{ subscription.description }}</p>
                    
                    <div class="features">
                        <div class="feature">
                            <span class="icon">📚</span>
                            <span>Доступно курсов: <strong>{{ subscription?.courses?.length }}</strong></span>
                        </div>
                        <div class="feature">
                            <span class="icon">🔢</span>
                            <span>Макс. курсов: <strong>{{ subscription.max_course }}</strong></span>
                        </div>
                        <div class="feature">
                            <span class="icon">👥</span>
                            <span>Макс. пользователей: <strong>{{ subscription.max_users }}</strong></span>
                        </div>
                    </div>
                </div>
                
                <button 
                    @click="goSubscriptionById(subscription.id)" 
                >
                    Подробнее
                </button>
            </div>
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
import { useRouter } from 'vue-router';

const router = useRouter();
const subscriptions = ref([]);

const getSubscriptions = async () => {
    // const response = await axios.get(`${API_URL}/subscription/all`);
    // subscriptions.value = response.data;

    subscriptions.value = [
        {
            "id": 1,
            "name": "Базовый",
            "price": "5206",
            "description": "Идеальный вариант для начала обучения с доступом к основным курсам.",
            "currency": "KZT",
            "interval": "year",
            "courses": [
                {"id": 1, "name": "Курс по PHP", "has_certificate": false},
                {"id": 2, "name": "Курс по Java", "has_certificate": false},
                {"id": 3, "name": "Курс по C++", "has_certificate": false},
                {"id": 5, "name": "Курс по PHP", "has_certificate": false},
                {"id": 4, "name": "Курс по JS", "has_certificate": true}
            ],
            "max_users": 92,
            "max_course": 7
        },
        {
            "id": 2,
            "name": "Премиум",
            "price": "5295",
            "description": "Полный доступ ко всем курсам с возможностью получения сертификатов.",
            "currency": "KZT",
            "interval": "month",
            "courses": [
                {"id": 1, "name": "Курс по PHP", "has_certificate": false},
                {"id": 2, "name": "Курс по Java", "has_certificate": false},
                {"id": 3, "name": "Курс по C++", "has_certificate": false},
                {"id": 5, "name": "Курс по PHP", "has_certificate": false},
                {"id": 4, "name": "Курс по JS", "has_certificate": true}
            ],
            "max_users": 28,
            "max_course": 2
        },
        {
            "id": 3,
            "name": "Профессиональный",
            "price": "9075",
            "description": "Для командного обучения с расширенными возможностями и поддержкой.",
            "currency": "KZT",
            "interval": "month",
            "courses": [
                {"id": 1, "name": "Курс по PHP", "has_certificate": false},
                {"id": 2, "name": "Курс по Java", "has_certificate": false},
                {"id": 3, "name": "Курс по C++", "has_certificate": false},
                {"id": 5, "name": "Курс по PHP", "has_certificate": false},
                {"id": 4, "name": "Курс по JS", "has_certificate": true}
            ],
            "max_users": 20,
            "max_course": 6
        }
    ]
}

const goSubscriptionById = async (id) => {
    router.push(`/subscription/${id}`)
}

onMounted(() => {
    getSubscriptions()
})
</script>

<style scoped>
.containerBody {
    margin-top: 50px;
    padding: 0 20px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
}

.header-section {
    text-align: center;
    margin-bottom: 50px;
}

h1 {
    font-size: 2.5rem;
    color: #11001C;
    margin-bottom: 10px;
    color: white !important;

}

.subtitle {
    font-size: 1.2rem;
    color: white !important;
    opacity: 0.8;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.card {
    border-radius: 15px;
    padding: 25px;
    position: relative;
    box-shadow: 0 10px 30px rgba(89, 0, 142, 0.1);
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    border: 1px solid #f0e6ff;
    overflow: hidden;
    background: linear-gradient(90deg, #11001C, #59008E);
    color: white !important;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(129, 0, 204, 0.2);
    border-color: #B14788;
}



.card-header {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0e6ff;
}

.card-header h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.price {
    font-size: 1.8rem;
    font-weight: bold;
    color: #8100CC;
}

.price span {
    font-size: 1rem;
    color: #8100CC;
    opacity: 0.7;
}

.card-body {
    flex-grow: 1;
}

.description {
    color: #c4c4c4;
    line-height: 1.5;
    margin-bottom: 25px;
}

.features {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 25px;
}

.feature {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #c4c4c4;
}

.feature .icon {
    font-size: 1.2rem;
}

button {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: none;
    background: linear-gradient(to right, #B14788, #8100CC);
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: auto;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(129, 0, 204, 0.4);
}


@media (max-width: 768px) {
    .cards {
        grid-template-columns: 1fr;
    }
    
    h1 {
        font-size: 2rem;
    }
}
</style>