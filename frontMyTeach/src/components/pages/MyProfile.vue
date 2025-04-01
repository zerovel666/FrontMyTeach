<template>
<TopBar />
<div class="containerBody">
    <div class="content">
        <div class="myProfile">
            <div class="top">
                <div class="icon">
                    <img src="/src/assets/Icons/editorIcon.svg" alt="">
                </div>
                <div class="avatar">
                    <img :src="userInfo.user_image.image_path" alt="">
                </div>
            </div>
            <div class="bottom">
                <div class="bg">
                    <div class="bottom-content">
                       <div class="userInfoFNE">
                            <p class="fname">{{ userInfo.first_name}} {{ userInfo.last_name }}</p>
                            <p class="email"> {{ userInfo.email }} </p>
                       </div>
                       <div class="learningInfo">
                            <p class="time">Время обучения : {{ Math.round(userInfo.client_infos.pastime) }} ч</p>
                            <div class="taskInfo">
                                <p>Курсов пройдено : {{ userInfo.client_infos.complete_course_count ?? "0" }}</p>
                                <p>Задач решено : {{ userInfo.client_infos.complete_tasks ?? "0" }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<FooterBar />
</template>

<script setup>
import { inject } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';

const userInfo = inject('userInfo');

</script>

<style scoped>
.myProfile{
    display: flex;
    flex-direction: column;
    width: 100%;
}
.content{
    margin-top: 50px;
}
.top{
    border-radius: 20px 20px 0 0;
    background-image: url('/src/assets/images/profileBackground/standartBg.jpg');
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    width: 100%;
    height: 200px;
    border: 1px solid #fff;
}
.icon,.avatar{
    position: absolute;
}
.avatar img{
    width: 200px;
    height: 200px;
    border-radius: 100%;
    object-fit: cover;
    border: 4px solid #fff;
}
.icon{
    right: 10px;
    top: 10px;
    cursor: pointer;
}
.avatar {
    bottom: -50%;
    left: 50%;
    transform: translateX(-50%);
}
.bottom{
    background: linear-gradient(#DAA3FF,#47106B);
    height: 400px;
    border-radius: 0 0 20px 20px;
    border: 1px solid #fff;
}
.bg{
    background-image: url('/src/assets/images/layouts/BgProfile.svg');
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
}
.bottom-content{
    width: 100%;
    height: 100%;
    max-width: 600px;
    max-height: 250px;
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.fname{
    text-align: center;
    font-size: 38px;
    max-width: 300px;
    margin: 0;
}
.email{
    font-size: 16px;
    text-align: center;
    opacity: 0.6;
    margin: 0;
    margin-top: 10px;
}
.learningInfo{
    margin-top: 50px;
    font-weight: 200;
}
.time{
    text-align: center;
}
.taskInfo{
    margin-top: 50px;
    display: flex;
    gap: 50px;
}
</style>