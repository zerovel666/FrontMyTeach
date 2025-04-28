<template>
    <TopBar />
    <div class="containerBody">
        <div class="content" v-if="courseInfo.id">
            <div class="top-card-info">
                <div class="l-info">
                    <h1>{{ courseInfo.name }}</h1>
                    <p>{{ courseInfo.previews }}</p>
                    <p>Количество задач: {{ courseInfo.task_count }}</p>
                    <p>Учащихся: {{ courseInfo.has_course_count ?? "-" }}</p>
                    <h2>Тэги</h2>
                    <ul class="tags">
                        <li v-for="(tag, index) in courseInfo.tags" :key="index">{{ tag.tag }}</li>
                    </ul>
                    <div class="courseMainAction">
                        <button @click="showCardCourseModal = true">
                            Редактировать
                        </button>
                        <button @click="showConfrimModal = true">
                            Удалить курс
                        </button>
                    </div>
                </div>
                <div class="r-info">
                    <img :src="courseInfo.image_path" alt="" id="courseImage">
                </div>
            </div>
            <div class="obj-info">
                <div class="l-obj-info">
                    <h2>О курсе</h2>
                    <p v-for="(description, index) in courseInfo.descriptions ?? []" :key="index">
                        {{ description.str_value ?? '-' }}
                    </p>
                    <div class="modul-cont">
                        <div class="module-header">
                            <h2>Программа обучения</h2>
                            <button @click="showModuleModal = true" class="add-btn">
                                + Добавить модуль
                            </button>
                        </div>

                        <div class="line"></div>

                        <div v-for="(module, index) in courseInfo.modules ?? []" :key="index" class="module-item">
                            <div class="module-title">
                                <h4>Модуль {{ index + 1 }}: {{ module.str_value ?? '-' }}</h4>
                                <div class="module-actions">
                                    <button @click="editModule(module)" class="edit-btn">Редактировать</button>
                                    <button @click="confirmDeleteModule(module)" class="delete-btn">Удалить</button>
                                </div>
                            </div>

                            <ol>
                                <li v-for="(task, taskIndex) in module.tasks ?? []" :key="taskIndex" class="task-item">
                                    <span>{{ task.type === 'task' ? 'Задача' : 'Лекция' }}: {{ task.name ?? '-'
                                        }}</span>
                                    <div class="task-actions">
                                        <button @click="editTask(module, task)" class="small-btn"><img src="/src/assets/Icons/editorPencilWhite.svg" alt="" class="iconEdition"></button>
                                        <button @click="deleteTask(module, task)" class="small-btn"><img src="/src/assets/Icons/deleteIconWhite.svg" alt="" class="iconEdition"></button>
                                    </div>
                                </li>
                            </ol>

                            <button @click="showAddTaskModal(module)" class="add-task-btn">
                                + Добавить задачу
                            </button>

                            <div class="line"></div>
                        </div>
                </div>
            </div>
            <div class="r-obj-info">
                <div class="authorInfo">
                    <div class="bg">
                        <img :src="courseInfo.author_image_path" alt="">
                        <div class="text">
                            <h3>Автор</h3>
                            <p id="author_name">{{ courseInfo.author_name }}</p>
                        </div>
                    </div>
                </div>
                <div class="buy-cont">
                    <h2>Цена:
                        <input v-if="editingPrice" v-model="editedPrice" type="number" class="price-input">
                        <span v-else>{{ courseInfo.amount ? courseInfo.amount + 'KZT' : '-'
                        }}</span>
                        <button @click="togglePriceEditing" class="small-btn">
                            {{ editingPrice ? 'Сохранить' : 'Изменить' }}
                        </button>
                    </h2>

                    <div class="certificate-toggle">
                        <span>Выдача сертификата: {{ courseInfo.hasCertificate ? 'Да' : 'Нет' }}</span>
                        <label class="switch">
                            <input type="checkbox" v-model="courseInfo.hasCertificate" @change="updateCertificate">
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <button class="btn-buy" @click="buy()">Приобрести</button>
                    <div class="fastInfoCourse">
                        <div class="line"></div>
                        <p>Учащихся: {{ courseInfo.has_course_count ?? '-' }}</p>
                        <p>Количество задач: {{ courseInfo.task_count ?? '-' }}</p>
                        <p>Категория: {{ courseInfo.category?.category ?? '-' }}</p>
                        <p>Курс: {{ courseInfo.name ?? '-' }}</p>
                        <p>Примерное время прохождения: {{
                            courseInfo.task_count && courseInfo.modules?.length
                                ? Math.round(courseInfo.task_count * courseInfo.modules.length * 20 / 60) + 'ч'
                                : '-'
                        }}</p>
                        <p>Количество модулей: {{ courseInfo.modules?.length ?? '-' }}</p>
                        <p>Выдача сертификат: {{ courseInfo.has_certificate ? "Да" : "Нет" }}</p>

                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    <ConfirmCourseModal v-if="showConfrimModal" message="Вы уверены, что хотите удалить этот курс?"
        @confirm="handleConfirmDeleteCourse" @cancel="showConfrimModal = false" />

    <CardCourseModal :showModal="showCardCourseModal" :cardBody="cardBody" @confirm="handleConfirmEditCardCourse"
        @cancel="showCardCourseModal = false" />

    <ModuleModal v-if="showModuleModal" :module="currentModule" :isEditing="isEditingModule" @save="handleSaveModule"
        @close="showModuleModal = false" />

    <TaskModal v-if="showTaskModal" :task="currentTask" :moduleId="currentModuleId" @save="handleSaveTask"
        @close="showTaskModal = false" />

    <ConfirmCourseModal v-if="showConfirmDelete" message="Вы уверены, что хотите удалить этот модуль?"
        @confirm="handleDeleteModule" @cancel="showConfirmDelete = false" />

    <Notification ref="notificationRef" />

    <FooterBar />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import axios from 'axios';
