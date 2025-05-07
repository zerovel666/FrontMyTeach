<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <input type="text" v-model="name" placeholder="Введите названия модуля">
            <div class="modal-action">
                <button @click="save">Сохранить</button>
                <button @click="emit('cancel')">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const name = ref('');

const emit = defineEmits(['confirm', 'cancel']);

const save = async () => {
    emit('confirm',name.value)
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
    background: rgb(48, 48, 48);
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    max-width: 90%;
}

.modal-content input {
    width: 100%;
    padding: 10px;
    outline: none;
    color: #fff;
    border-radius: 10px;
    background-color: #505050;
    border: none;
}

.modal-action {
    margin-top: 20px;
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