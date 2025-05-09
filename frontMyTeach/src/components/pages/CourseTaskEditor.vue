<template>
    <TopBar />
    <div class="containerBody" @click.stop="showOptionAnswer = false">
        <div class="main-content" v-if="moduleTasks.length > 0, currentTask?.id, answerEditors.length > 0">
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
                            <button @click="handleShowDeleteTask">Удалить урок</button>
                            <button @click="goToNextLesson">Перейти к следующему уроку</button>
                        </div>
                    </div>
                </section>

                <section class="task-section" v-else-if="currentTask?.type == 'task'">

                    <section class="taskDescription">
                        <h3>Описание задачи</h3>
                        <div v-if="currentTask?.taskDescription && showEditorTaskDescription == false"
                            class="taskDescription-editor">
                            <p>{{ currentTask?.taskDescription.description }}</p>
                            <div class="task-action">
                                <button @click="showEditorTaskDescription = true"><img
                                        src="/src/assets/Icons/editorPencilWhite.svg" alt=""></button>
                                <button @click="deleteTaskDescription()"><img
                                        src="/src/assets/Icons/deleteIconWhite.svg" alt=""></button>
                            </div>
                        </div>

                        <div v-else class="taskDescription-creator">
                            <textarea v-model="taskDescription"></textarea>
                            <button @click="saveDescription" class="saveDescription">Сохранить</button>
                        </div>
                    </section>

                    <section class="question">
                        <h3>Вопросы</h3>
                        <div class="question-item" v-for="(item, index) in currentTask.question">
                            <div class="str-value" v-if="item.str_value">
                                <p>{{ item.str_value }}</p>
                                <div class="task-action">
                                    <button @click="editQuestion(item)"><img
                                            src="/src/assets/Icons/editorPencilWhite.svg" alt=""></button>
                                    <button @click="deleteQuestion(item)"><img
                                            src="/src/assets/Icons/deleteIconWhite.svg" alt=""></button>
                                </div>
                            </div>
                            <div class="media-value" v-if="item.media_value">
                                <img :src="item.media_value" alt="" class="media-value-img">
                                <div class="task-action">
                                    <button @click="editQuestion(item)"><img
                                            src="/src/assets/Icons/editorPencilWhite.svg" alt=""></button>
                                    <button @click="deleteQuestion(item)"><img
                                            src="/src/assets/Icons/deleteIconWhite.svg" alt=""></button>
                                </div>
                            </div>
                        </div>

                        <button @click="showQuestionEditor = true" class="add-question-btn">Добавить вопрос</button>
                    </section>

                    <section class="answer">

                        <div @click.stop="showOptionAnswer = false">
                            <div class="choise-type-cont" @click.stop>
                                <input class="choise-type" type="text" v-model="currentAnswerEditor.description"
                                    placeholder="Выберите тип" @focus="showOptionAnswer = true" readonly />
                                <div class="answer-editor-options" v-if="showOptionAnswer">
                                    <p v-for="(type, index) in answerEditors" @click="selectType(type)">{{
                                        type.description }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="answer-cont"
                            v-if="currentTask.answer?.str_value || currentTask.answer?.media_value || currentTask.answer?.json">
                            <div class="word" v-if="currentTask.answerEditor?.code == 'WORD'">
                                <p>Правильный ответ: {{ currentTask.answer.str_value }}</p>
                                <div class="task-action">
                                    <button @click="editAnswer()"><img src="/src/assets/Icons/editorPencilWhite.svg"
                                            alt=""></button>
                                    <button @click="deleteAnswer()"><img src="/src/assets/Icons/deleteIconWhite.svg"
                                            alt=""></button>
                                </div>
                            </div>

                            <div class="one_choise" v-if="currentTask.answerEditor?.code == 'ONE_CHOISE'">
                                <p>Правильный ответ: {{ currentTask.answer.str_value }}</p>
                                <div class="task-action">
                                    <button @click="editAnswer()"><img src="/src/assets/Icons/editorPencilWhite.svg"
                                            alt=""></button>
                                    <button @click="deleteAnswer()"><img src="/src/assets/Icons/deleteIconWhite.svg"
                                            alt=""></button>
                                </div>
                            </div>

                            <div class="multi_choise" v-if="currentTask.answerEditor?.code == 'MULTI_CHOISE'">
                                <div class="multi-choise-content">
                                    <p v-for="(item, index) in currentTask.answer.json">{{ index }}: {{ item ? 'Да' :
                                        'Нет' }}</p>
                                </div>
                                <div class="task-action">
                                    <button @click="editAnswer()"><img src="/src/assets/Icons/editorPencilWhite.svg"
                                            alt=""></button>
                                    <button @click="deleteAnswer()"><img src="/src/assets/Icons/deleteIconWhite.svg"
                                            alt=""></button>
                                </div>

                            </div>

                            <div class="code" v-if="currentTask.answerEditor?.code == 'CODE'">
                                <p>Результат вывода: {{ currentTask.str_value }}</p>
                                <div class="task-action">
                                    <button @click="editAnswer()"><img src="/src/assets/Icons/editorPencilWhite.svg"
                                            alt=""></button>
                                    <button @click="deleteAnswer()"><img src="/src/assets/Icons/deleteIconWhite.svg"
                                            alt=""></button>
                                </div>
                            </div>

                            <div class="matching" v-if="currentTask.answerEditor?.code == 'MATCHING'">
                                <div class="matching-content">
                                    <h3>Сопоставление</h3>
                                    <div class="column-matching">
                                        <p v-for="(leftIndex, rightIndex) in currentTask.answer.json.correct"
                                            :key="rightIndex">
                                            <strong>{{ currentTask.answer.json.right[rightIndex] }}</strong> →
                                            {{ currentTask.answer.json.left[leftIndex] }}
                                        </p>
                                    </div>
                                </div>
                                <div class="task-action">
                                    <button @click="editAnswer()">
                                        <img src="/src/assets/Icons/editorPencilWhite.svg" alt="">
                                    </button>
                                    <button @click="deleteAnswer()">
                                        <img src="/src/assets/Icons/deleteIconWhite.svg" alt="">
                                    </button>
                                </div>
                            </div>

                        </div>
                        <button v-else class="add-answer-btn" @click="handleShowAnswerCreator()">Добавить ответ</button>

                    </section>
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

    <ConfirmCourseModal v-if="showConfrimDeleteTask" :message=messageConfirm @confirm="handleConfirmDeleteTask"
        @cancel="showConfrimDeleteTask = false" />

    <ConfirmCourseModal v-if="showConfrimDeleteTaskDescription" :message=messageConfirm
        @confirm="handleConfirmDeleteTaskDescription" @cancel="showConfrimDeleteTaskDescription = false" />

    <ConfirmCourseModal v-if="showConfrimDeleteAnswer" :message=messageConfirm @confirm="handleConfirmDeleteAnswer"
        @cancel="showConfrimDeleteAnswer = false" />

    <ConfirmCourseModal v-if="showConfrimDeleteQuestion" :message=messageConfirm @confirm="handleConfirmDeleteQuestion"
        @cancel="showConfrimDeleteQuestion = false" />

    <MainTaskEditor v-if="showMainTaskEditor" :currentTask="currentTask" @confirm="handleSaveTaskHeader"
        @cancel="showMainTaskEditor = false" />

    <MainTaskEditor v-if="showMainTaskCreator" @confirm="handleSaveTaskHeader" @cancel="showMainTaskCreator = false" />

    <ModuleCreatorModal v-if="showModuleCreatorModal" @confirm="handleSaveModule"
        @cancel="showModuleCreatorModal = false" />

    <ValueEditor v-if="showValueEditor" :currentValue="currentTask.lecture[currentValue]" @confirm="handleSaveValue"
        @cancel="showValueEditor = false" />

    <AnswerEditor v-if="showAnswerEditor" :currentTask="currentTask" @confirm="handleSaveAnswer"
        @cancel="showAnswerEditor = false" />

    <ObjectTaskCreator v-if="showObjectTaskCreator" @confirm="addInTask" @cancel="showObjectTaskCreator = false" />

    <QuestionEditor v-if="showQuestionEditor" :currentQuestion="currentQuestion" @confirm="handleSaveQuestion"
        @cancel="showQuestionEditor = false" />

    <AnswerCreator v-if="showAnswerCreator" :currentTask="currentTask" @confirm="handleCreateAnswer"
        @cancel="showAnswerCreator = false" />

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
import AnswerEditor from './CourseTaskEditorLayouts/AnswerEditor.vue';
import QuestionEditor from './CourseTaskEditorLayouts/QuestionEditor.vue';
import AnswerCreator from './CourseTaskEditorLayouts/AnswerCreator.vue';

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
const showConfrimDeleteTask = ref(false);
const currentAnswerEditor = ref([]);
const showOptionAnswer = ref(false)
const showConfrimDeleteAnswer = ref(false);
const showAnswerEditor = ref(false)
const showEditorTaskDescription = ref(false)
const taskDescription = ref('');
const showConfrimDeleteTaskDescription = ref(false)
const showQuestionEditor = ref(false);
const currentQuestion = ref({});
const showConfrimDeleteQuestion = ref(false);
const showAnswerCreator = ref(false);


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
                "description": "Введите слово или число:",
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

const getTask = async () => {
    try {
        // const response = await axios.get(`${API_URL}/course/task/${route.params.id}`);
        // currentTask.value = response.data;

        currentTask.value = {
            "id": 2,
            "name": "Проверка лекции",
            "order_id": 1,
            "type": "task",
            "taskDescription": {
                "id": 2,
                "description": "Ну что готовы проверить свои знания о предыдущей лекции или рискнете еще раз пробежаться глазами?) О чем мечтал мальчик?",
                "task_id": 2,
                "created_at": null,
                "updated_at": "2025-05-08T18:48:32.000000Z"
            },
            "question": [
                {
                    "id": 2,
                    "str_value": "1. О волшебной кнопке",
                    "media_value": null,
                    "task_id": 2,
                    "json_value": null,
                    "queue": 2
                },
                {
                    "id": 3,
                    "str_value": "2. О быстром отображении",
                    "media_value": null,
                    "task_id": 2,
                    "json_value": null,
                    "queue": 3
                },
                {
                    "id": 4,
                    "str_value": "3. О красивом оформлении",
                    "media_value": null,
                    "task_id": 2,
                    "json_value": null,
                    "queue": 4
                }
            ],
            "answer": {
                "id": 10,
                "str_value": null,
                "media_value": null,
                "json": {
                    "left": [
                        "Мальчик",
                        "Laravel + vue3",
                        "Vite",
                        "20=20"
                    ],
                    "right": [
                        "Кто главный герой рассказа",
                        "О каком сборищке идет речь",
                        "О каких/ом фреймворке/ах шла речь",
                        "18=18"
                    ],
                    "correct": [
                        0,
                        2,
                        1,
                        3
                    ]
                },
                "task_id": 2,
                "queue": 1,
                "type_id": 5
            },
            "answerEditor": {
                "id": 5,
                "code": "MATCHING",
                "description": "Сопоставьте:",
                "created_at": "2025-05-01T17:05:40.000000Z",
                "updated_at": "2025-05-01T17:05:40.000000Z"
            }
        }
        if (currentTask.value.type === 'task') {
            currentAnswerEditor.value = currentTask.value?.answerEditor ?? '';
            taskDescription.value = currentTask.value?.taskDescription?.description ?? '';
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

async function handleShowDeleteTask() {
    messageConfirm.value = 'Вы уверены что хотите удалить этот курс?';
    showConfrimDeleteTask.value = true;
}

async function handleConfirmDeleteTask() {
    try {
        await axios.delete(`${API_URL}/course/task/${route.params.id}`);
        notificationRef.value.showNotification(`Успешно удалено`);
        showConfrimDeleteTask.value = false;
        setTimeout(() => {
            router.push(`/main/course/editor/${route.params.course_id}`)
        }, 2000)
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`);
    }
}

async function goToNextLesson() {
    try {
        const currentModuleIndex = moduleTasks.value.findIndex(module =>
            module.tasks.some(task => task.id === parseInt(route.params.id))
        );

        if (currentModuleIndex === -1) {
            notificationRef.value.showNotification("Текущий урок не найден");
            return;
        }

        const currentModule = moduleTasks.value[currentModuleIndex];
        const currentTaskIndex = currentModule.tasks.findIndex(task =>
            task.id === parseInt(route.params.id)
        );

        if (currentTaskIndex < currentModule.tasks.length - 1) {
            const nextTaskId = currentModule.tasks[currentTaskIndex + 1].id;
            router.push(`/task/editor/${route.params.course_id}/${nextTaskId}`);
            return;
        }

        for (let i = currentModuleIndex + 1; i < moduleTasks.value.length; i++) {
            const nextModule = moduleTasks.value[i];
            if (nextModule.tasks.length > 0) {
                const firstTaskId = nextModule.tasks[0].id;
                router.push(`/task/editor/${route.params.course_id}/${firstTaskId}`);
                return;
            }
        }

        notificationRef.value.showNotification("Следующих уроков не найдено. Создайте новый урок.");
        currentModule.value = currentModule.id;
        showMainTaskCreator.value = true;

    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error.message}`);
    }
}

async function selectType(type) {
    try {
        if ((!!currentTask.value?.answer && (currentTask.value.answer.str_value || currentTask.value.answer.media_value || currentTask.value.answer.json !== null))) {
            notificationRef.value.showNotification("Вы уже выбрали тип ответа. Чтобы изменить, удалите текущий ответ.");
            showOptionAnswer.value = false
            return;
        }
        if (currentTask.value?.answer?.id !== null) {
            const response = await axios.put(`${API_URL}/course/answer/${currentTask.value?.answer?.id || 0}`, {
                type_id: type.id,
                task_id: route.params.id
            })
            currentTask.value.answer = response.data;
        }
        currentAnswerEditor.value = type;
        showOptionAnswer.value = false
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`);
    }
}

async function editAnswer() {
    showAnswerEditor.value = true;
}

async function deleteAnswer() {
    showConfrimDeleteAnswer.value = true;
    messageConfirm.value = "Вы уверены что хотите удалить ответ?"
}

async function handleConfirmDeleteAnswer() {
    try {
        if (currentTask.value.answer?.id !== null) {
            await axios.delete(`${API_URL}/course/answer/${currentTask.value.answer.id}`);
            delete currentTask.value.answer;
            delete currentTask.value.answerEditor;
            showConfrimDeleteAnswer.value = false;
            notificationRef.value.showNotification("Ответ успешно удалён");
        } else {
            delete currentTask.value.answer;
            delete currentTask.value.answerEditor;
            showConfrimDeleteAnswer.value = false;
            notificationRef.value.showNotification("Ответ успешно удалён");
        }
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`);
    }
}

async function handleConfirmDeleteQuestion() {
    try {
        await axios.delete(`${API_URL}/course/question/${currentQuestion.value.id}`);
        const index = currentTask.value.question.findIndex(item => item.id === currentQuestion.value.id);
        if (index !== -1) {
            currentTask.value.question.splice(index, 1);
        }
        showConfrimDeleteQuestion.value = false;
        notificationRef.value.showNotification("Вопрос успешно удалён")
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`);
    }
}

async function saveDescription() {
    try {
        if (currentTask.value.taskDescription) {
            await axios.put(`${API_URL}/course/taskDescription/${currentTask.value.taskDescription.id}`, {
                description: taskDescription.value
            });
            currentTask.value.taskDescription.description = taskDescription.value;
            showEditorTaskDescription.value = false;
            notificationRef.value.showNotification("Описание задачи успешно обновлено")
        } else {
            const response = await axios.post(`${API_URL}/course/taskDescription/store/${route.params.id}`, {
                description: taskDescription.value
            });
            currentTask.value.taskDescription = response.data;
            showEditorTaskDescription.value = false;
            notificationRef.value.showNotification("Описание задачи успешно добавлено")
        }
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`);
    }

}

async function handleSaveAnswer(params) {
    try {
        if (currentTask.value?.answer?.id != null) {
            await axios.put(`${API_URL}/course/answer/${currentTask.value.answer.id}`, params);
            if (params.str_value !== null && params.str_value !== undefined) {
                currentTask.value.answer.str_value = params.str_value;
            } else if (params.json_value !== null && params.json_value !== undefined) {
                if (currentTask.value.answerEditor.code === 'MATCHING') {
                    currentTask.value.answer.json = JSON.parse(params.json_value);
                } else {
                    currentTask.value.answer.json = params.json_value;
                }
            }
            showAnswerEditor.value = false;
            notificationRef.value.showNotification("Ответ успешно изменен")
            showAnswerCreator.value = false;
        } else {
            const response = await axios.post(`${API_URL}/course/answer/store/${route.params.id}`, params);
            currentTask.value.answer = response.data;
            currentTask.value.answerEditor = currentAnswerEditor.value;
            notificationRef.value.showNotification("Ответ успешно добавлен")
            showAnswerCreator.value = false;
        }
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка : ${error}`)
    }
}

async function handleConfirmDeleteTaskDescription() {
    try {
        await axios.delete(`${API_URL}/course/taskDescription/${currentTask.value.taskDescription.id}`);
        delete currentTask.value.taskDescription;
        showConfrimDeleteTaskDescription.value = false;
        taskDescription.value = '';
        notificationRef.value.showNotification("Описание задачи успешно удалено")
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`);
    }
}

