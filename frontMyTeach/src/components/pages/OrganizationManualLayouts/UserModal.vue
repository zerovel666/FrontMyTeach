<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <div class="modal-header">
                <h3>{{ mode === 'edit' ? 'Редактировать пользователя' : 'Добавить пользователя' }}</h3>
                <button class="close-btn" @click="close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" v-model="formData.email" required>
                </div>
                <div class="form-group">
                    <label>ИИН</label>
                    <input type="text" @input="onInput" v-model="formData.iin" required>
                </div>
                <div class="form-group">
                    <label>Пароль</label>
                    <input type="password" v-model="formData.password" :required="mode === 'add'">
                </div>
                <div class="form-group">
                    <label>Фамилия</label>
                    <input type="text" v-model="formData.last_name" required>
                </div>
                <div class="form-group">
                    <label>Имя</label>
                    <input type="text" v-model="formData.first_name" required>
                </div>
                <div class="form-group">
                    <label>Роль</label>
                    <select v-model="formData.roles" required>
                        <option value="Студент">Студент</option>
                        <option value="Преподаватель">Преподаватель</option>
                        <option value="Директор">Директор</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Группа</label>
                    <select v-model="formData.group_id" required>
                        <option v-for="group in groups" :key="group.id" :value="group.id">
                            {{ group.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn cancel" @click="close">Отмена</button>
                <button class="btn save" @click="save">Сохранить</button>
            </div>
        </div>
    </div>
    <Notification ref="notificationRef" />
</template>

<script setup>
import Notification from '@/components/Notification.vue';
import { ref, watch } from 'vue';

const notificationRef = ref(null);
const props = defineProps({
    user: Object,
    groups: Array,
    currentGroup: Object,
    mode: { type: String, default: 'edit' }
});

const emit = defineEmits(['save', 'close']);

const onInput = (event) => {
  event.target.value = event.target.value.replace(/\D/g, '') 
  formData.value.iin = event.target.value
}

const formData = ref({
    email: '',
    iin: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'Студент',
    group_id: props.currentGroup?.id || null
});

watch(() => props.user, (user) => {
    if (user && props.mode === 'edit') {
        formData.value = { ...user };
    }
}, { immediate: true });

watch(() => props.currentGroup, (group) => {
    if (group && props.mode === 'add') {
        formData.value.group_id = group.id;
    }
}, { immediate: true });

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validateIIN = (iin) => {
    return /^\d{12}$/.test(iin);
};

const validateForm = () => {
    if (!formData.value.email || !validateEmail(formData.value.email)) {
        notificationRef.value.showNotification("Пожалуйста, введите корректный email");
        return false;
    }
    
    if (!formData.value.iin || !validateIIN(formData.value.iin)) {
        notificationRef.value.showNotification("ИИН должен содержать ровно 12 цифр");
        return false;
    }
    
    if (props.mode === 'add' && !formData.value.password) {
        notificationRef.value.showNotification("Пожалуйста, введите пароль");
        return false;
    }
    
    if (!formData.value.last_name) {
        notificationRef.value.showNotification("Пожалуйста, введите фамилию");
        return false;
    }
    
    if (!formData.value.first_name) {
        notificationRef.value.showNotification("Пожалуйста, введите имя");
        return false;
    }
    
    if (!formData.value.roles) {
        notificationRef.value.showNotification("Пожалуйста, выберите роль");
        return false;
    }
    
    if (!formData.value.group_id) {
        notificationRef.value.showNotification("Пожалуйста, выберите группу");
        return false;
    }
    
    return true;
};

const save = () => {
    if (!validateForm()) return;
    
    emit('save', formData.value);
};

const close = () => {
    emit('close');
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #1E1E1E;
    border-radius: 12px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.3rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #aaa;
    cursor: pointer;
    padding: 0 10px;
}

.close-btn:hover {
    color: white;
}

.modal-body {
    padding: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.9rem;
    opacity: 0.8;
}

.form-group input, 
.form-group select {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #444;
    background-color: #252525;
    color: white;
    font-size: 1rem;
}

.modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #333;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn.cancel {
    background-color: #333;
    color: white;
    border: 1px solid #444;
}

.btn.cancel:hover {
    background-color: #444;
}

.btn.save {
    background-color: #9C4DF4;
    color: white;
    border: none;
}

.btn.save:hover {
    background-color: #8a3de0;
}
</style>