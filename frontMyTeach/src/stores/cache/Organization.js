import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useOrganizationsStore = defineStore('organizations', () => {
    const organizations = ref(null);

    async function getOrganizations() {
        if (!organizations.value) {
            const response = await axios.get(`${API_URL}/organization/all`)
            organizations.value = response.data
            
        }
    }


    return {
        organizations,
        getOrganizations,
    };
});