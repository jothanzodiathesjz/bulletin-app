<template>
    <Button
    :as-child="true"
    :variant="variant"
    :size="size"
    :class="costumclass"
    
    >
    <button
    @click="$emit('click')"
    :disabled="disabled"
    >
        <slot></slot>
    </button>
    </Button>
</template>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import type { ButtonVariants } from '@/components/ui/button';
import type { HtmlHTMLAttributes } from 'vue';

defineProps<{
    variant?: ButtonVariants['variant'];
    size?: ButtonVariants['size'];
    costumclass?: HtmlHTMLAttributes['class'];
    disabled?: boolean;
}>()

defineEmits<{
    click: (event: MouseEvent) => void
}>()
</script>

<style scoped>

</style>