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
                </div>
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
                                <button @click="editValue(item)"><img src="/src/assets/Icons/editorPencilWhite.svg"
                                        alt=""></button>
                                <button @click="deleteValue(item)"><img src="/src/assets/Icons/deleteIconWhite.svg"
                                        alt=""></button>
                            </div>
                        </div>
                        <div class="media-value" v-if="item.media_value">
                            <img :src="item.media_value" alt="" class="media-value-img">
                            <div class="task-action">
                                <button @click="editValue(item)"><img src="/src/assets/Icons/editorPencilWhite.svg"
                                        alt=""></button>
                                <button @click="deleteValue(item)"><img src="/src/assets/Icons/deleteIconWhite.svg"
                                        alt=""></button>
                            </div>
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

    <ValueEditor v-if="showValueEditor" :currentValue="currentValue" @confirm="handleSaveValue"
        @cancel="showValueEditor = false" />

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
                        "name": "История мальчишки",
                        "order_id": 1,
                        "type": "lecture",
                        "module_id": 1,
                        "course_id": 2,
                        "created_at": "2025-05-01T17:19:46.000000Z",
                        "updated_at": "2025-05-01T17:19:46.000000Z"
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
            }
        ];
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
            "name": "История мальчишки",
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
                    "media_value": "http://localhost:8082/storage/lectureMediaValue/OUe5ia4BLimmWw8DtkwGBccWCKs9ICbQEizjCXZz.jpg",
                    "task_id": 1,
                    "queue": 2
                },
                {
                    "id": 3,
                    "str_value": "Новый текст лекции",
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
        await axios.delete(`${API_URL}/course/module/${currentModule}`)
        notificationRef.value.showNotification("Модуль успешно удален");
        showConfrimModal.value = false
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`);
        showConfrimModal.value = false
    }
}

async function handleSaveTaskHeader(newTaskVal) {
    try {
        const response = await axios.put(`${API_URL}/course/task/${route.params.id}`, newTaskVal)
        currentTask.value = response.data
        showMainTaskEditor.value = false;
        notificationRef.value.showNotification("Задача успешно обновлена")
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
        const lectureIndex = currentTask.value.lecture.findIndex(item => item.id === currentValue.value.id);
        if (lectureIndex !== -1) {
            if (newItem.str_value) {
                await axios.put(`${API_URL}/course/lecture/${currentTask.value.lecture[lectureIndex].id}`, newItem);
                currentTask.value.lecture[lectureIndex] = {
                    ...currentTask.value.lecture[lectureIndex],
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
                    `${API_URL}/course/lecture/mediaValue/update/${currentTask.value.lecture[lectureIndex].id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                currentTask.value.lecture[lectureIndex] = {
                    ...currentTask.value.lecture[lectureIndex],
                    media_value: response.data.imageUrl || newItem.media_value 
                };

                console.log('Обновленные данные:', currentTask.value);
                notificationRef.value.showNotification("Изображение успешно обновлено");

                showValueEditor.value = false;
                currentValue.value = null;
            }
        } else {
            notificationRef.value.showNotification("Лекция не найдена");
        }
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error.message}`);
    }
}



async function handleConfirmDeleteValue() {
    try {
        await axios.delete(`${API_URL}/course/lecture/${currentValue.id}`)
        currentTask.value.lecture = currentTask.value.lecture.filter(
            item => item.id !== Number(currentValue.value.id)
        );
        currentValue.value = null;
        showConfrimDeleteValue.value = false;

    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`)
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
    gap: 20px;
    background-color: #470070;
    padding: 20px;
    border-radius: 10px;
    overflow: auto;
    max-height: 700px;
}

.modules {
    display: flex;
    flex-direction: column;
    gap: 10px;
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
</style>