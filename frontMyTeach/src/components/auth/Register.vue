<template>
	<Notification ref="notificationRef" />

	<div class="container">
		<PreLoad :show-logo="showLogo" />
		<transition name="fade">
			<div v-if="!showLogo" class="registerCont">
				<img src="/src/assets/Icons/Icon.svg" alt="" id="logo">
				<form @submit.prevent="register" class="registerForm">
					<input type="text" v-model="data.email" placeholder="Email">
					<input type="password" v-model="data.password" placeholder="Password">
					<input type="password" v-model="data.accessPassword" placeholder="Access Password">
					<input type="text" v-model="data.first_name" placeholder="First Name">
					<input type="text" v-model="data.last_name" placeholder="Last Name">
					<div class="checkboxRole">
						<div class="checkbox">
							<p>Student</p>
							<input type="checkbox" v-model="studentCheckBox">
						</div>
						<div class="checkbox">
							<p>Teacher</p>
							<input type="checkbox" v-model="teacherCheckBox">
						</div>
					</div>
					<button type="submit">Register</button>
				</form>

				<router-link to="/auth">Redirect auth</router-link>

			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/config';

const router = useRouter();
import PreLoad from '@/components/auth/PreLoad.vue';
import Notification from '../Notification.vue';

const showLogo = ref(true);
const studentCheckBox = ref(false)
const teacherCheckBox = ref(false)

const notificationRef = ref(null);
const data = ref({
	email: '',
	password: '',
	accessPassword: '',
	first_name: '',
	last_name: '',
	image_path: null,
	role: '',
	type: 'MyTAuth'
});


const register = async () => {
	const requiredFields = ['email', 'password', 'accessPassword', 'first_name', 'last_name'];
	for (const field of requiredFields) {
		if (!data.value[field]?.trim()) {
			notificationRef.value.showNotification(`Поле ${field.replace('_', ' ')} обязательно для заполнения`, 'error');
			return;
		}
	}

	if (data.value.password !== data.value.accessPassword) {
		notificationRef.value.showNotification('Пароли не совпадают', 'error');
		return;
	}

	data.value.role = studentCheckBox.value ? 'student' : teacherCheckBox.value ? 'teacher' : '';
	if (!data.value.role) {
		notificationRef.value.showNotification('Выберите роль', 'error');
		return;
	}

	try {
		await axios.post(API_URL + '/auth/register', data.value);
		notificationRef.value.showNotification('Регистрация успешна!', 'success');
		router.push('/auth');
	} catch (err) {
		notificationRef.value.showNotification('Ошибка регистрации. Проверьте данные.', 'error');
		console.error('Register error:', err);
	}
};

watch(studentCheckBox, (val) => {
	if (val) teacherCheckBox.value = false;
});

watch(teacherCheckBox, (val) => {
	if (val) studentCheckBox.value = false;
});

onMounted(() => {
	setTimeout(() => {
		showLogo.value = false;
	}, 500);
	document.body.style.backgroundImage = 'none';
});
</script>

<style scoped>
.registerCont a {
	display: flex;
	justify-content: center;
	text-align: center;
	text-decoration: none;
	color: white;
	font-size: 14px;
	margin-top: 5%;

	font-family: 'Anonymous Pro', monospace;
}

#errorPassword {
	color: red;
	font-size: 14px;
}

#logo {
	position: absolute;
	top: -20%;
	left: 35%;
	width: 100px;
}

.container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 97vh;
	position: relative;
}

.checkboxRole {
	display: flex;
	justify-content: space-between;
	align-items: center;
	accent-color: #af00b8;
}

.registerCont {
	width: 300px;
	transition: opacity 1s ease-in-out;
	position: absolute;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
}

.registerForm {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.registerForm input:-webkit-autofill[type="text"],[type="password"] {
	box-shadow: 0 0 0 1000px white inset !important;
	transition: background-color 5000s ease-in-out 0s;
}

.registerForm input[type="text"]:hover, 
.registerForm input[type="password"]:hover {
  box-shadow: 0px 0px 1000px #f200ff, 0 0 0 1000px white inset !important;
  transform: scale(1.05);
}

.registerForm button:hover {
	box-shadow: 0px 0px 1000px #f200ff,
		inset 0px 4px 4px rgba(0, 0, 0, 0.5);
	transform: scale(1.05);
	cursor: pointer;
}

.registerForm button {
	transition: all 0.25s ease-in-out;
}

.registerForm input[type="text"],
[type="password"] {
	width: 240px;
	height: 30px;
	margin: 10px;
	border-radius: 15px;
	display: flex;
	align-items: center;
	padding-left: 10px;
	font-size: 24px;
}

.registerForm input[type="checkbox"] {
	border-radius: 15px;
	display: flex;
	align-items: center;
	font-size: 24px;
	height: 20px;
	width: 20px;
	margin: 10px;
}

.registerForm button {
	width: 140px;
	height: 30px;
	border-radius: 15px;
	font-size: 22px;
	font-weight: 100;
	box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.5);
	margin: 10px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.checkbox {
	display: flex;
	justify-content: center;
	align-items: center;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}
</style>