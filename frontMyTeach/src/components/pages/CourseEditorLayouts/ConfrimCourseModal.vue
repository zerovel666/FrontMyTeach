<template>
    <div v-if="visible" class="modal-layout">
        <div class="modal-content">
            <h2 class="modal-title">{{ title }}</h2>
            <p class="modal-message">{{ message }}</p>
            <div class="modal-buttons">
                <button class="cancel-button" @click="emit('cancel')">Отмена</button>
                <button class="confirm-button" @click="emit('confirm')">Подтвердить</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: 'Подтверждение',
    },
    message: {
        type: String,
        default: 'Вы уверены, что хотите удалить курс?',
    },
})

const emit = defineEmits(['confirm', 'cancel'])
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
    max-width: 400px;
    text-align: center;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
}

.modal-title {
    font-size: 1.5rem;
    margin-bottom: 12px;
}

.modal-message {
    font-size: 1rem;
    margin-bottom: 24px;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.cancel-button,
.confirm-button {
    flex: 1;
    padding: 10px;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.cancel-button {
    background: #59008E;
    color: #ffffff;
}

.confirm-button {
    background: #59008E;
    color: white;
}
</style>