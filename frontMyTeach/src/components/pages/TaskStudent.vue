<template>
    <TopBar />
    <div class="containerBody">
        <div class="content" v-if="moduleTasks.length > 0 && task">
            <div class="modules-content" :style="{ height: `${taskContainerHeight}px` }">
                <div class="module" v-for="(module, index) in moduleTasks">
                    <div class="module-item">
                        <h3>{{ module.displayIndex }}. {{ module.str_value }}</h3>
                    </div>
                    <div class="module-task" v-for="(task, index) in module.tasks"
                        @click="router.push(`/task/${route.params.course_id}/${task.id}`)"
                        :class="{ 'completed': task.isCompleted }">
                        <h4>{{ task.displayIndex }}. {{ task.name }}</h4>
                        <span class="checkmark" v-if="task.isCompleted">✓</span>
                    </div>
                </div>
            </div>

            <div class="task-container">
                <div class="header">
                    <h2>{{ task.name }}</h2>
                    <h3>Статус: {{ task.isCompleted ? "Выполнено" : "Не выполнено" }}</h3>
                </div>
                <section class="lecture-content" v-if="task.type == 'lecture'">
                    <div class="lecture" v-for="(lecture, index) in task.lectures" :key="index">
                        <div class="str-value" v-if="lecture.str_value">
                            <p>{{ lecture.str_value }}</p>
                        </div>
                        <div class="media-value" v-else-if="lecture.media_value">
                            <img :src="lecture.media_value" alt="">
                        </div>
                    </div>
                </section>

                <section class="task" v-if="task.type == 'task'">
                    <div class="task-description">
                        <h3>Описание</h3>
                        <p>{{ task.task_description.description }}</p>
                    </div>
                    <div class="task-questions">
                        <h3>Задание</h3>
                        <p>{{ task.answer.answer_editors.description }}</p>
                        <div class="questions">
                            <p v-for="(question, index) in task.questions" :key="index">{{ question.str_value }}</p>
                        </div>
                    </div>

                    <div class="code-task-container" v-if="task.answer.answer_editors.code === 'CODE'">
                        <div class="code-editor-wrapper">
                            <textarea v-model="userCode" class="code-editor" placeholder="Введите ваш код здесь..."
                                :style="{ height: editorHeight + 'px' }" @input="adjustEditorHeight"></textarea>

                            <div class="editor-actions">
                                <button @click="executeCode" :disabled="isExecuting" class="execute-btn">
                                    <span v-if="!isExecuting">▶ Выполнить</span>
                                    <span v-else> Выполняется...</span>
                                </button>
                                <button @click="resetCode" class="reset-btn">⟲ Сбросить</button>
                            </div>
                        </div>

                        <div class="output-section">
                            <div class="output-header">
                                <span>Результат:</span>
                                <span class="execution-time" v-if="executionTime">
                                    ({{ executionTime.toFixed(2) }} сек)
                                </span>
                            </div>
                            <pre
                                class="output-content">{{ executionOutput || "Здесь будет результат выполнения вашего кода..." }}</pre>

                        </div>
                    </div>

                    <div class="one-choise" v-if="task.answer.answer_editors.code === 'ONE_CHOISE'">
                        <input type="number" v-model="str_value" @input="inputOneChoise">
                        <button @click="sendCheckOneChoise()">Отправить</button>
                    </div>

                </section>

                <div class="task-action">
                    <button @click="goBackTask()">К предыдущему уроку</button>
                    <button @click="goNextTask()">Следующий урок</button>
                </div>
            </div>
        </div>
    </div>
    <FooterBar />

    <Notification ref="notificationRef" />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';
import Notification from '../Notification.vue';

const route = useRoute();
const router = useRouter();
const task = ref([]);
const moduleTasks = ref([]);
const notificationRef = ref(null)
const taskContainerHeight = ref(0);
const userCode = ref('');
const executionOutput = ref('')
const executionTime = ref(0)
const isExecuting = ref(false)
const editorHeight = ref(150)
const str_value = ref('');

async function getTask() {
    const response = await axios.get(`${API_URL}/student/task/${route.params.id}`)
    task.value = response.data;

    if (task.value.answer.answer_editors.code == 'CODE') {
        userCode.value = String(task.value.userAnswer)
        console.log(userCode.value);
    } else if (task.value.answer.answer_editors.code == 'ONE_CHOISE') {
        str_value.value = String(task.value.userAnswer)
    }
    updateTaskContainerHeight();
}

async function getAllTasksInModule() {
    const response = await axios.get(`${API_URL}/student/task/all/${route.params.course_id}`)
    moduleTasks.value = response.data

    moduleTasks.value = moduleTasks.value.sort((a, b) => a.queue - b.queue)
        .map((module, mIndex) => {
            const sortedTasks = module.tasks
                .sort((a, b) => a.order_id - b.order_id)
                .map((task, tIndex) => ({
                    ...task,
                    displayIndex: `${mIndex + 1}.${tIndex + 1}`
                }));
            return {
                ...module,
                tasks: sortedTasks,
                displayIndex: `${mIndex + 1}`
            };
        });
    updateTaskContainerHeight();
}

