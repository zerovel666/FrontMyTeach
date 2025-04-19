<template>
    <TopBar />
    <div class="containerBody">
        <div class="content">
            <div class="companyInfoCont">
                <div class="bgImage">

                    <div><img src="/src/assets/Icons/editorIcon.svg" @click="openOrganizationModal" alt=""
                            id="editorIcon"></div>
                    <div class="companyInfo">
                        <h1>{{ tree.name }}</h1>
                        <h2>БИН: {{ tree.bin }}</h2>
                        <div class="contact-info">
                            <h4 @click="copyToClipboard(tree.email)">{{ tree.email }}</h4>
                            <h4 @click="copyToClipboard(tree.phone)">{{ tree.phone }}</h4>
                        </div>
                        <p class="address">{{ tree.address }}</p>
                    </div>
                </div>
            </div>

            <!-- Subscription Block -->
            <div class="info-block" v-if="tree.subscription">
                <div class="block-header" @click="toggleBlock('subscription')">
                    <h3>Подписки</h3>
                    <span class="toggle-icon">{{ activeBlocks.subscription ? '−' : '+' }}</span>
                </div>
                <transition name="slide">
                    <div class="block-content" v-show="activeBlocks.subscription">
                        <div class="subscription-card" v-for="(subscription, index) in tree.subscription">
                            <div class="sub-info">
                                <h4>{{ subscription.name }}</h4>
                                <p>{{ subscription.price }} / {{ formatInterval(tree.subscription[0].interval)
                                    }}</p>
                            </div>
                            <div class="sub-stats">
                                <div class="stat-item">
                                    <span class="stat-value">{{ tree.subscription[0].count_users }}</span>
                                    <span class="stat-label">из {{ tree.subscription[0].max_users }}
                                        пользователей</span>
                                </div>
                                <div class="stat-item" v-if="tree.subscription[0].max_courses">
                                    <span class="stat-value">{{ tree.courses?.length || 0 }}</span>
                                    <span class="stat-label">из {{ tree.subscription[0].max_courses }} курсов</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Groups Block -->
            <div class="info-block" v-if="tree.groups">
                <div class="block-header" @click="toggleBlock('groups')">
                    <h3>Группы ({{ tree.groups.length }})</h3>
                    <span class="toggle-icon">{{ activeBlocks.groups ? '−' : '+' }}</span>
                </div>
                <transition name="slide">
                    <div class="block-content" v-show="activeBlocks.groups">
                        <div class="group-actions">
                            <button class="action-btn primary" @click="openAddGroupModal">
                                Добавить группу
                            </button>
                        </div>
                        <div class="group-cards">
                            <div class="group-card" v-for="group in tree.groups" :key="group.id">
                                <div class="group-header">
                                    <h4>{{ group.name }}</h4>
                                    <div class="group-actions">
                                        <button class="icon-btn" @click="toggleGroup(group.id)">
                                            <i class="icon-arrow">
                                                <img :src="activeGroups[group.id] ? '/src/assets/Icons/closeEye.svg' : '/src/assets/Icons/openEye.svg'"
                                                    alt="">
                                            </i>
                                        </button>
                                        <button class="icon-btn" @click="openEditGroupModal(group)" v-if="group.id">
                                            <i class="icon-edit"><img src="/src/assets/Icons/pencilEditor.svg" alt=""
                                                    class="editorButtonImg"></i>
                                        </button>   
                                        <button class="icon-btn danger" @click="confirmDeleteGroup(group)"
                                            v-if="group.id">
                                            <i class="icon-delete"><img src="/src/assets/Icons/deleteIcon.svg" alt=""
                                                class="editorButtonImg"></i>
                                        </button>
                                    </div>
                                </div>
                                <transition name="slide">
                                    <div class="group-content" v-show="activeGroups[group.id]">
                                        <div class="user-actions">
                                            <button class="action-btn primary" @click="openAddUserModal(group)">
                                                Добавить пользователя
                                            </button>
                                        </div>
                                        <div class="users-list">
                                            <div class="user-card" v-for="user in group.users" :key="user.id">
                                                <div class="user-main">
                                                    <div class="user-avatar">
                                                        {{ getUserInitials(user.email) }}
                                                    </div>
                                                    <div class="user-info">
                                                        <p class="user-email">{{ user.email }}</p>
                                                        <p class="user-role">{{ user.roles }}</p>
                                                        <p class="user-iin">ИИН: {{ user.iin }}</p>
                                                    </div>
                                                    <div class="user-stats">
                                                        <div class="stat-badge" v-if="user.has_courses">
                                                            {{ user.has_courses }} курсов
                                                        </div>
                                                        <div class="stat-badge" v-if="user.complete_course_count">
                                                            {{ user.complete_course_count }} завершено
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="user-actions">
                                                    <button class="icon-btn" @click="openEditUserModal(user, group)">
                                                        <i class="icon-edit"><img src="/src/assets/Icons/pencilEditor.svg" alt=""
                                                            class="editorButtonImg"></i>
                                                    </button>
                                                    <button class="icon-btn danger"
                                                        @click="confirmDeleteUser(user, group)">
                                                        <i class="icon-delete"><img src="/src/assets/Icons/deleteIcon.svg" alt=""
                                                            class="editorButtonImg"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>

    <!-- Модальное окно редактирования пользователя -->
    <UserModal v-if="showUserModal" :user="currentUser" :groups="tree.groups" :currentGroup="currentGroup" mode="edit"
        @save="handleSaveUser" @close="closeUserModal" />

    <!-- Модальное окно добавления пользователя -->
    <UserModal v-if="showAddUserModal" :groups="tree.groups" :currentGroup="currentGroup" mode="add"
        @save="handleAddUser" @close="closeAddUserModal" />

    <!-- Модальное окно редактирования группы -->
    <GroupModal v-if="showGroupModal" :group="currentGroupData" mode="edit" @save="handleSaveGroup"
        @close="closeGroupModal" />

    <!-- Модальное окно добавления группы -->
    <GroupModal v-if="showAddGroupModal" mode="add" @save="handleAddGroup" @close="closeAddGroupModal" />

    <!-- Модальное окно подтверждения удаления -->
    <ConfirmationModal v-if="showConfirmModal" :message="confirmMessage" @confirm="handleConfirm"
        @cancel="closeConfirmModal" />

    <OrganizationEditModal v-if="showOrganizationModal" :organization="organizationData" @save="handleSaveOrganization"
        @close="closeOrganizationEditModal" />
    <FooterBar />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';
