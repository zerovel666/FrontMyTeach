<template>
    <div v-if="showModal" class="modal-layout">
        <div class="modal-content">
            <h3>Редактирование карточки</h3>
            <div class="cardBody">
                <!-- Поле для изображения -->
                <div class="image-upload">
                    <div class="image-preview" @mouseover="isHovered = true" @mouseleave="isHovered = false">
                        <img v-if="localCardBody.image_path" :src="localCardBody.image_path" alt="Изображение курса">
                        <div v-else class="no-image">Нет изображения</div>
                        <div v-if="isHovered" class="image-overlay" @click="triggerFileInput">
                            Изменить изображение?
                        </div>
                    </div>
                    <input type="file" ref="fileInput" @change="handleImageUpload" accept="image/*"
                        style="display: none">
                </div>

                <div class="form-group">
                    <label>Название курса</label>
                    <input type="text" v-model="localCardBody.name">
                </div>

                <div class="form-group">
                    <label>Категория</label>
                    <div class="custom-select" @click="toggleSelect">
                        <div class="select-header">
                            {{ selectedCategory?.category || 'Выберите категорию' }}
                            <i class="arrow" :class="{ 'open': isSelectOpen }"></i>
                        </div>
                        <div v-if="isSelectOpen" class="select-options">
                            <div v-for="category in categories" :key="category.id" class="option"
                                :class="{ 'selected': category.id === localCardBody.category.id }"
                                @click.stop="selectCategory(category)">
                                {{ category.category }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tags">
                    <h4>Тэги</h4>
                    <div class="tags-list">
                        <div v-for="(tag, index) in localCardBody.tags" :key="index" class="tag-item">
                            <input v-model="tag.tag">
                            <button @click="removeTag(index)" class="tag-remove">
                                &times;
                            </button>
                        </div>
                    </div>
                    <button @click="addTag" class="add-tag-btn">
                        + Добавить тэг
                    </button>
                </div>
            </div>
            <div class="modal-buttons">
                <button class="cancel-button" @click="emit('cancel')">Отмена</button>
                <button class="confirm-button" @click="confirmChanges">Подтвердить</button>
            </div>
        </div>
    </div>
    <Notification ref="notificationRef" />
</template>

<script setup>
import Notification from '@/components/Notification.vue';
import { API_URL } from '@/config';
import axios from 'axios';
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router';

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    },
    cardBody: {
        type: Object,
        default: () => ({
            name: '',
            image_path: '',
            category: { id: null, category: '' },
            tags: []
        }),
    },
})

const emit = defineEmits(['confirm', 'cancel'])

const localCardBody = ref(JSON.parse(JSON.stringify(props.cardBody)))
const isSelectOpen = ref(false)
const categories = ref([])
const notificationRef = ref(null)
const fileInput = ref(null)
const isHovered = ref(false)
const route = useRoute();

const selectedCategory = computed(() => {
    return categories.value.find(c => c.id === localCardBody.value.category.id)
})

const getCategories = async () => {
    try {
        // const response = await axios.get(`${API_URL}/course/category/all`)
        // categories.value = response.data

        categories.value = [
            {
                "id": 1,
                "category": "Django",
                "created_at": "2025-04-26T14:55:31.000000Z",
                "updated_at": "2025-04-26T14:55:31.000000Z"
            },
            {
                "id": 2,
                "category": "Python",
                "created_at": "2025-04-26T14:55:31.000000Z",
                "updated_at": "2025-04-26T14:55:31.000000Z"
            },
            {
                "id": 3,
                "category": "HTML&CSS",
                "created_at": "2025-04-26T14:55:31.000000Z",
                "updated_at": "2025-04-26T14:55:31.000000Z"
            },
            {
                "id": 4,
                "category": ".NET",
                "created_at": "2025-04-26T14:55:31.000000Z",
                "updated_at": "2025-04-26T14:55:31.000000Z"
            },
            {
                "id": 5,
                "category": "Java",
                "created_at": "2025-04-26T14:55:31.000000Z",
                "updated_at": "2025-04-26T14:55:31.000000Z"
            },
            {
                "id": 6,
                "category": "Java",
                "created_at": "2025-04-26T14:55:31.000000Z",
                "updated_at": "2025-04-26T14:55:31.000000Z"
            },
            {
                "id": 7,
                "category": "React.js",
                "created_at": "2025-04-26T14:55:31.000000Z",
                "updated_at": "2025-04-26T14:55:31.000000Z"
            },
            {
                "id": 8,
                "category": "C#",
                "created_at": "2025-04-26T14:55:31.000000Z",
                "updated_at": "2025-04-26T14:55:31.000000Z"
            },
            {
                "id": 9,
                "category": "HTML&CSS",
                "created_at": "2025-04-26T14:55:31.000000Z",
                "updated_at": "2025-04-26T14:55:31.000000Z"
            }
        ]
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error)
    }
}

