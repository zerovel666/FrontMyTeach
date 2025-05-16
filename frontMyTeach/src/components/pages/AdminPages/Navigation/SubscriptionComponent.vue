<template>
    <div class="subscriptions-admin dark-theme">
        <h1>Управление подписками</h1>

        <button class="add-subscription-btn" @click="openCreateModal">
            + Создать подписку
        </button>

        <div class="subscriptions-list" v-if="store.subscription && store.subscription.length > 0">
            <div class="subscription-card" v-for="sub in store.subscription" :key="sub.id">
                <div class="subscription-header">
                    <h2>{{ sub.name }}</h2>
                    <div class="price">{{ sub.price }} {{ sub.currency }} / {{ getIntervalName(sub.interval) }}</div>
                </div>

                <div class="subscription-details">
                    <p class="description">{{ sub.description }}</p>

                    <div class="limits">
                        <span>Макс. пользователей: {{ sub.max_users }}</span>
                        <span>Макс. курсов: {{ sub.max_course }}</span>
                    </div>

                    <div class="courses-list" v-if="sub.courses && sub.courses.length > 0">
                        <h3>Включенные курсы:</h3>
                        <ul>
                            <li v-for="course in sub.courses" :key="course.id">
                                {{ course.name }}
                                <span v-if="course.has_certificate" class="certificate-badge">Сертификат</span>
                            </li>
                        </ul>
                    </div>
                    <div v-else class="no-courses">
                        Нет включенных курсов
                    </div>
                </div>

                <div class="subscription-actions">
                    <button class="edit-btn" @click="openEditModal(sub)">
                        Редактировать
                    </button>
                    <button class="delete-btn" @click="confirmDelete(sub.id)">
                        Удалить
                    </button>
                </div>
            </div>
        </div>

        <div v-else-if="store.subscription && store.subscription.length === 0" class="no-subscriptions">
            Нет созданных подписок
        </div>

        <div v-else class="loading">
            Загрузка подписок...
        </div>

        <div class="modal" v-if="showModal" @click.self="closeModal">
            <div class="modal-content">
                <button class="close-modal" @click="closeModal">×</button>
                <h2>{{ isEditing ? 'Редактирование' : 'Создание' }} подписки</h2>

                <div class="form-group">
                    <label>Название</label>
                    <input type="text" v-model="currentSubscription.name" placeholder="Название подписки">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Цена</label>
                        <input type="number" v-model="currentSubscription.price" placeholder="Стоимость">
                    </div>

                    <div class="form-group">
                        <label>Валюта</label>
                        <select v-model="currentSubscription.currency">
                            <option value="KZT">KZT</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Интервал</label>
                        <select v-model="currentSubscription.interval">
                            <option value="month">Месяц</option>
                            <option value="year">Год</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Описание</label>
                    <textarea v-model="currentSubscription.description" placeholder="Описание подписки"></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Макс. пользователей</label>
                        <input type="number" v-model="currentSubscription.max_users" min="1">
                    </div>

                    <div class="form-group">
                        <label>Макс. курсов</label>
                        <input type="number" v-model="currentSubscription.max_course" min="1">
                    </div>
                </div>

                <div class="form-group">
                    <label>Доступные курсы</label>
                    <div class="courses-select">
                        <div class="course-option" v-for="course in allCourses" :key="course.id">
                            <label class="custom-checkbox">
                                <input type="checkbox" :id="'course-' + course.id" :value="course.id"
                                    v-model="selectedCourses" class="hidden-checkbox">
                                <span class="checkbox-icon"></span>
                                <span class="course-name">{{ course.name }}</span>
                                <span v-if="course.has_certificate" class="certificate-badge">Сертификат</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="cancel-btn" @click="closeModal">Отмена</button>
                    <button class="save-btn" @click="saveSubscription">
                        {{ isEditing ? 'Сохранить' : 'Создать' }}
                    </button>
                </div>
            </div>
        </div>

        <div class="modal" v-if="showDeleteModal" @click.self="showDeleteModal = false">
            <div class="modal-content small">
                <h3>Подтверждение удаления</h3>
                <p>Вы уверены, что хотите удалить эту подписку?</p>
                <div class="confirm-actions">
                    <button class="cancel-btn" @click="showDeleteModal = false">Отмена</button>
                    <button class="delete-confirm-btn" @click="deleteSubscription">Удалить</button>
                </div>
            </div>
        </div>
    </div>
    <Notification ref="notificationRef" />
