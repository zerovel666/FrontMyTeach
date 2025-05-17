<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Редактировать организацию</h3>
                <button class="close-btn" @click="close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Название организации</label>
                    <input type="text" v-model="formData.name" required>
                    <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
                </div>
                <div class="form-group">
                    <label>БИН (9 цифр)</label>
                    <input type="text" v-model="formData.bin" @input="validateBin" required>
                    <span class="error-message" v-if="errors.bin">{{ errors.bin }}</span>
                </div>
                <div class="form-group">
                    <label>Адрес</label>
                    <input type="text" v-model="formData.address" required>
                    <span class="error-message" v-if="errors.address">{{ errors.address }}</span>
                </div>
                <div class="form-group">
                    <label>Телефон</label>
                    <input type="tel" v-model="formData.phone" @input="validatePhone" required>
                    <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" v-model="formData.email" @input="validateEmail" required>
                    <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
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
    organization: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['save', 'close']);

const formData = ref({
    id: '',
    name: '',
    bin: '',
    address: '',
    phone: '',
    email: '',
});

const errors = ref({
    name: '',
    bin: '',
    address: '',
    phone: '',
    email: ''
});

watch(() => props.organization, (org) => {
    if (org) {
        formData.value = { 
            id: org.id || '',
            name: org.name || '',
            bin: org.bin || '',
            address: org.address || '',
            phone: org.phone || '',
            email: org.email || ''
        };
    }
}, { immediate: true });

const save = () => {
    if (!validateForm()) {
        return;
    }
    emit('save', formData.value);
};

const close = () => {
    emit('close');
};

const validateForm = () => {
    let isValid = true;
    
    if (!formData.value.name.trim()) {
        errors.value.name = 'Введите название организации';
        isValid = false;
    } else {
        errors.value.name = '';
    }
    
    validateBin();
    if (errors.value.bin) {
        isValid = false;
    }
    
    if (!formData.value.address.trim()) {
        errors.value.address = 'Введите адрес';
        isValid = false;
    } else {
        errors.value.address = '';
    }
    
    validatePhone();
    if (errors.value.phone) {
        isValid = false;
    }
    
    validateEmail();
    if (errors.value.email) {
        isValid = false;
    }
    
    if (!isValid) {
        notificationRef.value.showNotification("Исправьте ошибки в форме");
    }
    
    return isValid;
};

const validateBin = () => {
    const bin = formData.value.bin;
    if (!bin) {
        errors.value.bin = 'Введите БИН';
        return;
    }
    
    const cleanBin = bin.replace(/\D/g, '');
    formData.value.bin = cleanBin;
    
    if (cleanBin.length !== 9) {
        errors.value.bin = 'БИН должен содержать 9 цифр';
    } else {
        errors.value.bin = '';
    }
};

const validateEmail = () => {
    const email = formData.value.email;
    if (!email) {
        errors.value.email = 'Введите email';
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.value.email = 'Введите корректный email';
    } else {
        errors.value.email = '';
    }
};

const validatePhone = () => {
    const phone = formData.value.phone;
    if (!phone) {
        errors.value.phone = 'Введите телефон';
        return;
    }
    
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 6) {
        errors.value.phone = 'Телефон должен содержать минимум 6 цифр';
    } else {
        errors.value.phone = '';
    }
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

.form-group input {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #444;
    background-color: #252525;
    color: white;
    font-size: 1rem;
}

.form-group input:invalid {
    border-color: #ff4444;
}

.error-message {
    color: #ff4444;
    font-size: 0.8rem;
    margin-top: 5px;
    display: block;
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

.btn.save {
    background-color: #9C4DF4;
    color: white;
    border: none;
}

.btn.save:hover {
    background-color: #8a3de0;
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
</style>