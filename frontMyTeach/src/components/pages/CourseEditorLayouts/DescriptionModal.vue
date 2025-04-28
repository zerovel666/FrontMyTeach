<template>
    <div class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <h3>{{ isEditing ? 'Редактировать описание' : 'Добавить описание' }}</h3>
            
            <textarea 
                v-model="localDescription.str_value" 
                class="description-input"
                placeholder="Введите текст описания"
                rows="5"
            ></textarea>
            
            <div class="modal-actions">
                <button class="btn secondary" @click="$emit('close')">Отмена</button>
                <button class="btn primary" @click="saveDescription">Сохранить</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    description: Object,
    isEditing: Boolean
});

const emit = defineEmits(['save', 'close']);

const localDescription = ref({ str_value: '' });

watch(() => props.description, (newVal) => {
    localDescription.value = { ...newVal };
}, { immediate: true });

const saveDescription = () => {
    emit('save', localDescription.value);
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #1A1A1A;
    padding: 2rem;
    border-radius: 12px;
    width: 500px;
    max-width: 90%;
}

.description-input {
    width: 100%;
    padding: 1rem;
    margin: 1rem 0;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid #4D4D4D;
    border-radius: 8px;
    color: white;
    font-family: inherit;
    resize: vertical;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
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