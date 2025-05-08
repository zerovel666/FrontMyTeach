<template>
    <div class="modal-overlay" @click="$emit('cancel')">
        <div class="modal-content" @click.stop>
            <div class="str-value">
                <textarea v-model="localBody.str_value"></textarea>
            </div>
            <div class="modal-action">
                <button @click="save">Сохранить</button>
                <button @click="$emit('cancel')">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, watch } from 'vue';

const localBody = ref({
    str_value: ''
});

const props = defineProps({
    currentQuestion: Object
});

watch(
    () => props.currentQuestion,
    (newVal) => {
        if (newVal?.str_value) {
            localBody.value.str_value = newVal?.str_value;
        }else {
            localBody.value.str_value = '';
        }
    },
    { immediate: true, deep: true }
);
const emit = defineEmits(['confirm', 'cancel']);

const save = () => {
    emit('confirm', localBody.value);
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