<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <h3>Вопросы:</h3>
            <div class="questions">
                <div v-for="(item, index) in localTask.question" class="question">{{ item.str_value }}</div>
            </div>
            <div class="type-answer">
                <h4>Тип ответа: {{ localTask.answerEditor.description }}</h4>
            </div>

            <div class="one-choise" v-if="localTask.answerEditor.code === 'ONE_CHOISE'">
                <input type="number" placeholder="Установите правильный вариант ответа"
                    v-model.number="localTask.answer.str_value" :min="1" :max="localTask.question.length"
                    @input="validateAnswer" class="input-oc" />
            </div>

            <div class="multi-choise-editor-wrapper" v-else-if="localTask.answerEditor.code == 'MULTI_CHOISE'">
                <label v-for="(item, index) in localTask.question" :key="index"
                    class="multi-choise-editor-checkbox-container">
                    <input type="checkbox" v-model="localTask.answer.json[index + 1]" />
                    <span class="multi-choise-editor-checkmark"></span>
                    {{ item.str_value }}
                </label>
            </div>


            <div class="modal-action">
                <button @click="save">Сохранить</button>
                <button @click="emit('cancel')">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';


const localTask = ref([]);

const props = defineProps({
    currentTask: Object,
});

watch(
    () => props.currentTask,
    (newVal) => {
        if (newVal) {
            localTask.value = JSON.parse(JSON.stringify(newVal));
        }
    },
    { immediate: true, deep: true }
);


const emit = defineEmits(['confirm', 'cancel']);

async function save() {
    let params = {};

    if (localTask.value.answer.str_value) {
        params = {
            str_value: localTask.value.answer.str_value,
        };
    } else if (localTask.value.answer.json) {
        params = {
            json_value: localTask.value.answer.json,
        };
    }

    emit('confirm', params);
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
    background: #303030;
    padding: 20px;
    border-radius: 10px;
    width: 600px;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    gap: 20px;
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

.multi-choise-editor-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.multi-choise-editor-checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 30px;
    cursor: pointer;
    user-select: none;
}

.multi-choise-editor-checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.multi-choise-editor-checkmark {
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

.multi-choise-editor-checkbox-container:hover .multi-choise-editor-checkmark {
    background-color: #ddd;
}

.multi-choise-editor-checkbox-container input:checked~.multi-choise-editor-checkmark {
    background-color: #59008E;
    border-color: #59008E;
}

.multi-choise-editor-checkmark::after {
    content: "";
    position: absolute;
    display: none;
}

.multi-choise-editor-checkbox-container input:checked~.multi-choise-editor-checkmark::after {
    display: block;
}

.multi-choise-editor-checkmark::after {
    left: 6px;
    top: 2px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}
</style>