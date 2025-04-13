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
		const publicPages = ['/', '/auth', '/register', '/aboutUs','/catalog'];
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
			const response = await axios.get(`${API_URL}/client/info`);
			userInfo.value = response.data;
			VueCookies.set('role', userInfo.value.roles[0].slug);	
			// userInfo.value = {
			// 	"id": 2,
			// 	"email": "student@gmail.com",
			// 	"first_name": "Antonio",
			// 	"last_name": "Banderes",
			// 	"role": "teacher",
			// 	"created_at": "2025-04-03T15:30:52.000000Z",
			// 	"updated_at": "2025-04-03T15:30:52.000000Z",
			// 	"client_infos": {
			// 		"id": 2,
			// 		"user_id": 2,
			// 		"has_courses": null,
			// 		"complete_course_count": null,
			// 		"complete_tasks": null,
			// 		"pastime": "0.56666666666667",
			// 		"image_bg": "http://localhost:8081/storage//bgProfile/Чистилище.jpg",
			// 		"created_at": "2025-04-03T15:30:43.000000Z",
			// 		"updated_at": "2025-04-04T19:23:18.000000Z"
			// 	},
			// 	"user_image": {
			// 		"id": 2,
			// 		"user_id": 2,
			// 		"image_path": "http://localhost:8081/storage/userAvatars/default_avatars.jpg",
			// 		"created_at": "2025-04-03T15:30:52.000000Z",
			// 		"updated_at": "2025-04-03T15:30:52.000000Z"
			// 	}
			// }
		} catch (error) {
			console.error('Error fetching user info:', error);
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
