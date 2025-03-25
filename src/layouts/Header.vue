<template>
    <div class="w-full flex flex-row gap-5 py-3 px-3 bg-red-900 sticky top-0 z-50 items-center">
        <SheetTrigger as-child>
            <TextAlignLeftIcon
            class="w-7 h-7 transition-transform duration-200 active:scale-90 text-white"
            />
        </SheetTrigger>
        <div class="w-full flex flex-row justify-start items-center gap-3">
            <img class="w-7 h-7" src="/logo.svg" alt="">
            <span class="text-lg font-bold text-white uppercase">Bulletin <span class="text-primary-main">Board</span><span class="font-bold text-2xl text-blue-">.</span></span>
        </div>
    </div>
</template>

<script setup lang="ts">
// import Button from '@/components/ui/button/Button.vue';
import { TextAlignLeftIcon } from '@radix-icons/vue'
import { SheetTrigger } from '@/components/ui/sheet';
</script>