import { API_URL } from '@/config';
import { useRoute } from 'vue-router';
import ConfirmCourseModal from './CourseEditorLayouts/ConfirmCourseModal.vue';
import CardCourseModal from './CourseEditorLayouts/CardCourseModal.vue';
import Notification from '../Notification.vue';
import TaskModal from './CourseEditorLayouts/TaskModal.vue';
import ModuleModal from './CourseEditorLayouts/ModuleModal.vue';

const courseInfo = ref([]);
const showConfrimModal = ref(false)
const showCardCourseModal = ref(false)
const cardBody = ref({});
const route = useRoute();
const notificationRef = ref(null);
const editingPrice = ref(false);
const editedPrice = ref(0);
const showModuleModal = ref(false);
const showTaskModal = ref(false);
const showConfirmDelete = ref(false);
const currentModule = ref(null);
const currentTask = ref(null);
const currentModuleId = ref(null);
const isEditingModule = ref(false);

const getCourseInfo = async () => {
    const response = await axios.get(`${API_URL}/course/${route.params.id}`);
    courseInfo.value = response.data;

    // courseInfo.value = {
    //     "id": 8,
    //     "name": "Курс по JS",
    //     "image_path": "http://localhost:8082//storage/logoCourse/laravelLogo.png",
    //     "is_active": true,
    //     "category": {
    //         "id": 1,
    //         "category": "Django",
    //         "created_at": "2025-04-26T14:55:31.000000Z",
    //         "updated_at": "2025-04-26T14:55:31.000000Z"
    //     },
    //     "has_certificate": false,
    //     "author_name": "Jovany Marvin",
    //     "author_image_path": "http://localhost:8081/storage/userAvatars/default_avatars.jpg",
    //     "status": "Отклонен",
    //     "preview": {
    //         "id": 8,
    //         "title": "Eos accusantium eius aut quos animi iusto beatae omnis ut magnam quo eum fuga."
    //     },
    //     "descriptions": [
    //         {
    //             "id": 8,
    //             "queue": 1,
    //             "str_value": "Voluptatem aut eaque impedit dignissimos deleniti tenetur et.",
    //             "preview_id": 8,
    //             "created_at": "2025-04-26T14:55:32.000000Z",
    //             "updated_at": "2025-04-26T14:55:32.000000Z"
    //         }
    //     ],
    //     "task_count": 25,
    //     "tags": [
    //         {
    //             "id": 22,
    //             "course_id": 8,
    //             "tag": "eos",
    //             "created_at": "2025-04-26T14:55:32.000000Z",
    //             "updated_at": "2025-04-26T14:55:32.000000Z"
    //         },
    //         {
    //             "id": 23,
    //             "course_id": 8,
    //             "tag": "illo",
    //             "created_at": "2025-04-26T14:55:32.000000Z",
    //             "updated_at": "2025-04-26T14:55:32.000000Z"
    //         },
    //         {
    //             "id": 24,
    //             "course_id": 8,
    //             "tag": "numquam",
    //             "created_at": "2025-04-26T14:55:32.000000Z",
    //             "updated_at": "2025-04-26T14:55:32.000000Z"
    //         }
    //     ],
    //     "modules": [
    //         {
    //             "id": 36,
    //             "queue": 1,
    //             "str_value": "Minima voluptatem in excepturi in excepturi assumenda et quod mollitia consequatur iste molestiae vel.",
    //             "course_id": 8,
    //             "created_at": "2025-04-26T14:55:32.000000Z",
    //             "updated_at": "2025-04-26T14:55:32.000000Z",
    //             "tasks": [
    //                 {
    //                     "id": 176,
    //                     "name": "harum",
    //                     "order_id": 1,
    //                     "type": "task",
    //                     "module_id": 36,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 177,
    //                     "name": "dolore",
    //                     "order_id": 2,
    //                     "type": "task",
    //                     "module_id": 36,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 178,
    //                     "name": "debitis",
    //                     "order_id": 3,
    //                     "type": "task",
    //                     "module_id": 36,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 179,
    //                     "name": "quas",
    //                     "order_id": 4,
    //                     "type": "task",
    //                     "module_id": 36,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 180,
    //                     "name": "rerum",
    //                     "order_id": 5,
    //                     "type": "task",
    //                     "module_id": 36,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 37,
    //             "queue": 2,
    //             "str_value": "Voluptatum voluptate dolorem optio sed vero dolor mollitia laboriosam quos in.",
    //             "course_id": 8,
    //             "created_at": "2025-04-26T14:55:32.000000Z",
    //             "updated_at": "2025-04-26T14:55:32.000000Z",
    //             "tasks": [
    //                 {
    //                     "id": 181,
    //                     "name": "sapiente",
    //                     "order_id": 6,
    //                     "type": "task",
    //                     "module_id": 37,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 182,
    //                     "name": "eos",
    //                     "order_id": 7,
    //                     "type": "task",
    //                     "module_id": 37,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 183,
    //                     "name": "rerum",
    //                     "order_id": 8,
    //                     "type": "task",
    //                     "module_id": 37,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 184,
    //                     "name": "ut",
    //                     "order_id": 9,
    //                     "type": "task",
    //                     "module_id": 37,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 185,
    //                     "name": "officiis",
    //                     "order_id": 10,
    //                     "type": "task",
    //                     "module_id": 37,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 38,
    //             "queue": 3,
    //             "str_value": "Aspernatur impedit sit non consequatur consequatur quia placeat praesentium hic.",
    //             "course_id": 8,
    //             "created_at": "2025-04-26T14:55:32.000000Z",
    //             "updated_at": "2025-04-26T14:55:32.000000Z",
    //             "tasks": [
    //                 {
    //                     "id": 186,
    //                     "name": "ea",
    //                     "order_id": 11,
    //                     "type": "task",
    //                     "module_id": 38,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 187,
    //                     "name": "est",
    //                     "order_id": 12,
    //                     "type": "task",
    //                     "module_id": 38,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 188,
    //                     "name": "nobis",
    //                     "order_id": 13,
    //                     "type": "task",
    //                     "module_id": 38,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 189,
    //                     "name": "dolores",
    //                     "order_id": 14,
    //                     "type": "task",
    //                     "module_id": 38,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 190,
    //                     "name": "distinctio",
    //                     "order_id": 15,
    //                     "type": "task",
    //                     "module_id": 38,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 39,
    //             "queue": 4,
    //             "str_value": "Ut voluptatem aut aperiam deleniti vitae ducimus pariatur velit.",
    //             "course_id": 8,
    //             "created_at": "2025-04-26T14:55:32.000000Z",
    //             "updated_at": "2025-04-26T14:55:32.000000Z",
    //             "tasks": [
    //                 {
    //                     "id": 191,
    //                     "name": "quisquam",
    //                     "order_id": 16,
    //                     "type": "task",
    //                     "module_id": 39,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 192,
    //                     "name": "et",
    //                     "order_id": 17,
    //                     "type": "task",
    //                     "module_id": 39,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 193,
    //                     "name": "in",
    //                     "order_id": 18,
    //                     "type": "task",
    //                     "module_id": 39,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 194,
    //                     "name": "pariatur",
    //                     "order_id": 19,
    //                     "type": "task",
    //                     "module_id": 39,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 195,
    //                     "name": "vitae",
    //                     "order_id": 20,
    //                     "type": "task",
    //                     "module_id": 39,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 40,
    //             "queue": 5,
    //             "str_value": "Nulla dolor id aspernatur modi sunt voluptatem qui nemo quae vel delectus iure commodi.",
    //             "course_id": 8,
    //             "created_at": "2025-04-26T14:55:32.000000Z",
    //             "updated_at": "2025-04-26T14:55:32.000000Z",
    //             "tasks": [
    //                 {
    //                     "id": 196,
    //                     "name": "et",
    //                     "order_id": 21,
    //                     "type": "task",
    //                     "module_id": 40,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 197,
    //                     "name": "qui",
    //                     "order_id": 22,
    //                     "type": "task",
    //                     "module_id": 40,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 198,
    //                     "name": "porro",
    //                     "order_id": 23,
    //                     "type": "task",
    //                     "module_id": 40,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 199,
    //                     "name": "blanditiis",
    //                     "order_id": 24,
    //                     "type": "task",
    //                     "module_id": 40,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 },
    //                 {
    //                     "id": 200,
    //                     "name": "sunt",
    //                     "order_id": 25,
    //                     "type": "task",
    //                     "module_id": 40,
    //                     "course_id": 8,
    //                     "created_at": "2025-04-26T14:55:32.000000Z",
    //                     "updated_at": "2025-04-26T14:55:32.000000Z"
    //                 }
    //             ]
    //         }
    //     ]
    // }
    cardBody.value = {
        name: courseInfo.value.name,
        image_path: courseInfo.value.image_path,
        category: courseInfo.value.category,
        tags: courseInfo.value.tags
    };

}

