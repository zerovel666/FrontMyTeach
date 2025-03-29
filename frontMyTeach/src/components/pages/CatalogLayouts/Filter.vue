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
    // const response = await axios.get(`${API_URL}/student/course/all`);
    // options.value = response.data.data;
    const response = {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "name": "Курс по Django",
                "image_path": "http://localhost:8082//storage/logoCourse/laravelLogo.png",
                "author_id": "9",
                "category_id": 1,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:30.000000Z",
                "updated_at": "2025-03-27T08:10:30.000000Z",
                "author_name": "Leonardo Di Kaprio",
                "tags": [
                    {
                        "id": 1,
                        "course_id": 1,
                        "tag": "quia",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    },
                    {
                        "id": 2,
                        "course_id": 1,
                        "tag": "rerum",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    },
                    {
                        "id": 3,
                        "course_id": 1,
                        "tag": "ducimus",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 1,
                    "course_id": 1,
                    "rating": "3",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                }
            },
            {
                "id": 2,
                "name": "Курс по Vue.js",
                "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
                "author_id": "9",
                "category_id": 3,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:30.000000Z",
                "updated_at": "2025-03-27T08:10:30.000000Z",
                "author_name": "Leonardo Di Kaprio",
                "tags": [
                    {
                        "id": 4,
                        "course_id": 2,
                        "tag": "iste",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    },
                    {
                        "id": 5,
                        "course_id": 2,
                        "tag": "voluptatem",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    },
                    {
                        "id": 6,
                        "course_id": 2,
                        "tag": "maiores",
                        "created_at": "2025-03-27T08:10:30.000000Z",
                        "updated_at": "2025-03-27T08:10:30.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 2,
                    "course_id": 2,
                    "rating": "2",
                    "created_at": "2025-03-27T08:10:30.000000Z",
                    "updated_at": "2025-03-27T08:10:30.000000Z"
                }
            },
            {
                "id": 3,
                "name": "Курс по HTML&CSS",
                "image_path": "http://localhost:8082//storage/logoCourse/laravelLogo.png",
                "author_id": "9",
                "category_id": 1,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:30.000000Z",
                "updated_at": "2025-03-27T08:10:30.000000Z",
                "author_name": "Leonardo Di Kaprio",
                "tags": [
                    {
                        "id": 7,
                        "course_id": 3,
                        "tag": "quibusdam",
                        "created_at": "2025-03-27T08:10:31.000000Z",
                        "updated_at": "2025-03-27T08:10:31.000000Z"
                    },
                    {
                        "id": 8,
                        "course_id": 3,
                        "tag": "perspiciatis",
                        "created_at": "2025-03-27T08:10:31.000000Z",
                        "updated_at": "2025-03-27T08:10:31.000000Z"
                    },
                    {
                        "id": 9,
                        "course_id": 3,
                        "tag": "provident",
                        "created_at": "2025-03-27T08:10:31.000000Z",
                        "updated_at": "2025-03-27T08:10:31.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 3,
                    "course_id": 3,
                    "rating": "2",
                    "created_at": "2025-03-27T08:10:31.000000Z",
                    "updated_at": "2025-03-27T08:10:31.000000Z"
                }
            },
            {
                "id": 4,
                "name": "Курс по Python",
                "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
                "author_id": "10",
                "category_id": 1,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:36.000000Z",
                "updated_at": "2025-03-27T08:10:36.000000Z",
                "author_name": "Lana Rouz",
                "tags": [
                    {
                        "id": 10,
                        "course_id": 4,
                        "tag": "placeat",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 11,
                        "course_id": 4,
                        "tag": "a",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 12,
                        "course_id": 4,
                        "tag": "quia",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 4,
                    "course_id": 4,
                    "rating": "4",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
            },
            {
                "id": 5,
                "name": "Курс по HTML&CSS",
                "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
                "author_id": "9",
                "category_id": 4,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:36.000000Z",
                "updated_at": "2025-03-27T08:10:36.000000Z",
                "author_name": "Leonardo Di Kaprio",
                "tags": [
                    {
                        "id": 13,
                        "course_id": 5,
                        "tag": "velit",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 14,
                        "course_id": 5,
                        "tag": "quam",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 15,
                        "course_id": 5,
                        "tag": "sed",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 5,
                    "course_id": 5,
                    "rating": "4",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
            },
            {
                "id": 6,
                "name": "Курс по Laravel",
                "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
                "author_id": "10",
                "category_id": 1,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:36.000000Z",
                "updated_at": "2025-03-27T08:10:36.000000Z",
                "author_name": "Lana Rouz",
                "tags": [
                    {
                        "id": 16,
                        "course_id": 6,
                        "tag": "doloribus",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 17,
                        "course_id": 6,
                        "tag": "ipsam",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    },
                    {
                        "id": 18,
                        "course_id": 6,
                        "tag": "dolorem",
                        "created_at": "2025-03-27T08:10:36.000000Z",
                        "updated_at": "2025-03-27T08:10:36.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 6,
                    "course_id": 6,
                    "rating": "4",
                    "created_at": "2025-03-27T08:10:36.000000Z",
                    "updated_at": "2025-03-27T08:10:36.000000Z"
                }
            },
            {
                "id": 7,
                "name": "Курс по SpringBoot",
                "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
                "author_id": "4",
                "category_id": 5,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:40.000000Z",
                "updated_at": "2025-03-27T08:10:40.000000Z",
                "author_name": "Antonio Banderes",
                "tags": [
                    {
                        "id": 19,
                        "course_id": 7,
                        "tag": "non",
                        "created_at": "2025-03-27T08:10:40.000000Z",
                        "updated_at": "2025-03-27T08:10:40.000000Z"
                    },
                    {
                        "id": 20,
                        "course_id": 7,
                        "tag": "qui",
                        "created_at": "2025-03-27T08:10:40.000000Z",
                        "updated_at": "2025-03-27T08:10:40.000000Z"
                    },
                    {
                        "id": 21,
                        "course_id": 7,
                        "tag": "dolor",
                        "created_at": "2025-03-27T08:10:40.000000Z",
                        "updated_at": "2025-03-27T08:10:40.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 7,
                    "course_id": 7,
                    "rating": "5",
                    "created_at": "2025-03-27T08:10:40.000000Z",
                    "updated_at": "2025-03-27T08:10:40.000000Z"
                }
            },
            {
                "id": 8,
                "name": "Курс по JS",
                "image_path": "http://localhost:8082//storage/logoCourse/vueLogo.png",
                "author_id": "10",
                "category_id": 3,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:40.000000Z",
                "updated_at": "2025-03-27T08:10:40.000000Z",
                "author_name": "Lana Rouz",
                "tags": [
                    {
                        "id": 22,
                        "course_id": 8,
                        "tag": "quam",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    },
                    {
                        "id": 23,
                        "course_id": 8,
                        "tag": "nisi",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    },
                    {
                        "id": 24,
                        "course_id": 8,
                        "tag": "quo",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 8,
                    "course_id": 8,
                    "rating": "3",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                }
            },
            {
                "id": 9,
                "name": "Курс по SpringBoot",
                "image_path": "http://localhost:8082//storage/logoCourse/javaLogo.webp",
                "author_id": "9",
                "category_id": 7,
                "is_active": true,
                "amount": null,
                "send_check": false,
                "checked": true,
                "has_certificate": false,
                "certificate_id": null,
                "created_at": "2025-03-27T08:10:40.000000Z",
                "updated_at": "2025-03-27T08:10:40.000000Z",
                "author_name": "Leonardo Di Kaprio",
                "tags": [
                    {
                        "id": 25,
                        "course_id": 9,
                        "tag": "facilis",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    },
                    {
                        "id": 26,
                        "course_id": 9,
                        "tag": "maiores",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    },
                    {
                        "id": 27,
                        "course_id": 9,
                        "tag": "architecto",
                        "created_at": "2025-03-27T08:10:41.000000Z",
                        "updated_at": "2025-03-27T08:10:41.000000Z"
                    }
                ],
                "rating_course": {
                    "id": 9,
                    "course_id": 9,
                    "rating": "3",
                    "created_at": "2025-03-27T08:10:41.000000Z",
                    "updated_at": "2025-03-27T08:10:41.000000Z"
                }
            }
        ],
        "first_page_url": "http://localhost:8080/api/student/course/all?page=1",
        "from": 1,
        "last_page": 2,
        "last_page_url": "http://localhost:8080/api/student/course/all?page=2",
        "links": [
            {
                "url": "http://localhost:8080/api/student/course/all?",
                "label": "&laquo; Previous",
                "active": false
            },
            {
                "url": "http://localhost:8080/api/student/course/all?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": "http://localhost:8080/api/student/course/all?page=2",
                "label": "2",
                "active": false
            },
            {
                "url": "http://localhost:8080/api/student/course/all?page=2",
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "next_page_url": "http://localhost:8080/api/student/course/all?page=2",
        "path": "http://localhost:8080/api/student/course/all",
        "per_page": 9,
        "prev_page_url": null,
        "to": 9,
        "total": 15
    }
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