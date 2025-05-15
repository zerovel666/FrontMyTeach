<template>
    <div class="banners-admin">
        <h1>Управление баннерами</h1>

        <div class="controls">
            <button class="add-banner-btn" @click="showAddBannerModal = true">
                + Добавить баннер
            </button>
        </div>

        <div class="banners-list" v-if="store.banners && store.banners.length > 0">
            <div class="banner-card" v-for="banner in store.banners" :key="banner.id">
                <div class="banner-preview">
                    <img :src="banner.image_path" alt="Баннер" class="banner-image">
                    <div class="banner-overlay">
                        <button class="preview-btn" @click="openPreview(banner.image_path)">
                            Предпросмотр
                        </button>
                    </div>
                </div>

                <div class="banner-info">
                    <p class="banner-id">ID: {{ banner.id }}</p>
                    <p class="banner-status">
                        {{ banner.active ? 'Активен' : 'Неактивен' }}
                    </p>
                    <p class="banner-date">Добавлен: {{ formatDate(banner.created_at) }}</p>
                </div>

                <div class="banner-actions">
                    <button class="toggle-btn"
                        :class="{ 'activate-btn': !banner.active, 'deactivate-btn': banner.active }"
                        @click="toggleBannerStatus(banner.id, banner.active)">
                        {{ banner.active ? 'Деактивировать' : 'Активировать' }}
                    </button>
                    <button class="delete-btn" @click="confirmDelete(banner.id)">
                        Удалить
                    </button>
                </div>
            </div>
        </div>

        <div v-else-if="store.banners && store.banners.length === 0" class="no-banners">
            Нет добавленных баннеров
        </div>

        <div v-else class="loading">
            Загрузка баннеров...
        </div>

        <div class="modal" v-if="showPreviewModal" @click.self="showPreviewModal = false">
            <div class="modal-content">
                <button class="close-modal" @click="showPreviewModal = false">×</button>
                <img :src="previewImage" alt="Превью баннера" class="modal-image">
            </div>
        </div>

        <div class="modal" v-if="showAddBannerModal" @click.self="showAddBannerModal = false">
            <div class="modal-content">
                <button class="close-modal" @click="showAddBannerModal = false">×</button>
                <h2>Добавить новый баннер</h2>

                <div class="upload-area" @dragover.prevent="dragOver" @drop.prevent="handleDrop">
                    <input type="file" id="banner-upload" ref="fileInput" accept="image/*" @change="handleFileSelect"
                        style="display: none;">

                    <div class="drop-zone" :class="{ 'dragover': isDragging }" @click="$refs.fileInput.click()">
                        <div v-if="!selectedFile">
                            <p>Перетащите изображение сюда или кликните для выбора</p>
                            <p class="hint">Рекомендуемый размер: 1200×400px</p>
                        </div>
                        <div v-else class="file-info">
                            <p>{{ selectedFile.name }}</p>
                            <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" v-model="activateAfterUpload">
                            Активировать после загрузки
                        </label>
                    </div>

                    <div class="modal-actions">
                        <button class="cancel-btn" @click="cancelUpload">Отмена</button>
                        <button class="upload-btn" @click="uploadBanner" :disabled="!selectedFile">
                            Загрузить
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Модальное окно подтверждения удаления -->
        <div class="modal" v-if="showDeleteConfirm" @click.self="showDeleteConfirm = false">
            <div class="modal-content small">
                <h3>Подтверждение удаления</h3>
                <p>Вы уверены, что хотите удалить этот баннер?</p>
                <div class="confirm-actions">
                    <button class="cancel-btn" @click="showDeleteConfirm = false">Отмена</button>
                    <button class="confirm-delete-btn" @click="deleteBanner">Удалить</button>
                </div>
            </div>
        </div>
    </div>

    <Notification ref="notificationRef" />
</template>

<script setup>
import Notification from '@/components/Notification.vue';
import { API_URL } from '@/config';
import { useBannersStore } from '@/stores/cache/Banners';
import axios from 'axios';
import { ref, onMounted } from 'vue';

const store = useBannersStore();
const showPreviewModal = ref(false);
const previewImage = ref('');
const showAddBannerModal = ref(false);
const showDeleteConfirm = ref(false);
const bannerToDelete = ref(null);
const isDragging = ref(false);
const selectedFile = ref(null);
const activateAfterUpload = ref(false);
const fileInput = ref(null);
const notificationRef = ref(null);

onMounted(() => {
    store.getBanners();
});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
};

const openPreview = (imageUrl) => {
    previewImage.value = imageUrl;
    showPreviewModal.value = true;
};

const toggleBannerStatus = async (id, currentStatus) => {
    try {
        await axios.put(`${API_URL}/admin/poster/${id}`,{
            active: !currentStatus
        })

        const banner = store.banners.find(b => b.id === id);
        if (banner) {
            banner.active = !currentStatus;
        }
    } catch (error) {
        notificationRef.value.showNotification('Ошибка' + error?.response?.data?.error ?? error)
    }
};

const confirmDelete = (id) => {
    bannerToDelete.value = id;
    showDeleteConfirm.value = true;
};

