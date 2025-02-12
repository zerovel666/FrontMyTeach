<template>
	<div class="container">
		<PreLoad :show-logo="showLogo" />
		<transition name="fade">
			<div v-if="!showLogo" class="loginCont">
				<form action="" class="loginForm">
					<input type="text" placeholder="Login">
					<input type="text" placeholder="Password">
					<button>Auth</button>
				</form>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PreLoad from '@/components/auth/PreLoad.vue';

const showLogo = ref(true);

onMounted(() => {
	setTimeout(() => {
		showLogo.value = false;
	}, 3000);
});
</script>

<style scoped>

.container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 97vh;
	position: relative;
}

.loginCont {
	width: 300px;
	height: 300px;
	transition: opacity 1s ease-in-out;
	position: absolute;
}
.loginForm {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
}

.loginForm input {
    width: 280px;
    height: 40px;
    margin: 15px;
    border-radius: 15px;
    display: flex;
    align-items: center; 
    padding-left: 10px; 
    font-size: 24px;
}

.loginForm button{
	width: 140px;
	height: 40px;
	border-radius: 15px;
	font-size: 32px;
	font-weight: 100;
	box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.5);
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