import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useCheckingsStore = defineStore('checkings', () => {
    const checkings = ref(null);

    async function getCheckings() {
        if (!checkings.value) {
            const response = await axios.get(`${API_URL}/admin/getForChecked`)
            checkings.value = response.data

           
        }
    }


    return {
        checkings,
        getCheckings,
    };
});