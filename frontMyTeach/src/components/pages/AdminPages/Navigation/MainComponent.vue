<template>
    <h1>Главная</h1>
    <div class="content" v-if="store.analytics">
        <h2>Привет, админ вот аналитика за все время жизни сайта</h2>
        <div class="analitics">
            <p>Кол-во пользователей: {{ store.analytics.user_count }}</p>
            <p>Продаж совершенных: {{ store.analytics.count_sale }}</p>
            <p>Кол-во организаций: {{ store.analytics.organization_count }}</p>
            <p>Заработано с подписок: {{ store.analytics.amount_sale_subscription }} KZT</p>
            <p>Время пользования сайтом: {{ store.analytics.time_use.toFixed(1) }} м</p>
            <p>Заработано с курсов: {{ store.analytics.amount_sale_course }} KZT</p>
            <p>Кол-во курсов: {{ store.analytics.course_count }}</p>
            <p>Общий заработок: {{ store.analytics.total_amount_sale }} KZT</p>
            <p>Кол-во задач: {{ store.analytics.task }}</p>
        </div>

        <div class="metric">
            <h3>Актуальность сайта по данным метрикам</h3>
            <div class="cont-metric">
                <div class="progress-line" :style="{ width: store.progressLinePercent + '%' }">
                    {{ store.progressLinePercent }}%
                </div>
            </div>
        </div>
    </div>
    <div v-else class="loading">Загрузка аналитики...</div>
</template>

<script setup>
import { useAnalyticsStore } from '@/stores/cache/Analitics';
import { onMounted } from 'vue';

const store = useAnalyticsStore();

onMounted(() => {
    store.fetchAnalytics();
});
</script>



<style scoped>
h1,
h2,
h3,
h4,
h5,
h6,
p {
    margin: 0;
}

.content {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.analitics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.cont-metric {
    width: 100%;
    height: 50px;
    background-color: #4f007d;
    margin: 20px 0;
    border-radius: 10px;
    position: relative;
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 10px;
    box-shadow: 0 0 10px #b14788;
}

.progress-line {
    width: 100%;
    height: 30px;
    border-radius: 10px;
    background: linear-gradient(90deg, #9600ed, #b14788);
    display: flex;
    align-items: center;
    justify-content: left;
    padding: 10px;
}

.loading{
    margin-top: 40px;
}
</style>