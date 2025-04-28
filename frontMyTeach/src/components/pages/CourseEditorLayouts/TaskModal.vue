<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <h2>{{ task.id ? 'Редактировать задачу' : 'Добавить задачу' }}</h2>

            <div class="form-group">
                <label>Тип:</label>
                <div class="custom-select" @click="toggleDropdown">
                    <div class="selected-option">{{ getTypeLabel(localTask.type) }}</div>
                    <div v-if="dropdownOpen" class="options-list">
                        <div v-for="option in options" :key="option.value" class="option"
                            @click.stop="selectOption(option.value)">
                            {{ option.label }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Название:</label>
                <input v-model="localTask.name" type="text">
            </div>

            <div class="modal-actions">
                <button @click="$emit('save', localTask)" class="save-btn">Сохранить</button>
                <button @click="$emit('close')" class="cancel-btn">Отмена</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    task: Object,
    moduleId: Number
});

const emit = defineEmits(['save', 'close']);

const localTask = ref({
    type: 'task',
    name: '',
    order_id: 1,
    module_id: props.moduleId,
    ...props.task
});

watch(() => props.task, (newVal) => {
    localTask.value = { ...newVal };
});

const options = [
    { value: 'task', label: 'Задача' },
    { value: 'lecture', label: 'Лекция' }
];

const dropdownOpen = ref(false);

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const selectOption = (value) => {
    localTask.value.type = value;
    dropdownOpen.value = false;
};

const getTypeLabel = (value) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : '';
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
    background: rgb(48, 48, 48);
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    max-width: 90%;
}

.custom-select {
    position: relative;
    width: 100%;
    background-color: #2c2c2c;
    border: 1px solid #555;
    border-radius: 10px;
    padding: 10px;
    color: white;
    cursor: pointer;
    user-select: none;
}

.selected-option::after {
    content: '';
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    border: solid white;
    border-width: 0 2px 2px 0;
    padding: 3px;
    transform-origin: center;
    transition: transform 0.3s;
}

.options-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #2c2c2c;
    border: 1px solid #555;
    border-radius: 0 0 10px 10px;
    z-index: 10;
    max-height: 150px;
    overflow-y: auto;
}

.option {
    padding: 10px;
    transition: background-color 0.3s;
}

.option:hover {
    background-color: #3a3a3a;
}

.form-group {
    margin-bottom: 15px;
    color: black;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    color: white;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 10px;
    outline: none;
    color: rgb(255, 255, 255);
    background-color: #2c2c2c;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.modal-actions button{
    border-radius: 10px;
    background-color: #59008E;
    border: none;
    padding: 5px 20px;
    cursor: pointer;
}
</style>