<template>
    <Teleport to="body">
        <div class="modal-overlay" v-if="showModal" @click="$emit('close')">
            <div class="content" @click.stop v-if="categories">
                <h3>Все Фильтры</h3>
                <h4>Категории</h4>
                <div class="buttons">
                    <button v-for="(category, index) in categories" :key="index" @click="pushInFiltersCategory(index)"
                        :class="{ 'buttonSelected': filters.category.includes(category) }">
                        {{ category }}
                    </button>
                </div>
                <h4>Дополнительные фильтры</h4>
                <div class="addFilters">
                    <div class="amountFilter">
                        <p>Цена</p>
                        <Slider v-model="rangeAmount" :min="minValue" :max="maxValue" :tooltip="'always'"
                            class="slider" />
                        <div class="switchCont" id="sw1">
                            <p>Бесплатные</p>
                            <Toggle v-model="isFree" class="toogle" />
                        </div>
                    </div>
                    <div class="ratingFilter">
                        <p>Рейтинг</p>
                        <Slider v-model="rangeRating" :min="1" :max="5" :tooltip="'always'" class="slider" />
                    </div>
                    <div class="switchCertificate">
                        <p>Наличие сертификата</p>
                        <div class="switchCont">
                            <Toggle v-model="isChecked" class="toogle" />
                            {{ isChecked ? "Да" : "Нет" }}
                        </div>
                    </div>
                </div>
                <div class="lastAction">
                    <button @click="allClear">Очистить</button>
                    <button @click="applyFilters">Искать</button>
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
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(5px);
    overflow-y: auto;
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
    overflow-y: auto;
    max-height: 300px;
    padding: 20px;
}

.buttons button {
    padding: 3px;
    border-radius: 20px;
    border: none;
    background: linear-gradient(#FFB8B8, #D467FF);
    transition: transform 0.3s;
    cursor: pointer;
}

.buttonSelected {
    background: linear-gradient(#FFB8B9, #FF676A) !important;
    box-shadow: 0 0 20px #fff;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 200px;
}

.amountFilter p,
.ratingFilter p {
    margin-bottom: 30px;
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

.lastAction {
    display: flex;
    justify-content: right;
    margin-top: 40px;
    gap: 20px;
}

.lastAction button {
    padding: 3px 40px;
    border-radius: 20px;
    border: none;
    background: linear-gradient(#FFB8B8, #D467FF);
    transition: transform 0.3s;
    cursor: pointer;
}

.lastAction button:hover {
    transform: scale(1.1);
}

#sw1 {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

#sw1 p {
    margin: 0;
}
</style>