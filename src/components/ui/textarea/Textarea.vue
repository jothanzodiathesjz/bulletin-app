<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  value: string
}>()

defineEmits<{
  (e: 'input', payload: string): void
}>()


</script>

<template>
  <textarea 
  :value="value" 
  :class="cn('flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', props.class)" 
  @input="$emit('input', ($event.target as HTMLInputElement).value)"
  />
</template>
