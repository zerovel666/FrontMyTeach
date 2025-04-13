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
    // images.value = [
    //     { id: 1, image_path: "http://localhost:8081/storage//bgProfile/Чистилище.jpg", name: "Чистилище" },
    //     { id: 2, image_path: "http://localhost:8081/storage//bgProfile/Таинство.jpg", name: "Таинство" },
    //     { id: 3, image_path: "http://localhost:8081/storage//bgProfile/Иллюстрация.jpg", name: "Иллюстрация" },
    //     { id: 4, image_path: "http://localhost:8081/storage//bgProfile/Абстракция.jpg", name: "Абстракция" },
    //     { id: 5, image_path: "http://localhost:8081/storage//bgProfile/Капли.jpg", name: "Капли" }
    // ];
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
}
h3 {
    color: white;
    text-align: center;
}

.content {
    width: 1000px;
    min-height: 300px;
    background-color: #000000;
    border-radius: 50px;
    border: 1px solid white;
    padding: 40px;
    max-height: 600px;
    position: relative;
}

.img-block {
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
}

.images {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.images img {
    width: 400px;
    height: 300px;
    object-fit: cover;
    border-radius: 10px;
    border:1px solid #c758ff;

}
.image {
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 30px;
    transition: 0.3s;
}
.image:hover{
    transform: scale(1.05);
}
.image p{
    margin: 0;
    margin-top: 10px;
}
.image.selected img {
    box-shadow: 0 0 10px #c758ff;
}
.image.selected{
    transform: scale(1.05);
}
.save {
    position: absolute;
    right: 50px;
    height: 30px;
    border-radius: 15px;
    font-size: 75%;
    padding-left: 30px;
    padding-right: 30px;
    background-color: #5A217C;
    color: white;
    box-shadow: inset 0px 0px 7px rgb(255, 255, 255);
    border: none;
    transition: transform 0.3s;
}
.save:hover {
    transform: scale(1.1);
}
</style>