</template>

<script setup>
import Notification from '@/components/Notification.vue';
import { API_URL } from '@/config';
import { useSubscriptionStore } from '@/stores/cache/Subscriptions';
import axios from 'axios';
import { ref, onMounted } from 'vue';

const store = useSubscriptionStore();
const allCourses = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const currentSubscription = ref({
    name: '',
    price: '',
    description: '',
    currency: 'KZT',
    interval: 'month',
    max_users: 5,
    max_course: 1,
    courses: []
});
const selectedCourses = ref([]);
const subscriptionToDelete = ref(null);
const notificationRef = ref(null);

onMounted(async () => {
    store.getSubscription();
    await store.getCourses();
    allCourses.value = store.courses
});

const getIntervalName = (interval) => {
    return interval === 'month' ? 'месяц' : 'год';
};

const openCreateModal = () => {
    currentSubscription.value = {
        name: '',
        price: '',
        description: '',
        currency: 'KZT',
        interval: 'month',
        max_users: 5,
        max_course: 1,
        courses: []
    };
    selectedCourses.value = [];
    isEditing.value = false;
    showModal.value = true;
};

const openEditModal = (subscription) => {
    currentSubscription.value = { ...subscription };
    selectedCourses.value = subscription.courses.map(c => c.id);
    isEditing.value = true;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const confirmDelete = (id) => {
    subscriptionToDelete.value = id;
    showDeleteModal.value = true;
};

const saveSubscription = async () => {
    try {
        const subscriptionData = {
            ...currentSubscription.value,
            course_ids: selectedCourses.value
        };

        let response;

        if (isEditing.value) {
            response = await axios.put(`${API_URL}/subscription/update/${currentSubscription.value.id}`,subscriptionData);
        } else {
            response = await axios.post(`${API_URL}/subscription/store`,subscriptionData);
        }

        if (isEditing.value) {
            const index = store.subscription.findIndex(s => s.id === currentSubscription.value.id);
            if (index !== -1) {
                store.subscription[index] = {
                    ...subscriptionData,
                    courses: allCourses.value.filter(c => selectedCourses.value.includes(c.id))
                };
            }
        } else {
            store.subscription.push({
                ...response.data,
                courses: allCourses.value.filter(c => selectedCourses.value.includes(c.id))
            });
        }

        closeModal();
    } catch (error) {
        notificationRef.value.showNotification(error)
    }
};

const deleteSubscription = async () => {
    try {
        await axios.delete(`${API_URL}/subscription/delete/${currentSubscription.value.id}`)
        store.subscription = store.subscription.filter(s => s.id !== subscriptionToDelete.value);
        showDeleteModal.value = false;
    } catch (error) {
        notificationRef.value.showNotification(error)
    }
};
</script>

<style scoped>
.add-subscription-btn {
    background-color: #4f007d;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    margin-bottom: 30px;
    transition: background-color 0.3s;
}

.add-subscription-btn:hover {
    background-color: #5f008d;
}

.subscriptions-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
}

.subscription-card {
    background-color: #1e1e1e;
    border-radius: 8px;
    border: 1px solid #b14788;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
}

.subscription-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(139, 41, 185, 0.3);
}

.subscription-header {
    padding: 20px;
    background-color: rgba(79, 0, 125, 0.1);
    border-bottom: 1px solid #b14788;
}

.subscription-header h2 {
    margin: 0;
    color: #b14788;
}

.price {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 10px;
    color: #8b29b9;
}

.subscription-details {
    padding: 20px;
}

.description {
    margin-bottom: 15px;
    color: #b0b0b0;
}

.limits {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
    color: #8b29b9;
    font-size: 0.9rem;
}

