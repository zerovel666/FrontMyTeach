import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useUsersStore = defineStore('users', () => {
    const users = ref(null);

    async function getUsers() {
        if (!users.value) {
            const response = await axios.get(`${API_URL}/admin/getAllUsers`);
            users.value = response.data

        
        }
    }

    async function setUserById(userData, user_id) {
        if (userData && user_id) {
            const index = users.value.findIndex(user => user.id === user_id);
            if (index !== -1) {
                users.value[index] = { ...userData };
            }
        }
    }


    return {
        users,
        getUsers,
        setUserById
    };
});