const togglePriceEditing = async () => {
    if (editingPrice.value) {
        try {
            await axios.put(`${API_URL}/course/${route.params.id}`, {
                amount: editedPrice.value
            });
            courseInfo.value.course_amount = editedPrice.value;
            notificationRef.value.showNotification('Цена успешно обновлена');
        } catch (error) {
            notificationRef.value.showNotification('Ошибка при обновлении цены');
        }
    } else {
        editedPrice.value = courseInfo.value.course_amount;
    }
    editingPrice.value = !editingPrice.value;
};

function handleConfirmDeleteCourse() {
    showConfrimModal.value = false
}

async function handleConfirmEditCardCourse(newValue) {
    console.log(newValue);

    try {
        const { image_path, ...dataToSend } = newValue;
        const response = await axios.post(`${API_URL}/course/card/${route.params.id}`, dataToSend);

        showCardCourseModal.value = false;
        courseInfo.value = response.data;
        notificationRef.value.showNotification('Успешно обновлено');
        console.log('Успешно обновлено:', response.data);

    } catch (error) {
        notificationRef.value.showNotification(`Ошибка ${error.message}`);
        console.error('Ошибка при обновлении:', error);
    }
}

const updateCertificate = async () => {
    try {
        await axios.put(`${API_URL}/course/${route.params.id}`, {
            has_certificate: courseInfo.value.hasCertificate
        });
        notificationRef.value.showNotification('Настройки сертификата обновлены');
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при обновлении сертификата');
        courseInfo.value.hasCertificate = !courseInfo.value.hasCertificate;
    }
};

