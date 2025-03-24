<template>
    <div class="w-full h-screen relative lg:w-[35rem] lg:mx-auto flex flex-col bg-secondary-surface border">
        <Sheet>
            <Header/>
            <Sidebar/>
            <RouterView v-slot="{ Component }">
                <Transition :name="''" mode="out-in">
                    <component :is="Component" />
                </Transition>
            </RouterView>
        </Sheet>
    </div>
</template>

<script setup lang="ts">
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import {
  Sheet
} from '@/components/ui/sheet'
</script>
