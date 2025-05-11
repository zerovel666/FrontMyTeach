<template>
	<div v-if="$loading.active" class="loader">
		<a-spin size="large" />
	</div>
	<router-view />
	<Notification ref="notificationRef" />
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, provide, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getCurrentInstance } from 'vue';
import VueCookies from 'vue-cookies';
import axios from 'axios';
import { API_URL } from './config';
import Notification from './components/Notification.vue';

const router = useRouter();
const route = useRoute();
const instance = getCurrentInstance();
const loading = instance.appContext.config.globalProperties.$loading;
const userInfo = ref(null);
const notificationRef = ref(null);

axios.interceptors.response.use(
	response => response,
	error => {
		if (error.config.url.startsWith(API_URL) && error.response?.status === 401) {
			VueCookies.remove('token');
			VueCookies.remove('role');
			notificationRef.value.showNotification('Доступ запрещен');
			router.push('/auth');
		}
		return Promise.reject(error);
	}
);

let startTime = 0;

watch(
	() => loading.active,
	(newVal) => {
		document.body.style.overflow = newVal ? 'hidden' : '';
	}
);

watch(
	() => route.path,
	(path) => {
		const token = VueCookies.get('token');
		const publicPages = ['/', '/auth', '/register', '/aboutUs', '/catalog'];
		const authRequired = !publicPages.includes(path);

		if (authRequired && !token) {
			notificationRef.value.showNotification('Пожалуйста войдите в систему для этой страницы');
			router.push('/auth');
		}
	},
	{ immediate: true }
);

const logTimeSpent = async () => {
	if (VueCookies.get('token')) {
		const totalTime = Math.floor((Date.now() - startTime) / 1000);
		const data = { time: totalTime };
		try {
			await axios.post(`${API_URL}/client/analytics/time`, data);
		} catch (error) {
			console.error('Error logging time:', error?.response?.data || error.message);
		}
	}
};

const getUserInfo = async () => {
	if (VueCookies.get('token')) {
		try {
			// const response = await axios.get(`${API_URL}/client/info`);
			// userInfo.value = response.data;
			userInfo.value = {
				"id": 2,
				"email": "student@gmail.com",
				"first_name": "Pete",
				"last_name": "Deckow",
				"iin": "668555715520",
				"organization_id": 1,
				"group_id": 1,
				"is_active": true,
				"created_at": "2025-04-17T07:05:23.000000Z",
				"updated_at": "2025-04-17T07:05:23.000000Z",
				"roles": [
					{
						"id": 2,
						"name": "Студент",
						"slug": "student",
						"created_at": "2025-04-17T07:05:22.000000Z",
						"updated_at": "2025-04-17T07:05:22.000000Z",
						"pivot": {
							"user_id": 2,
							"role_id": 2
						}
					}
				],
				"client_infos": {
					"id": 2,
					"user_id": 2,
					"has_courses": 0,
					"complete_course_count": 0,
					"complete_tasks": 0,
					"pastime": "1.3666666666667",
					"image_bg": "http://localhost:8081/storage/bgProfile/Капли.jpg",
					"created_at": "2025-04-17T07:05:23.000000Z",
					"updated_at": "2025-05-10T13:07:15.000000Z"
				},
				"user_image": {
					"id": 2,
					"user_id": 2,
					"image_path": "http://localhost:8081/storage/userAvatars/default_avatars.jpg",
					"created_at": "2025-04-17T07:05:23.000000Z",
					"updated_at": "2025-04-17T07:05:23.000000Z"
				}
			}
			VueCookies.set('role', userInfo.value.roles[0].slug);
		} catch (error) {
			console.error('Error logging time:', error?.response?.data?.error || "Неизвестная ошибка");

			if (error.response) {
				console.log('Ошибка HTTP:', error.response.status);
				console.log('Ответ от сервера:', error.response.data);
			} else if (error.request) {
				// Ошибка, если запрос был отправлен, но не получили ответ
				console.log('Ошибка запроса, ответа нет:', error.request);
			} else {
				// Другие ошибки
				console.log('Ошибка в настройке запроса:', error.message);
			}

			// Обработка 401 ошибки (неавторизованный доступ)
			if (error.response && error.response.status === 401) {
				VueCookies.remove('token');
				VueCookies.remove('role');
				notificationRef.value.showNotification('Пожалуйста войдите в систему для этой страницы');
				setTimeout(() => {
					if (route.path !== '/auth') {
						router.push('/auth');
					}
				}, 300);
			}
		}
	}
};


provide('userInfo', userInfo);

onMounted(() => {
	if (VueCookies.get('token')) {
		startTime = Date.now();
	}
	getUserInfo();
});

onBeforeUnmount(() => {
	logTimeSpent();
	window.removeEventListener('beforeunload', logTimeSpent);
});

window.addEventListener('beforeunload', logTimeSpent);
</script>