async function goBackTask() {
    try {
        // Находим текущий модуль и индекс текущей задачи
        let currentModuleIndex = -1;
        let currentTaskIndex = -1;

        for (let m = 0; m < moduleTasks.value.length; m++) {
            const module = moduleTasks.value[m];
            for (let t = 0; t < module.tasks.length; t++) {
                if (module.tasks[t].id === task.value.id) {
                    currentModuleIndex = m;
                    currentTaskIndex = t;
                    break;
                }
            }
            if (currentModuleIndex !== -1) break;
        }

        // Если не нашли текущую задачу
        if (currentModuleIndex === -1 || currentTaskIndex === -1) {
            notificationRef.value.showNotification('Не удалось определить текущий урок', 'error');
            return;
        }

        // Определяем предыдущую задачу
        let prevModuleIndex = currentModuleIndex;
        let prevTaskIndex = currentTaskIndex - 1;

        // Если текущая задача первая в модуле, переходим к последней задаче предыдущего модуля
        if (prevTaskIndex < 0) {
            if (prevModuleIndex > 0) {
                prevModuleIndex--;
                prevTaskIndex = moduleTasks.value[prevModuleIndex].tasks.length - 1;
            } else {
                // Это первая задача в первом модуле - ничего не делаем
                notificationRef.value.showNotification('Это первый урок курса', 'info');
                return;
            }
        }

        // Переходим к предыдущей задаче
        const prevTask = moduleTasks.value[prevModuleIndex].tasks[prevTaskIndex];
        router.push(`/task/${route.params.course_id}/${prevTask.id}`);

    } catch (error) {
        console.error('Error going to previous task:', error);
        notificationRef.value.showNotification('Ошибка при переходе к предыдущему уроку', 'error');
    }
}

async function goNextTask() {
    try {
        let currentModuleIndex = -1;
        let currentTaskIndex = -1;

        for (let m = 0; m < moduleTasks.value.length; m++) {
            const module = moduleTasks.value[m];
            for (let t = 0; t < module.tasks.length; t++) {
                if (module.tasks[t].id === task.value.id) {
                    currentModuleIndex = m;
                    currentTaskIndex = t;
                    break;
                }
            }
            if (currentModuleIndex !== -1) break;
        }

        // Если не нашли текущую задачу
        if (currentModuleIndex === -1 || currentTaskIndex === -1) {
            notificationRef.value.showNotification('Не удалось определить текущий урок', 'error');
            return;
        }

        // Определяем следующую задачу
        let nextModuleIndex = currentModuleIndex;
        let nextTaskIndex = currentTaskIndex + 1;

        // Если текущая задача последняя в модуле, переходим к первой задаче следующего модуля
        if (nextTaskIndex >= moduleTasks.value[nextModuleIndex].tasks.length) {
            if (nextModuleIndex < moduleTasks.value.length - 1) {
                nextModuleIndex++;
                nextTaskIndex = 0;
            } else {
                // Это последняя задача в последнем модуле - ничего не делаем
                notificationRef.value.showNotification('Это последний урок курса', 'info');
                return;
            }
        }

        // Переходим к следующей задаче
        const nextTask = moduleTasks.value[nextModuleIndex].tasks[nextTaskIndex];
        router.push(`/task/${route.params.course_id}/${nextTask.id}`);

    } catch (error) {
        console.error('Error going to next task:', error);
        notificationRef.value.showNotification('Ошибка при переходе к следующему уроку', 'error');
    }
}

function updateTaskContainerHeight() {
    nextTick(() => {
        const taskContainer = document.querySelector('.task-container');
        if (taskContainer) {
            taskContainerHeight.value = taskContainer.offsetHeight;
        }
    });
}

const adjustEditorHeight = () => {
    const lines = userCode.value.split('\n').length
    editorHeight.value = Math.max(150, Math.min(400, lines * 20))
}

const executeCode = async () => {
    isExecuting.value = true
    executionOutput.value = 'Выполнение...'

    try {
        const startTime = performance.now()
        const response = await axios.put(`${API_URL}/student/task/complete/${route.params.id}`, {
            userAnswer: userCode.value
        })
        executionTime.value = (performance.now() - startTime) / 1000

        if (response.data.error) {
            executionOutput.value = `Ошибка: ${response.data.error}`;
            notificationRef.value.showNotification(response.data.message)
        } else {
            executionOutput.value = response.data.output;
            notificationRef.value.showNotification(response.data.message)
            if (response.data.success == true){
                changeStatus();
            }
        }
    } catch (error) {
        executionOutput.value = `Ошибка выполнения: ${error.message}`
    } finally {
        isExecuting.value = false
    }
}

