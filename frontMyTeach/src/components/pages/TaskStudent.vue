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
                <h2>{{ task.name }}</h2>
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
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';
import Notification from '../Notification.vue';

const route = useRoute();
const router = useRouter();
const task = ref([]);
const moduleTasks = ref([]);
const notificationRef = ref(null)
const taskContainerHeight = ref(0);

async function getTask() {
    const response = await axios.get(`${API_URL}/student/task/${route.params.id}`)
    tasks.value = response.data;

  
    updateTaskContainerHeight();
}

async function getAllTasksInModule() {
    // const response = await axios.get(`${API_URL}/student/task/all/${route.params.course_id}`)
    // moduleTasks.value = response.data

    moduleTasks.value = [
        {
            "id": 37,
            "queue": 1,
            "str_value": "Введение в Laravel",
            "course_id": 3,
            "created_at": "2025-05-10T08:50:20.000000Z",
            "updated_at": "2025-05-10T08:50:20.000000Z",
            "tasks": [
                {
                    "id": 4,
                    "name": "Установка Laravel и настройка окружения.",
                    "order_id": 1,
                    "type": "lecture",
                    "module_id": 37,
                    "course_id": 3,
                    "created_at": "2025-05-10T08:51:04.000000Z",
                    "updated_at": "2025-05-10T09:54:54.000000Z",
                    "isCompleted": true
                },
                {
                    "id": 5,
                    "name": "Структура проекта Laravel",
                    "order_id": 2,
                    "type": "lecture",
                    "module_id": 37,
                    "course_id": 3,
                    "created_at": "2025-05-10T08:51:24.000000Z",
                    "updated_at": "2025-05-10T08:51:24.000000Z",
                    "isCompleted": true
                },
                {
                    "id": 6,
                    "name": "Роутинг и базовые контроллеры",
                    "order_id": 3,
                    "type": "lecture",
                    "module_id": 37,
                    "course_id": 3,
                    "created_at": "2025-05-10T08:51:49.000000Z",
                    "updated_at": "2025-05-10T08:51:49.000000Z",
                    "isCompleted": true
                },
                {
                    "id": 7,
                    "name": "Первый API-запрос",
                    "order_id": 4,
                    "type": "task",
                    "module_id": 37,
                    "course_id": 3,
                    "created_at": "2025-05-10T08:52:10.000000Z",
                    "updated_at": "2025-05-10T08:52:10.000000Z",
                    "isCompleted": false
                }
            ]
        },
        {
            "id": 38,
            "queue": 2,
            "str_value": "Алгоритмы",
            "course_id": 3,
            "created_at": "2025-05-10T10:14:13.000000Z",
            "updated_at": "2025-05-10T10:14:13.000000Z",
            "tasks": [
                {
                    "id": 8,
                    "name": "Простая математика",
                    "order_id": 5,
                    "type": "task",
                    "module_id": 38,
                    "course_id": 3,
                    "created_at": "2025-05-10T10:14:44.000000Z",
                    "updated_at": "2025-05-10T10:14:44.000000Z",
                    "isCompleted": false
                },
                {
                    "id": 9,
                    "name": "Все о return",
                    "order_id": 6,
                    "type": "task",
                    "module_id": 38,
                    "course_id": 3,
                    "created_at": "2025-05-10T10:18:56.000000Z",
                    "updated_at": "2025-05-10T10:18:56.000000Z",
                    "isCompleted": false
                },
                {
                    "id": 10,
                    "name": "Тернарные операторы",
                    "order_id": 7,
                    "type": "task",
                    "module_id": 38,
                    "course_id": 3,
                    "created_at": "2025-05-10T10:32:03.000000Z",
                    "updated_at": "2025-05-10T10:32:03.000000Z",
                    "isCompleted": false
                },
                {
                    "id": 14,
                    "name": "Тест",
                    "order_id": 8,
                    "type": "task",
                    "module_id": 38,
                    "course_id": 3,
                    "created_at": "2025-05-10T10:36:38.000000Z",
                    "updated_at": "2025-05-10T10:36:38.000000Z",
                    "isCompleted": false
                }
            ]
        }
    ].sort((a, b) => a.queue - b.queue)
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
        console.log(nextTask);
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

.task-container h2 {
    margin-bottom: 20px;
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


</style>