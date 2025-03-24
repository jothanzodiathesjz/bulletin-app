<template>
  <AlertDialog :open="open">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ header }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ body }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel as-child>
          <button
          @click="$emit('cancel')"
          >
            Cancel
          </button>
        </AlertDialogCancel>
        <AlertDialogAction as-child>
          <ReloadIcon v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
          <button
          :disabled="loading"
          @click="$emit('confirm')"
          >
            Confirm
          </button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ReloadIcon } from '@radix-icons/vue';

defineProps<{
  open: boolean;
  header: string;
  body: string;
  loading?: boolean;
}>()

defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>()

</script>