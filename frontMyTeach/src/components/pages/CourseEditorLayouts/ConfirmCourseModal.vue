<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <h3>Подтверждение</h3>
            <p>{{ message }}</p>

            <div class="modal-actions">
                <button @click="$emit('confirm')" class="confirm-btn">Да</button>
                <button @click="$emit('cancel')" class="cancel-btn">Нет</button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    message: String
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: rgb(48, 48, 48);
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    max-width: 90%;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.modal-actions button{
    border-radius: 10px;
    background-color: #59008E;
    border: none;
    padding: 5px 20px;
    cursor: pointer;
}

</style>