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

            // banners.value = [
            //     {
            //         "id": 1,
            //         "course_id": null,
            //         "image_path": "http://localhost:8083/storage/posters/GR8dFLd7muYe6sQtqyOqUkzXQJoPgdCPwfHuKCjf.jpg",
            //         "active": false,
            //         "created_at": "2025-05-15T14:27:56.000000Z",
            //         "updated_at": "2025-05-15T14:27:56.000000Z"
            //     },
            //     {
            //         "id": 2,
            //         "course_id": null,
            //         "image_path": "http://localhost:8083/storage/posters/4Uq8YK81T4F3RbU9L0P0aziY2JUudKuRqZb3ZCC6.png",
            //         "active": false,
            //         "created_at": "2025-05-15T14:28:15.000000Z",
            //         "updated_at": "2025-05-15T14:28:15.000000Z"
            //     }
            // ]
        }
    }


    return {
        banners,
        getBanners,
    };
});