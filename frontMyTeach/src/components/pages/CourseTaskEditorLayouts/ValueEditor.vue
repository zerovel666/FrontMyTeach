<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <div class="str-value" v-if="props.currentValue.str_value">
                <textarea v-model="str_value.str_value"></textarea>
            </div>
            <div class="media-value" v-if="props.currentValue.media_value !== null" @click="selectImage">
                <div class="image-container">
                    <img 
                        v-if="currentImage" 
                        :src="currentImage" 
                        alt="Current image"
                        class="image-preview"
                    />
                    <div v-else class="empty-image">
                        <span>Добавить изображение</span>
                    </div>
                    <div class="image-overlay">
                        <span>Изменить</span>
                    </div>
                </div>
                <input 
                    type="file" 
                    ref="fileInput" 
                    @change="handleImageChange" 
                    accept="image/*" 
                    style="display: none"
                />
            </div>
            <div class="modal-action">
                <button @click="save">Сохранить</button>
                <button @click="emit('cancel')">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const str_value = ref({
    str_value: ''
});

const media_value = ref({
    media_value: null
});

const fileInput = ref(null);
const currentImage = ref(null); // Отдельная ref для отображения текущего изображения

const props = defineProps({
    currentValue: Object
});

watch(
    () => props.currentValue,
    (newVal) => {
        if (newVal.str_value) {
            str_value.value.str_value = newVal.str_value;
        } else {
            media_value.value.media_value = newVal.media_value;
            currentImage.value = newVal.media_value; 
        }
    },
    { immediate: true, deep: true }
);

const emit = defineEmits(['confirm', 'cancel']);

const save = () => {
    if (props.currentValue.str_value) {
        emit('confirm', str_value.value);
    } else {
        emit('confirm', media_value.value);
    }
};

const selectImage = () => {
    fileInput.value.click();
};

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentImage.value = event.target.result;
            media_value.value.media_value = event.target.result;
        };
        reader.readAsDataURL(file);
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #303030;
    padding: 20px;
    border-radius: 10px;
    width: 600px;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.str-value textarea {
    width: 100%;
    outline: none;
    border-radius: 10px;
    min-height: 200px;
    max-height: 700px;
    padding: 10px;
    line-height: 130%;
    background-color: #303030;
    color: white;
    resize: vertical;
}

.media-value {
    width: 100%;
    cursor: pointer;
}

.image-container {
    position: relative;
    width: 100%;
    max-height: 70vh;
    overflow: hidden;
    border-radius: 8px;
}

.image-preview {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    max-height: 70vh;
}

.empty-image {
    width: 100%;
    height: 300px;
    background: #505050;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    font-size: 18px;
    border-radius: 8px;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: white;
    font-size: 18px;
    font-weight: bold;
}

.image-container:hover .image-overlay {
    opacity: 1;
}

.modal-action {
    display: flex;
    gap: 20px;
}

.modal-action button {
    background-color: #505050;
    width: 100%;
    color: #fff;
    padding: 10px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
}

.modal-action button:hover {
    background: #707070;
}
</style>