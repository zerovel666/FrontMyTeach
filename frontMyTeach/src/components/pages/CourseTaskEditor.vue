<template>
    <TopBar />
    <div class="containerBody">
        <div class="main-content">
            <div class="module-content">
                <div class="modules" v-for="(module, index) in moduleTasks" :key="index">
                    <div class="module-item">
                        <h3>{{ module.displayIndex }}. {{ module.str_value }}</h3>
                        <div class="action-module">
                            <img src="/src/assets/Icons/deleteIconWhite.svg" alt=""
                                @click="showConfrimModal = true; currentModule = module.id; messageConfirm = 'Вы точно хотите удалить этот модуль?'">
                        </div>
                    </div>
                    <div class="tasks" v-for="(task, index) in module.tasks" :key="index">
                        <div class="module-task-item"
                            @click="router.push(`/task/editor/${route.params.course_id}/${task.id}`)">
                            <h4>{{ task.displayIndex }} {{ task.name }}</h4>
                        </div>
                    </div>
                    <button @click="showMainTaskCreator = true; currentModule = module.id">Добавить задачу</button>
                </div>
                <button @click="showModuleCreatorModal = true">Добавить модуль</button>
            </div>

            <div class="task-content">
                <section class="header-section">
                    <h2>{{ currentTask?.name }}</h2>
                    <img src="/src/assets/Icons/editorIcon.svg" alt="" @click="showMainTaskEditor = true">
                </section>
                <section class="lecture-section" v-if="currentTask?.type == 'lecture'">
                    <div class="lecture-item" v-for="(item, index) in currentTask?.lecture">
                        <div class="str-value" v-if="item.str_value">
                            <p>{{ item.str_value }}</p>
                            <div class="task-action">
                                <button @click="editValue(index)"><img src="/src/assets/Icons/editorPencilWhite.svg"
                                        alt=""></button>
                                <button @click="deleteValue(index)"><img src="/src/assets/Icons/deleteIconWhite.svg"
                                        alt=""></button>
                            </div>
                        </div>
                        <div class="media-value" v-if="item.media_value">
                            <img :src="item.media_value" alt="" class="media-value-img">
                            <div class="task-action">
                                <button @click="editValue(index)"><img src="/src/assets/Icons/editorPencilWhite.svg"
                                        alt=""></button>
                                <button @click="deleteValue(index)"><img src="/src/assets/Icons/deleteIconWhite.svg"
                                        alt=""></button>
                            </div>
                        </div>
                    </div>
                    <div class="action">
                        <button @click="showObjectTaskCreator = true">Добавить блок</button>
                        <div class="action-page">
                            <button>Удалить урок</button>
                            <button>Перейти к следующему уроку</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
    <FooterBar />

    <Notification ref="notificationRef" />

    <ConfirmCourseModal v-if="showConfrimModal" :message=messageConfirm @confirm="handleConfirmDeleteModule"
        @cancel="showConfrimModal = false" />

    <ConfirmCourseModal v-if="showConfrimDeleteValue" :message=messageConfirm @confirm="handleConfirmDeleteValue"
        @cancel="showConfrimDeleteValue = false" />

    <MainTaskEditor v-if="showMainTaskEditor" :currentTask="currentTask" @confirm="handleSaveTaskHeader"
        @cancel="showMainTaskEditor = false" />

    <MainTaskEditor v-if="showMainTaskCreator" @confirm="handleSaveTaskHeader" @cancel="showMainTaskCreator = false" />

    <ModuleCreatorModal v-if="showModuleCreatorModal" @confirm="handleSaveModule"
        @cancel="showModuleCreatorModal = false" />

    <ValueEditor v-if="showValueEditor" :currentValue="currentTask.lecture[currentValue]" @confirm="handleSaveValue"
        @cancel="showValueEditor = false" />

    <ObjectTaskCreator v-if="showObjectTaskCreator" @confirm="addInTask" @cancel="showObjectTaskCreator = false" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/config';