import TopBar from '../layouts/TopBar.vue';
import FooterBar from '../layouts/FooterBar.vue';
import ConfirmationModal from './OrganizationManualLayouts/ConfirmationModal.vue';
import GroupModal from './OrganizationManualLayouts/GroupModal.vue';
import UserModal from './OrganizationManualLayouts/UserModal.vue';
import OrganizationEditModal from './OrganizationManualLayouts/OrganizationEditModal.vue';


const tree = ref({});
const activeBlocks = ref({ subscription: true, groups: true });
const activeGroups = ref({});
const showUserModal = ref(false);
const showAddUserModal = ref(false);
const showGroupModal = ref(false);
const showAddGroupModal = ref(false);
const showConfirmModal = ref(false);
const currentUser = ref(null);
const currentGroup = ref(null);
const currentGroupData = ref(null);
const confirmMessage = ref('');
const confirmAction = ref(null);
const organizationData = ref({});
const showOrganizationModal = ref(false);

const getTree = async () => {
    const response = await axios.get(`${API_URL}/organization/myAll`);
    tree.value = response.data.data;

    if (tree.value.groups) {
        tree.value.groups.forEach(group => {
            activeGroups.value[group.id] = false;
        });
    }
};

const toggleBlock = (block) => {
    activeBlocks.value[block] = !activeBlocks.value[block];
};

const toggleGroup = (groupId) => {
    activeGroups.value[groupId] = !activeGroups.value[groupId];
};

const openEditUserModal = (user, group) => {
    currentUser.value = { ...user };
    currentGroup.value = group;
    showUserModal.value = true;
};

const openOrganizationModal = () => {
    organizationData.value = {
        id: tree.value.id,
        name: tree.value.name,
        email: tree.value.email,
        bin: tree.value.bin,
        phone: tree.value.phone,
        address: tree.value.address
    }
    showOrganizationModal.value = true;
};
const closeOrganizationEditModal = () => {
    showOrganizationModal.value = false;
    organizationData.value = {};
};


const openAddUserModal = (group) => {
    currentGroup.value = group;
    showAddUserModal.value = true;
};

const closeUserModal = () => {
    showUserModal.value = false;
    currentUser.value = null;
};

