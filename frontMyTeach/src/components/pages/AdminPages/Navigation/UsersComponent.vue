<template>
    <div class="users-admin">
        <h1>Пользователи</h1>

        <div class="search-container">
            <input v-model="searchQuery" type="text" placeholder="Поиск по имени, email или роли..."
                class="search-input">
        </div>
        <div class="content" v-if="store.users">
            <div class="user-card" v-for="(user, index) in filteredUsers" :key="user.id">
                <div class="user-summary" @click="toggleUserDetails(index)">
                    <div class="user-avatar">
                        <img :src="`http://localhost:8081/${user.user_image.image_path}`" alt="Avatar" class="avatar">
                    </div>
                    <div class="user-info">
                        <h3>{{ user.last_name }} {{ user.first_name }}</h3>
                        <p>{{ user.email }}</p>
                        <p v-if="user.group">Группа: {{ user.group.name }}</p>
                    </div>
                    <div class="user-status">
                        <span>
                            {{ user.is_active ? 'Активен' : 'Неактивен' }}
                        </span>
                        <button class="toggle-details">
                            {{ expandedUsers[index] ? '▲' : '▼' }}
                        </button>

                    </div>
                </div>

                <div class="user-details" v-if="expandedUsers[index]">
                    <div class="details-section">
                        <h4>Основная информация</h4>
                        <div class="details-grid">
                            <div>
                                <p><strong>ИИН:</strong> {{ user.iin }}</p>
                                <p><strong>Организация:</strong> {{ user.organization.name }}</p>
                            </div>
                            <div>
                                <p><strong>Дата регистрации:</strong> {{ formatDate(user.created_at) }}</p>
                                <p><strong>BIN организации:</strong> {{ user.organization.bin }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="details-section">
                        <h4>Контактные данные организации</h4>
                        <div class="details-grid">
                            <div>
                                <p><strong>Адрес:</strong> {{ user.organization.address }}</p>
                                <p><strong>Телефон:</strong> {{ user.organization.phone }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="details-section" v-if="user.client_infos">
                        <h4>Статистика</h4>
                        <div class="details-grid">
                            <div>
                                <p><strong>Время обучения:</strong> {{ user.client_infos.pastime || '0' }} часов</p>
                            </div>
                        </div>
                    </div>

                    <div class="details-section" v-if="user?.roles[0]">
                        <h4>Роль</h4>
                        <span class="user-role" :class="getRoleClass(user.roles[0].slug)">
                            {{ user.roles[0].name }}
                        </span>
                    </div>

                    <div class="action-buttons">
                        <button class="edit-btn" @click="handleShowUserEditor(user)">Редактировать</button>
                        <button class="status-btn" @click="handleReverseStatusUser(user)"
                            :class="{ 'deactivate': user.is_active, 'activate': !user.is_active }">
                            {{ user.is_active ? 'Деактивировать' : 'Активировать' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="loading">
            <div class="spinner"></div>
            <p>Загрузка пользователей...</p>
        </div>
    </div>

    <Notification ref="notificationRef" />
    <UserEditor v-if="showUserEditor" :user="currentUser" @confirm="handleUserSave"
        @cancel="showUserEditor = false; currentUser = null" />
</template>

<script setup>
import { useUsersStore } from '@/stores/cache/Users';
import { ref, computed, onMounted } from 'vue';
import UserEditor from '../LayoutComponent/UserEditor.vue';
import axios from 'axios';
import { API_URL } from '@/config';
import Notification from '@/components/Notification.vue';

const store = useUsersStore();
const searchQuery = ref('');
const expandedUsers = ref([]);
const showUserEditor = ref(false);
const currentUser = ref(null);
const notificationRef = ref(null);

const toggleUserDetails = (index) => {
    expandedUsers.value[index] = !expandedUsers.value[index];
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
};

const getRoleClass = (roleSlug) => {
    return {
        'director': 'role-director',
        'teacher': 'role-teacher',
        'student': 'role-student',
        'admin': 'role-admin'
    }[roleSlug] || '';
};

const filteredUsers = computed(() => {
    if (!store.users) return [];

    return store.users.filter(user => {
        const query = searchQuery.value.toLowerCase();
        return (
            user.email.toLowerCase().includes(query) ||
            user.first_name.toLowerCase().includes(query) ||
            user.last_name.toLowerCase().includes(query) ||
            user.roles.some(role => role.name.toLowerCase().includes(query))
        );
    });
});

async function handleShowUserEditor(user) {
    currentUser.value = user;
    showUserEditor.value = true
}

async function handleUserSave(userData) {
    try {
        await axios.put(`${API_URL}/admin/updateUser/${userData.id}`, {
            'first_name': userData.first_name,
            'last_name': userData.last_name,
            'email': userData.email
        });

        store.setUserById(userData, userData.id)
        store.getUsers().then(() => {
            expandedUsers.value = new Array(store.users.length).fill(false);
        });

        notificationRef.value.showNotification("Пользователь успешно обновлен")
    } catch (error) {
        notificationRef.value.showNotification("Ошибка: " + error?.response?.data?.error ?? error)
    }
}

async function handleReverseStatusUser(userData) {
       try {
        if (userData.is_active){
            userData.is_active = false
        }else{
            userData.is_active = true
        }
        await axios.put(`${API_URL}/admin/updateUser/${userData.id}`, {
            "is_active" : userData.is_active
        });
        store.setUserById(userData, userData.id)
        store.getUsers().then(() => {
            expandedUsers.value = new Array(store.users.length).fill(false);
        });

        notificationRef.value.showNotification("Пользователь успешно обновлен")
    } catch (error) {
        notificationRef.value.showNotification("Ошибка: " + error?.response?.data?.error ?? error)
    }
}

onMounted(() => {
    store.getUsers().then(() => {
        expandedUsers.value = new Array(store.users.length).fill(false);
    });
});
</script>

<style scoped>
.users-admin {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    margin-bottom: 30px;
    font-size: 2rem;
}

.search-container {
    position: relative;
    margin-bottom: 30px;
    max-width: 500px;
}

.search-input {
    width: 100%;
    padding: 12px 20px 12px 40px;
    border: 1px solid #ddd;
    border-radius: 30px;
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    color: black;
}

.search-input:focus {
    outline: none;
    border-color: #b14788;
    box-shadow: 0 2px 10px rgba(177, 71, 136, 0.2);
}

.search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #777;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.user-card {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0px 10px #b14788;
    transition: all 0.3s ease;
    border: 1px solid #b14788;
}

.user-card:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.user-summary {
    display: flex;
    align-items: center;
    padding: 20px;
    cursor: pointer;
    gap: 20px;
}

.user-avatar {
    position: relative;
    flex-shrink: 0;
}

.avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #eee;
}

.user-role {
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 0.7rem;
    font-weight: bold;
    color: white;
}

.role-director {
    background-color: #6a1b9a;
}

.role-teacher {
    background-color: #1565c0;
}

.role-student {
    background-color: #2e7d32;
}

.role-admin {
    background-color: #c62828;
}

.user-info {
    flex-grow: 1;
}

.user-info h3 {
    margin: 0;
    font-size: 1.2rem;
}

.user-info p {
    margin: 5px 0 0;
    font-size: 0.9rem;
}

.user-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
}


.toggle-details {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #666;
}

.user-details {
    padding: 20px;
    border-top: 1px solid #eee;
}

.details-section {
    margin-bottom: 20px;
}

.details-section h4 {
    margin: 0 0 15px;
    font-size: 1.1rem;
}

.details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}


.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.edit-btn,
.status-btn {
    padding: 8px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.edit-btn {
    background-color: #b14788;
    color: white;
    border: 1px solid #b14788;
}

.edit-btn:hover {
    background-color: #9a3c74;
}

.status-btn {
    background-color: white;
    border: 1px solid #ddd;
}

.deactivate {
    color: #c62828;
    border-color: #c62828;
}

.activate {
    color: #2e7d32;
    border-color: #2e7d32;
}

.deactivate:hover {
    background-color: #ffebee;
}

.activate:hover {
    background-color: #e8f5e9;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;
    color: #666;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #b14788;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .user-summary {
        flex-wrap: wrap;
    }

    .details-grid {
        grid-template-columns: 1fr;
    }

    .action-buttons {
        flex-direction: column;
    }
}
</style>