import TopBar from '../layouts/TopBar.vue';
import FooterBar from '../layouts/FooterBar.vue';
import ConfirmCourseModal from './CourseEditorLayouts/ConfirmCourseModal.vue';
import Notification from '../Notification.vue';
import MainTaskEditor from './CourseTaskEditorLayouts/MainTaskEditor.vue';
import ValueEditor from './CourseTaskEditorLayouts/ValueEditor.vue';
import ModuleCreatorModal from './CourseTaskEditorLayouts/ModuleCreatorModal.vue';
import ObjectTaskCreator from './CourseTaskEditorLayouts/ObjectTaskCreator.vue';

const route = useRoute();
const router = useRouter();
const moduleTasks = ref([]);
const answerEditors = ref([]);
const currentTask = ref([]);
const showConfrimModal = ref(false);
const currentModule = ref(0);
const notificationRef = ref(null);
const showMainTaskEditor = ref(false);
const showValueEditor = ref(false);
const currentValue = ref(null);
const showConfrimDeleteValue = ref(false);
const messageConfirm = ref('');
const showMainTaskCreator = ref(false)
const showModuleCreatorModal = ref(false)
const showObjectTaskCreator = ref(false)

const getModuleTasks = async () => {
    try {
        // const response = await axios.get(`${API_URL}/course/task/all/${route.params.course_id}`);
        const response = [
            {
                "id": 1,
                "queue": 1,
                "str_value": "Начало начал",
                "course_id": 2,
                "created_at": "2025-05-01T17:19:32.000000Z",
                "updated_at": "2025-05-01T17:19:32.000000Z",
                "tasks": [
                    {
                        "id": 1,
                        "name": "История мальчишек",
                        "order_id": 1,
                        "type": "lecture",
                        "module_id": 1,
                        "course_id": 2,
                        "created_at": "2025-05-01T17:19:46.000000Z",
                        "updated_at": "2025-05-06T07:20:21.000000Z"
                    },
                    {
                        "id": 2,
                        "name": "Проверка лекции",
                        "order_id": 2,
                        "type": "task",
                        "module_id": 1,
                        "course_id": 2,
                        "created_at": "2025-05-01T17:25:50.000000Z",
                        "updated_at": "2025-05-01T17:25:39.000000Z"
                    }
                ]
            },
            {
                "id": 2,
                "queue": 2,
                "str_value": "Введение",
                "course_id": 2,
                "created_at": "2025-05-01T17:19:32.000000Z",
                "updated_at": "2025-05-01T17:19:32.000000Z",
                "tasks": [
                    {
                        "id": 3,
                        "name": "Laravel теория",
                        "order_id": 1,
                        "type": "lecture",
                        "module_id": 2,
                        "course_id": 2,
                        "created_at": "2025-05-01T17:19:46.000000Z",
                        "updated_at": "2025-05-01T17:19:46.000000Z"
                    }
                ]
            },
            {
                "id": 3,
                "queue": 3,
                "str_value": "Колекции",
                "course_id": 2,
                "created_at": "2025-05-05T13:42:18.000000Z",
                "updated_at": "2025-05-05T13:42:18.000000Z",
                "tasks": []
            },
            {
                "id": 36,
                "queue": 4,
                "str_value": "ORM",
                "course_id": 2,
                "created_at": "2025-05-07T09:54:57.000000Z",
                "updated_at": "2025-05-07T09:54:57.000000Z",
                "tasks": []
            }
        ]
        const sortedModules = response
            .sort((a, b) => a.queue - b.queue)
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

        moduleTasks.value = sortedModules;
    } catch (error) {
        console.error('Ошибка при загрузке модулей:', error);
    }
};

