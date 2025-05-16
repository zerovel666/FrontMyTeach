<template>
    <Teleport to="body">
        <div class="modal-overlay" v-if="showModal" @click="$emit('close')">
            <div class="content" @click.stop v-if="categories">
                <button class="close-btn" @click="$emit('close')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                
                <h3>Все Фильтры</h3>
                
                <div class="filter-section">
                    <h4>Категории</h4>
                    <div class="buttons">
                        <button 
                            v-for="(category, index) in categories" 
                            :key="index" 
                            @click="pushInFiltersCategory(index)"
                            :class="{ 'buttonSelected': filters.category.includes(category) }"
                        >
                            {{ category }}
                        </button>
                    </div>
                </div>
                
                <div class="filter-section">
                    <h4>Дополнительные фильтры</h4>
                    <div class="addFilters">
                        <div class="filter-group amountFilter">
                            <p>Цена</p>
                            <Slider 
                                v-model="rangeAmount" 
                                :min="minValue" 
                                :max="maxValue" 
                                :tooltip="'always'" 
                                class="slider" 
                            />
                            <div class="switchCont">
                                <p>Бесплатные</p>
                                <Toggle v-model="isFree" class="toogle" />
                            </div>
                        </div>
                        
                        <div class="filter-group ratingFilter">
                            <p>Рейтинг</p>
                            <Slider 
                                v-model="rangeRating" 
                                :min="1" 
                                :max="5" 
                                :tooltip="'always'" 
                                class="slider" 
                            />
                        </div>
                        
                        <div class="filter-group switchCertificate">
                            <p>Наличие сертификата</p>
                            <div class="switchCont">
                                <Toggle v-model="isChecked" class="toogle" />
                                <span>{{ isChecked ? "Да" : "Нет" }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="lastAction">
                    <button class="clear-btn" @click="allClear">Очистить</button>
                    <button class="apply-btn" @click="applyFilters">Искать</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { onMounted, ref, defineProps, defineEmits, watch, nextTick } from 'vue';
import Slider from "@vueform/slider";
import "@vueform/slider/themes/default.css";
import Toggle from "@vueform/toggle";
import "@vueform/toggle/themes/default.css";
import axios from 'axios';
import { API_URL } from '@/config';

const isChecked = ref(false);
const isFree = ref(false)

const props = defineProps({ showModal: Boolean });
const emit = defineEmits(["close", "applyFilters"]);
const categories = ref([]);
const minValue = ref(null);
const maxValue = ref(null);
const rangeAmount = ref([0, 1000000]);
const rangeRating = ref([1, 5])

const getCategories = async () => {
    const response = await axios.get(`${API_URL}/student/filters`);
    categories.value = response.data.message.category;
    minValue.value = Number(response.data.message.amount.startAmount);
    maxValue.value = Number(response.data.message.amount.endAmount);

    // const response = {
    //     "status": true,
    //     "message": {
    //         "category": [
    //             "Python",
    //             "C#",
    //             "React.js",
    //             "PHP",
    //             "Java",
    //             "HTML&CSS"
    //         ],
    //         "amount": {
    //             "startAmount": 0,
    //             "endAmount": 35000
    //         },
    //         "certificate": "boolean",
    //         "isFree": "boolean",
    //         "rating": [
    //             1,
    //             2,
    //             3,
    //             4,
    //             5
    //         ]
    //     }
    // }
    // categories.value = response.message.category;
    // minValue.value = Number(response.message.amount.startAmount);
    // maxValue.value = Number(response.message.amount.endAmount);

}
const pushInFiltersCategory = async (index) => {
    const value = categories.value[index];
    const idx = filters.value.category.indexOf(value);

    if (idx !== -1) {
        filters.value.category.splice(idx, 1);
    } else {
        filters.value.category.push(value);
    }
};


const filters = ref({
    isFree: null,
    category: [],
    ratingStart: null,
    ratingEnd: null,
    amountStart: null,
    amountEnd: null,
    hasCertificate: null
});

const applyFilters = () => {
    emit("applyFilters", filters);
    emit("close");
};

const allClear = async () => {
    isFree.value = false;

    await nextTick();

    filters.value = {
        isFree: null,
        category: [],
        ratingStart: null,
        ratingEnd: null,
        amountStart: null,
        amountEnd: null,
        hasCertificate: false
    };
    isChecked.value = false;
    rangeAmount.value = [minValue.value, maxValue.value];
    rangeRating.value = [1, 5];
};


watch(isFree, (newVal) => {
    filters.value.isFree = newVal;
    rangeAmount.value = [0, 0];
})

watch(rangeAmount, ([newMin, newMax]) => {
    if (filters.value.isFree) {
        if (rangeAmount.value[0] !== 0 || rangeAmount.value[1] !== 0) {
            rangeAmount.value = [0, 0];
        }
        filters.value.amountStart = null;
        filters.value.amountEnd = null;
    } else {
        filters.value.amountStart = newMin;
        filters.value.amountEnd = newMax;
    }
});

watch(rangeRating, ([newMin, newMax]) => {
    filters.value.ratingStart = newMin;
    filters.value.ratingEnd = newMax;
})

watch(isChecked, (newVal) => {
    filters.value.hasCertificate = newVal
})

onMounted(getCategories);

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
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    overflow-y: auto;
    z-index: 1000;
    padding: 20px;
}