const toggleSelect = () => {
    isSelectOpen.value = !isSelectOpen.value
}

const selectCategory = (category) => {
    localCardBody.value.category = { ...category }
    isSelectOpen.value = false
}

const addTag = () => {
    if (!localCardBody.value.tags) {
        localCardBody.value.tags = []
    }
    localCardBody.value.tags.push({ tag: '' })
}

const removeTag = async (index) => {
    const item = localCardBody.value.tags[index];
    if (item.id) {
        try {
            await axios.delete(`${API_URL}/course/tag/${item.id}`);
            notificationRef.value.showNotification('Успешно удалено');
            localCardBody.value.tags.splice(index, 1)
        } catch (error) {
            notificationRef.value.showNotification(`Ошибка: ${error}`);
        }
    } else {
        localCardBody.value.tags.splice(index, 1)
    }
}

const triggerFileInput = () => {
    fileInput.value.click();
}

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            localCardBody.value.image_path = e.target.result;
            uploadLogo(file);
        };
        reader.readAsDataURL(file);
    }
}

async function uploadLogo(file) {
    const formData = new FormData();
    formData.append('image_path', file);

    await axios.post(`${API_URL}/course/logo/${route.params.id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    notificationRef.value.showNotification("Сохранено");
}


const confirmChanges = () => {
    emit('confirm', localCardBody.value)
}

watch(() => props.cardBody, (newVal) => {
    localCardBody.value = JSON.parse(JSON.stringify(newVal))
}, { deep: true })

onMounted(() => {
    getCategories()
})
</script>

<style scoped>
.modal-layout {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content {
    background: rgb(36, 36, 36);
    padding: 24px;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90%;
    overflow-y: auto;
    text-align: center;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
}

/* Стили для загрузки изображения */
.image-upload {
    margin-bottom: 20px;
}

.image-preview {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    background: #1E1E1E;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.no-image {
    color: #B0B0B0;
    font-size: 0.9rem;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    transition: opacity 0.3s;
}

.modal-content h3 {
    margin-bottom: 20px;
    color: #E0E0E0;
}

.cardBody {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
}

.form-group label {
    color: #B0B0B0;
    font-size: 0.9rem;
}

.cardBody input {
    width: 100%;
    padding: 10px 15px;
    background: #1E1E1E;
    border: 1px solid #333;
    border-radius: 8px;
    color: #E0E0E0;
    outline: none;
}

.cardBody input:focus {
    border-color: #6800A5;
}

/* Стили для кастомного селектора */
.custom-select {
    position: relative;
    cursor: pointer;
}

.select-header {
    padding: 10px 15px;
    background: #1E1E1E;
    border: 1px solid #333;
    border-radius: 8px;
    color: #E0E0E0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.arrow {
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #B0B0B0;
    transition: transform 0.2s;
}

.arrow.open {
    transform: rotate(180deg);
}

.select-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #252525;
    border: 1px solid #333;
    border-radius: 8px;
    margin-top: 5px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
}

.option {
    padding: 10px 15px;
    color: #E0E0E0;
    text-align: left;
}

.option:hover {
    background: #333;
}

.option.selected {
    background: #6800A5;
}

/* Стили для тегов */
.tags {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tags h4 {
    text-align: left;
    margin: 0;
    color: #B0B0B0;
    font-size: 0.9rem;
}

.tags-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.tag-item {
    display: flex;
    gap: 8px;
}

.tag-item input {
    flex: 1;
}

.tag-remove {
    width: 36px;
    background: #5a1e1e;
    color: #ff6b6b;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
}

.tag-remove:hover {
    background: #7a2a2a;
}

.add-tag-btn {
    margin-top: 5px;
    padding: 8px;
    background: #333;
    color: #E0E0E0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    align-self: flex-start;
}

.add-tag-btn:hover {
    background: #444;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;
}

.cancel-button,
.confirm-button {
    flex: 1;
    padding: 10px;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.cancel-button {
    background: #333;
    color: #E0E0E0;
}

.cancel-button:hover {
    background: #444;
}

.confirm-button {
    background: #6800A5;
    color: white;
}

.confirm-button:hover {
    background: #5A217C;
}
</style>