const getAnswerEditors = async () => {
    try {
        // const response = await axios.get(`${API_URL}/course/answer/editor/all`);
        // answerEditors.value = response.data;
        answerEditors.value = [
            {
                "id": 1,
                "code": "WORD",
                "description": "Напишите слово:",
                "created_at": "2025-05-01T17:05:40.000000Z",
                "updated_at": "2025-05-01T17:05:40.000000Z"
            },
            {
                "id": 2,
                "code": "ONE_CHOISE",
                "description": "Выберите одно:",
                "created_at": "2025-05-01T17:05:40.000000Z",
                "updated_at": "2025-05-01T17:05:40.000000Z"
            },
            {
                "id": 3,
                "code": "MULTI_CHOISE:",
                "description": "Выберите одно или несколько:",
                "created_at": "2025-05-01T17:05:40.000000Z",
                "updated_at": "2025-05-01T17:05:40.000000Z"
            },
            {
                "id": 4,
                "code": "CODE",
                "description": "Напишите программу..",
                "created_at": "2025-05-01T17:05:40.000000Z",
                "updated_at": "2025-05-01T17:05:40.000000Z"
            },
            {
                "id": 5,
                "code": "MATCHING",
                "description": "Сопоставьте:",
                "created_at": "2025-05-01T17:05:40.000000Z",
                "updated_at": "2025-05-01T17:05:40.000000Z"
            }
        ]
    } catch (error) {
        console.error('Ошибка при загрузке редакторов ответов:', error);
    }
};

const getTask = async (taskId) => {
    try {
        // const response = await axios.get(`${API_URL}/course/task/${taskId}`);
        // currentTask.value = response.data;
        currentTask.value = {
            "id": 1,
            "name": "История мальчишек",
            "order_id": 1,
            "type": "lecture",
            "lecture": [
                {
                    "id": 1,
                    "str_value": "Жил-был мальчишка, который устал обновлять страницы при каждом клике. Он любил Laravel за мощный бэкенд, но мечтал о волшебной кнопке без перезагрузки. Тогда он нашёл Vue 3 — лёгкий и быстрый фреймворк. Он подружил их: Laravel отдавал данные через API, а Vue 3 красиво показывал их на странице. Так родилась их дружба — и проект, где всё было быстро, красиво и без лишней мороки.",
                    "media_value": null,
                    "task_id": 1,
                    "queue": 1
                },
                {
                    "id": 2,
                    "str_value": null,
                    "media_value": "http://localhost:8082/storage/lectureMediaValue/E2VAjIYN00284WjAofy18HbhdBJ0OP7jTchzxOlH.png",
                    "task_id": 1,
                    "queue": 2
                },
                {
                    "id": 3,
                    "str_value": "Vite — современный сборщик фронтенда\n\nVite — это инструмент сборки, созданный для быстрой и удобной разработки современных веб-приложений. Его разработал автор Vue.js — Эван Ю. В отличие от традиционных сборщиков, таких как Webpack, Vite использует нативные возможности браузера и загружает модули по запросу. Это обеспечивает практически мгновенный запуск проекта и быстрые обновления при разработке.\n\nГлавное преимущество Vite — это мгновенная перезагрузка благодаря использованию ES-модулей и модуля Hot Module Replacement (HMR). Это делает разработку особенно комфортной: любые изменения отображаются на экране без полной перезагрузки страницы.\n\nVite имеет два режима: режим разработки и режим продакшена. В режиме разработки он не делает сборку, а просто отдает файлы через сервер, используя esbuild для трансформации. А в продакшене — использует Rollup для оптимизации и упаковки.\n\nОн поддерживает Vue, React, Preact, Svelte, TypeScript, JSX, CSS-модули и многое другое “из коробки”. Конфигурация проста, но при этом гибкая — её можно расширять с помощью плагинов.\n\nVite — отличный выбор для проектов, где важны скорость запуска и современная архитектура. Это будущее фронтенд-разработки.",
                    "media_value": null,
                    "task_id": 1,
                    "queue": 3
                }
            ]
        }
    } catch (error) {
        console.error('Ошибка при загрузке задачи:', error);
    }
};

