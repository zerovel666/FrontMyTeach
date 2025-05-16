<template>
    <div class="container">
        <div class="content">
            <div class="networks">
                <h3>Социальные сети:</h3>
                <p><img src="/src/assets/Icons/facebook.svg" alt=""> Facebook</p>
                <p><img src="/src/assets/Icons/instagram.svg" alt=""> Instagram</p>
                <p><img src="/src/assets/Icons/telegram.svg" alt=""> Telegram</p>
            </div>
            <img src="/src/assets/images/layouts/FooterImg.svg" alt="" class="footer-logo">
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
    width: 100%;
    background: linear-gradient(140deg, #11001C 0%, #59008E 100%);
    padding: 40px 0;
    margin-top: 100px;
    border-radius: 40px 40px 0 0;
    box-shadow: 0px -5px 20px rgba(255, 255, 255, 0.655);
    color: white;
}

.content {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

.networks, .contacts {
    text-align: center;
    width: 100%;
}

.networks h3, .contacts h3 {
    font-size: 1.3rem;
    margin-bottom: 15px;
    color: white;
}

.networks p, .contacts p {
    color: #6D92FF;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
}

.networks p:hover {
    color: white;
    transform: translateX(5px);
}

.networks img, .contacts img {
    width: 20px;
    height: 20px;
}

.footer-logo {
    max-width: 200px;
    height: auto;
    margin: 10px 0;
}

/* Адаптация для планшетов */
@media (min-width: 768px) {
    .content {
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        gap: 20px;
    }
    
    .networks, .contacts {
        width: auto;
        text-align: left;
    }
    
    .networks p, .contacts p {
        justify-content: flex-start;
    }
    
    .footer-logo {
        max-width: 180px;
    }
}

/* Адаптация для десктопов */
@media (min-width: 1024px) {
    .container {
        padding: 60px 0;
    }
    
    .content {
        gap: 40px;
    }
    
    .networks h3, .contacts h3 {
        font-size: 1.5rem;
    }
    
    .footer-logo {
        max-width: 250px;
    }
}

/* Адаптация для очень маленьких экранов */
@media (max-width: 480px) {
    .container {
        margin-top: 60px;
        border-radius: 30px 30px 0 0;
        padding: 30px 0;
    }
    
    .networks h3, .contacts h3 {
        font-size: 1.1rem;
    }
    
    .networks p, .contacts p {
        font-size: 0.9rem;
    }
    
    .footer-logo {
        max-width: 150px;
    }
}
</style>