async function deleteTaskDescription() {
    showConfrimDeleteTaskDescription.value = true;
    messageConfirm.value = "Вы уверены что хотите удалить описание задачи?"
}

async function handleSaveQuestion(newQuestion) {
    try {
        if (currentQuestion.value?.id) {
            await axios.put(`${API_URL}/course/question/${currentQuestion.value.id}`, newQuestion);
            const index = currentTask.value.question.findIndex(item => item.id === currentQuestion.value.id);
            if (index !== -1) {
                currentTask.value.question[index] = newQuestion;
            }
            currentQuestion.value = null;
            showQuestionEditor.value = false;
            notificationRef.value.showNotification("Вопрос успешно обновлен")
        } else {
            const response = await axios.post(`${API_URL}/course/question/store/${route.params.id}`, newQuestion);
            currentTask.value.question.push(response.data);
            showQuestionEditor.value = false;
            currentQuestion.value = null;
            notificationRef.value.showNotification("Вопрос успешно добавлен")
        }
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`);
    }
}

async function editQuestion(item) {
    console.log(item);
    currentQuestion.value = item;
    showQuestionEditor.value = true;
}

async function deleteQuestion(item) {
    currentQuestion.value = item;
    messageConfirm.value = "Вы уверены что хотите удалить вопрос?"
    showConfrimDeleteQuestion.value = true;
}

async function handleShowAnswerCreator() {
    if (currentTask.value?.answerEditor === null) {
        notificationRef.value.showNotification("Выберите тип ответа")
        return
    } else if (currentTask.value?.answerEditor?.code === 'MULTI_CHOISE') {
        if (currentTask.value.question.length < 3) {
            notificationRef.value.showNotification("Для этого типа ответа нужно минимум 3 вопроса")
            return
        }
    } else if (currentTask.value?.answerEditor?.code === 'ONE_CHOISE') {
        if (currentTask.value.question.length < 2) {
            notificationRef.value.showNotification("Для этого типа ответа нужно минимум 2 вопроса")
            return
        }
    }

    showAnswerCreator.value = true;
}

async function handleCreateAnswer(params) {
    try {
        await axios.put(`${API_URL}/course/answer/${currentTask.value.answer.id}`, {
            str_value: params.answer.str_value,
            media_value: params.answer.media_value,
            json_value: params.answer.json,
            task_id: route.params.id,
            type_id: currentTask.value.answerEditor.id
        });
        currentTask.value.answer.str_value = params.answer.str_value;
        currentTask.value.answerEditor = currentAnswerEditor.value;
        notificationRef.value.showNotification("Ответ успешно добавлен")
        showAnswerCreator.value = false;
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error}`);
    }
}

