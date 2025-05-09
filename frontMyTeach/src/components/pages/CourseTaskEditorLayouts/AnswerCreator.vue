<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <h3>Вопросы:</h3>
            <div class="questions">
                <div v-for="(item, index) in localbody.question" class="question">{{ item.str_value }}</div>
            </div>
            <div class="type-answer">
                <h4>Тип ответа: {{ localbody.answerEditor.description }}</h4>
            </div>
            
            <div class="one-choise" v-if="localbody.answerEditor.code == 'ONE_CHOISE'">
                <input type="number" placeholder="Установите правильный вариант ответа"
                    v-model.number="localbody.answer.str_value" :min="1" :max="localbody.question.length"
                    @input="validateAnswer" class="input-oc" />
            </div>

            <div class="multi-choise" v-else-if="localbody.answerEditor.code == 'MULTI_CHOISE'">
                <label v-for="(item, index) in localbody.question" :key="index" class="multi-choise-checkbox-container">
                    <input type="checkbox" v-model="correctAnswers[index + 1]" />
                    <span class="multi-choise-checkmark"></span>
                    {{ item.str_value }}
                </label>
            </div>

            <div class="modal-action">
                <button @click="save">Сохранить</button>
                <button @click="emit('cancel')">Закрыть</button>
            </div>
        </div>
    </div>

    <Notification ref="notificationRef" />
</template>

<script setup>
import Notification from '@/components/Notification.vue';
import { ref, watch, computed } from 'vue';

const localbody = ref({});
const notificationRef = ref(null);
const correctAnswers = ref({});

const props = defineProps({
    currentTask: Object,
});

function initCorrectAnswers() {
    if (localbody.value.answer?.json) {
        correctAnswers.value = JSON.parse(localbody.value.answer.json);
    } else {
        const answers = {};
        if (localbody.value.question) {
            localbody.value.question.forEach((_, index) => {
                answers[index + 1] = false;
            });
        }
        correctAnswers.value = answers;
    }
}

watch(() => props.currentTask, (newVal) => {
    if (newVal) {
        localbody.value = JSON.parse(JSON.stringify(newVal));
        initCorrectAnswers();
    } else {
        localbody.value = {};
        correctAnswers.value = {};
    }
}, { immediate: true, deep: true });

const emit = defineEmits(['confirm', 'cancel']);

async function validateAnswer() {
    const value = localbody.value.answer.str_value;
    const min = 1;
    const max = localbody.value.question.length;

    if (value < min || value > max) {
        localbody.value.answer.str_value = null;
        notificationRef.value.showNotification(`Ответ должен быть в диапазоне от ${min} до ${max}`);
    } else {
        localbody.value.answer.str_value = value;
    }
};

async function save() {
    if (localbody.value.answerEditor.code == 'ONE_CHOISE') {
        if (!localbody.value.answer.str_value) {
            notificationRef.value.showNotification('Укажите правильный вариант ответа');
            return;
        }
        emit('confirm', localbody.value);
        localbody.value = {};
    } else if (localbody.value.answerEditor.code == 'MULTI_CHOISE') {
        const hasCorrectAnswer = Object.values(correctAnswers.value).some(val => val);
        if (!hasCorrectAnswer) {
            notificationRef.value.showNotification('Выберите хотя бы один правильный вариант ответа');
            return;
        }

        localbody.value.answer.json = JSON.stringify(correctAnswers.value);
        localbody.value.answer.str_value = null; 
        emit('confirm', localbody.value);
        localbody.value = {};
    } else {
        notificationRef.value.showNotification('Неизвестный тип ответа');
    }
}
</script>

<style scoped>
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

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

.questions {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.input-oc {
    color: black;
    width: 400px;
    outline: none;
    padding: 10px;
    border-radius: 10px;
}

.multi-choise {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.multi-choise-checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 30px;
    cursor: pointer;
    user-select: none;
}

.multi-choise-checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.multi-choise-checkmark {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 18px;
    width: 18px;
    background-color: #eee;
    border-radius: 4px;
    transition: all 0.2s ease;
    border: 1px solid #ccc;
}

.multi-choise-checkbox-container:hover .multi-choise-checkmark {
    background-color: #ddd;
}

.multi-choise-checkbox-container input:checked~.multi-choise-checkmark {
    background-color: #59008E;
    border-color: #59008E;
}

.multi-choise-checkmark::after {
    content: "";
    position: absolute;
    display: none;
}

.multi-choise-checkbox-container input:checked~.multi-choise-checkmark::after {
    display: block;
}

.multi-choise-checkmark::after {
    left: 6px;
    top: 2px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}
</style>