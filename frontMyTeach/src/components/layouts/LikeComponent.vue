<template>
    <div class="like-modal" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <h3>Оцените курс</h3>
            <div class="stars">
                <span v-for="n in 5" :key="n" @click="setRating(n)" class="star"
                    :class="{ active: n <= rating }">★</span>
            </div>
            <button class="btn submit" @click="submitRating">Подтвердить</button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emits = defineEmits(['close', 'rated']);
const rating = ref(0);

const setRating = (value) => {
    rating.value = value;
};

const submitRating = () => {
    emits('rated', rating.value);
    emits('close');
};
</script>

<style scoped>
.like-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: #6b00aa;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
}

.stars {
    font-size: 32px;
    margin: 10px 0;
}

.star {
    cursor: pointer;
    color: #ccc;
    transition: color 0.2s;
}

.star.active {
    color: #a200ff;
}

.btn.submit {
    background-color: #4b0076;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}
</style>
