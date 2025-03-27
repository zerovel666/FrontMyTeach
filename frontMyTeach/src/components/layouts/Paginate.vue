<template>
    <div class="content" v-if="paginateData?.links?.length">
        <div class="pagination">
            <button 
                class="buttonPrev" 
                :disabled="!paginateData.links[0]?.url || !paginateData.links[0].url.includes('page=')"
                v-if="paginateData.links[0]?.label.includes('Previous')"
                @click="emitPage(paginateData.links[0].url)"
            >
                < 
            </button>

            <button 
                v-for="(link, index) in paginateData.links.slice(1, -1)" 
                :key="index"
                :class="{ 'active-page': link.active }"
                class="page-number"
                @click="emitPage(link.url)"
                :disabled="!link.url || !link.url.includes('page=') || link.active"
            >
                {{ link.label }}
            </button>

            <button 
                class="buttonNext" 
                :disabled="!paginateData.links.at(-1)?.url || !paginateData.links.at(-1).url.includes('page=')"
                v-if="paginateData.links.at(-1)?.label.includes('Next')"
                @click="emitPage(paginateData.links.at(-1).url)"
            >
                >
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const props = defineProps({
    paginateData: Object
});

const emit = defineEmits(['howPage']);

const emitPage = (url) => {
    if (url && url.includes('page=')) {
        emit('howPage', url);
    }
};
</script>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    gap: 5px;
}

button {
    padding: 5px 10px;
    border-radius: 5px;
    background: linear-gradient(90deg, #350457, #59008E);
    cursor: pointer;
    border: none;
}

button:disabled {
    background: #444;
    opacity: 0.6;
    cursor: default;

}

.active-page {
    background: linear-gradient(90deg, #8759a7, #9804ee) !important;
    opacity: 1 !important;
    cursor: default;
    pointer-events: none;
}
</style>
