<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Подтверждение</h3>
                <button class="close-btn" @click="close">&times;</button>
            </div>
            <div class="modal-body">
                <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
                <button class="btn cancel" @click="close">Отмена</button>
                <button class="btn confirm" @click="confirm">Подтвердить</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    message: String
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
    emit('confirm');
};

const close = () => {
    emit('cancel');
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #1E1E1E;
    border-radius: 12px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.3rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #aaa;
    cursor: pointer;
    padding: 0 10px;
}

.close-btn:hover {
    color: white;
}

.modal-body {
    padding: 20px;
}

.modal-body p {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
}

.modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #333;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn.cancel {
    background-color: #333;
    color: white;
    border: 1px solid #444;
}

.btn.cancel:hover {
    background-color: #444;
}

.btn.confirm {
    background-color: #ff6b6b;
    color: white;
    border: none;
}

.btn.confirm:hover {
    background-color: #ff5252;
}
</style>