const deleteBanner = async () => {
    try {
        await axios.delete(`${API_URL}/admin/poster/${bannerToDelete.value}`);
        notificationRef.value.showNotification("Успешно удален");
        store.banners = store.banners.filter(b => b.id !== bannerToDelete.value);
        showDeleteConfirm.value = false;
    } catch (error) {
        notificationRef.value.showNotification('Ошибка' + error?.response?.data?.error ?? error)
    }
};

const dragOver = () => {
    isDragging.value = true;
};

const handleDrop = (e) => {
    isDragging.value = false;
    const files = e.dataTransfer.files;
    if (files.length) {
        handleFile(files[0]);
    }
};

const handleFileSelect = (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
};

const handleFile = (file) => {
    if (!file.type.match('image.*')) {
        notificationRef.value.showNotification('Пожалуйста, выберите файл изображения');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { 
        notificationRef.value.showNotification('Файл слишком большой. Максимальный размер: 5MB');
        return;
    }

    selectedFile.value = file;
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
};

const cancelUpload = () => {
    selectedFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
    showAddBannerModal.value = false;
};

const uploadBanner = async () => {
    if (!selectedFile.value) return;

    try {
        const formData = new FormData();
        formData.append('image_path', selectedFile.value); 
        formData.append('active', activateAfterUpload.value ? 1 : 0); 

        const response = await axios.post(`${API_URL}/admin/poster/store`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        store.banners.push(response.data);
        selectedFile.value = null;
        if (fileInput.value) {
            fileInput.value.value = '';
        }
        activateAfterUpload.value = false;
        showAddBannerModal.value = false;

    } catch (error) {
        notificationRef.value.showNotification('Ошибка' + error?.response?.data?.error ?? error)
    }
};

</script>

<style scoped>
h1 {
    margin-bottom: 30px;
}

.controls {
    margin-bottom: 30px;
}

.add-banner-btn {
    background-color: #4f007d;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.add-banner-btn:hover {
    background-color: #8b29b9;
}

.banners-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.banner-card {
    border: 1px solid #b14788;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0px 10px #4f007d;
    transition: transform 0.3s, box-shadow 0.3s;
}

.banner-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0px 20px #4f007d;
}

.banner-preview {
    position: relative;
    height: 150px;
    overflow: hidden;
}

.banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.banner-card:hover .banner-overlay {
    opacity: 1;
}

.preview-btn {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid white;
    padding: 5px 10px;
    border-radius: 20px;
    cursor: pointer;
    backdrop-filter: blur(5px);
    transition: background-color 0.3s;
}

.preview-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

.banner-info {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.banner-id {
    font-size: 0.9rem;
    color: #7f8c8d;
    margin: 0;
}

.banner-status {
    margin: 0;
}

.banner-date {
    font-size: 0.8rem;
    color: #95a5a6;
    margin: 0;
}

.banner-actions {
    display: flex;
    padding: 0 15px 15px;
    gap: 10px;
}

.toggle-btn,
.delete-btn {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;
}

.activate-btn {
    background-color: #4f007d;
}

.activate-btn:hover {
    background-color: #8b29b9;
}

.deactivate-btn {
    background-color: #4f007d;
    color: white;
}

.deactivate-btn:hover {
    background-color: #8b29b9;
}

.delete-btn {
    background-color: #4f007d;
    color: white;
}

.delete-btn:hover {
    background-color: #8b29b9;
}

.no-banners,
.loading {
    text-align: center;
    padding: 50px;
    color: #7f8c8d;
    font-size: 1.1rem;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: #333;
    border-radius: 10px;
    padding: 20px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.modal-content.small {
    max-width: 400px;
}

.close-modal {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 3rem;
    cursor: pointer;
    color: #7f8c8d;
}

.modal-image {
    max-width: 100%;
    max-height: 70vh;
    display: block;
    margin: 0 auto;
}

/* Форма добавления баннера */
.upload-area {
    padding: 20px;
}

.drop-zone {
    border: 2px dashed #95a5a6;
    border-radius: 5px;
    padding: 30px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 20px;
    transition: border-color 0.3s;
}

.drop-zone.dragover {
    border-color: #3498db;
}

.drop-zone p {
    margin: 0;
    color: #7f8c8d;
}

.hint {
    font-size: 0.8rem;
    margin-top: 10px !important;
}

.file-info {
    color: #2c3e50;
}

.file-size {
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-top: 5px !important;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.modal-actions,
.confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.cancel-btn,
.upload-btn,
.confirm-delete-btn {
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
}

.cancel-btn {
    background-color: #4f007d;
    color: white;
    border: none;
}

.cancel-btn:hover {
    background-color: #8b29b9;
}

.upload-btn {
    background-color: #4f007d;
    color: white;
    border: none;
}

.upload-btn:disabled {
    background-color: #8b29b9;
    cursor: not-allowed;
}

.upload-btn:hover:not(:disabled) {
    background-color: #4f007d;
}

.confirm-delete-btn {
    background-color: #4f007d;
    color: white;
    border: none;
}

.confirm-delete-btn:hover {
    background-color: #8b29b9;
}

@media (max-width: 768px) {
    .banners-list {
        grid-template-columns: 1fr;
    }

    .banner-actions {
        flex-direction: column;
    }

    .modal-content {
        width: 95%;
        padding: 15px;
    }
}
</style>