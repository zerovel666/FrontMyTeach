import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useAnalyticsStore = defineStore('analytics', () => {
    const analytics = ref(null);
    const progressLinePercent = ref(0);

    function calculateRelevance(data) {
        let total = 0;
        total = (
            Math.min(data.user_count * 5, 20) * 0.25 +
            Math.min(data.count_sale * 2, 20) * 0.30 +
            Math.min(data.total_amount_sale / 3000, 20) * 0.30 +
            Math.min(data.time_use / 5, 20) * 0.10 +
            Math.min(data.task * 2, 20) * 0.05
        );
        return Math.round(total);

    }

    async function fetchAnalytics() {
        if (!analytics.value) {
            const response = await axios.get(`${API_URL}/admin/allAnalitics`);
            analytics.value = response.data;
           
            progressLinePercent.value = calculateRelevance(analytics.value);
        }
    }

    return {
        analytics,
        progressLinePercent,
        fetchAnalytics,
    };
});
