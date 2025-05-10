<template>
	<div class="register-container">
		<img src="@/assets/images/auth/BGauth.svg" alt="" class="register-bg">
		<div class="register-box">
			<div class="logo-cont">
				<img src="/src/assets/Icons/arrowLeft.svg" alt="" class="back-page" @click="backLogin">
				<img src="/src/assets/Icons/logo.svg" alt="Logo" class="logo">
			</div>
			<h2>Регистрация организации</h2>

			<div class="steps">
				<div :class="['step', { 'active': currentStep === 1 }]">1. Организация</div>
				<div :class="['step', { 'active': currentStep === 2 }]">2. Директор</div>
			</div>

			<form v-if="currentStep === 1" @submit.prevent="nextStep">
				<div class="input-group">
					<label>Название организации <span class="required">*</span></label>
					<input v-model="formData.organization.name" required>
				</div>
				<div class="input-group">
					<label>БИН <span class="required">*</span></label>
					<input v-model="formData.organization.bin" type="text" @keydown="validateNumberInput($event)"
						@paste="preventPasteNonNumbers" maxlength="9" required>
					<span v-if="binError" class="error-message">{{ binError }}</span>
				</div>
				<div class="input-group">
					<label>Адрес <span class="required">*</span></label>
					<input v-model="formData.organization.address" required>
				</div>
				<div class="input-group">
					<label>Телефон <span class="required">*</span></label>
					<input v-model="formData.organization.phone" type="tel" required>
				</div>
				<div class="input-group">
					<label>Email организации <span class="required">*</span></label>
					<input v-model="formData.organization.email" type="email" required>
				</div>
				<button type="submit" :disabled="!isStep1Valid">Далее</button>
			</form>

			<form v-if="currentStep === 2" @submit.prevent="register">
				<div class="input-group">
					<label>Email директора <span class="required">*</span></label>
					<input v-model="formData.user.email" type="email" required>
				</div>
				<div class="input-group">
					<label>Пароль <span class="required">*</span></label>
					<div class="password-input">
						<input v-model="formData.user.password" :type="showPassword ? 'text' : 'password'" required>
						<button type="button" class="toggle-password" @click="showPassword = !showPassword">
							{{ showPassword ? 'Скрыть' : 'Показать' }}
						</button>
					</div>
				</div>
				<div class="input-row">
					<div class="input-group">
						<label>Имя <span class="required">*</span></label>
						<input v-model="formData.user.first_name" required>
					</div>
					<div class="input-group">
						<label>Фамилия <span class="required">*</span></label>
						<input v-model="formData.user.last_name" required>
					</div>
				</div>
				<div class="input-group">
					<label>ИИН <span class="required">*</span></label>
					<input v-model="formData.user.iin" type="text" @keydown="validateNumberInput($event)"
						@paste="preventPasteNonNumbers" maxlength="12" required>
					<span v-if="iinError" class="error-message">{{ iinError }}</span>
					<span v-if="iinError" class="error-message">{{ iinError }}</span>
				</div>
				<div class="buttons">
					<button type="button" class="back" @click="prevStep">Назад</button>
					<button type="submit" :disabled="!isStep2Valid">Зарегистрироваться</button>
				</div>
			</form>
		</div>
		<Notification ref="notificationRef" />
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Notification from '@/components/Notification.vue';
import { API_URL } from '@/config';

const router = useRouter();
const notificationRef = ref(null);
const currentStep = ref(1);
const showPassword = ref(false);
const binError = ref('');
const iinError = ref('');

const formData = ref({
	organization: {
		name: '',
		bin: '',
		address: '',
		phone: '',
		email: ''
	},
	user: {
		email: '',
		password: '',
		first_name: '',
		last_name: '',
		iin: ''
	},
	type: 'MyTAuth'
});

const backLogin = async () => {
	router.push('/auth');
}

const validateNumberInput = (event) => {
	const allowedKeys = [
		'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
		'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
	];

	if (event.ctrlKey && ['a', 'c', 'x', 'v'].includes(event.key.toLowerCase())) {
		return true;
	}

	if (!allowedKeys.includes(event.key)) {
		event.preventDefault();
		return false;
	}
};