async function handleConfirmDeleteModule() {
    try {
        await axios.delete(`${API_URL}/course/module/${currentModule.value.id}`)
        notificationRef.value.showNotification("Модуль успешно удален");
        const index = moduleTasks.value.findIndex(item => item.id === currentModule.value)
        if (index !== -1) {
            moduleTasks.value.splice(index, 1)
        }
        showConfrimModal.value = false
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`);
        showConfrimModal.value = false
    }
}

async function handleSaveTaskHeader(newTaskVal) {
    try {
        if (newTaskVal.id) {
            await axios.put(`${API_URL}/course/task/${route.params.id}`, newTaskVal)
            currentTask.value.name = newTaskVal.name;
            currentTask.value.type = newTaskVal.type;
            const taskToUpdate = moduleTasks.value.flatMap(m => m.tasks).find(task => task.id === newTaskVal.id);
            if (taskToUpdate) {
                taskToUpdate.name = newTaskVal.name;
                taskToUpdate.type = newTaskVal.type;
            }
            showMainTaskEditor.value = false;
            notificationRef.value.showNotification("Задача успешно обновлена")
        } else if (newTaskVal.id === '' || newTaskVal.id === null) {
            await axios.post(`${API_URL}/course/task/store/${route.params.course_id}/${currentModule.value}`, newTaskVal);
            const moduleIndex = moduleTasks.value.findIndex(item => item.id === currentModule.value)
            moduleTasks.value[moduleIndex].tasks.push(newTaskVal)
            const sortedModules = moduleTasks.value
                .sort((a, b) => a.queue - b.queue)
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

            moduleTasks.value = sortedModules
        }

    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`)
    }
}

async function editValue(item) {
    currentValue.value = item;
    showValueEditor.value = true
}

async function deleteValue(item) {
    currentValue.value = item;
    messageConfirm.value = 'Вы точно хотите удалить этот объект лекции?'
    showConfrimDeleteValue.value = true;
}

async function handleSaveValue(newItem) {
    try {
        if (currentTask.value.lecture[currentValue.value]?.id != null) {
            if (newItem.str_value) {
                await axios.put(`${API_URL}/course/lecture/${currentTask.value.lecture[currentValue.value].id}`, newItem);
                currentTask.value.lecture[currentValue.value] = {
                    ...currentTask.value.lecture[currentValue.value],
                    str_value: newItem.str_value
                };
                console.log(currentTask.value);
                notificationRef.value.showNotification("Лекция успешно обновлена");

                showValueEditor.value = false;
                currentValue.value = null;
            } else if (newItem.media_value) {
                const formData = new FormData();

                let imageFile;
                if (newItem.media_value.startsWith('data:image')) {
                    const blob = await fetch(newItem.media_value).then(r => r.blob());
                    imageFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                } else {
                    imageFile = newItem.media_value;
                }

                formData.append('image_path', imageFile);

                const response = await axios.post(
                    `${API_URL}/course/lecture/mediaValue/update/${currentTask.value.lecture[currentValue.value].id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                currentTask.value.lecture[currentValue.value] = {
                    ...currentTask.value.lecture[currentValue.value],
                    media_value: response.data.imageUrl || newItem.media_value
                };

                console.log('Обновленные данные:', currentTask.value);
                notificationRef.value.showNotification("Изображение успешно обновлено");

                showValueEditor.value = false;
                currentValue.value = null;
            }

        } else {
            if (newItem.str_value) {
                const response = await axios.post(`${API_URL}/course/lecture/store/${route.params.id}`, newItem);
                currentTask.value.lecture.push(response.data);
                notificationRef.value.showNotification("Лекция успешно добавлена");
                showValueEditor.value = false;
                currentValue.value = null;
            } else if (newItem.media_value) {
                const formData = new FormData();

                let imageFile;
                if (newItem.media_value.startsWith('data:image')) {
                    const blob = await fetch(newItem.media_value).then(r => r.blob());
                    imageFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                } else {
                    imageFile = newItem.media_value;
                }

                formData.append('image_path', imageFile);

                const response = await axios.post(
                    `${API_URL}/course/lecture/mediaValue/store/${route.params.id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                currentTask.value.lecture.push(response.data);
                notificationRef.value.showNotification("Изображение успешно добавлено");
                showValueEditor.value = false;
                currentValue.value = null;
            }
        }
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error.message}`);
    }
}

async function handleConfirmDeleteValue() {
    try {
        if (currentTask.value.lecture[currentValue.value]?.id !== null) {
            await axios.delete(`${API_URL}/course/lecture/${currentTask.value.lecture[currentValue.value].id}`)
        }
        currentTask.value.lecture.splice(currentValue.value, 1);
        currentValue.value = null;
        showConfrimDeleteValue.value = false;
        notificationRef.value.showNotification("Блок успешно удалён");
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`)
    }
}

