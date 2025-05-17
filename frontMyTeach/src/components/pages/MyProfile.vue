<template>
    <TopBar />
    <div class="containerBody">
        <div class="content">
            <div class="myProfile" v-if="userInfo">
                <div class="top" :style="{ backgroundImage: `url(${userInfo.client_infos.image_bg})` }">
                    <div class="icon">
                        <img src="/src/assets/Icons/editorIcon.svg" alt="" @click="showModal = true">
                    </div>
                    <div class="avatar">
                        <img :src="userInfo.user_image.image_path" alt="">
                    </div>
                </div>
                <div class="bottom">
                    <div class="bg">
                        <div class="bottom-content">
                            <div class="userInfoFNE">
                                <p class="fname">{{ userInfo.first_name }} {{ userInfo.last_name }}</p>
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
            <div class="certificateCont">
                <h2>Сертификаты</h2>
                <div class="certificates" v-if="certificates.length != 0">
                    <div class="certificate" v-for="(certificate, index) in certificates" :key="index">
                        <div class="image">
                            <img src="/src/assets/Icons/logo.svg" alt="" class="logoCertificate">
                            <img :src="certificate.image_path" alt="" class="bgImageCertificate">
                        </div>
                        <div class="certificate-content">
                            <div class="downloader" @click="downloadCertificate(index)">
                                <img src="/src/assets/Icons/download.svg" alt="Download">
                            </div>

                            <div class="infoCertificate">
                                <h4>Сертификат</h4>
                                <p>{{ certificate.description }}</p>
                                <p>“{{ certificate.course_name }}“</p>
                                <img :src="certificate.course_image_path" alt="">
                                <div class="bootomCertifacte">
                                    <div class="companyInfo">
                                        <div class="CIP">MyTeach</div>
                                        <img src="/src/assets/images/stamp.svg" alt="">
                                    </div>
                                    <div class="date">{{ certificate.date_issue }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="certificates.length == 0">
                    <h4>У вас еще нету полученных сертификатов!</h4>
                </div>
            </div>
        </div>
        <ChangeBgModal :showModal="showModal" @close="showModal = false" />
    </div>
    <FooterBar />
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import ChangeBgModal from './ProfileLayouts/ChangeBgModal.vue';
import axios from 'axios';
import { API_URL } from '@/config';
import html2canvas from 'html2canvas';

const userInfo = inject('userInfo');
const showModal = ref(false)
const certificates = ref([]);

const getCertificate = async () => {
    const response = await axios.get(`${API_URL}/certificate/my/all`);
    certificates.value = response.data;

}

const downloadCertificate = async (index) => {
    const element = document.querySelectorAll('.certificate')[index];
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = `certificate-${index + 1}.png`;
    link.click();
};

onMounted(() => {
    getCertificate();
})
</script>

<style scoped>
.myProfile {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.content {
    margin-top: 50px;
}

.top {
    border-radius: 20px 20px 0 0;
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    width: 100%;
    height: 200px;
    border: 1px solid #fff;
}

.icon,
.avatar {
    position: absolute;
}

.avatar img {
    width: 200px;
    height: 200px;
    border-radius: 100%;
    object-fit: cover;
    border: 4px solid #fff;
}

.icon {
    right: 10px;
    top: 10px;
    cursor: pointer;
}

.avatar {
    bottom: -50%;
    left: 50%;
    transform: translateX(-50%);
}

.bottom {
    background: linear-gradient(#DAA3FF, #47106B);
    height: 400px;
    border-radius: 0 0 20px 20px;
    border: 1px solid #fff;
}

.bg {
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

.bottom-content {
    width: 100%;
    height: 100%;
    max-width: 600px;
    max-height: 250px;
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.fname {
    text-align: center;
    font-size: 38px;
    max-width: 300px;
    margin: 0;
}

.email {
    font-size: 16px;
    text-align: center;
    opacity: 0.6;
    margin: 0;
    margin-top: 10px;
}

.learningInfo {
    margin-top: 50px;
    font-weight: 200;
}

@media (max-width:500px){
    .learningInfo{
        margin-top: 20px;
        margin-left: 20px;
    }
}

.time {
    text-align: center;
}

.taskInfo {
    margin-top: 50px;
    display: flex;
    gap: 50px;
}

h2,
h4 {
    text-align: center;
}

.certificateCont {
    margin-top: 50px;
}

.certificates {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 100px;
    margin-top: 40px;
}

@media (max-width: 1200px) {
    .certificates {
        grid-template-columns: repeat(2, 1fr);
        gap: 60px;
    }
}

@media (max-width: 768px) {
    .certificates {
        grid-template-columns: 1fr;
        gap: 40px;
    }
}


.certificate {
    width: 100%;
    border-radius: 20px;
    border: 1px solid #fff;
    background: linear-gradient(45deg, #001C37 6%, #460067 100%);
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 5px;
}

.image {
    border: 2px solid #fff;
    width: 40%;
    border-radius: 20px 0 0 20px;
    position: relative;
    overflow: hidden;
}

.bgImageCertificate {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.logoCertificate {
    position: absolute;
    left: 50%;
    top: 5%;
    transform: translateX(-50%);
    width: 80px;
}

.certificate-content {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.downloader {
    position: absolute;
    width: 30px;
    height: 30px;
    right: 10px;
    top: 10px;
    background-color: #fff;
    opacity: 0.5;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    cursor: pointer;
}

.downloader img {
    object-fit: contain;
    width: 20px;
    height: 20px;
}

.infoCertificate {
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
}

.infoCertificate h4 {
    margin-bottom: 40px;
}

.infoCertificate p {
    text-align: center;
    font-size: 16px;
}

.infoCertificate img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 100%;
}

.bootomCertifacte {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    bottom: 5px;
}

.companyInfo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.companyInfo img {
    background-color: black;
    width: 40px;
    height: 40px;
}

.CIP {
    font-size: 16px;
}

.date {
    font-size: 16px;
}

</style>