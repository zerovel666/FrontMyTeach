<template>
    <div class="modal-overlay" @click="emit('cancel')">
        <div class="modal-content" @click.stop>
            <div class="form">
                <input type="text" v-model="localBody.first_name" placeholder="Имя">
                <input type="text" v-model="localBody.last_name" placeholder="Фамилия">
                <input type="text" v-model="localBody.email" placeholder="email">
            </div>
            <div class="modal-actions">
                <button @click="emit('cancel')">Отмена</button>
                <button @click="emit('confirm', localBody)">Сохранить</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    user: Object
});

const emit = defineEmits(['cancel', 'confirm']);

const localBody = ref({});  

watch(
    () => props.user,
    (newVal) => {
        localBody.value = newVal; 
    },
    { immediate: true } 
);
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

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
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

.form{
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form input{
    background-color: #59008E;
    padding: 10px;
    border-radius: 10px;
    outline: none;
    border: none;
}
</style>