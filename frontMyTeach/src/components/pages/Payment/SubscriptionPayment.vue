<template>
    <div class="payment-page">
        <div class="blurred-logo"></div>

        <div class="payment-container">
            <div class="payment-header">
                <h1>Оформление подписки</h1>
                <p class="subscription-name">К оплате</p>
                <p class="amount">{{ paidInfo?.objectPending?.amount }} {{ paidInfo?.objectPending?.currency }}</p>
            </div>

            <form class="payment-form" @submit.prevent="handlePayment" autocomplete="off">
                <div class="form-group">
                    <label>Номер карты</label>
                    <input type="text" v-model="paid.card_num" placeholder="1234 5678 9012 3456" maxlength="19"
                        @input="formatCardNumber" autocomplete="cc-number" inputmode="numeric">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Срок действия</label>
                        <input type="text" v-model="paid.period_card" placeholder="MM/ГГ" maxlength="5"
                            @input="formatCardDate" autocomplete="cc-exp" inputmode="numeric">
                    </div>

                    <div class="form-group">
                        <label>CVV/CVC</label>
                        <input type="password" v-model="paid.cvv" placeholder="•••" maxlength="3" autocomplete="cc-csc"
                            inputmode="numeric">
                    </div>
                </div>

                <div class="form-group">
                    <label>Имя и фамилия</label>
                    <input type="text" v-model="paid.fn_ln_card" placeholder="Как на карте" autocomplete="cc-name">
                </div>

                <button type="submit" class="pay-button">
                    Оплатить {{ paidInfo?.objectPending?.amount }} {{ paidInfo?.objectPending?.currency }}
                </button>

                <div class="payment-methods">
                    <img src="/src/assets/images/paymentMethod/Visa.svg" alt="Visa">
                    <img src="/src/assets/images/paymentMethod/masterCard.svg" alt="Mastercard">
                    <img src="/src/assets/images/paymentMethod/unionPay.svg" alt="UnionPay">
                </div>

                <p class="security-info">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#B14788"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
                            fill="#B14788" />
                        <path d="M12 12V15" stroke="#B14788" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    Ваши данные защищены
                </p>
            </form>
        </div>
    </div>

    <Notification ref="notificationRef" />
</template>

<script setup>
import Notification from '@/components/Notification.vue';
import { API_URL } from '@/config';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const paid = ref({
    card_num: null,
    cvv: null,
    period_card: null,
    fn_ln_card: null,
    amount: null,
});
const paidInfo = ref({});
const notificationRef = ref(null);

const getPaidInfo = async () => {
    try {
        const response = await axios.get(`${API_URL}/subscription/showPay/${route.params.uuid}`);
        paidInfo.value = response.data;
        paid.value.amount = response.data.objectPending.amount
    } catch (error) {
        console.error('Error fetching payment info:', error);
    }
};

const formatCardNumber = (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];

    for (let i = 0; i < match.length; i += 4) {
        parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
        paid.value.card_num = parts.join(' ');
    } else {
        paid.value.card_num = value;
    }
};

const formatCardDate = (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    paid.value.period_card = value;
};

const handlePayment = async () => {
    try {
        const cardNumberValid = paid.value.card_num?.replace(/\s/g, '').length === 16;
        if (!cardNumberValid) {
            notificationRef.value.showNotification('Номер карты должен содержать 16 цифр');
            return;
        }

        const cvvValid = /^\d{3}$/.test(paid.value.cvv);
        if (!cvvValid) {
            notificationRef.value.showNotification('CVV должен содержать 3 цифры');
            return;
        }

        const dateValid = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paid.value.period_card);
        if (!dateValid) {
            notificationRef.value.showNotification('Срок действия карты должен быть в формате MM/ГГ (01-12/01-99)');
            return;
        }

        if (!paid.value.fn_ln_card?.trim()) {
            notificationRef.value.showNotification('Укажите имя и фамилию как на карте');
            return;
        }

        if (!paid.value.amount || Number(paid.value.amount) <= 0) {
            notificationRef.value.showNotification('Сумма оплаты не указана');
            return;
        }

        const payload = {
            card_num: Number(paid.value.card_num?.replace(/\s/g, '')),
            cvv: Number(paid.value.cvv),
            period_card: paid.value.period_card,
            fn_ln_card: paid.value.fn_ln_card.trim(),
            amount: Number(paid.value.amount)
        };

        const response = await axios.post(
            `${API_URL}/subscription/paid/${route.params.uuid}`,
            payload
        );
        notificationRef.value.showNotification('Оплата прошла успешно, в случае неполадок обратитесь в тех.поддержку :)');
    } catch (error) {
        console.log(error);
        notificationRef.value.showNotification(error.response.data.error);
    }
};

onMounted(() => {
    getPaidInfo();
});
</script>

<style scoped>
.payment-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #11001C, #59008E);
    position: relative;
    overflow: hidden;
    padding: 20px;
}

.blurred-logo {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('@/assets/Icons/logo.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 70%;
    opacity: 0.1;
    filter: blur(8px);
    z-index: 0;
}

.payment-container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-height: 700px;
    max-width: 500px;
    padding: 40px;
    position: relative;
    z-index: 1;
    overflow: hidden;
    border: 1px solid black;
}

.payment-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    background: linear-gradient(90deg, #B14788, #8100CC);
}

.payment-header {
    text-align: center;
    margin-bottom: 30px;
}

.payment-header h1 {
    color: #11001C;
    font-size: 1.8rem;
    margin-bottom: 5px;
}

.subscription-name {
    color: #59008E;
    font-size: 1.1rem;
    margin-bottom: 10px;
}

.amount {
    font-size: 2rem;
    font-weight: bold;
    color: #8100CC;
    margin: 10px 0;
}

.payment-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: black;
}

.form-group label {
    color: #11001C;
    font-weight: 500;
    font-size: 0.9rem;
}

.form-group input {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s;
    width: 100%;
    box-sizing: border-box;
}

.form-group input:focus {
    border-color: #B14788;
    box-shadow: 0 0 0 3px rgba(177, 71, 136, 0.2);
    outline: none;
}

.form-row {
    display: flex;
    gap: 20px;
}

.form-row .form-group {
    flex: 1;
}

.pay-button {
    background: linear-gradient(135deg, #B14788, #8100CC);
    color: white;
    border: none;
    padding: 16px;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    transition: all 0.3s;
}

.pay-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(129, 0, 204, 0.4);
}

.payment-methods {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 20px 0;
}

.payment-methods img {
    height: 30px;
    opacity: 0.7;
    transition: opacity 0.3s;
}

.payment-methods img:hover {
    opacity: 1;
}

.security-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #666;
    font-size: 0.9rem;
    margin-top: 10px;
}

@media (max-width: 600px) {
    .payment-container {
        padding: 30px 20px;
    }

    .form-row {
        flex-direction: column;
        gap: 20px;
    }
}
</style>