const editModule = (module) => {
    currentModule.value = { ...module };
    isEditingModule.value = true;
    showModuleModal.value = true;
};

const confirmDeleteModule = (module) => {
    currentModule.value = module;
    showConfirmDelete.value = true;
};

const handleDeleteModule = async () => {
    try {
        await axios.delete(`${API_URL}/course/module/${currentModule.value.id}`);
        courseInfo.value.modules = courseInfo.value.modules.filter(
            m => m.id !== currentModule.value.id
        );
        notificationRef.value.showNotification('Модуль удален');
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при удалении модуля');
    }
    showConfirmDelete.value = false;
};

const handleSaveModule = async (moduleData) => {
    try {
        let response; 

        if (moduleData.id) {
            response = await axios.put(`${API_URL}/course/module/${moduleData.id}`, moduleData);
        } else {
            response = await axios.post(`${API_URL}/course/module/store/${route.params.id}`, moduleData);
        }

        if (isEditingModule.value) {
            const index = courseInfo.value.modules.findIndex(m => m.id === moduleData.id);
            courseInfo.value.modules.splice(index, 1, response.data);
        } else {
            courseInfo.value.modules.push(response.data);
        }

        notificationRef.value.showNotification(
            isEditingModule.value ? 'Модуль обновлен' : 'Модуль добавлен'
        );
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при сохранении модуля');
        console.log(error);
    }

    showModuleModal.value = false;
};


const showAddTaskModal = (module) => {
    currentModuleId.value = module.id;
    currentTask.value = { type: 'task', name: '', module_id: module.id };
    showTaskModal.value = true;
};

const editTask = (module, task) => {
    currentModuleId.value = module.id;
    currentTask.value = { ...task };
    showTaskModal.value = true;
};

const deleteTask = async (module, task) => {
    try {
        console.log(task);
        await axios.delete(`${API_URL}/course/task/${task.id}`);
        module.tasks = module.tasks.filter(t => t.id !== task.id);
        notificationRef.value.showNotification('Задача удалена');
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при удалении задачи');
    }
};

