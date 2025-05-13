<template>
    <TopBar />
    <div class="containerBody" @click.stop="showOptionAnswer = false">
        <div class="main-content" v-if="moduleTasks.length > 0, currentTask?.id, answerEditors.length > 0">
            <div class="module-content">
                <div class="goHome" @click="router.push(`/main/course/editor/${route.params.course_id}`)">
                    <h3>Перейти на главную</h3>
                </div>
                <div class="modules" v-for="(module, index) in moduleTasks" :key="index">
                    <div class="module-item">
                        <h3>{{ module.displayIndex }}. {{ module.str_value }}</h3>
                        <div class="action-module">
                            <img src="/src/assets/Icons/deleteIconWhite.svg" alt=""
                                @click="handleShowConfirmModal(module.id)">
                        </div>
                    </div>
                    <div class="tasks" v-for="(task, index) in module.tasks" :key="index">
                        <div class="module-task-item"
                            @click="router.push(`/task/editor/${route.params.course_id}/${task.id}`)">
                            <h4>{{ task.displayIndex }} {{ task.name }}</h4>
                        </div>
                    </div>
                    <button @click="handleShowMainTaskCreator(module.id)">Добавить задачу</button>
                </div>
                <button @click="handleShowModuleCreatorModal()">Добавить модуль</button>
            </div>

            <div class="task-content">
                <section class="header-section">
                    <h2>{{ currentTask?.name }}</h2>
                    <img src="/src/assets/Icons/editorIcon.svg" alt="" @click="handleShowMainTaskEditor">
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
                        <button @click="handleShowObjectTaskCreator">Добавить блок</button>
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
                                <button @click="handleShowEditorTaskHeader()"><img
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

                        <button @click="handleShowQuestionEditor()" class="add-question-btn">Добавить вопрос</button>
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
                                <p>Результат вывода: {{ currentTask.answer.str_value }}</p>
                                <div class="task-action">
                                    <button @click="editAnswer()"><img src="/src/assets/Icons/editorPencilWhite.svg"
                                            alt=""></button>
                                    <button @click="deleteAnswer()"><img src="/src/assets/Icons/deleteIconWhite.svg"
                                            alt=""></button>
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

async function handleShowMainTaskEditor() {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
    showMainTaskEditor.value = true
}

const getModuleTasks = async () => {
    try {
        const response = await axios.get(`${API_URL}/course/task/all/${route.params.course_id}`);
        const sortedModules = response.data
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
        const response = await axios.get(`${API_URL}/course/answer/editor/all`);
        answerEditors.value = response.data;

    } catch (error) {
        console.error('Ошибка при загрузке редакторов ответов:', error);
    }
};

const getTask = async () => {
    try {
        const response = await axios.get(`${API_URL}/course/task/${route.params.id}`);
        currentTask.value = response.data;

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
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`);
        showConfrimModal.value = false
    }
}

async function handleShowQuestionEditor() {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
    showQuestionEditor.value = true
}

async function handleShowMainTaskCreator(moduleId) {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
    currentModule.value = moduleId
    showMainTaskCreator.value = true
    
}

async function handleShowModuleCreatorModal() {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
    showModuleCreatorModal.value = true
}

async function handleShowObjectTaskCreator() {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
    showObjectTaskCreator.value = true
}

async function handleShowConfirmModal(moduleId) {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
    currentModule.value = moduleId
    messageConfirm.value = 'Вы точно хотите удалить этот модуль?'
    showConfrimModal.value = true
}

async function handleShowEditorTaskHeader() {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
    showEditorTaskDescription.value = true
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
            notificationRef.value.showNotification("Задача успешно обновлена")
        } else if (newTaskVal.id === '' || newTaskVal.id === null) {
            const response = await axios.post(`${API_URL}/course/task/store/${route.params.course_id}/${currentModule.value}`, newTaskVal);
            const moduleIndex = moduleTasks.value.findIndex(item => item.id === currentModule.value)
            moduleTasks.value[moduleIndex].tasks.push(response.data)
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

        showMainTaskCreator.value = false;
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`)
    }
}

async function editValue(item) {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
    currentValue.value = item;
    showValueEditor.value = true
}

