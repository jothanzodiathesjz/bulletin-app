<template>
    <div class="w-full flex flex-row justify-start items-center gap-2">
        <button @click="$router.push({ name: 'home' })" class="border rounded p-1"><ChevronLeftIcon class="w-7 h-7"/></button>
        <span class="text-4xl font-extrabold">BULLETIN<span class="text-primary-main">BOARD</span>.</span>
    </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon } from "@radix-icons/vue";
</script>