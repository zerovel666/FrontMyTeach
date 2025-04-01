<template>
	<div v-if="$loading.active" class="loader">
		<a-spin size="large" />
	</div>
	<router-view />
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, provide } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue';
import VueCookies from 'vue-cookies';
import axios from 'axios';
import { API_URL } from './config';

const router = useRouter();
const instance = getCurrentInstance();
const loading = instance.appContext.config.globalProperties.$loading;
const userInfo = ref(null);
let startTime = 0;

watch(
	() => loading.active,
	(newVal) => {
		document.body.style.overflow = newVal ? 'hidden' : '';
	}
);

if (!VueCookies.get('token')) {
	router.push('/auth');
}

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
	try {
		// const response = await axios.get(`${API_URL}/client/info`);
		// userInfo.value = response.data;

		const response = {
			"id": 1,
			"email": "student@gmail.com",
			"first_name": "Antonio",
			"last_name": "Banderes",
			"role": "student",
			"created_at": "2025-03-31T19:05:28.000000Z",
			"updated_at": "2025-03-31T19:05:28.000000Z",
			"client_infos": {
				"id": 1,
				"user_id": 1,
				"has_courses": 1,
				"complete_course_count": null,
				"complete_tasks": null,
				"pastime": "90.816666666666",
				"created_at": "2025-03-31T19:07:21.000000Z",
				"updated_at": "2025-03-31T19:19:22.000000Z"
			},
			"user_image": {
				"id": 1,
				"user_id": 1,
				"image_path": "/public/storage/images/default_avatars.jpg",
				"created_at": "2025-03-31T19:05:28.000000Z",
				"updated_at": "2025-03-31T19:05:28.000000Z"
			}
		}
		userInfo.value = response
	} catch (error) {
		console.error('Error fetching user info:', error);
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
