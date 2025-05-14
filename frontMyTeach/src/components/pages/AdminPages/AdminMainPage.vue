<template>
    <div class="container">
        <NavAdmin @changePage="changePage" />
        <div class="content">
            <MainComponent v-if="currentPage === 'main'" />
            <UsersComponent v-if="currentPage === 'users'" />
        </div>
    </div>
    <Notification ref="notificationRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';
import Notification from '@/components/Notification.vue';
import NavAdmin from './NavAdmin.vue';

import MainComponent from './Navigation/MainComponent.vue';
import UsersComponent from './Navigation/UsersComponent.vue';

const router = useRouter();
const notificationRef = ref(null);
const currentPage = ref('main');

function changePage(page) {
    if (page === 'interface') {
        router.push('/');
        return;
    }
    currentPage.value = page;
}

onMounted(() => {
    document.body.classList.remove('bg-custom');

    if (VueCookies.get('role') !== 'admin') {
        notificationRef.value?.showNotification('Недостаточно прав');
        setTimeout(() => router.push('/'), 2000);
    }
});
</script>

<style scoped>
.container {
    display: flex;
}

.content {
    padding: 50px;
}
</style>
