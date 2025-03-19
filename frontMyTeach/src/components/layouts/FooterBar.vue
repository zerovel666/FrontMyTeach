<template>
    <div class="container">
        <div class="content">
            <div class="networks">
                <h3>Социальные сети:</h3>
                <p>Facebook <img src="/src/assets/Icons/facebook.svg" alt=""></p>
                <p>Instagram <img src="/src/assets/Icons/instagram.svg" alt=""></p>
                <p>Telegram <img src="/src/assets/Icons/telegram.svg" alt=""></p>
            </div>
            <img src="/src/assets/images/layouts/FooterImg.svg" alt="">
            <div class="contacts">
                <h3>Контакты:</h3>
                <p>+7 708 605 5840</p>
                <p>MyTeach@gmail.com</p>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.container {
    min-height: 350px;
    width: 100%;
    background: linear-gradient(140deg, #11001C 0%, #59008E 100%);
    margin-top: 200px;
    border-radius: 40px 40px 0 0;
    box-shadow: 0px 10px 40px white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content {
    width: 70%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.networks{
    text-align: center;
}
.networks p{
    color: #6D92FF;
}
.contacts{
    text-align: center;
}
.contacts p{
    color: #6D92FF;
}
</style>