const preventPasteNonNumbers = (event) => {
	const pasteData = event.clipboardData?.getData('text/plain');
	if (pasteData && !/^\d+$/.test(pasteData)) {
		event.preventDefault();
		notificationRef.value.showNotification('Можно вставлять только цифры');
	}
};
const isStep1Valid = computed(() => {
	return (
		formData.value.organization.name &&
		formData.value.organization.bin.length === 9 &&
		formData.value.organization.address &&
		formData.value.organization.phone &&
		formData.value.organization.email &&
		!binError.value
	);
});

const isStep2Valid = computed(() => {
	return (
		formData.value.user.email &&
		formData.value.user.password &&
		formData.value.user.first_name &&
		formData.value.user.last_name &&
		formData.value.user.iin.length === 12 &&
		!iinError.value
	);
});

const nextStep = () => {
	if (isStep1Valid.value) {
		currentStep.value = 2;
	} else {
		notificationRef.value.showNotification('Пожалуйста, заполните все поля правильно');
	}
};

const prevStep = () => {
	currentStep.value = 1;
};

const register = async () => {
	try {
		if (!isStep2Valid.value) {
			notificationRef.value.showNotification('Пожалуйста, заполните все поля правильно');
			return;
		}

		const response = await axios.post(API_URL + '/auth/register', formData.value);

		if (response.status === 200) {
			notificationRef.value.showNotification('Регистрация успешна! Переброс на авторизацию');
			setTimeout(() => {
				router.push('/auth');
			}, 2000);
		}
	} catch (error) {
		notificationRef.value.showNotification('Ошибка регистрации: ' + error?.response?.data?.error || "Неизвестная ошибка");
		console.error('Registration error:', error);
	}
};
</script>

<style scoped>
.register-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #000;
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: Arial, sans-serif;
}

.register-bg {
	position: absolute;
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0.3;
}

.register-box {
	position: relative;
	z-index: 2;
	width: 420px;
	padding: 30px;
	background: rgba(30, 30, 30, 0.9);
	border-radius: 10px;
	box-shadow: 0 0 20px rgba(177, 71, 136, 0.3);
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.back-page{
	position: absolute;
	left: 5%;
	cursor: pointer;
}
.logo-cont{
	width: 100%;
	display: flex;
	justify-content: center;

}
.logo {
	width: 80px;
	margin-bottom: 15px;
}
h2 {
	color: #fff;
	margin-bottom: 20px;
	font-size: 1.5rem;
	text-align: center;
}

.steps {
	display: flex;
	justify-content: center;
	margin-bottom: 25px;
	gap: 15px;
}

.step {
	color: #666;
	font-weight: 500;
	padding-bottom: 5px;
	border-bottom: 2px solid transparent;
}

.step.active {
	color: #fff;
	border-bottom: 2px solid #B14788;
}

.input-group {
	margin-bottom: 15px;
}

.input-row {
	display: flex;
	gap: 15px;
}

.input-row .input-group {
	flex: 1;
}

label {
	display: block;
	color: #aaa;
	margin-bottom: 5px;
	font-size: 0.9rem;
}

.required {
	color: #B14788;
}

input {
	width: 100%;
	padding: 12px 15px;
	background: rgba(50, 50, 50, 0.7);
	border: 1px solid #444;
	border-radius: 6px;
	color: #fff;
	font-size: 14px;
}

input:focus {
	outline: none;
	border-color: #B14788;
	background: rgba(70, 70, 70, 0.7);
}

button {
	padding: 12px;
	background: linear-gradient(to right, #B14788, #8100CC);
	color: white;
	border: none;
	border-radius: 6px;
	font-weight: 600;
	cursor: pointer;
	transition: opacity 0.3s;
	width: 100%;
	margin-top: 10px;
}

button:hover {
	opacity: 0.9;
}

button:disabled {
	background: #444;
	cursor: not-allowed;
	opacity: 0.7;
}

.buttons {
	display: flex;
	gap: 10px;
	margin-top: 20px;
}

.back {
	background: #333 !important;
}

.password-input {
	position: relative;
}

.toggle-password {
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
	background: transparent;
	border: none;
	color: #B14788;
	font-size: 0.8rem;
	padding: 0;
	margin: 0;
	width: auto;
	cursor: pointer;
}

.toggle-password:hover {
	text-decoration: underline;
}

.error-message {
	color: #ff6b6b;
	font-size: 0.8rem;
	margin-top: 5px;
	display: block;
}
</style>