<template>
	<div class="auth-container">
		<img src="@/assets/images/auth/BGauth.svg" alt="" class="auth-bg">
		<div class="auth-box">
			<img src="/src/assets/Icons/logo.svg" alt="Logo" class="logo">
			<h2>Вход в систему</h2>

			<form @submit.prevent="auth">
				<div class="input-group">
					<input type="email" v-model="data.email" placeholder="Email" required>
				</div>
				<div class="input-group">
					<input type="password" v-model="data.password" placeholder="Пароль" required>
				</div>
				<button type="submit">Войти</button>
			</form>
			<p id="register" @click="register">Регистрация</p>
		</div>
		<Notification ref="notificationRef" />
	</div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';
import Notification from '@/components/Notification.vue';
import { API_URL } from '@/config';

const router = useRouter();
const notificationRef = ref(null);

const data = ref({
	type: 'MyTAuth',
	email: '',
	password: ''
});

const auth = async () => {
	try {
		if (!data.value.email || !data.value.password) {
			notificationRef.value.showNotification('Заполните все поля');
			return;
		}
		const response = await axios.post(API_URL + '/auth/login', data.value);
		const token = response.data.token;

		VueCookies.set('token', encodeURIComponent(token), '7d');
		if (response.data.role) {
			VueCookies.set('role', encodeURIComponent(response.data.role), '7d');
		}
		decodeURIComponent(VueCookies.get('token'));
		router.push('/');
	} catch (error) {
		notificationRef.value.showNotification('Ошибка авторизации' + error.response.data.error);
	}
};

const register = async () => {
	router.push('/register');
}
</script>

<style scoped>
.auth-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #000;
	display: flex;
	justify-content: center;
	align-items: center;
}

.auth-bg {
	position: absolute;
	width: 100%;
	object-fit: cover;
	opacity: 0.3;
}

.auth-box {
	position: relative;
	z-index: 2;
	width: 320px;
	padding: 30px;
	background: rgba(30, 30, 30, 0.8);
	border-radius: 10px;
	box-shadow: 0 0 20px rgba(177, 71, 136, 0.3);
	text-align: center;
}

.logo {
	width: 100px;
	margin-bottom: 20px;
}

h2 {
	color: #fff;
	margin-bottom: 25px;
	font-size: 1.5rem;
}

.input-group {
	margin-bottom: 15px;
}

input {
	width: 100%;
	padding: 12px 15px;
	background: rgba(50, 50, 50, 0.5);
	border: 1px solid #444;
	border-radius: 6px;
	color: #fff;
	font-size: 14px;
}

input:focus {
	outline: none;
	border-color: #B14788;
}

button {
	width: 100%;
	padding: 12px;
	background: linear-gradient(to right, #B14788, #8100CC);
	color: white;
	border: none;
	border-radius: 6px;
	font-weight: 600;
	cursor: pointer;
	margin-top: 10px;
	transition: opacity 0.3s;
}

button:hover {
	opacity: 0.9;
}
#register{
	margin: 0;
	cursor: pointer;
	margin-top:20px ;
}
</style>
