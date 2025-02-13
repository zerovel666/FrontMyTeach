<template>
	<div class="container">
		<PreLoad :show-logo="showLogo" />
		<transition name="fade">
			<div v-if="!showLogo" class="loginCont">
				<img src="/src/assets/Icons/Icon.svg" alt="" id="logo">
				<form action="" class="loginForm">
					<input type="text" placeholder="Login">
					<input type="text" placeholder="Password">
					<button>Auth</button>
				</form>
				<a href="">Don't have account?</a>
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
	}, 1000);
});
</script>

<style scoped>
#logo{
	position: absolute;
	top: -90%;
	left: 35%;
	width: 100px;
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
    font-size: 24px;
}

.loginForm button {
	width: 140px;
	height: 30px;
	border-radius: 15px;
	font-size: 24px;
	font-weight: 100;
	box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.5);
	margin:10px;
}

@import url('https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400&display=swap');

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