async function deleteValue(item) {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
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

                notificationRef.value.showNotification("Изображение успешно обновлено");

                showValueEditor.value = false;
                currentValue.value = null;
            }

        } else {
            if (newItem.str_value) {
                const response = await axios.post(`${API_URL}/course/lecture/store/${route.params.id}`, newItem);
                currentTask.value.lecture[currentValue.value] = response.data;
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

                currentTask.value.lecture[currentValue.value] = response.data;
                notificationRef.value.showNotification("Изображение успешно добавлено");
                showValueEditor.value = false;
                currentValue.value = null;
            }
        }
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`);
    }
}

async function handleConfirmDeleteValue() {
    try {
        if (currentTask.value.lecture[currentValue.value]?.id !== null && currentTask.value.lecture[currentValue.value]?.id !== undefined) {
            await axios.delete(`${API_URL}/course/lecture/${currentTask.value.lecture[currentValue.value].id}`);
        }
        currentTask.value.lecture.splice(currentValue.value, 1);
        currentValue.value = null;
        showConfrimDeleteValue.value = false;
        notificationRef.value.showNotification("Блок успешно удалён");
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`)
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
    if (type == 'TEXT') {
        currentTask.value.lecture.push({
            media_value: null,
            str_value: "Введите текст",
            task_id: currentTask.value.id
        })
        showObjectTaskCreator.value = false
    } else if (type == 'MEDIA') {
        currentTask.value.lecture.push({
            media_value: "/src/assets/images/SelectImage.png",
            str_value: null,
            task_id: currentTask.value.id
        })
        showObjectTaskCreator.value = false
    }
}

async function handleShowDeleteTask() {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
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
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`);
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
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`);
    }
}

async function selectType(type) {
    try {
        console.log(currentTask.value.course_status)
        if (currentTask.value.course_status !== 'В работе') {
            notificationRef.value.showNotification('Курс на модерации');
            showOptionAnswer.value = false;
            return;
        }
        const answer = currentTask.value?.answer;

        const hasId = answer?.id != null;
        const hasAnyValue = answer?.str_value != null || answer?.json != null || answer?.media_value != null;

        if (hasId && hasAnyValue) {
            notificationRef.value.showNotification("Вы уже выбрали тип ответа. Чтобы изменить, удалите текущий ответ.");
            showOptionAnswer.value = false;
            return;
        }

        let id = answer?.id || 0;

        const response = await axios.put(`${API_URL}/course/answer/${id}`, {
            type_id: type.id,
            task_id: route.params.id
        });
        currentTask.value.answer = response.data;

        currentTask.value.answerEditor = type;
        currentAnswerEditor.value = type;
        showOptionAnswer.value = false;
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`);
    }
}


async function editAnswer() {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
    showAnswerEditor.value = true;
}

async function deleteAnswer() {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
    showConfrimDeleteAnswer.value = true;
    messageConfirm.value = "Вы уверены что хотите удалить ответ?"
}

async function handleConfirmDeleteAnswer() {
    try {
        if (currentTask.value.answer?.id !== null) {
            await axios.delete(`${API_URL}/course/answer/${currentTask.value.answer.id}`);
            getTask();
            showConfrimDeleteAnswer.value = false;
            notificationRef.value.showNotification("Ответ успешно удалён");
        } else {
            getTask();
            showConfrimDeleteAnswer.value = false;
            notificationRef.value.showNotification("Ответ успешно удалён");
        }
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`);
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
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`);
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
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`);
    }

}

async function handleSaveAnswer(params) {
    try {
        console.log(currentTask.value);
        if (currentTask.value?.answer?.id != null) {
            const response = await axios.put(`${API_URL}/course/answer/${currentTask.value.answer.id}`, params);
            if (params.str_value !== null && params.str_value !== undefined) {
                currentTask.value.answer.str_value = params.str_value;
            } else if (params.json_value !== null && params.json_value !== undefined) {
                    currentTask.value.answer.json = params.json_value;
            }
            console.log(currentTask.value);
            console.log(response.data);
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
        notificationRef.value.showNotification(`Ошибка : ${error?.response?.data?.error || "Неизвестная ошибка"}`)
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
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`);
    }
}

async function deleteTaskDescription() {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
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
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`);
    }
}

async function editQuestion(item) {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
    currentQuestion.value = item;
    showQuestionEditor.value = true;
}

async function deleteQuestion(item) {
    if (currentTask.value.course_status !== 'В работе') {
        notificationRef.value.showNotification('Курс на модерации');
        return;
    }
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
        const response = await axios.put(`${API_URL}/course/answer/${currentTask.value.answer.id}`, {
            str_value: params.answer.str_value,
            media_value: params.answer.media_value,
            json_value: params.answer.json,
            task_id: route.params.id,
            type_id: currentTask.value.answerEditor.id
        });
        if (params.answer.str_value !== null && params.answer.str_value !== undefined) {
            currentTask.value.answer.str_value = params.answer.str_value;
        } else if (params.answer.json !== null && params.answer.json !== undefined) {
                currentTask.value.answer.json = JSON.parse(params.answer.json);
        }

        currentTask.value.answerEditor = currentAnswerEditor.value;
        notificationRef.value.showNotification("Ответ успешно добавлен")
        showAnswerCreator.value = false;
    } catch (error) {
        notificationRef.value.showNotification(`Ошибка: ${error?.response?.data?.error || "Неизвестная ошибка"}`);
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

.goHome {
    background-color: #5f0096;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
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
.code {
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

</style>