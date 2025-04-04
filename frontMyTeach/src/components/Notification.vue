<template>
  <transition name="fade">
    <div v-if="visible" class="notification">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');

const showNotification = (msg) => {
  console.log(msg);
  message.value = msg;
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, 3000);
};

defineExpose({
  showNotification
});
</script>

<style scoped>
.notification {
  position: fixed;
  width: 400px;
  top: 20px;
  right: 20px;
  padding: 15px;
  border-radius: 5px;
  z-index: 100;
  color: white;
  background-color: #af00b8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>