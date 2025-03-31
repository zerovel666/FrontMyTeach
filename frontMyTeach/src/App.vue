<template>
	<div v-if="$loading.active" class="loader">
		<a-spin size="large" />
	</div>
	<router-view />
</template>

<script setup>
import { watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue';
import VueCookies from 'vue-cookies';
import axios from 'axios';
import { API_URL } from './config';

const router = useRouter();
const instance = getCurrentInstance();
const loading = instance.appContext.config.globalProperties.$loading;

watch(
	() => loading.active,
	(newVal) => {
		document.body.style.overflow = newVal ? 'hidden' : '';
	}
);

if (!VueCookies.get('token')) {
	router.push('/auth');
}

let startTime = 0;

onMounted(() => {
	if (VueCookies.get('token')) {
		startTime = Date.now();
	}
});

const logTimeSpent = async () => {
	if (VueCookies.get('token')) {
		const totalTime = Math.floor((Date.now() - startTime) / 1000);
		const data = {
			time: totalTime
		};
		console.log('goAwait');
		await axios.post(`${API_URL}/client/analytics/time`, data)
	}
};

onBeforeUnmount(logTimeSpent);
window.addEventListener('beforeunload', logTimeSpent);

onBeforeUnmount(() => {
	window.removeEventListener('beforeunload', logTimeSpent);
});
</script>


<style scoped></style>
