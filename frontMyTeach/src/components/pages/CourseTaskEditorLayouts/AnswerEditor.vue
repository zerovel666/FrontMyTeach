<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <div class="str-value" v-if="props.currentAnswer.str_value">
                <textarea v-model="localBody.str_value"></textarea>
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


const localBody = ref({
    str_value: ''
});

const localMedia = ref({
    media_value: null
});

const props = defineProps({
    currentAnswer: Object,
    currentAnswerEditor: Object,
});

watch(
    () => props.currentAnswer,
    (newVal) => {
        if (newVal.str_value) {
            localBody.value.str_value = newVal.str_value;
        } else {
            localMedia.value.media_value = newVal.media_value;
        }
    },
    { immediate: true, deep: true }
);

const emit = defineEmits(['confirm', 'cancel']);

async function save() {
    emit('confirm', localBody.value || localMedia.value);
}

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