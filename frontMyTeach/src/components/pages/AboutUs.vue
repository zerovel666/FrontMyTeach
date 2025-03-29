<template>
<TopBar />
<div class="containerBody">
    <div class="content">
        <div class="imgPrev">
            <img src="/src/assets/images/layouts/FooterImg.svg" alt="">
        </div>
        
    </div>
</div>
<FooterBar />
</template>

<script setup>
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';


</script>

<style scoped>
.imgPrev{
    display: flex;
    justify-content: center;
}

.imgPrev img{
    width: 600px;
}
</style>