const handleSaveTask = async (taskData) => {
    try {
        console.log(taskData);
        let response;
        if (taskData.id) {
            response = await axios.put(`${API_URL}/course/task/${taskData.id}`, taskData);
        } else {
            response = await axios.post(`${API_URL}/course/task/store/${route.params.id}/${taskData.module_id}`, taskData);
        }

        const module = courseInfo.value.modules.find(m => m.id === currentModuleId.value);
        if (taskData.id) {
            const index = module.tasks.findIndex(t => t.id === taskData.id);
            module.tasks.splice(index, 1, response.data);
        } else {
            module.tasks.push(response.data);
        }

        notificationRef.value.showNotification(
            taskData.id ? 'Задача обновлена' : 'Задача добавлена'
        );
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при сохранении задачи');
    }

    showTaskModal.value = false;
};

onMounted(() => {
    getCourseInfo();
});
</script>

<style scoped>
.content {
    margin-top: 30px;
}

.top-card-info {
    display: flex;
    background-color: #59008E;
    height: 450px;
    padding: 30px;
    border-radius: 20px;
}

.courseMainAction {
    display: flex;
    flex-direction: column;
    max-width: 250px;
    gap: 15px;
}

.courseMainAction button {
    padding: 5px;
    border-radius: 10px;
    border: none;
    transition: transform 0.3s;
    background: #7824a9;
    border: 1px solid #bfbfbf;
    cursor: pointer;
}

.l-info {
    width: 60%;
    color: white;
    overflow-y: auto;
}

.r-info {
    width: 40%;
    display: flex;
    justify-content: right;
    align-items: center;
    position: relative;
}

#courseImage {
    width: 350px;
    height: 350px;
    object-fit: cover;
    border-radius: 100%;
}

.tags {
    padding-left: 20px;
}

.tags li {
    margin-top: 10px;
}

.obj-info {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    gap: 30px;
}

.r-obj-info {
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.authorInfo {
    background-color: #59008E;
    height: 200px;
    border-radius: 20px;
    overflow: hidden;
}

.bg {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    text-align: center;
    background-image: url('/src/assets/images/layouts/BgProfile.svg');
    padding: 30px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.authorInfo img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 100%;
    border: 2px solid white;
}

#author_name {
    color: white;
    font-size: 25px;
}

.text p {
    margin: 5px;
}

.modul-cont {
    margin-top: 50px;
}

.buy-cont {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #59008E;
    padding: 30px;
    border-radius: 20px;
}

.buy-cont h2 {
    margin: 0;
}

.btn-buy {
    cursor: pointer;
    height: 40px;
    border-radius: 15px;
    padding-left: 30px;
    padding-right: 30px;
    background-color: #7824a9;
    color: white;
    box-shadow: inset 0px 0px 7px rgb(255, 255, 255);
    border: none;
    transition: background 0.3s ease;
}

.btn-buy:hover {
    background-color: #611e88;
}

.l-obj-info {
    width: 60%;
    border: 1px solid #B14788;
    box-shadow: 0px 0px 7px #B14788;
    height: auto;
    border-radius: 20px;
    padding: 30px;
    display: flex;
    flex-direction: column;
}

.line {
    width: 100%;
    height: 2px;
    background-color: white;
    margin-bottom: 20px;
    margin-top: 20px;
}

.modules {
    margin-top: 20px;
}

.modules ol li {
    margin-top: 20px;
}

.modules ol {
    margin: 40px 0;
}

.small-btn {
    padding: 5px 10px;
    margin-left: 10px;
    border-radius: 5px;
    background: #7824a9;
    color: white;
    border: none;
    cursor: pointer;
}

.iconEdition{
    width: 20px;
}

.add-btn,
.add-task-btn {
    padding: 8px 15px;
    background: #59008E;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px 0;
}

.edit-btn {
    background: #59008E;
    color: white;
    border: none;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 10px;
}

.delete-btn {
    background: #59008E;
    color: white;
    border: none;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 10px;
}

/* Стили для переключателя сертификата */
.certificate-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 15px 0;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: #8b24c7;
}

input:checked+.slider:before {
    transform: translateX(26px);
}

.module-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.module-item {
    margin-bottom: 30px;
}

.module-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.module-actions {
    display: flex;
    gap: 15px;
    margin-left: 15px; 

}
.module-actions button{
    padding: 5px 15px;
}

.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.task-actions {
    display: flex;
    gap: 5px;
}

.task-actions button{
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 30px;
}

.price-input {
    width: 120px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
    color: black;
    outline: none;
}
</style>