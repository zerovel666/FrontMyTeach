<template>
    <TopBar />
    <div class="containerBody">
        <div class="course-editor" v-if="courseInfo.id">
            <div class="course-header">
                <div class="course-meta">
                    <h1 class="course-title">{{ courseInfo.name }}</h1>
                    <p class="course-description">{{ courseInfo.previews }}</p>
                    <div class="course-stats">
                        <span> {{ courseInfo.task_count }} задач</span>
                        <span> {{ courseInfo.has_course_count || "0" }} - учащихся</span>
                    </div>

                    <div class="tags-section">
                        <h3 class="section-title">Тэги</h3>
                        <div class="tags-grid">
                            <span v-for="(tag, index) in courseInfo.tags" :key="index" class="tag-badge">
                                {{ tag.tag }}
                            </span>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button class="btn primary" @click="showCardCourseModal = true">
                            Редактировать
                        </button>
                        <button class="btn danger" @click="showConfrimModal = true">
                            Удалить курс
                        </button>
                    </div>
                </div>

                <div class="course-visual">
                    <img :src="courseInfo.image_path" :alt="courseInfo.name" class="course-preview">
                </div>
            </div>

            <div class="course-content-grid">
                <div class="course-structure">
                    <section class="preview-section">
                        <div class="section-header with-button">
                            <h2>Превью</h2>
                            <button class="btn primary small" @click="initPreviewEdit">
                                {{ courseInfo.preview?.title ? 'Редактировать превью' : 'Добавить превью текст' }}
                            </button>
                        </div>

                        <div class="savePreview" v-if="showInputArea">
                            <button class="backButton" @click="cancelPreviewEdit">
                                <img src="/src/assets/Icons/arrowLeft.svg" alt="">
                            </button>
                            <div class="areaForm">
                                <textarea class="previewArea" v-model="textArea" :maxlength="100"></textarea>
                                <div class="counter">
                                    {{ textArea.length }}/100
                                </div>
                            </div>
                            <button class="btn primary purchase-btn" @click="savePreview(courseInfo.preview?.id)">
                                Сохранить
                            </button>
                        </div>

                        <div class="preview-block" v-if="courseInfo.preview?.title && !showInputArea">
                            <p>{{ courseInfo.preview.title }}</p>
                            <div class="description-actions">
                                <button class="btn-icon small" @click="initPreviewEdit" title="Редактировать">
                                    <img src="/src/assets/Icons/editorPencilWhite.svg" alt="">
                                </button>
                                <button class="btn-icon small danger" @click="deletePreview" title="Удалить">
                                    <img src="/src/assets/Icons/deleteIconWhite.svg" alt="">
                                </button>
                            </div>
                        </div>
                    </section>

                    <section class="about-section" v-if="courseInfo.preview">
                        <div class="section-header with-button">
                            <h2>О курсе</h2>
                            <button class="btn primary small" @click="showAddDescriptionModal = true">
                                Добавить описание
                            </button>
                        </div>

                        <div class="description-block">
                            <div v-for="(description, index) in courseInfo.descriptions || []" :key="index"
                                class="description-item">
                                <p>{{ description.str_value || '-' }}</p>
                                <div class="description-actions">
                                    <button class="btn-icon small" @click="editDescription(description)"
                                        title="Редактировать">
                                        <img src="/src/assets/Icons/editorPencilWhite.svg" alt="">
                                    </button>
                                    <button class="btn-icon small danger" @click="deleteDescription(description)"
                                        title="Удалить">
                                        <img src="/src/assets/Icons/deleteIconWhite.svg" alt="">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="modules-section" v-if="courseInfo.preview">
                        <div class="section-header with-button">
                            <h2>Программа обучения</h2>
                            <button class="btn primary small" @click="showModuleModal = true">
                                Добавить модуль
                            </button>
                        </div>

                        <div class="divider"></div>

                        <div v-for="(module, index) in courseInfo.modules || []" :key="module.id" class="module-card">
                            <div class="line"></div>
                            <div class="module-header">
                                <h3 class="module-title">
                                    Модуль {{ index + 1 }}: {{ module.str_value || '-' }}
                                </h3>
                                <div class="module-actions">
                                    <button class="btn-icon" @click="editModule(module)" title="Редактировать"><img
                                            src="/src/assets/Icons/editorPencilWhite.svg" alt="">
                                    </button>
                                    <button class="btn-icon danger" @click="confirmDeleteModule(module)"
                                        title="Удалить"><img src="/src/assets/Icons/deleteIconWhite.svg" alt="">
                                    </button>
                                </div>
                            </div>

                            <ol class="task-list">
                                <li v-for="task in module.tasks || []" :key="task.id" class="task-item">
                                    <span class="task-type">{{ task.type === 'task' ? 'Задача' : 'Лекция' }}:</span>
                                    <span class="task-name">{{ task.name || '-' }}</span>
                                    <div class="task-actions">
                                        <button class="btn-icon small" @click="editTask(module, task)"
                                            title="Редактировать"> <img src="/src/assets/Icons/editorPencilWhite.svg"
                                                alt="">
                                        </button>
                                        <button class="btn-icon small danger" @click="deleteTask(module, task)"
                                            title="Удалить"><img src="/src/assets/Icons/deleteIconWhite.svg" alt="">
                                        </button>
                                    </div>
                                </li>
                            </ol>

                            <button class="btn secondary add-task-btn" @click="showAddTaskModal(module)">
                                Добавить задачу
                            </button>

                            <div class="divider"></div>
                        </div>
                    </section>
                </div>

                <div class="course-sidebar">
                    <div class="author-card">
                        <div class="author-banner">
                            <img :src="courseInfo.author_image_path" :alt="courseInfo.author_name"
                                class="author-avatar">
                            <div class="author-info">
                                <h3 class="author-role">Автор</h3>
                                <p class="author-name">{{ courseInfo.author_name }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="purchase-card">
                        <div class="price-section">
                            <h3>Цена:</h3>
                            <div class="price-control">
                                <input v-if="editingPrice" v-model="editedPrice" type="number" class="price-input">
                                <span v-else class="price-value">
                                    {{ courseInfo.amount ? courseInfo.amount + ' ₸' : 'Бесплатно' }}
                                </span>
                                <button class="btn small" @click="togglePriceEditing">
                                    {{ editingPrice ? 'Сохранить' : 'Изменить' }}
                                </button>
                            </div>
                        </div>

                        <div class="certificate-section">
                            <span>Выдача сертификата:</span>
                            <label class="toggle-switch">
                                <input type="checkbox" v-model="courseInfo.hasCertificate" @change="updateCertificate">
                                <span class="slider"></span>
                            </label>
                            <span class="toggle-label">{{ courseInfo.hasCertificate ? 'Да' : 'Нет' }}</span>
                        </div>

                        <button class="btn primary purchase-btn" @click="buy()">
                            Приобрести курс
                        </button>

                        <div class="course-facts">
                            <div class="fact-item">
                                <span class="fact-label">Учащихся:</span>
                                <span class="fact-value">{{ courseInfo.has_course_count || '-' }}</span>
                            </div>
                            <div class="fact-item">
                                <span class="fact-label">Задач:</span>
                                <span class="fact-value">{{ courseInfo.task_count || '-' }}</span>
                            </div>
                            <div class="fact-item">
                                <span class="fact-label">Категория:</span>
                                <span class="fact-value">{{ courseInfo.category?.category || '-' }}</span>
                            </div>
                            <div class="fact-item">
                                <span class="fact-label">Время прохождения:</span>
                                <span class="fact-value">
                                    {{ courseInfo.task_count && courseInfo.modules?.length
                                        ? Math.round(courseInfo.task_count * courseInfo.modules.length * 20 / 60) + ' ч'
                                        : '-' }}
                                </span>
                            </div>
                            <div class="fact-item">
                                <span class="fact-label">Модулей:</span>
                                <span class="fact-value">{{ courseInfo.modules?.length || '-' }}</span>
                            </div>
                            <div class="fact-item">
                                <span class="fact-label">Сертификат:</span>
                                <span class="fact-value">{{ courseInfo.has_certificate ? "Да" : "Нет" }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div>
                <h1 class="warning">Данного курса не существует</h1>
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

    <DescriptionModal v-if="showDescriptionModal" :description="currentDescription" :isEditing="isEditingDescription"
        @save="handleSaveDescription" @close="showDescriptionModal = false" />

    <Notification ref="notificationRef" />
    <FooterBar />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
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
import DescriptionModal from './CourseEditorLayouts/DescriptionModal.vue';

const showInputArea = ref(false);
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
const showDescriptionModal = ref(false);
const showAddDescriptionModal = ref(false);
const currentDescription = ref(null);
const isEditingDescription = ref(false);
const textArea = ref('');

const getCourseInfo = async () => {
    const response = await axios.get(`${API_URL}/course/${route.params.id}`);
    courseInfo.value = response.data;

    cardBody.value = {
        name: courseInfo.value.name,
        image_path: courseInfo.value.image_path,
        category: courseInfo.value.category,
        tags: courseInfo.value.tags
    };

    textArea.value = courseInfo.value.preview?.title ?? ''

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
    currentModule.value = false;
    currentModuleId.value = null;
};

const handleSaveModule = async (moduleData) => {
    try {
        let response;

        if (moduleData.id) {
            response = await axios.put(`${API_URL}/course/module/${moduleData.id}`, {
                str_value: moduleData.str_value
            });
        } else {
            response = await axios.post(`${API_URL}/course/module/store/${route.params.id}`, {
                str_value: moduleData.str_value
            });
        }
        if (isEditingModule.value) {
            const module = courseInfo.value.modules?.find(m => m.id === moduleData.id);
            if (module) {
                module.str_value = response.data.str_value;
            }
        } else {
            courseInfo.value.modules.push(response.data);
        }


        currentModule.value = null;
        currentModuleId.value = null;
        isEditingModule.value = false;
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
        currentModuleId.value = null;
        currentTask.value = null;
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
            const taskIndex = module.tasks.findIndex(m => m.id === taskData.id);
            if (taskIndex !== -1) {
                module.tasks[taskIndex] = response.data; 
            }
        } else {
            if (!Array.isArray(module.tasks)) {
                module.tasks = [];
            }
            module.tasks.push(response.data);
        }

        notificationRef.value.showNotification(
            taskData.id ? 'Задача обновлена' : 'Задача добавлена'
        );

        currentModuleId.value = null;
        currentModule.value = null;
        currentTask.value = null;
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при сохранении задачи');
        console.log(error);
    }
    showTaskModal.value = false;
};


const editDescription = (description) => {
    currentDescription.value = { ...description };
    isEditingDescription.value = true;
    showDescriptionModal.value = true;
};

const deleteDescription = async (description) => {
    try {
        await axios.delete(`${API_URL}/course/description/${description.id}`);
        courseInfo.value.descriptions = courseInfo.value.descriptions.filter(
            d => d.id !== description.id
        );
        notificationRef.value.showNotification('Описание удалено');
        currentDescription.value = null;
        isEditingDescription.value = false;
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при удалении описания');
    }
};

const handleSaveDescription = async (descriptionData) => {
    try {
        let response;

        if (descriptionData.id) {
            response = await axios.put(`${API_URL}/course/description/${descriptionData.id}`, {
                str_value: descriptionData.str_value
            });

            const index = courseInfo.value.descriptions.findIndex(d => d.id === descriptionData.id);
            courseInfo.value.descriptions.splice(index, 1, descriptionData);
            console.log(courseInfo.value.descriptions)
        } else {
            response = await axios.post(`${API_URL}/course/description/store/${courseInfo.value.preview.id}`, {
                str_value: descriptionData.str_value
            });

            if (!courseInfo.value.descriptions) {
                courseInfo.value.descriptions = [];
            }
            courseInfo.value.descriptions.push(response.data);
        }
        isEditingModule.value = false;
        currentDescription.value = false;
        notificationRef.value.showNotification(
            descriptionData.id ? 'Описание обновлено' : 'Описание добавлено'
        );
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при сохранении описания');
    }

    showDescriptionModal.value = false;
};

const initPreviewEdit = () => {
    textArea.value = courseInfo.value.preview?.title || '';
    showInputArea.value = true;
};

const cancelPreviewEdit = () => {
    showInputArea.value = false;
};

const deletePreview = async () => {
    try {
        await axios.delete(`${API_URL}/course/preview/${courseInfo.value.preview.id}`);
        courseInfo.value.preview = null;
        notificationRef.value.showNotification('Превью удалено');
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при удалении превью');
    }
};

const savePreview = async (preview_id) => {
    try {
        let response;
        if (preview_id) {
            response = await axios.put(`${API_URL}/course/preview/${preview_id}`, {
                title: textArea.value
            });
            courseInfo.value.preview.title = response.data.title;
        } else {
            response = await axios.post(`${API_URL}/course/preview/store/${route.params.id}`, {
                title: textArea.value
            });
            courseInfo.value.preview = response.data
        }

        showInputArea.value = false;
        notificationRef.value.showNotification('Превью сохранено');
    } catch (error) {
        notificationRef.value.showNotification('Ошибка при сохранении превью');
    }
};

watch(showAddDescriptionModal, (val) => {
    if (val) {
        currentDescription.value = { str_value: '' };
        isEditingDescription.value = false;
        showDescriptionModal.value = true;
        showAddDescriptionModal.value = false;
    }
});

onMounted(() => {
    getCourseInfo();
});
</script>

<style scoped>
:root {
    --primary: #59008E;
    --primary-light: #7824a9;
    --secondary: #B14788;
    --dark: #1A1A1A;
    --gray: #3D3D3D;
    --light-gray: #6D6D6D;
    --border: #4D4D4D;
    --danger: #D32F2F;
    --success: #388E3C;
}

.course-editor {
    margin-top: 2rem;
    color: #E0E0E0;
}

.warning {
    text-align: center;
    margin-top: 16rem;
}

.course-header {
    display: flex;
    background: linear-gradient(135deg, #59008E 0%, #6a1b9a 100%);
    border-radius: 16px;
    padding: 2rem;
    gap: 2rem;
    margin-bottom: 2rem;
}

.course-meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
}

.course-title {
    font-size: 2rem;
    margin: 0;
    color: white;
}

.course-description {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
}

.course-stats {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
}

.tags-section {
    margin-top: 1rem;
}

.section-title {
    font-size: 2rem;
    color: white;
    margin-bottom: 10px;
}

.tags-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag-badge {
    background-color: #a200ff;
    padding: 0.3rem 0.8rem;
    border-radius: 1rem;
    font-size: 0.9rem;
    color: #ffffff;
}

.action-buttons {
    display: flex;
    gap: 1rem;
    position: absolute;
    bottom: 0;
}

.course-visual {
    width: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.course-preview {
    width: 100%;
    max-width: 350px;
    height: 350px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid var(--secondary);
}

.course-content-grid {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;
}

.course-structure {
    border: 1px solid #1A1A1A;
    box-shadow: 0 0 12px rgba(177, 71, 136, 0.3);
    border-radius: 16px;
    padding: 2rem;
    background-color: #1A1A1A;

}

.course-sidebar {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.section-header {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: white;
    display: flex;
    align-items: center;
}

.section-header h2,
h3,
h4,
h5,
p {
    margin: 0;
}

.section-header.with-button {
    justify-content: space-between;
}

.preview-section {
    margin-bottom: 2.5rem;
}

.savePreview textarea {
    color: white;
    background: #333;
    width: 100%;
    border-radius: 10px;
    min-height: 200px;
    padding: 15px;
    line-height: 1.6;
}

.areaForm {
    position: relative;
    width: 100%;
}

.areaForm textarea {
    padding-bottom: 24px;
    outline: none;
    min-height: 100px;
}

.counter {
    position: absolute;
    right: 15px;
    bottom: 15px;
    font-size: 12px;
    color: #888;
}

.backButton {
    background: #5e5e5e7f !important;
    margin-top: 0 !important;
    padding: 5px !important;
    margin-bottom: 1rem;
    border-radius: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.savePreview button {
    margin-top: 1.5rem;
    color: white;
    background: #6000de;
    border-radius: 10px;
    padding: 15px;
    border: none;
}

.preview-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1.6;
}

.preview-block p {
    margin: 0;
}

.about-section {
    margin-bottom: 2.5rem;
}

.description-block {
    line-height: 1.6;
}

.divider {
    height: 1px;
    background-color: var(--border);
    margin: 1.5rem 0;
    opacity: 0.5;
}

.module-card {
    margin-bottom: 2rem;
}

.line {
    width: 100%;
    border: 1px solid white;
    height: 1px;
    margin-bottom: 50px;
}

.module-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.module-title {
    font-size: 1.2rem;
    margin: 0;
    color: white;
}

.module-actions {
    display: flex;
    gap: 0.5rem;
}

.module-actions img {
    width: 20px;
}

.task-list {
    padding-left: 1.5rem;
    margin: 1.5rem 0;
}

.task-item {
    display: flex;
    align-items: center;
    padding: 0.7rem 0;
    border-bottom: 1px dashed var(--border);
}

.task-item:last-child {
    border-bottom: none;
}

.task-type {
    color: var(--secondary);
    margin-right: 0.5rem;
    font-weight: 500;
}

.task-name {
    flex: 1;
}

.task-actions {
    display: flex;
    gap: 0.5rem;
}

.task-actions img {
    width: 20px;
    margin: 5px;
}

.add-task-btn {
    width: 100%;
    margin-top: 1rem;
}

.author-card {
    background: linear-gradient(135deg, #59008E 0%, #6a1b9a 100%);
    border-radius: 16px;
    overflow: hidden;
}

.author-banner {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
        url('/src/assets/images/layouts/BgProfile.svg');
    background-size: cover;
    background-position: center;
}

.author-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid white;
    object-fit: cover;
}

.author-info {
    color: white;
}

.author-role {
    margin: 0 0 0.3rem 0;
    font-size: 1rem;
    opacity: 0.8;
}

.author-name {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 500;
}

.purchase-card {
    background: linear-gradient(135deg, #59008E 0%, #6a1b9a 100%);
    border-radius: 16px;
    padding: 1.5rem;
}

.price-section {
    margin-bottom: 1.5rem;
}

.price-control {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
}

.price-value {
    font-size: 1.2rem;
    font-weight: 500;
}

.price-input {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--border);
    color: white;
    padding: 0.5rem;
    border-radius: 6px;
    width: 100px;
    outline: none;
}

.price-input::-webkit-outer-spin-button,
.price-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.certificate-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.toggle-switch input {
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
    background-color: #7e00c7;
    transition: .4s;
    border-radius: 24px;
    width: 50px;
    padding: 5px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: #c561ff;
}

input:checked+.slider:before {
    transform: translateX(26px);
}

.toggle-label {
    margin-left: 0.5rem;
}

.purchase-btn {
    width: 100%;
    padding: 0.8rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
}

.course-facts {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.fact-item {
    display: flex;
    justify-content: space-between;
}

.fact-label {
    color: rgba(255, 255, 255, 0.7);
}

.fact-value {
    font-weight: 500;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn.primary {
    color: white;
    background: #9400e9;
}

.btn.primary:hover {
    background-color: #a200ff;
}

.btn.secondary {
    background-color: #6b6b6b;
    color: white;
}

.btn.secondary:hover {
    background-color: #4d4d4d;
}

.btn.danger {
    color: white;
    background: #9400e9;
}

.btn.danger:hover {
    background-color: #a200ff;
}

.btn.small {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    background-color: #9400e9;
}

.btn-icon {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.btn-icon:hover {
    background-color: #59008E;
}


.btn-icon.small {
    padding: 0.3rem;
    font-size: 0.9rem;
}

.icon-edit,
.icon-delete,
.icon-add {
    display: inline-block;
    width: 1em;
    height: 1em;
    background-size: contain;
    background-repeat: no-repeat;
}

.icon-edit {
    background-image: url('/src/assets/Icons/editorPencilWhite.svg');
}

.icon-delete {
    background-image: url('/src/assets/Icons/deleteIconWhite.svg');
}

.icon-add {
    background-image: url('/src/assets/Icons/addIconWhite.svg');
}

.description-item {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.description-item p {
    margin: 0;
    padding-right: 4rem;
}

.description-actions {
    display: flex;
    gap: 0.5rem;
    padding: 10px;
}

.description-actions button {
    padding: 10px !important;
}

.description-actions img {
    width: 20px;
}
</style>