<template>
    <form @submit.prevent="submit" class="form">
        <input v-model="form.category" placeholder="Название категории" required class="input" />
        <div class="form-actions">
            <button type="submit" class="btn submit">
                {{ editingId ? 'Обновить' : 'Создать' }}
            </button>
            <button v-if="editingId" @click="resetForm" type="button" class="btn cancel">
                Отмена
            </button>
        </div>
    </form>

    <div class="grid">
        <div v-for="category in store.categories" :key="category.id" class="card" @click="editCategory(category)">
            <span>{{ category.category }}</span>
            <img src="/src/assets/Icons/deleteIconWhite.svg" alt="Удалить" @click.stop="askDelete(category)"
                style="cursor: pointer" />
        </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
        <div class="modal">
            <p>Вы уверены, что хотите удалить эту категорию?<br />
                <strong>Все курсы, закрепленные за ней, будут удалены.</strong>
            </p>
            <div class="modal-actions">
                <button class="btn danger" @click="confirmDelete">Удалить</button>
                <button class="btn cancel" @click="cancelDelete">Отмена</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCategoriesStore } from '@/stores/cache/Categories';

const store = useCategoriesStore();
const editingId = ref(null);
const form = ref({ category: '' });
const showModal = ref(false);
const categoryToDelete = ref(null);

const askDelete = (category) => {
    categoryToDelete.value = category;
    showModal.value = true;
};

const cancelDelete = () => {
    showModal.value = false;
    categoryToDelete.value = null;
};

const confirmDelete = async () => {
    try {
        await store.deleteCategory(categoryToDelete.value.id);
        showModal.value = false;
        categoryToDelete.value = null;
    } catch (e) {
        console.error("Ошибка при удалении:", e);
    }
};

const submit = async () => {
    if (editingId.value) {
        await store.updateCategory(form.value, editingId.value)
    } else {
        await store.createCategory(form.value);
    }
    resetForm();
};

const editCategory = (category) => {
    form.value = { category: category.category };
    editingId.value = category.id;
};

const resetForm = () => {
    form.value = { category: '' };
    editingId.value = null;
};

onMounted(() => {
    store.getCategories();
});
</script>

<style scoped>
.form {
    margin-bottom: 30px;
}

.input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    font-size: 16px;
    background-color: #59008e;
    outline: none;
    border: none;
}

.input::placeholder {
    color: #ddd;
}

.form-actions {
    display: flex;
    gap: 10px;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.submit {
    background: #59008e;
    color: white;
}

.submit:hover {
    background: #3f0063;
}

.cancel {
    background: #b14788;
    color: white;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
}

.card {
    padding: 15px;
    background: #3f0063;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    justify-content: space-between;
}

.card img {
    width: 20px;
}

.card:hover {
    background: #59008e;
    transform: translateY(-2px);
}

.card:hover {
    opacity: 1;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: #3f0063;
    padding: 20px;
    border-radius: 12px;
    max-width: 400px;
    text-align: center;
}

.modal-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
}

.modal-actions button{
    background-color: #59008e;
}

</style>