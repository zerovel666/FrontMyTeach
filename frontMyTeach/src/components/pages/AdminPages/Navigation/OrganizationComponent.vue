<template>
    <div class="organizations-container">
        <h1>Организации</h1>

        <div class="organization-list">
            <div class="organization-card" v-for="org in store.organizations" :key="org.id">
                <div class="org-header">
                    <h2>{{ org.name }}</h2>
                    <span class="org-status" :class="{ 'active': org.is_active, 'inactive': !org.is_active }">
                        {{ org.is_active ? 'Активна' : 'Неактивна' }}
                    </span>
                </div>

                <div class="org-details">
                    <p><strong>BIN:</strong> {{ org.bin }}</p>
                    <p><strong>Адрес:</strong> {{ org.address }}</p>
                    <p><strong>Телефон:</strong> {{ org.phone }}</p>
                    <p><strong>Email:</strong> {{ org.email }}</p>
                    <p><strong>Дата создания:</strong> {{ formatDate(org.created_at) }}</p>
                </div>

                <div class="subscriptions-section" v-if="org.subscriptions.length > 0">
                    <h3>Подписки</h3>
                    <div class="subscription" v-for="sub in org.subscriptions" :key="sub.id">
                        <h4>{{ sub.name }}</h4>
                        <p>{{ sub.description }}</p>
                        <div class="sub-details">
                            <span><strong>Цена:</strong> {{ sub.price }} {{ sub.currency }}</span>
                            <span><strong>Интервал:</strong> {{ sub.interval === 'month' ? 'месяц' : sub.interval
                                }}</span>
                            <span><strong>Макс. пользователей:</strong> {{ sub.max_users }}</span>
                            <span><strong>Макс. курсов:</strong> {{ sub.max_course }}</span>
                        </div>
                    </div>
                </div>
                <div v-else class="no-subscriptions">
                    Нет активных подписок
                </div>

                <div class="groups-section" v-if="org.groups.length > 0">
                    <h3>Группы</h3>
                    <div class="group" v-for="group in org.groups" :key="group.id">
                        <h4>{{ group.name }}</h4>
                        <div class="users-list">
                            <div class="user" v-for="user in group.users" :key="user.id">
                                <div class="user-info">
                                    <span class="user-name">{{ user.last_name }} {{ user.first_name }}</span>
                                    <span class="user-email">{{ user.email }}</span>
                                    <span class="user-role">{{ user.roles[0].name }}</span>
                                    <span class="user-status"
                                        :class="{ 'active': user.is_active, 'inactive': !user.is_active }">
                                        {{ user.is_active ? 'Активен' : 'Неактивен' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="no-groups">
                    Нет групп
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useOrganizationsStore } from '@/stores/cache/Organization';
import { onMounted } from 'vue';

const store = useOrganizationsStore();

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
};

onMounted(() => {
    store.getOrganizations();
});
</script>

<style scoped>
h1 {
    margin-bottom: 30px;
}

.organization-list {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.organization-card {
    border-radius: 10px;
    box-shadow: 0 0 10px #4f007d;
    padding: 20px;
    border: 1px solid #b14788;
}

.org-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.org-status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
}


.org-details {
    margin-bottom: 20px;
}

.org-details p {
    margin: 5px 0;
}

.subscriptions-section,
.groups-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

h3 {
    margin-bottom: 15px;
}

.subscription {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    border: 1px solid #b14788;
}

.subscription h4 {
    margin: 0 0 10px;
}

.sub-details {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    margin-top: 10px;
}

.group {
    border: 1px solid #b14788;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
}

.group h4 {
    margin: 0 0 10px;
    color: #9b59b6;
}

.users-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.user {
    border: 1px solid #b14788;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.user-info {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    align-items: center;
}

.user-name {
    font-weight: bold;
}

.user-email {
    font-size: 0.9rem;
}

.user-role {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
}

.user-status {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
}


.no-subscriptions,
.no-groups {
    color: #7f8c8d;
    font-style: italic;
    text-align: center;
    padding: 10px;
}

@media (max-width: 768px) {
    .sub-details {
        flex-direction: column;
        gap: 5px;
    }

    .user-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }
}
</style>