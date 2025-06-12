import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useBannersStore = defineStore('banners', () => {
    const banners = ref(null);

    async function getBanners() {
        if (!banners.value) {
            const response = await axios.get(`${API_URL}/admin/poster/all`)
            banners.value = response.data

            
        }
    }


    return {
        banners,
        getBanners,
    };
});