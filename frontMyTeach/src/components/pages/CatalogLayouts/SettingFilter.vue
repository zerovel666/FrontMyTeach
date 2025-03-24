<template>
    <Teleport to="body">
        <div class="modal-overlay" v-if="showModal" @click="$emit('close')">
            <div class="content" @click.stop>
                <h3>Все Фильтры</h3>
                <h4>Категории</h4>
                <div class="buttons">
                    <button v-for="(category, index) in categories" :key="index">{{ category }}</button>
                </div>
                <h4>Дополнительные фильтры</h4>
                <div class="addFilters">
                    <div class="amountFilter">
                        <p>Цена</p>
                        <Slider v-model="rangeAmount" :min="minValue" :max="maxValue" :tooltip="'always'"
                            class="slider" />
                    </div>
                    <div class="ratingFilter">
                        <h4>Рейтинг</h4>
                        <Slider v-model="rangeRating" :min="1" :max="5" :tooltip="'always'" class="slider" />
                    </div>
                    <div class="switchCertificate">
                        
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script setup>
import { API_URL } from '@/config';
import axios from 'axios';
import { onMounted, ref, defineProps, defineEmits, watch } from 'vue';
import Slider from "@vueform/slider";
import "@vueform/slider/themes/default.css"; 

defineProps({ showModal: Boolean });
const emit = defineEmits(["close", "applyFilters"]);
const categories = ref([]);
const minValue = ref(null);
const maxValue = ref(null);
const rangeAmount = ref([1, 3]);
const rangeRating = ref([1, 3])

const getCategories = async () => {
    // const response = await axios.get(`${API_URL}/student/filters`);
    // categories.value = response.data.message.category;
    const response = {
        "status": true,
        "message": {
            "category": [
                ".NET",
                "React.js"
            ],
            "amount": {
                "startAmount": "500",
                "endAmount": "10000"
            },
            "certificate": "boolean",
            "isFree": "boolean",
            "rating": [
                1,
                2,
                3,
                4,
                5
            ]
        }
    }
    categories.value = response.message.category;
    minValue.value = Number(response.message.amount.startAmount);
    maxValue.value = Number(response.message.amount.endAmount);

}

const filters = {
    isFree: true,
    category: "Программирование",
    amountStart: 100,
    amountEnd: 500,
};

const applyFilters = () => {
    emit("applyFilters", filters);
};

const updateRange = () => {
    if (minValue.value >= maxValue.value) {
        minValue.value = maxValue.value - 1;
    }
};

watch([minValue, maxValue], updateRange);

onMounted(() => {
    if (categories.value.length === 0) {
        getCategories();
    }
});

</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(5px);
}

.content {
    width: 1000px;
    min-height: 300px;
    background-color: #000000;
    border-radius: 50px;
    border: 1px solid white;
    padding: 40px;
}

h3 {
    text-align: center;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    margin: 40px 0;
}

.buttons button {
    padding: 3px;
    border-radius: 20px;
    border: none;
    background: linear-gradient(#FFB8B8, #D467FF);
    color: black;
    transition: transform 0.3s;
    cursor: pointer;
}

.buttons button:hover {
    transform: scale(1.1);
}

.addFilters {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
}

.amountFilter,
.ratingFilter,
.switchCertificate {
    border: 1px solid yellow;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 200px;
}

.amountFilter {
    width: 300px;
}



.ranges {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.switchCertificate {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.slider {
    width: 100%;
    --slider-bg: #ffffff;
    --slider-connect-bg: #ffffff;
    --slider-tooltip-bg: #000000;
    --slider-tooltip-color: #fff;
    --slider-handle-bg: #fff;
    --slider-height: 4px;
    --slider-handle-size: 16px;
}

::v-deep(.slider-tooltip) {
    border: 2px solid white !important;
}
</style>