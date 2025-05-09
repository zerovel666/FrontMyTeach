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
                    @input="validateAnswer" class="default-input" />
            </div>

            <div class="multi-choise" v-else-if="localbody.answerEditor.code == 'MULTI_CHOISE'">
                <label v-for="(item, index) in localbody.question" :key="index" class="multi-choise-checkbox-container">
                    <input type="checkbox" v-model="correctAnswers[index + 1]" />
                    <span class="multi-choise-checkmark"></span>
                    {{ item.str_value }}
                </label>
            </div>

            <div class="word" v-else-if="localbody.answerEditor.code == 'WORD'">
                <input type="text" placeholder="Введите правильный ответ" v-model="localbody.answer.str_value"
                    class="default-input" />
            </div>

            <div class="matching" v-else-if="localbody.answerEditor.code == 'MATCHING'">
                <div class="matching-columns">
                    <div class="left-column">
                        <h4>Ответы</h4>
                        <div v-for="(item, index) in matchingBody.left" :key="'left-' + index" class="matching-item">
                            <input v-model="matchingBody.left[index]" placeholder="Текст слева" class="matching-input">
                            <button @click="removeMatchingPair(index)" class="remove-btn">×</button>
                        </div>
                    </div>
                    <div class="right-column">
                        <h4>Вопросы</h4>
                        <div v-for="(item, index) in matchingBody.right" :key="'right-' + index" class="matching-item">
                            <input v-model="matchingBody.right[index]" placeholder="Текст справа"
                                class="matching-input">
                        </div>
                    </div>
                </div>
                <div class="matching-controls">
                    <button class="add-row" @click="addMatchingPair">Добавить пару</button>
                    <button class="match-pairs" @click="openMatchingModal"
                        v-if="matchingBody.left.length > 0">Сопоставить пары</button>
                </div>
            </div>

            <div class="matching-modal" v-if="showMatchingModal">
                <div class="matching-modal-overlay" @click.self="showMatchingModal = false">
                    <div class="matching-modal-container">
                        <div class="matching-modal-header">
                            <h3 class="matching-modal-title">Сопоставление элементов</h3>
                            <button class="matching-modal-close" @click="showMatchingModal = false">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 4L4 12" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                    <path d="M4 4L12 12" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                </svg>
                            </button>
                        </div>

                        <div class="matching-modal-body">
                            <div class="matching-pair" v-for="(rightItem, rightIndex) in matchingBody.right"
                                :key="'pair-' + rightIndex">
                                <div class="pair-card">
                                    <div class="pair-card-header">
                                        <span class="pair-card-badge">Элемент {{ rightIndex + 1 }}</span>
                                    </div>
                                    <div class="pair-card-content">
                                        <div class="pair-card-right">
                                            <div class="pair-card-text">{{ rightItem || 'Пусто' }}</div>
                                        </div>

                                        <div class="pair-card-arrow">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 16L18 12M18 12L14 8M18 12L6 12" stroke="#64748B"
                                                    stroke-width="2" stroke-linecap="round" />
                                            </svg>
                                        </div>

                                        <div class="pair-card-left">
                                            <select v-model="matchingBody.correct[rightIndex]" class="pair-select">
                                                <option :value="undefined" disabled>Выберите соответствие</option>
                                                <option v-for="(leftItem, leftIndex) in matchingBody.left"
                                                    :value="leftIndex" :key="'option-' + leftIndex"
                                                    :disabled="isLeftItemAlreadyUsed(leftIndex)" class="pair-option">
                                                    {{ leftItem || 'Пусто' }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="matching-modal-footer">
                            <button class="matching-modal-button secondary" @click="showMatchingModal = false">
                                Отменить
                            </button>
                            <button class="matching-modal-button primary" @click="saveMatchingPairs">
                                Сохранить сопоставления
                            </button>
                        </div>
                    </div>
                </div>
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
const showMatchingModal = ref(false);

const matchingBody = ref({
    left: [],
    right: [],
    correct: [], // индексы левой колонки, соответствующие правой
});

// Добавление новой пары
function addMatchingPair() {
    matchingBody.value.left.push('');
    matchingBody.value.right.push('');
    matchingBody.value.correct.push(undefined);
};

// Удаление пары
function removeMatchingPair(index) {
    matchingBody.value.left.splice(index, 1);
    matchingBody.value.right.splice(index, 1);
    matchingBody.value.correct.splice(index, 1);
};

// Открытие модального окна для сопоставления
function openMatchingModal() {
    // Проверяем, что все поля заполнены
    if (matchingBody.value.left.some(item => !item.trim())) {
        notificationRef.value.showNotification('Заполните все поля в левой колонке');
        return;
    }
    if (matchingBody.value.right.some(item => !item.trim())) {
        notificationRef.value.showNotification('Заполните все поля в правой колонке');
        return;
    }
    showMatchingModal.value = true;
};

// Сохранение сопоставленных пар
function saveMatchingPairs() {
    showMatchingModal.value = false;
    console.log(matchingBody.value);
};

// Проверка, используется ли уже элемент левой колонки
function isLeftItemAlreadyUsed(leftIndex) {
    return matchingBody.value.correct.includes(leftIndex) &&
        matchingBody.value.correct.indexOf(leftIndex) !== matchingBody.value.correct.lastIndexOf(leftIndex);
};

const props = defineProps({
    currentTask: Object,
});

watch(() => props.currentTask, (newVal) => {
    if (newVal) {
        localbody.value = JSON.parse(JSON.stringify(newVal));
        initCorrectAnswers();

        // Инициализация matchingBody если это тип MATCHING
        if (localbody.value.answerEditor.code === 'MATCHING' && localbody.value.answer?.json) {
            const savedData = JSON.parse(localbody.value.answer.json);
            matchingBody.value.left = savedData.left || [];
            matchingBody.value.right = savedData.right || [];
            matchingBody.value.correct = savedData.correct || [];
        }
    } else {
        localbody.value = {};
        correctAnswers.value = {};
        matchingBody.value = { left: [], right: [], correct: [] };
    }
}, { immediate: true, deep: true });

const emit = defineEmits(['confirm', 'cancel']);

function validateAnswer() {
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

function save() {
    if (localbody.value.answerEditor.code == 'ONE_CHOISE' || localbody.value.answerEditor.code == 'WORD') {
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
    } else if (localbody.value.answerEditor.code == 'MATCHING') {
        // Проверка для MATCHING
        if (matchingBody.value.left.length === 0 || matchingBody.value.right.length === 0) {
            notificationRef.value.showNotification('Добавьте элементы в обе колонки');
            return;
        }

        if (matchingBody.value.left.some(item => !item.trim()) || matchingBody.value.right.some(item => !item.trim())) {
            notificationRef.value.showNotification('Заполните все поля в обеих колонках');
            return;
        }

        if (matchingBody.value.correct.some(item => item === undefined)) {
            notificationRef.value.showNotification('Сопоставьте все элементы');
            return;
        }

        localbody.value.answer.json = JSON.stringify(matchingBody.value);
        localbody.value.answer.str_value = null;
        emit('confirm', localbody.value);
        localbody.value = {};
    } else {
        notificationRef.value.showNotification('Неизвестный тип ответа');
    }
}
</script>

<style scoped>
/* Существующие стили оставляем без изменений */
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
    position: relative;
}

/* Стили для matching */
.matching-columns {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
}

.left-column,
.right-column {
    flex: 1;
}

.matching-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.matching-input {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 10px;
    outline: none;
    background-color: #505050;
}

.matching-input::placeholder {
    color: #aaa;
}

.remove-btn {
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.correct-match {
    font-size: 0.8em;
    color: #aaa;
    margin-left: 10px;
}

.matching-controls {
    display: flex;
    gap: 20px;
}

.add-row,
.match-pairs {
    width: 100%;
    padding: 8px 15px;
    background: #505050;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
}

.add-row:hover,
.match-pairs:hover {
    background: #707070;
}

/* Modern Matching Modal Styles */
.matching-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
}

.matching-modal-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
}

