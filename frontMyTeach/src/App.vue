<template>
	<div v-if="$loading.active" class="loader">
		<a-spin size="large" />
	</div>
	<router-view />
</template>

<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue';
import VueCookies from 'vue-cookies';

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
</script>

<style scoped>

</style>
