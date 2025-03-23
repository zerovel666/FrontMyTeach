<template>
<TopBar />
<div class="containerBody">
    <Filter />
</div>
<FooterBar />
</template>

<script setup>
import { ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import Filter from './CatalogLayouts/Filter.vue';

const searchInput = ref('');
const showOption = ref(false);


</script>

<style scoped>

</style>