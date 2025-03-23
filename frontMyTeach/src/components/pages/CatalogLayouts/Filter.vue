<template>
    <div class="filterSearch">
        <div class="searchContainer" @click.stop>
            <div class="inputContainer">
                <input type="text" placeholder="Поиск..." @focus="showOption = true" v-model=searchInput>
                <button @click="searchAction"><img src="/src/assets/Icons/Search.svg" alt=""></button>
            </div>
            <ul v-if="showOption" class="dropdown">
                <li v-for="(option,index) in filteredOptions" :key="index" @click="selectOption(option)">{{ option }}</li>
            </ul>
        </div>
        <div class="quickFilter">

        </div>
        <div class="settingFilter">

        </div>
        <button>Искать</button>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const searchInput = ref('');
const showOption = ref(false);
const options = ref(['apple','banana','ananas','ogurec','firma','sabatini'])

const filteredOptions = computed(() => {
    if (!searchInput.value) return options.value;
    return options.value.filter(option =>
        option.toLowerCase().includes(searchInput.value.toLowerCase())
    );
});


const selectOption = async (option) => {
    if(option != null){
        searchInput.value = option
        showOption.value = false
    }
}

const handleClickOutside = (event) => {
    const searchContainer = document.querySelector(".searchContainer");
    if (!searchContainer.contains(event.target)) {
        showOption.value = false;
    }
};

onMounted(() => {
    // getOptions();
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.filterSearch{
    width: 100%;
    height: 90px;
    padding: 25px 60px;
    background:linear-gradient(125deg,#200035, #59008E 40%);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.searchContainer{
    width: 100%;
    max-width: 350px;
    position: relative;
}
.inputContainer{
    position: relative;
    display: flex;
    align-items: center;
    max-width: 350px;

}
.inputContainer input{
    border-radius: 20px;
    height: 40px;
    padding: 10px 25px;
    max-width: 350px;
    width: 100%;
    outline: none;
    color: black;
}
.inputContainer button{
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 100%;    
    border: none;
    right: 10px;
    background-color: #59008E;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.3s;
    cursor: pointer;
}
.inputContainer button:hover{
    background-color: #7300b6;
    
}
.inputContainer button img{
    filter: invert(1);
}
.dropdown{
    position: absolute;
    width: 100%;
    background-color: white;
    margin-top: 10px;
    border-radius: 20px;
    color: black;
    padding: 10px 20px;
}
.dropdown li {
    padding: 0px;
    margin: 0px;
    color: black;
    list-style: none;
    cursor: pointer;
    padding: 5px;
}

.dropdown li:hover {
    background: #f0f0f0;
}
</style>