async function handleSaveModule(name) {
    const response = await axios.post(`${API_URL}/course/module/store/${route.params.course_id}`, {
        str_value: name
    });

    moduleTasks.value.push({
        id: response.data.id,
        queue: response.data.queue,
        str_value: response.data.str_value,
        course_id: response.data.course_id,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        tasks: []
    })

    const sortedModules = moduleTasks.value
        .sort((a, b) => a.queue - b.queue)
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

    moduleTasks.value = sortedModules;

    showModuleCreatorModal.value = false
}

async function addInTask(type) {
    if (type = 'TEXT') {
        currentTask.value.lecture.push({
            media_value: null,
            str_value: "Введите текст",
            task_id: currentTask.value.id
        })
        showObjectTaskCreator.value = false
    }
}

watch(() => route.params.id, (newId) => {
    if (newId) {
        getModuleTasks();
        if (currentTask.value) {
            getTask(currentTask.value.id);
        }
    }
});

onMounted(() => {
    getModuleTasks();
    getAnswerEditors();
    getTask(route.params.id)
});
</script>

<style scoped>
.main-content {
    display: flex;
    justify-content: space-around;
    gap: 30px;
    width: 100%;
    margin-top: 70px;
}

.main-content p,
h1,
h2,
h3,
h4,
h5,
h6 {
    margin: 0;
}

.module-content {
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 40px;
    background-color: #470070;
    padding: 20px;
    border-radius: 10px;
    overflow: auto;
}

.module-content button {
    background-color: #59008E;
    padding: 20px 20px 20px 20px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
}

.module-content button:hover {
    background-color: #7300b5;
}

.modules {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.modules button {
    background-color: #59008E;
    padding: 20px 20px 20px 20px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
}

.modules button:hover {
    background-color: #7300b5;
}

.module-item {
    background-color: #5f0096;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.action-module {
    display: flex;
    gap: 15px;
    border-radius: 100%;
    border: 1px solid #B14788;
    transition: background 0.2s ease-in-out;

}

.action-module img {
    width: 30px;
    padding: 8px;
    cursor: pointer;
}

.action-module:hover {
    background: #b14788;
}

.tasks {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.module-task-item {
    background-color: #59008E;
    padding: 20px 20px 20px 35px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.module-task-item img {
    width: 5px;
}

.module-task-item:hover {
    background-color: #7300b5;
}



.task-content {
    width: 70%;
    background-color: #470070;
    padding: 30px;
    border-radius: 10px;
}

.header-section {
    display: flex;
    align-items: center;
    gap: 20px;
}

.header-section img {
    width: 40px;
    cursor: pointer;
    border-radius: 100%;
    transition: box-shadow 0.2s ease-in-out;
}

.header-section img:hover {
    box-shadow: 0 0 20px #B14788;
}

.lecture-section {
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin: 40px 0;
}

.task-action {
    display: flex;
    gap: 20px;
}

.task-action button {
    width: 40px !important;
    height: 40px !important;
    background: none !important;
    border: 1px solid #B14788 !important;
    border-radius: 100% !important;
    cursor: pointer !important;
    transition: box-shadow 0.2s ease-in-out !important;
}

.task-action button:hover {
    box-shadow: 0 0 20px #B14788 !important;
}

.task-action img {
    width: 25px !important;
    height: 25px !important;
    padding: 5px !important;
    max-width: 100% !important;
}

.str-value {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
}

.str-value p {
    line-height: 130%;
}

.media-value {
    display: flex;
    gap: 30px;
    justify-content: space-between;
    align-items: center;
}

.media-value-img {
    max-width: 80%;
    border-radius: 10px;
}

.action {
    text-align: center;
}

.action-page {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.action button {
    background: none;
    border: 1px solid #B14788;
    cursor: pointer;
    transition: box-shadow 0.2s ease-in-out;
    padding: 10px 40px;
    border-radius: 10px;
    margin-top: 40px;
}

.action button:hover {
    box-shadow: 0 0 20px #B14788 !important;
}
</style>