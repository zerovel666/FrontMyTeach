<template>
	<div class="body">
		<img src="/src/assets/images/auth/BGauth.svg" alt="" id="bg">
		<transition name="fade">
			<img v-if="showLogo" src="/src/assets/Icons/Icon.svg" alt="" id="logo">
		</transition>
	</div>
</template>

<script setup>
defineProps({
	showLogo: Boolean
});
</script>

<style scoped>
.body {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 97vh;
}

#bg {
	width: 100%;
	height: 100%;
}

#logo {
	position: absolute;
	width: 100px;
	height: 100px;
	transition: opacity 1s ease-in-out;
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