const closeAddUserModal = () => {
    showAddUserModal.value = false;
    currentGroup.value = null;
};

const handleSaveUser = async (updatedUser) => {
    try {
        await axios.put(`${API_URL}/users/director/updateUser${updatedUser.id}`, updatedUser);
        await getTree();
        closeUserModal();
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

const handleAddUser = async (newUser) => {
    try {
        if (newUser.role === "Студент") {
            newUser.role = 'student';
        } else if (newUser.role === "Директор") {
            newUser.role = "director";
        } else if (newUser.role === "Преподаватель") {
            newUser.role = "teacher"
        }
        await axios.post(`${API_URL}/users/director/createUser`, {
            ...newUser,
            group_id: currentGroup.value.id
        });
        await getTree(); // Обновляем данные
        closeAddUserModal();
    } catch (error) {
        console.error('Error adding user:', error);
    }
};

const handleSaveOrganization = async (updatedData) => {
    try {
        await axios.put(`${API_URL}/organization/update/${updatedData.id}`, updatedData);
        await getTree(); // Обновляем данные после сохранения
        closeOrganizationEditModal();
    } catch (error) {
        console.error('Error updating organization:', error);
    }
};

const confirmDeleteUser = (user, group) => {
    currentUser.value = user;
    currentGroup.value = group;
    confirmMessage.value = `Вы уверены, что хотите удалить пользователя ${user.email}?`;
    confirmAction.value = 'deleteUser';
    showConfirmModal.value = true;
};

// Group CRUD operations
const openEditGroupModal = (group) => {
    currentGroupData.value = { ...group };
    showGroupModal.value = true;
};

const openAddGroupModal = () => {
    showAddGroupModal.value = true;
};

const closeGroupModal = () => {
    showGroupModal.value = false;
    currentGroupData.value = null;
};

const closeAddGroupModal = () => {
    showAddGroupModal.value = false;
};

const handleSaveGroup = async (updatedGroup) => {
    try {
        // Здесь API запрос для обновления группы
        await axios.put(`${API_URL}/group/update/${updatedGroup.id}`, updatedGroup);
        await getTree(); // Обновляем данные
        closeGroupModal();
    } catch (error) {
        console.error('Error updating group:', error);
    }
};

const handleAddGroup = async (newGroup) => {
    try {
        await axios.post(`${API_URL}/group/create`, newGroup);
        await getTree(); // Обновляем данные
        closeAddGroupModal();
    } catch (error) {
        console.error('Error adding group:', error);
    }
};

const confirmDeleteGroup = (group) => {
    currentGroupData.value = group;
    confirmMessage.value = `Вы уверены, что хотите удалить группу "${group.name}"? Все пользователи будут перемещены в группу "Без группы".`;
    confirmAction.value = 'deleteGroup';
    showConfirmModal.value = true;
};

const handleConfirm = async () => {
    try {
        if (confirmAction.value === 'deleteUser') {
            await axios.delete(`${API_URL}/users/director/deleteUser/${currentUser.value.id}`);
            // Или перемещение в другую группу, если удалять нельзя
        } else if (confirmAction.value === 'deleteGroup') {
            await axios.delete(`${API_URL}/group/delete/${currentGroupData.value.id}`);
            // Или перемещение пользователей в другую группу
        }
        await getTree();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        closeConfirmModal();
    }
};

const closeConfirmModal = () => {
    showConfirmModal.value = false;
    confirmMessage.value = '';
    confirmAction.value = null;
    currentUser.value = null;
    currentGroupData.value = null;
};

const formatInterval = (interval) => {
    const intervals = { 'year': 'год', 'month': 'месяц', 'day': 'день' };
    return intervals[interval] || interval;
};

const getUserInitials = (email) => {
    const nameParts = email.split('@')[0].split('.');
    return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
};

onMounted(() => {
    getTree();
});
</script>

<style scoped>
.containerBody {
    color: white;
    padding: 20px;
    min-height: 100vh;
}

.content {
    max-width: 1200px;
    margin: 0 auto;
}

.companyInfoCont {
    margin-top: 30px;
    background: linear-gradient(135deg, #5A217C 0%, #6800A5 100%);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(106, 0, 165, 0.3);
}

.bgImage {
    position: relative;
    padding: 40px 20px;
    display: flex;
    justify-content: center;
    overflow: hidden;
    z-index: 0;
}

.bgImage::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/src/assets/images/layouts/BgProfile.svg') no-repeat center;
    background-size: cover;
    transform: scale(1.2) rotate(180deg);
    opacity: 0.45;
    z-index: -1;
}

#editorIcon {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    transition: transform 0.2s ease;
    width: 40px;
    height: 40px;
}

#editorIcon:hover {
    transform: scale(1.1);
    filter: brightness(1.2);
}

