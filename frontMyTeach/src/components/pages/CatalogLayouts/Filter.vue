<template>
    <div class="filterSearch">
        <div class="searchContainer" @click.stop>
            <div class="inputContainer">
                <input type="text" placeholder="Поиск..." @focus="showOption = true" v-model=searchInput>
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
        <div class="settingFilter" @click="showSettingModal = true" @applyFilters="updateFilters" @close="showSettingModal = false">
            <p>Фильтры</p>
            <img src="/src/assets/Icons/Filter.svg" alt="">
        </div>
        <button class="searchAllFitler">Искать</button>
    </div>
    <SettingFilter :showModal="showSettingModal" @close="showSettingModal = false" />

</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import SettingFilter from './SettingFilter.vue';
import axios from 'axios';
import { API_URL } from '@/config';


const showSettingModal = ref(false);
const searchInput = ref('');
const showOption = ref(false);
const options = ref([])
const allFilterOption = ref({
    isFree: null,
    amountStart: null,
    amountEnd: null,
    category: null
});

const updateFilters = () => {
    //logic write
};

const getOptions = async () => {
    // const response = await axios.get(`${API_URL}/student/course/all`);
    const response = [
        {
            "id": 2,
            "name": "Курс по Java",
            "image_path": "storage/logoCourse/vueLogo.png",
            "author_id": "4",
            "category_id": 3,
            "isActive": true,
            "amount": null,
            "sendCheck": false,
            "checked": true,
            "created_at": "2025-03-18T14:15:27.000000Z",
            "updated_at": "2025-03-18T14:15:27.000000Z",
            "tags": [
                {
                    "id": 4,
                    "course_id": 2,
                    "tag": "SDK",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 5,
                    "course_id": 2,
                    "tag": "MAVEN",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 6,
                    "course_id": 2,
                    "tag": "JVM",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                }
            ]
        },
        {
            "id": 3,
            "name": "Курс по C#",
            "image_path": "storage/logoCourse/laravelLogo.png",
            "author_id": "9",
            "category_id": 3,
            "isActive": true,
            "amount": null,
            "sendCheck": false,
            "checked": true,
            "created_at": "2025-03-18T14:15:27.000000Z",
            "updated_at": "2025-03-18T14:15:27.000000Z",
            "tags": [
                {
                    "id": 7,
                    "course_id": 3,
                    "tag": "OOP",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 8,
                    "course_id": 3,
                    "tag": "DOT.NET",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 9,
                    "course_id": 3,
                    "tag": "WebServlet",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                }
            ]
        },
        {
            "id": 1,
            "name": "Курс по Laravel:Laravel: Искусство Бэкенда",
            "image_path": "storage/logoCourse/javaLogo.webp",
            "author_id": "10",
            "category_id": 3,
            "isActive": true,
            "amount": null,
            "sendCheck": false,
            "checked": true,
            "created_at": "2025-03-18T14:15:27.000000Z",
            "updated_at": "2025-03-18T14:15:27.000000Z",
            "tags": [
                {
                    "id": 1,
                    "course_id": 1,
                    "tag": "Middleware",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 3,
                    "course_id": 1,
                    "tag": "Eloquent",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                },
                {
                    "id": 2,
                    "course_id": 1,
                    "tag": "Migration",
                    "created_at": "2025-03-18T14:15:27.000000Z",
                    "updated_at": "2025-03-18T14:15:27.000000Z"
                }
            ]
        }
    ];
    options.value = response;
};

const filteredOptions = computed(() => {
    if (!searchInput.value) return options.value;
    return options.value.filter(option =>
        option.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );
});


const selectOption = async (option) => {
    if (option != null) {
        searchInput.value = option
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

    if (allFilterOption.value.isFree === null || allFilterOption.value.isFree === false){
        allFilterOption.value.isFree = true
    }else{
        allFilterOption.value.isFree = false
    }

}

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
    height: 90px;
    padding: 25px 60px;
    background: linear-gradient(125deg, #200035, #59008E 40%);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.searchContainer {
    width: 100%;
    max-width: 350px;
    position: relative;
}

.inputContainer {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 350px;

}

.inputContainer input {
    border-radius: 20px;
    height: 40px;
    padding: 10px 25px;
    max-width: 350px;
    width: 100%;
    outline: none;
    color: black;
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
}

.dropdown {
    position: absolute;
    width: 100%;
    background-color: white;
    margin-top: 10px;
    border-radius: 20px;
    color: black;
    padding: 10px 20px;
}

.dropdown li {
    padding: 0px;
    margin: 0px;
    color: black;
    list-style: none;
    cursor: pointer;
    padding: 5px;
}

.dropdown li:hover {
    background: #f0f0f0;
}

.quickFilterFree {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 5px;
}

.quickFilterFree p {
    margin: 0;
    padding: 0;
    font-size: 24px;
}

.quickFilterFree input {
    width: 30px;
    height: 30px;
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
    width: 30px;
    height: 30px;
    border: 2px solid white;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.checkmark::after {
    content: "";
    width: 16px;
    height: 20px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    display: none;
    margin: 8px;
    margin-bottom: 10px;
}

.custom-checkbox input:checked+.checkmark {
    background: none;
    border-color: white;
}

.custom-checkbox input:checked+.checkmark::after {
    display: block;
}
.settingFilter{
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.settingFilter p{
    margin: 0;
    padding: 0;
    font-size: 24px;
}
.settingFilter img{
    width: 40px;
    height: 40px;
}
.searchAllFitler {
    width: 17%;
    cursor: pointer;
    height: 40px;
    border-radius: 15px;
    font-size: 24px;
    padding-left: 30px;
    padding-right: 30px;
    background-color: #5A217C;
    color: white;
    box-shadow: inset 0px 0px 7px rgb(255, 255, 255);
    border: none;
    transition: transform 0.3s;
}

.searchAllFitler:hover {
    transform: scale(1.1);
}
</style>