watch(() => route.params.id, (newId) => {
    if (newId) {
        getTask();
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

.taskDescription {
    margin-top: 30px;
}

.taskDescription-creator {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.taskDescription-editor {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
}

.taskDescription-creator textarea {
    width: 100%;
    margin-top: 20px;
    background-color: #2b0045;
    padding: 10px;
    line-height: 130%;
    border-radius: 10px;
    outline: none;
    min-height: 100px;
}

.taskDescription-creator button {
    background-color: #59008E;
    padding: 20px 20px 20px 20px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    transition: background 0.3s ease-in-out;
}

.taskDescription-creator button:hover {
    background-color: #7300b5;
}

.question {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 30px;
}

.answer {
    margin-top: 30px;
    color: white;
}

.choise-type-cont {
    position: relative;
    width: 300px;
}

.choise-type {
    padding: 10px;
    border-radius: 10px;
    width: 300px;
    outline: none;
    background-color: #7300b5;
    border: none;
}

.choise-type::placeholder {
    color: rgb(202, 202, 202);
}

.answer-editor-options {
    position: absolute;
    background-color: #7300b5;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    margin-top: 10px;
}

.answer-editor-options p {
    cursor: pointer;
    padding: 15px;
    border-radius: 10px;
    transition: background 0.1s ease-in-out;
}

.answer-editor-options p:hover {
    background-color: #59008E;
}

.answer-cont {
    margin-top: 20px;
}

.word,
.one_choise,
.multi_choise,
.code,
.matching {
    display: flex;
    justify-content: space-between;
    align-items: center;
}



.add-question-btn {
    background-color: #59008E;
    padding: 20px 20px 20px 20px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    transition: background 0.3s ease-in-out;
}

.add-question-btn:hover {
    background-color: #7300b5;
}

.add-answer-btn {
    background-color: #59008E;
    padding: 20px 20px 20px 20px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    transition: background 0.3s ease-in-out;
    width: 100%;
    margin-top: 20px;
}

.add-answer-btn:hover {
    background-color: #7300b5;
}

.multi-choise-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    width: 100%;
}

.column-matching {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>