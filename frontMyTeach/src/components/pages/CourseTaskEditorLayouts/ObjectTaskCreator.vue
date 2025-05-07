<template>
    <div class="modal-overlay" @click.self="showOption = false">
        <div class="modal-content" @click.self="showOption = false">
            <div class="selectOptions" @click.self="showOption = false">
                <input type="text" placeholder="Выберите тип" :value="displayedType" readonly @focus="showOptionFunc" />
                <div class="options" v-if="showOption">
                    <p @click="selectType('TEXT')">Текстовый блок</p>
                    <p @click="selectType('MEDIA')">Медиа</p>
                </div>
            </div>
            <div class="modal-action">
                <button @click="save">Сохранить</button>
                <button @click="emit('cancel')">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const showOption = ref(false);
const selectedType = ref('');

const emit = defineEmits(['confirm', 'cancel']);

const displayedType = computed(() => {
  if (selectedType.value === 'TEXT') return 'Текстовый блок';
  if (selectedType.value === 'MEDIA') return 'Медиа';
  return '';
});

const showOptionFunc = () => {
  showOption.value = true;
};

const selectType = (type) => {
  selectedType.value = type;
  showOption.value = false;
};

const save = () => {
    emit('confirm', selectedType.value );
};
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
    background: #303030;
    padding: 20px;
    border-radius: 10px;
    width: 600px;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.modal-content input {
    width: 100%;
    padding: 10px;
    outline: none;
    color: #fff;
    border-radius: 10px;
    background-color: #505050;
    border: none;
}


.selectOptions {
    position: relative;
}

.options {
    position: absolute;
    background-color: #505050;
    width: 100%;
    border-radius: 10px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px 0;
}

.options p {
    width: 100%;
    cursor: pointer;
    margin: 0;
    padding: 10px;
}

.options p:hover {
    background-color: #555555;
}

.modal-action {
    display: flex;
    gap: 20px;
}

.modal-action button {
    background-color: #505050;
    width: 100%;
    color: #fff;
    padding: 10px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
}

.modal-action button:hover {
    background: #707070;
}
</style>