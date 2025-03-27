<template>
    <div class="w-full flex flex-row gap-5 py-5 px-3 bg-white sticky top-0 z-50 items-center rounded-t-3xl ">
        <SheetTrigger as-child class="absolute">
            <TextAlignLeftIcon
            class="w-7 h-7 transition-transform duration-200 active:scale-90 text-dark-border"
            />
        </SheetTrigger>
        <div class="w-full flex flex-row justify-center items-center gap-2">
            <div class="flex flex-row gap-2 items-center">
                <img class="w-7 h-7" src="/logo.svg" alt="">
                <span class="text-lg text-primary-main font-bold ">Bulletin <span class="">Board</span><span class="font-bold text-2xl text-blue-">.</span></span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import Button from '@/components/ui/button/Button.vue';
import { TextAlignLeftIcon } from '@radix-icons/vue'
import { SheetTrigger } from '@/components/ui/sheet';
</script>
