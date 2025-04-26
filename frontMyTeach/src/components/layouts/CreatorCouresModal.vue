<template>
    <div class="modal" v-if="showModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Создание нового курса</h2>
                <button class="close-btn" @click="$emit('close')">
                    &times;
                </button>
            </div>

            <div class="modal-body">
                <form @submit.prevent="submitForm">
                    <div class="form-group">
                        <label for="image">Обложка курса</label>
                        <div class="image-upload">
                            <label for="image-input" class="upload-area">
                                <span v-if="!previewImage">Загрузить изображение</span>
                                <img v-else :src="previewImage" class="image-preview">
                            </label>
                            <input id="image-input" type="file" accept="image/*" @change="handleImageUpload"
                                ref="fileInput">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="name">Название курса</label>
                        <input type="text" id="name" v-model="formData.name" placeholder="Введите название курса"
                            required>
                    </div>

                    <div class="form-group">
                        <label for="category">Категория</label>
                        <select id="category" v-model="formData.category_id" required>
                            <option value="" disabled selected>Выберите категорию</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.category }}
                            </option>
                        </select>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="cancel-btn" @click="$emit('close')">
                            Отмена
                        </button>
                        <button type="submit" class="submit-btn">
                            Создать курс
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { API_URL } from '@/config';
import axios from 'axios';

const props = defineProps({
    showModal: Boolean
});

const emit = defineEmits(['close', 'created']);

const categories = ref([]);
const previewImage = ref(null);
const fileInput = ref(null);

const formData = ref({
    image_path: null,
    name: '',
    category_id: ''
});

const getCategories = async () => {
    try {
        // const response = await axios.get(`${API_URL}/course/category/all`);
        // categories.value = response.data;

        categories.value = [
            {
                "id": 1,
                "category": "Python",
                "created_at": "2025-04-25T19:58:34.000000Z",
                "updated_at": "2025-04-25T19:58:34.000000Z"
            },
            {
                "id": 2,
                "category": "Java",
                "created_at": "2025-04-25T19:58:34.000000Z",
                "updated_at": "2025-04-25T19:58:34.000000Z"
            },
            {
                "id": 3,
                "category": "React.js",
                "created_at": "2025-04-25T19:58:34.000000Z",
                "updated_at": "2025-04-25T19:58:34.000000Z"
            },
            {
                "id": 4,
                "category": "PHP",
                "created_at": "2025-04-25T19:58:34.000000Z",
                "updated_at": "2025-04-25T19:58:34.000000Z"
            },
            {
                "id": 5,
                "category": "PHP",
                "created_at": "2025-04-25T19:58:34.000000Z",
                "updated_at": "2025-04-25T19:58:34.000000Z"
            },
            {
                "id": 6,
                "category": "HTML&CSS",
                "created_at": "2025-04-25T19:58:34.000000Z",
                "updated_at": "2025-04-25T19:58:34.000000Z"
            },
            {
                "id": 7,
                "category": "HTML&CSS",
                "created_at": "2025-04-25T19:58:34.000000Z",
                "updated_at": "2025-04-25T19:58:34.000000Z"
            },
            {
                "id": 8,
                "category": "HTML&CSS",
                "created_at": "2025-04-25T19:58:34.000000Z",
                "updated_at": "2025-04-25T19:58:34.000000Z"
            },
            {
                "id": 9,
                "category": "C++",
                "created_at": "2025-04-25T19:58:34.000000Z",
                "updated_at": "2025-04-25T19:58:34.000000Z"
            }
        ]
    } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
    }
};

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        formData.value.image_path = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const submitForm = async () => {
    try {
        const formDataToSend = new FormData();
        formDataToSend.append('image_path', formData.value.image_path);
        formDataToSend.append('name', formData.value.name);
        formDataToSend.append('category_id', formData.value.category_id);

        const response = await axios.post(`${API_URL}/course/store`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        emit('created', response.data);
        resetForm();
        emit('close');
    } catch (error) {
        console.error('Ошибка при создании курса:', error);
    }
};

const resetForm = () => {
    formData.value = {
        image_path: null,
        name: '',
        category_id: ''
    };
    previewImage.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

onMounted(() => {
    getCategories();
});
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: #252525;
    border-radius: 10px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border: 1px solid #333;
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    color: #E0E0E0;
    font-size: 1.5rem;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    color: #B0B0B0;
    font-size: 1.2rem;
    cursor: pointer;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #E0E0E0;
}

.modal-body {
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    color: #E0E0E0;
    margin-bottom: 8px;
    font-size: 0.9rem;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 12px;
    border-radius: 5px;
    border: 1px solid #333;
    background-color: #1E1E1E;
    color: #E0E0E0;
    font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #6800A5;
}

.image-upload {
    position: relative;
    width: 100%;
    height: 200px;
}

#image-input {
    display: none;
}

.upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 2px dashed #333;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
    color: #B0B0B0;
    text-align: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
}

.upload-area span {
    position: relative;
    z-index: 2;
}

.upload-area:hover {
    border-color: #6800A5;
    color: #E0E0E0;
}

.image-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 30px;
}

.cancel-btn,
.submit-btn {
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.cancel-btn {
    background-color: #333;
    color: #E0E0E0;
    border: none;
}

.cancel-btn:hover {
    background-color: #444;
}

.submit-btn {
    background-color: #6800A5;
    color: white;
    border: none;
}

.submit-btn:hover {
    background-color: #5A217C;
}
</style>