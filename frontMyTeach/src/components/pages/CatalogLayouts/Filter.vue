<template>
    <div class="filterSearch">
        <div class="searchContainer" @click.stop>
            <div class="inputContainer">
                <input type="text" placeholder="Поиск..." @focus="showOption = true" v-model="searchInput">
                <button @click="searchAction"><img src="/src/assets/Icons/Search.svg" alt=""></button>
            </div>
            <ul v-if="showOption" class="dropdown">
                <li v-for="(option, index) in filteredOptions" :key="index" @click="selectOption(option)">{{ option.name
                }}</li>
            </ul>
        </div>
        <div class="quickFilterFree">
            <p>Бесплатные</p>
            <label class="custom-checkbox">
                <input type="checkbox" @click="changeIsFree">
                <span class="checkmark"></span>
            </label>
        </div>
        <div class="settingFilter" @click="showSettingModal = true">
            <p>Фильтры</p>
            <img src="/src/assets/Icons/Filter.svg" alt="">
        </div>
        <button class="searchAllFitler" @click="searchFree">Искать</button>
    </div>
    <SettingFilter :showModal="showSettingModal" @close="showSettingModal = false" @applyFilters="updateFilters" />
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import SettingFilter from './SettingFilter.vue';
import axios from 'axios';
import { API_URL } from '@/config';

const emit = defineEmits(["updateWithFilter","searchExtra"]);
const showSettingModal = ref(false);
const searchInput = ref('');
const searchInputId = ref('')
const showOption = ref(false);
const options = ref([])
const filters = ref({
    isFree: null,
    category: [],
    ratingStart: null,
    ratingEnd: null,
    amountStart: null,
    amountEnd: null,
    hasCertificate: false   
})

const updateFilters = (filters) => {
    emit("updateWithFilter",filters);
};


const searchAction = () => {
    emit("searchExtra", searchInputId.value)
}

const searchFree = () => {
    emit("updateWithFilter", filters)
}

const filteredOptions = computed(() => {
    if (!searchInput.value) return options.value;
    return options.value.filter(option =>
        option.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );
});


const selectOption = async (option) => {
    if (option != null) {
        searchInput.value = option.name
        searchInputId.value = option.id
        showOption.value = false
    }
}

const handleClickOutside = (event) => {
    const searchContainer = document.querySelector(".searchContainer");
    if (!searchContainer.contains(event.target)) {
        showOption.value = false;
    }
};

const changeIsFree = () => {
    if (filters.value.isFree === null || filters.value.isFree === false){
        filters.value.isFree = true
    }else{
        filters.value.isFree = null
    }
}
const getOptions = async () => {
    const response = await axios.get(`${API_URL}/student/course/list`);
    options.value = response.data;
};
onMounted(() => {
    getOptions();
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>
<style scoped>
.filterSearch {
    width: 100%;
    padding: 15px 20px;
    background: linear-gradient(125deg, #200035, #59008E 40%);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    border-radius: 10px;
}

.searchContainer {
    width: 100%;
    max-width: 350px;
    position: relative;
    order: 1;
    flex-grow: 1;
}

.inputContainer {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
}

.inputContainer input {
    border-radius: 20px;
    height: 40px;
    padding: 10px 25px;
    width: 100%;
    outline: none;
    color: black;
    font-size: 14px;
}

.inputContainer button {
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    border: none;
    right: 10px;
    background-color: #59008E;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.3s;
    cursor: pointer;
}

.inputContainer button:hover {
    background-color: #7300b6;
}

.inputContainer button img {
    filter: invert(1);
    width: 16px;
    height: 16px;
}

.dropdown {
    position: absolute;
    width: 100%;
    background-color: white;
    margin-top: 10px;
    border-radius: 10px;
    color: black;
    padding: 10px 20px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 99999;
}

.dropdown li {
    padding: 0px;
    margin: 0px;
    color: black;
    list-style: none;
    cursor: pointer;
    padding: 5px;
    font-size: 14px;
}

.dropdown li:hover {
    background: #f0f0f0;
}

.quickFilterFree {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    order: 2;
}

.quickFilterFree p {
    margin: 0;
    padding: 0;
    font-size: 16px;
    white-space: nowrap;
}

.settingFilter {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    order: 3;
    gap: 5px;
}

.settingFilter p {
    margin: 0;
    padding: 0;
    font-size: 16px;
    white-space: nowrap;
}

.settingFilter img {
    width: 24px;
    height: 24px;
}

.searchAllFitler {
    cursor: pointer;
    height: 40px;
    border-radius: 15px;
    font-size: 16px;
    padding: 0 15px;
    background-color: #5A217C;
    color: white;
    box-shadow: inset 0px 0px 7px rgb(255, 255, 255);
    border: none;
    transition: transform 0.3s;
    order: 4;
    white-space: nowrap;
}

.searchAllFitler:hover {
    transform: scale(1.05);
}

.custom-checkbox {
    display: inline-block;
    position: relative;
    cursor: pointer;
}

.custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.checkmark {
    width: 24px;
    height: 24px;
    border: 2px solid white;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.checkmark::after {
    content: "";
    width: 12px;
    height: 16px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    display: none;
    margin-bottom: 8px;
}

.custom-checkbox input:checked+.checkmark {
    background: none;
    border-color: white;
}

.custom-checkbox input:checked+.checkmark::after {
    display: block;
}

@media (min-width: 768px) {
    .filterSearch {
        padding: 20px 40px;
        gap: 20px;
    }
    
    .quickFilterFree p,
    .settingFilter p {
        font-size: 20px;
    }
    
    .settingFilter img {
        width: 30px;
        height: 30px;
    }
    
    .searchAllFitler {
        font-size: 20px;
        padding: 0 20px;
    }
    
    .checkmark {
        width: 28px;
        height: 28px;
    }
}

@media (min-width: 1024px) {
    .filterSearch {
        height: 90px;
        padding: 25px 60px;
        flex-wrap: nowrap;
        gap: 30px;
    }
    
    .searchContainer {
        order: 0;
    }
    
    .quickFilterFree {
        order: 0;
    }
    
    .settingFilter {
        order: 0;
    }
    
    .searchAllFitler {
        order: 0;
        width: 17%;
        font-size: 24px;
        padding-left: 30px;
        padding-right: 30px;
    }
    
    .quickFilterFree p,
    .settingFilter p {
        font-size: 24px;
    }
    
    .settingFilter img {
        width: 40px;
        height: 40px;
    }
    
    .checkmark {
        width: 30px;
        height: 30px;
    }
    
    .checkmark::after {
        width: 16px;
        height: 20px;
    }
}
</style>