.companyInfo {
    text-align: center;
    width: 100%;
    max-width: 800px;
    position: relative;
}

.companyInfo h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
}

.companyInfo h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    font-weight: 500;
    opacity: 0.9;
}

.contact-info {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 15px;
}

.companyInfo h4 {
    opacity: 0.8;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 400;
    font-size: 1.1rem;
}

.companyInfo h4:hover {
    opacity: 1;
    transform: scale(1.05);
    color: #fff;
}

.address {
    opacity: 0.7;
    font-size: 0.95rem;
}

.info-block {
    margin-top: 30px;
    background-color: #1E1E1E;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.block-header {
    padding: 18px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: #2A2A2A;
    transition: background-color 0.2s ease;
}

.block-header:hover {
    background-color: #333;
}

.block-header h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0;
}

.toggle-icon {
    font-size: 1.5rem;
    font-weight: 300;
    width: 24px;
    text-align: center;
}

.block-content {
    padding: 20px;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s cubic-bezier(0.65, 0, 0.35, 1);
    max-height: 1000px;
    overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
}

.subscription-card {
    display: flex;
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(90, 33, 124, 0.3) 0%, rgba(104, 0, 165, 0.3) 100%);
    border-radius: 10px;
    padding: 20px;
    border: 1px solid #5A217C;
}

.sub-info h4 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    font-weight: 600;
}

.sub-info p {
    opacity: 0.8;
    font-size: 0.95rem;
}

.sub-stats {
    display: flex;
    gap: 30px;
}

.stat-item {
    text-align: center;
}

.stat-value {
    display: block;
    font-size: 1.8rem;
    font-weight: 700;
    color: #9C4DF4;
    line-height: 1;
}

.stat-label {
    font-size: 0.85rem;
    opacity: 0.7;
}

.group-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
}

.group-card {
    background-color: #252525;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.group-header {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s ease;
}

.group-header:hover {
    background-color: #2E2E2E;
}

.group-header h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
}

.group-actions {
    display: flex;
    gap: 10px;
}

.group-content {
    padding: 0 20px 15px;
}

.user-actions-top {
    margin-bottom: 15px;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn.primary {
    background-color: #9C4DF4;
    color: white;
}

.action-btn.primary:hover {
    background-color: #8a3de0;
}

.users-list {
    margin-top: 10px;
}

.user-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid #333;
}

.user-main {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #5A217C 0%, #9C4DF4 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    font-weight: 600;
    flex-shrink: 0;
}

.user-info {
    flex: 1;
    min-width: 0;
}

.user-email {
    margin: 0 0 4px 0;
    font-size: 0.95rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-role {
    margin: 0 0 4px 0;
    font-size: 0.85rem;
    opacity: 0.8;
    color: #9C4DF4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-iin {
    margin: 0;
    font-size: 0.8rem;
    opacity: 0.6;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-stats {
    display: flex;
    gap: 5px;
    margin-left: 15px;
    flex-shrink: 0;
}

.stat-badge {
    background-color: rgba(156, 77, 244, 0.15);
    color: #9C4DF4;
    padding: 3px 8px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
}

.user-actions {
    display: flex;
    gap: 8px;
    margin-left: 15px;
    flex-shrink: 0;
}

.icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 1px solid #444;
    color: #ddd;
    cursor: pointer;
    transition: all 0.2s ease;
}

.icon-btn:hover {
    background-color: #333;
    color: white;
}

.icon-btn.danger {
    color: #ff6b6b;
    border-color: #ff6b6b;
}

.icon-btn.danger:hover {
    background-color: rgba(255, 107, 107, 0.1);
}

.icon-add,
.icon-edit,
.icon-delete {
    font-size: 1rem;
}

.editorButtonImg {
    width: 18px;
    height: 18px;
}

.icon-arrow {
    font-size: 1rem;
    transition: transform 0.2s ease;
}

.icon-arrow.rotate {
    transform: rotate(180deg);
}
</style>