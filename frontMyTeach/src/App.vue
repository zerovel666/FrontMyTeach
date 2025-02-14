<template>
	<router-view/>
</template>

<script setup>
	import { useRouter } from 'vue-router';
	import { onMounted } from 'vue';
	import VueCookies from 'vue-cookies';


	onMounted (() => {
		const token = VueCookies.get('token');
		if (!token) {
			const router = useRouter();
			router.push('/auth');
		}
	});
</script>

<style scoped>

</style>