.courses-list h3 {
    color: #b14788;
    margin-bottom: 10px;
    font-size: 1rem;
}

.courses-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.courses-list li {
    padding: 8px 0;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.certificate-badge {
    background-color: #8b29b9;
    color: white !important;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
}

.no-courses {
    color: #666;
    font-style: italic;
}

.subscription-actions {
    display: flex;
    padding: 15px;
    background-color: rgba(79, 0, 125, 0.1);
    border-top: 1px solid #b14788;
}

.edit-btn,
.delete-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 10px;
}

.edit-btn {
    background-color: #4f007d;
    color: white;
    margin-right: 10px;
}

.edit-btn:hover {
    background-color: #5f008d;
}

.delete-btn {
    background-color: #1e1e1e;
    color: #e74c3c;
    border: 1px solid #e74c3c;
}

.delete-btn:hover {
    background-color: rgba(231, 76, 60, 0.1);
}

.no-subscriptions,
.loading {
    text-align: center;
    padding: 50px;
    color: #666;
}

/* Модальные окна */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: #1e1e1e;
    border-radius: 8px;
    padding: 25px;
    width: 90%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid #b14788;
}

.modal-content.small {
    max-width: 400px;
}

.close-modal {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #b14788;
}

.modal h2,
.modal h3 {
    color: #b14788;
    margin-top: 0;
}

/* Форма */
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #b0b0b0;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 10px;
    background-color: #2d2d2d;
    border: 1px solid #444;
    border-radius: 4px;
    color: #e0e0e0;
}

.form-group textarea {
    min-height: 80px;
    resize: vertical;
}

.form-row {
    display: flex;
    gap: 15px;
}

.form-row .form-group {
    flex: 1;
}

.courses-select {
  max-height: 300px;
  overflow-y: auto;
  background-color: #2d2d2d;
  border: 1px solid #b14788;
  border-radius: 6px;
  padding: 10px;
}

.course-option {
  padding: 12px 10px;
  border-bottom: 1px solid #333;
  transition: background-color 0.2s;
}

.course-option:last-child {
  border-bottom: none;
}

.course-option:hover {
  background-color: rgba(139, 41, 185, 0.1);
}

.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  width: 100%;
}

.hidden-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #b14788;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.2s;
  flex-shrink: 0;
}

.hidden-checkbox:checked + .checkbox-icon {
  background-color: #8b29b9;
  border-color: #8b29b9;
}

.hidden-checkbox:checked + .checkbox-icon::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.course-name {
  flex-grow: 1;
  color: #e0e0e0;
  transition: color 0.2s;
}

.hidden-checkbox:checked ~ .course-name {
  color: #b14788;
}

.certificate-badge {
  background-color: rgba(139, 41, 185, 0.3);
  color: #8b29b9;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 10px;
  border: 1px solid #8b29b9;
}

/* Стили для скроллбара */
.courses-select::-webkit-scrollbar {
  width: 6px;
}

.courses-select::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.courses-select::-webkit-scrollbar-thumb {
  background-color: #8b29b9;
  border-radius: 3px;
}

/* Кнопки модального окна */
.modal-actions,
.confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.cancel-btn,
.save-btn,
.delete-confirm-btn {
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.cancel-btn {
    background-color: #2d2d2d;
    color: #b0b0b0;
    border: 1px solid #444;
}

.cancel-btn:hover {
    background-color: #3d3d3d;
}

.save-btn {
    background-color: #4f007d;
    color: white;
    border: none;
}

.save-btn:hover {
    background-color: #5f008d;
}

.delete-confirm-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
}

.delete-confirm-btn:hover {
    background-color: #c0392b;
}

@media (max-width: 768px) {
    .subscriptions-list {
        grid-template-columns: 1fr;
    }

    .form-row {
        flex-direction: column;
        gap: 0;
    }

    .subscription-actions {
        flex-direction: column;
        gap: 10px;
    }

    .edit-btn,
    .delete-btn {
        width: 100%;
        margin-right: 0;
    }
}
</style>