.content {
    width: 100%;
    max-width: 900px;
    min-height: 300px;
    background-color: #000000;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 30px;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

h3 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 30px;
    color: white;
}

h4 {
    font-size: 18px;
    color: white;
    margin-bottom: 15px;
}

.filter-section {
    margin-bottom: 30px;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
    margin: 20px 0;
    overflow-y: auto;
    max-height: 200px;
    padding: 10px;
}

.buttons button {
    padding: 10px;
    border-radius: 20px;
    border: none;
    background: linear-gradient(#FFB8B8, #D467FF);
    transition: all 0.3s;
    cursor: pointer;
    color: #000;
    font-weight: 500;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.buttonSelected {
    background: linear-gradient(#FFB8B9, #FF676A) !important;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    color: white;
}

.buttons button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.addFilters {
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin-top: 20px;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
}

.filter-group p {
    margin: 0;
    color: white;
    font-size: 16px;
}

.slider {
    width: 100%;
    --slider-bg: rgba(255, 255, 255, 0.2);
    --slider-connect-bg: #ffffff;
    --slider-tooltip-bg: #000000;
    --slider-tooltip-color: #fff;
    --slider-handle-bg: #fff;
    --slider-height: 6px;
    --slider-handle-size: 18px;
    --slider-handle-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

::v-deep(.slider-tooltip) {
    border: 2px solid white !important;
    border-radius: 10px !important;
    font-size: 14px !important;
    padding: 2px 8px !important;
}

.switchCont {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
}

.switchCont span {
    font-size: 14px;
}

.lastAction {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    gap: 15px;
    flex-wrap: wrap;
}

.lastAction button {
    padding: 10px 30px;
    border-radius: 20px;
    border: none;
    font-weight: 500;
    transition: all 0.3s;
    cursor: pointer;
    font-size: 16px;
}

.clear-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.apply-btn {
    background: linear-gradient(#FFB8B8, #D467FF);
    color: #000;
}

.lastAction button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Адаптив для планшетов */
@media (min-width: 768px) {
    .content {
        padding: 40px;
        border-radius: 30px;
    }
    
    .buttons {
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }
    
    .addFilters {
        flex-direction: row;
        flex-wrap: wrap;
    }
    
    .filter-group {
        width: calc(50% - 15px);
    }
}

/* Адаптив для десктопов */
@media (min-width: 992px) {
    .content {
        border-radius: 40px;
        padding: 50px;
    }
    
    h3 {
        font-size: 28px;
    }
    
    h4 {
        font-size: 20px;
    }
    
    .buttons {
        grid-template-columns: repeat(4, 1fr);
        gap: 25px;
    }
    
    .addFilters {
        flex-direction: row;
    }
    
    .filter-group {
        width: calc(33.333% - 20px);
    }
    
    .lastAction {
        justify-content: flex-end;
    }
}

/* Адаптив для очень маленьких экранов */
@media (max-width: 400px) {
    .content {
        padding: 20px 15px;
        border-radius: 15px;
    }
    
    .buttons {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    
    .buttons button {
        font-size: 12px;
        padding: 8px 5px;
    }
    
    .lastAction button {
        padding: 8px 20px;
        font-size: 14px;
    }
}
</style>