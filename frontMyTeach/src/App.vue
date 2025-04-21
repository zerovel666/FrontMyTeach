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
      notificationRef.value.showNotification('Сессия истекла. Пожалуйста войдите снова');
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
			console.error('Error logging time:', error);
		}
	}
};

const getUserInfo = async () => {
	if (VueCookies.get('token')) {
		try {
			// const response = await axios.get(`${API_URL}/client/info`);
			// userInfo.value = response.data;
			userInfo.value = {
				"id": 4,
				"email": "director@gmail.com",
				"first_name": "Edison",
				"last_name": "Rice",
				"iin": "475204701005",
				"organization_id": 1,
				"group_id": 1,
				"is_active": true,
				"created_at": "2025-04-15T18:33:19.000000Z",
				"updated_at": "2025-04-15T18:33:19.000000Z",
				"roles": [
					{
						"id": 4,
						"name": "Директор",
						"slug": "director",
						"created_at": "2025-04-15T18:33:17.000000Z",
						"updated_at": "2025-04-15T18:33:17.000000Z",
						"pivot": {
							"user_id": 4,
							"role_id": 4
						}
					}
				],
				"client_infos": {
					"id": 4,
					"user_id": 4,
					"has_courses": 0,
					"complete_course_count": 0,
					"complete_tasks": 0,
					"pastime": "0",
					"image_bg": "http://localhost:8081/storage/bgProfile/Капли.jpg",
					"created_at": "2025-04-15T18:33:19.000000Z",
					"updated_at": "2025-04-15T18:33:19.000000Z"
				},
				"user_image": {
					"id": 4,
					"user_id": 4,
					"image_path": "http://localhost:8081/storage/userAvatars/default_avatars.jpg",
					"created_at": "2025-04-15T18:33:19.000000Z",
					"updated_at": "2025-04-15T18:33:19.000000Z"
				}
			}
			VueCookies.set('role', userInfo.value.roles[0].slug);
		} catch (error) {
			console.log('Ошибка при запросе user info:', error);

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