async function changeStatus() {

    task.value.isCompleted = true;

    const taskId = Number(route.params.id);
    const foundTask = moduleTasks.value
        .flatMap(module => module.tasks)
        .find(task => task.id === taskId);

    if (foundTask) {
        foundTask.isCompleted = true;
    } else {
        console.warn(`Задача с id=${taskId} не найдена`);
    }

    console.log(moduleTasks.value);
}


const resetCode = () => {
    userCode.value = '';
    executionOutput.value = ''
    executionTime.value = 0
    editorHeight.value = 150
}

async function inputOneChoise() {
    if (str_value.value > task.value.questions.length) {
        notificationRef.value.showNotification(`Выберите ответ в диапазоне от 1 до ${task.value.questions.length}`)
        str_value.value = 1
    }
}

async function sendCheckOneChoise() {
    try {
        const response = await axios.put(`${API_URL}/student/task/complete/${route.params.id}`, {
            userAnswer: str_value.value
        });
        
        if (Boolean(response.data.success) == true){
            changeStatus();
        }        

        notificationRef.value.showNotification(response.data.message);

    } catch (error) {
        notificationRef.value.showNotification(error?.response?.data?.error ?? error ?? "Неизвестная ошибка")
    }
}

watch(() => task.value, () => {
    updateTaskContainerHeight();
}, { deep: true });

watch(() => route.params.id, (newId) => {
    if (newId) {
        getTask();
        getAllTasksInModule();
    }
});

onMounted(() => {
    getTask();
    getAllTasksInModule();
})
</script>

<style scoped>
p,
h1,
h2,
h3,
h4,
h5,
h6 {
    margin: 0;
}

.content {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    margin-top: 40px;
}

.modules-content {
    width: 30%;
    background: #59008E;
    border-radius: 20px 0 0 20px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    overflow-y: auto;
}

.module-task {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.module-task.completed {
    background-color: #3a005d;
}

.module-task.completed h4 {
    opacity: 0.7;
    text-decoration: line-through;
}

.checkmark {
    color: #a200ff;
    font-weight: bold;
    font-size: 1.2em;
}

.module {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.module-item {
    background-color: #470070;
    padding: 20px;
    border-radius: 10px;
}

.module-task {
    background-color: #470070;
    padding: 20px 20px 20px 30px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
}

.module-task:hover {
    background-color: #6f00af;
}

.task-container {
    width: 70%;
    background: #59008E;
    border-radius: 20px;
    padding: 30px;
    line-height: 140%;
}

.task-container .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.lecture-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.lecture-content .media-value img {
    width: 100%;
    height: auto;
    border-radius: 10px;
}

.task-action {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
}

.task-action button {
    padding: 10px 20px;
    background: none;
    border: none;
    border-radius: 10px;
    border: 1px solid #B14788;
    box-shadow: 0 0 10px #B14788;
    cursor: pointer;
    transition: box-shadow 0.3s ease-in-out;
}

.task-action button:hover {
    box-shadow: 0 0 20px #B14788;
}

.task h3 {
    margin: 40px 0 20px 0;
}

.questions {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
}

.code-task-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    border-radius: 8px;
    background-color: #470070;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.code-editor-wrapper {
    margin-bottom: 20px;
}

.code-editor {
    width: 100%;
    min-height: 150px;
    padding: 12px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 14px;
    line-height: 1.5;
    background-color: #3a005d;
    border-radius: 4px;
    resize: none;
    tab-size: 2;
    outline: none;
}

.code-editor:focus {
    border-color: #B14788;
    box-shadow: 0 0 0 0.2rem #b147883d;
}

.editor-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.execute-btn,
.reset-btn {
    padding: 8px 16px;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.execute-btn {
    background-color: #6e00b3;
    border: none;
}

.reset-btn {
    background-color: #6e00b3;
    border: none;
}

.output-section {
    background-color: #3a005d;
    padding: 15px;
    border-radius: 5px;
}

.output-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-weight: 600;
}

.execution-time {
    color: #6c757d;
    font-weight: normal;
}

.output-content {
    background-color: #490077;
    padding: 12px;
    border-radius: 4px;
    min-height: 50px;
    white-space: pre-wrap;
    font-family: 'Consolas', 'Monaco', monospace;
    margin-bottom: 15px;
}

.expected-result {
    padding: 10px;
    background-color: #d4edda;
    color: #155724;
    border-radius: 4px;
    border-left: 4px solid #28a745;
}

.one-choise {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
}

.one-choise button {
    background: #470070;
    border: none;
    padding: 10px 30px;
    border-radius: 10px;
    cursor: pointer;
}

.one-choise input {
    background-color: #470070;
    outline: none;
    border: none;
    border-radius: 10px;
    padding: 10px;
}

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>