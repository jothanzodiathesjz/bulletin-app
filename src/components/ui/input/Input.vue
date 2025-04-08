<template>
  <input 
    :value="value"
    @input="debouncedHandleInput(($event.target as HTMLInputElement).value)"
    :class="cn( resetClass ? '' :'flex w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50', props.class)"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  >
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
  defaultValue?: string | number
  value: string | number
  class?: HTMLAttributes['class']
  debounce?: number // Waktu debounce dalam milidetik
  resetClass?: boolean;
}>()

const emits = defineEmits<{
  (e: 'input', payload: string | number): void;
  (e: 'focus'): void
  (e: 'blur'): void
}>()

// Nilai internal untuk input
// const inputValue = ref(props.modelValue ?? props.defaultValue ?? '')

// Nilai yang akan di-debounce
// const debouncedValue = useDebounceFn(inputValue.value, props.debounce ?? 300)

// Watch debouncedValue dan emit perubahan
const debouncedHandleInput = useDebounceFn((value: string) => {
    emits("input", value);
}, props.debounce ?? 0);
// Watch perubahan modelValue dari parent
</script>