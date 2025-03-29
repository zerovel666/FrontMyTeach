<template>
	<Notification ref="notificationRef" />
	<div class="container">
		<PreLoad :show-logo="showLogo" />
		<transition name="fade">
			<div v-if="!showLogo" class="loginCont">
				<img src="/src/assets/Icons/logo.svg" alt="" id="logo">
				<form @submit.prevent="auth" action="" class="loginForm">
					<input type="text" placeholder="Email" v-model="data.email">
					<input type="password" placeholder="Password" v-model="data.password">
					<button type="submit">Auth</button>
				</form>
				<router-link to="/register">Don't have account?</router-link>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PreLoad from '@/components/auth/PreLoad.vue';
import Notification from '@/components/Notification.vue';
import axios from 'axios';
import { API_URL } from '@/config';
import VueCookies from 'vue-cookies';
import { useRouter } from 'vue-router';
import { onUnmounted } from 'vue';


const showLogo = ref(true);
const notificationRef = ref(null);
const router = useRouter();

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
		decodeURIComponent(VueCookies.get('token'));
		router.push('/');
	} catch (err) {
		notificationRef.value.showNotification('Ошибка авторизации. Проверьте данные.');
		console.error('Auth error:', err);
	}
};

axios.interceptors.request.use(
	(config) => {
		const token = VueCookies.get('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

onMounted(() => {
	setTimeout(() => {
		showLogo.value = false;
	}, 500);
});

onMounted(() => {
  document.body.style.backgroundImage = 'none';
});

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400&display=swap');

#logo {
	position: absolute;
	top: -90%;
	left: 35%;
	width: 100px;
}
body {
  background-image: none !important;
}
.container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 97vh;
	position: relative;
}

.loginCont {
	width: 300px;
	transition: opacity 1s ease-in-out;
	position: absolute;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
}

.loginForm {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.loginForm input {
	width: 240px;
	height: 30px;
	margin: 10px;
	border-radius: 15px;
	display: flex;
	align-items: center;
	padding-left: 10px;
	font-size: 20px;
	transition: all 0.25s ease-in-out !important;
	color: black;
	outline: none;
	padding: 15px;
}

.loginForm input:-webkit-autofill {
	box-shadow: 0 0 0 1000px white inset !important;
	transition: background-color 5000s ease-in-out 0s;
}

.loginForm input:hover {
	box-shadow: 0px 0px 1000px #f200ff, 0 0 0 1000px white inset !important;
	transform: scale(1.05);
}

.loginForm button:hover {
	box-shadow: 0px 0px 1000px #f200ff,
		inset 0px 4px 4px rgba(0, 0, 0, 0.5);
	transform: scale(1.05);
	cursor: pointer;
}

.loginForm button {
	width: 140px;
	height: 30px;
	border-radius: 15px;
	font-size: 22px;
	box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.5);
	margin: 10px;
	color: black;
}



.loginForm button {
	transition: all 0.25s ease-in-out;
}

.loginCont a {
	display: flex;
	justify-content: center;
	text-align: center;
	text-decoration: none;
	color: white;
	font-size: 14px;
	margin-top: 10%;
	font-family: 'Anonymous Pro', monospace;
}


.fade-enter-active,
.fade-leave-active {
	transition: opacity 1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}
</style>