import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useCategoriesStore = defineStore('categories', () => {
    const categories = ref(null);

    async function getCategories() {
        if (!categories.value) {
            const response = await axios.get(`${API_URL}/course/category/all`)
            categories.value = response.data

        }
    }

    async function updateCategory(nameCategory, editingId) {
        try {
            await axios.put(`${API_URL}/course/category/${editingId}`, nameCategory);

            const index = categories.value.findIndex(cat => cat.id === editingId);
            if (index !== -1) {
                categories.value[index].category = nameCategory.category;
            }
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    async function createCategory(nameCategory) {
        try {
            const response = await axios.post(`${API_URL}/course/category/store`, nameCategory);
            categories.value.push(response.data);
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    async function deleteCategory(id) {
        try {
            await axios.delete(`${API_URL}/course/category/${id}`);
            categories.value = categories.value.filter(cat => cat.id !== id);
        } catch (error) {
            console.error('Ошибка при удалении категории:', error);
            throw error;
        }
    }

    return {
        categories,
        getCategories,
        updateCategory,
        createCategory,
        deleteCategory,

    };
});