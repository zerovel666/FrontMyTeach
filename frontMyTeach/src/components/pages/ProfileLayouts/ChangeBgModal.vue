<template>
    <div class="modal-overlay" v-if="showModal" @click="$emit('close')">
        <div class="content" @click.stop>
            <button class="save" @click="saveImage">Сохранить</button>
            <h3>Редактировать фон</h3>
            <div class="img-block">
                <div class="images">
                    <div class="image" 
                        v-for="(image, index) in images" 
                        :key="index" 
                        :class="{ selected: selectedImage && selectedImage.id === image.id }" 
                        @click="selectImage(image)">
                        <img :src="image.image_path">
                        <p>{{ image.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Notification ref="notificationRef" />
</template>
<script setup>
import Notification from '@/components/Notification.vue';
import { API_URL } from '@/config';
import axios from 'axios';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
    showModal: Boolean
});

const emit = defineEmits(['close']);

const images = ref([]);
const selectedImage = ref(null);
const notificationRef = ref(null);

const getImages = async () => {
    const response = await axios.get(`${API_URL}/client/bg/all`);
    images.value = response.data;


};

const selectImage = (image) => {
    selectedImage.value = image;
};

const saveImage = async () => {
    if (selectedImage.value) {
        try {
            const response = await axios.put(`${API_URL}/client/update`, { 
                image_bg : selectedImage.value.id 
            });

            if (response.status === 200) {
                notificationRef.value.showNotification("Фон успешно сохранен!");
                emit('close');
                setTimeout(() => {
                    window.location.reload();
                }, 1000); 
            }

        } catch (error) {
            notificationRef.value.showNotification(error.response?.data?.message || "Ошибка сохранения!");
        }
    }
};

watch(() => props.showModal, (newVal) => {
    document.body.style.overflow = newVal ? 'hidden' : '';
});

onMounted(getImages);

onUnmounted(() => {
    document.body.style.overflow = '';
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
    z-index: 1000;
}

h3 {
    color: white;
    text-align: center;
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
    font-weight: 500;
}

.content {
    width: 90%;
    max-width: 1000px;
    min-height: 300px;
    background-color: #000000;
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1.5rem;
    max-height: 80vh;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.img-block {
    max-height: calc(80vh - 180px);
    overflow-y: auto;
    padding-right: 0.5rem;
    scrollbar-width: thin;
    scrollbar-color: #5A217C transparent;
}

.images {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0.5rem;
}

.images img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 0.75rem;
    border: 1px solid #c758ff;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.image {
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.image p {
    margin: 0.75rem 0 0 0;
    font-size: 1rem;
    color: white;
    text-align: center;
}

.image.selected img {
    box-shadow: 0 0 15px #c758ff;
    transform: scale(1.02);
}

.save {
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    height: 2.5rem;
    border-radius: 1.5rem;
    font-size: 0.9rem;
    padding: 0 1.5rem;
    background-color: #5A217C;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.3);
    font-weight: 500;
}

.save:hover {
    transform: scale(1.05);
    background-color: #6a2c8c;
}

/* Стили для планшетов (600px и выше) */
@media (max-width: 500px) {
    .content {
        padding: 2rem;
    }
    .content h3{
        text-align: left;
        font-size: 1.1rem;
    }
    .content button{
        height: 35px;
    }
    .images {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .images img {
        height: 200px;
    }
}
@media (min-width: 900px) {
    .content {
        padding: 2.5rem;
    }
    
    .images {
        gap: 2rem;
    }
    
    .images img {
        height: 220px;
    }
    
    .save {
        font-size: 1rem;
        padding: 0 2rem;
    }
}

@media (min-width: 1200px) {
    .images img {
        height: 250px;
    }
}

/* Кастомизация скроллбара */
.img-block::-webkit-scrollbar {
    width: 6px;
}

.img-block::-webkit-scrollbar-track {
    background: transparent;
}

.img-block::-webkit-scrollbar-thumb {
    background-color: #5A217C;
    border-radius: 3px;
}
</style>