.matching-modal-container {
    background-color: #1e1e1e;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.matching-modal-header {
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.matching-modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.matching-modal-close {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    transition: color 0.2s;
}

.matching-modal-close:hover {
    color: #475569;
}

.matching-modal-body {
    padding: 16px 24px;
    overflow-y: auto;
    flex-grow: 1;
}

.matching-pair {
    margin-bottom: 16px;
}

.matching-pair:last-child {
    margin-bottom: 0;
}

.pair-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
}

.pair-card-header {
    background-color: #1e1e1e;
    padding: 8px 12px;
    border-bottom: 1px solid #e2e8f0;
}

.pair-card-badge {
    font-size: 0.75rem;
    font-weight: 500;
}

.pair-card-content {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.pair-card-right,
.pair-card-left {
    flex: 1;
}

.pair-card-text {
    padding: 12px;
    background-color: #6a6a6a;
    border-radius: 6px;
    font-size: 0.875rem;
}

.pair-card-arrow {
    color: #94a3b8;
}

.pair-select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 6px;
    background-color: #6a6a6a;
    font-size: 0.875rem;
    transition: border-color 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
}

.pair-select:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.pair-option {
    padding: 8px;
}

.matching-modal-footer {
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.matching-modal-button {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.matching-modal-button {
    background-color: #6a6a6a;
    color: white;
}

.matching-modal-button:hover {
    background-color: #3b3b3b;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .pair-card-content {
        flex-direction: column;
        gap: 12px;
    }

    .pair-card-arrow {
        transform: rotate(90deg);
    }
}

/* Остальные существующие стили */
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

.default-input {
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