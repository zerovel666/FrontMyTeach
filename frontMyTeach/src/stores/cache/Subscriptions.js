import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useSubscriptionStore = defineStore('subscription', () => {
    const subscription = ref(null);
    const courses = ref(null)

    async function getSubscription() {
        if (!subscription.value) {
            const response = await axios.get(`${API_URL}/subscription/all`);
            subscription.value = response.data
        }
    }

    async function getCourses(params) {
        const response = await axios.get(`${API_URL}/course/all`)
        courses.value = response.data

    }

    return {
        subscription,
        courses,
        getCourses,
        getSubscription,
    };
});