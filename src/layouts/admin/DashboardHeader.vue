<template>
    <div class="flex flex-row justify-start items-center gap-2">
        <div @click="$router.push({ name: 'home' })" class="flex flex-row gap-2 items-center cursor-pointer">
            <img class="w-7 h-7" src="/logo.svg" alt="">
            <span class="text-2xl text-primary-main font-bold ">Bulletin <span class="">Board</span><span class="font-bold text-2xl text-blue-">.</span></span>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>