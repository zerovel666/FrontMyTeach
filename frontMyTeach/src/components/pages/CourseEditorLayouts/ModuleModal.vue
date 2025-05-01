<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <h2>{{ isEditing ? 'Редактировать модуль' : 'Добавить модуль' }}</h2>

            <div class="form-group">
                <label>Название модуля:</label>
                <input v-model="localModule.str_value" type="text">
            </div>

            <div class="modal-actions">
                <button @click="$emit('save', localModule)" class="save-btn">Сохранить</button>
                <button @click="$emit('close')" class="cancel-btn">Отмена</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    module: Object,
    isEditing: Boolean
});

const emit = defineEmits(['save', 'close']);

const localModule = ref({
    str_value: '',
    ...props.module
});

watch(() => props.module, (newVal) => {
    localModule.value = { ...newVal };
});
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
    background: rgb(48, 48, 48);
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    max-width: 90%;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #333;
    outline: none;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.modal-actions button {
    background-color: #59008E;
    color: white;
    border-radius: 10px;
    background-color: #59008E;
    border: none;
    padding: 5px 20px;
    cursor: pointer;
}
</style>