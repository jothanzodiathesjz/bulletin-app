<template>
    <div class="w-full flex flex-col gap-2 h-full py-5 px-3 lg:px-10">
        <DashboardHeader/>
        <div class="w-full flex flex-row justify-start border-b pb-2">
            <div class="bg-muted rounded-md p-2 flex flex-row gap-2">
                <RouterLink
                v-slot="{navigate, isActive}"
                :to="{name: r.name}"
                custom
                v-for="r in routes.filter(r => (user.is_admin || user.is_head) && r.auth?.includes(user.board_id) ? true : r.label !== 'Users' )"
                :key="r.name"
                >
                    <button 
                    class=" px-5 py-2 text-base font-bold  transition-all"
                    :class="isActive ? 'bg-background shadow-md ring-offset-background rounded-md ' : 'bg-muted opacity-50'"
                    @click="navigate"
                    >
                        <span>{{ r.label }}</span>
                    </button>
                </RouterLink>
            </div>
        </div>
        <RouterView v-slot="{ Component }">
                <Transition :name="''" mode="out-in">
                    <component :is="Component" />
                </Transition>
            </RouterView>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import DashboardHeader from './DashboardHeader.vue';
import { ref } from 'vue';
const userData = localStorage.getItem("user");
const user = ref(userData ? JSON.parse(userData) : null);
const routes = [
    {
        name: 'dashboard-post-list',
        label: 'Post List'
    },
    {
        name: 'dashboard-user-list',
        label: 'Users',
        auth: [0 , 4]
    }
]

</script>