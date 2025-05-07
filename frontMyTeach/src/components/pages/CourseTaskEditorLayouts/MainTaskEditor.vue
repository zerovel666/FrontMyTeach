<template>
    <div class="modal-overlay"  @click.self="showOption = false">
        <div class="modal-content" @click.self="showOption = false">
            <input type="text" placeholder="Название урока" v-model="localBody.name" />
            <div class="selectOptions">
                <input type="text" placeholder="Выберите тип" :value="displayedType" readonly @focus="showOptionFunc" />
                <div class="options" v-if="showOption">
                    <p @click="selectType('lecture')">Лекция</p>
                    <p @click="selectType('task')">Задача</p>
                </div>
            </div>

            <div class="modal-action">
                <button @click="save">Сохранить</button>
                <button @click="emit('cancel')">Закрыть</button>
            </div>
        </div>
    </div>

    <Notification ref="notificationRef" />
</template>

<script setup>
import Notification from '@/components/Notification.vue';
import { ref, computed, watch } from 'vue';

const showOption = ref(false);
const notificationRef = ref(null);

const localBody = ref({
    id: '',
    name: '',
    type: ''
});

const props = defineProps({
    currentTask: Object
});

async function showOptionFunc() {
    const currentTask = props.currentTask || {};
    const hasLecture = currentTask.lecture 
        ? (Array.isArray(currentTask.lecture) 
            ? currentTask.lecture.length > 0 
            : !!currentTask.lecture)
        : false;
    
    const hasModule = currentTask.module
        ? (Array.isArray(currentTask.module) 
            ? currentTask.module.length > 0 
            : !!currentTask.module)
        : false;

    if (hasLecture || hasModule) {
        notificationRef.value.showNotification("Нельзя менять тип урока, если он наполнен данными");
    } else {
        showOption.value = true;
    }
}


watch(
    () => props.currentTask,
    (newVal) => {
        if (newVal) {
            localBody.value.id = newVal.id || null;
            localBody.value.name = newVal.name || '';
            localBody.value.type = newVal.type || '';
        }
    },
    { immediate: true, deep: true }
);

const emit = defineEmits(['confirm', 'cancel']);

const selectType = (type) => {
    localBody.value.type = type;
    showOption.value = false;
};

const displayedType = computed(() => {
    switch (localBody.value.type) {
        case 'lecture':
            return 'Лекция';
        case 'task':
            return 'Задача';
        default:
            return '';
    }
});

const save = () => {
    emit('confirm', localBody.value );
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
    background: rgb(48, 48, 48);
    padding: 20px;
    border-radius: 10px;
    width: 400px;
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