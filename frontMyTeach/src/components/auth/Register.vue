<template>
	<div class="container">
		<PreLoad :show-logo="showLogo" />
		<transition name="fade">
			<div v-if="!showLogo" class="loginCont">
				<img src="/src/assets/Icons/Icon.svg" alt="" id="logo">
				<form action="" class="loginForm">
					<input type="text" placeholder="Email">
					<input type="text" placeholder="Password">
					<input type="text" placeholder="Access Password">
                    <input type="text" placeholder="First Name">
                    <input type="text" placeholder="Last Name">
                    <div class="checkboxRole">
                        <div class="checkbox">
                            <p>Student</p>
                            <input type="checkbox" v-model="studentCheckBox">
                        </div>
                        <div class="checkbox">
                            <p>Teacher</p>
                            <input type="checkbox" v-model="teacherCheckBox">
                        </div>
                    </div>
					<button>Register</button>
                    <router-link to="/auth">Redirect auth</router-link>
				</form>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import PreLoad from '@/components/auth/PreLoad.vue';

const showLogo = ref(true);
const studentCheckBox = ref(false)
const teacherCheckBox = ref(false)


watch(studentCheckBox, (val) => {
  if (val) teacherCheckBox.value = false;
});

watch(teacherCheckBox, (val) => {
  if (val) studentCheckBox.value = false;
});

onMounted(() => {
	setTimeout(() => {
		showLogo.value = false;
	}, 500);
});
</script>

<style scoped>

.loginCont a {
	display: flex;
	justify-content: center;
	text-align: center;
	text-decoration: none;
	color: white;
	font-size: 14px;
	margin-top: 5%;

	font-family: 'Anonymous Pro', monospace;
}
#logo{
	position: absolute;
	top: -20%;
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
.checkboxRole{
    display: flex;
    justify-content:space-between;
    align-items: center;
    accent-color: #af00b8;
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

.loginForm input[type="text"] {
    width: 240px;
    height: 30px;
    margin: 10px;
    border-radius: 15px;
    display: flex;
    align-items: center; 
    padding-left: 10px; 
    font-size: 24px;
}

.loginForm input[type="checkbox"] {
    border-radius: 15px;
    display: flex;
    align-items: center; 
    font-size: 24px;
    height: 20px;
    width: 20px;
    margin: 10px;
}
.loginForm button {
	width: 140px;
	height: 30px;
	border-radius: 15px;
	font-size: 22px;
	font-weight: 100;
	box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.5);
	margin:10px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.checkbox{
    display: flex;
    justify-content: center;
    align-items: center;
}
.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}
</style>