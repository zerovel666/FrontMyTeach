<template>
    <div class="container">
        <NavAdmin @changePage="changePage" class="navAdmin" />
        <div class="content">
            <MainComponent v-if="currentPage === 'main'" />
            <UsersComponent v-if="currentPage === 'users'" />
            <CoursesComponent v-if="currentPage === 'course'" />
            <CheckingComponent v-if="currentPage === 'checking'" />
            <OrganizationComponent v-if="currentPage === 'organization'" />
            <BannersComponent v-if="currentPage === 'banners'" />
            <SubscriptionComponent v-if="currentPage === 'subscriptions'" />
            <CategoriesComponent v-if="currentPage === 'categories'" />
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
import CoursesComponent from './Navigation/CoursesComponent.vue';
import CheckingComponent from './Navigation/CheckingComponent.vue';
import OrganizationComponent from './Navigation/OrganizationComponent.vue';
import BannersComponent from './Navigation/BannersComponent.vue';
import SubscriptionComponent from './Navigation/SubscriptionComponent.vue';
import CategoriesComponent from './Navigation/CategoriesComponent.vue';

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
.navAdmin{
    width: 30%;
    height: auto;
}

.content {
    width: 70%;
    padding: 50px;
}
</style>
