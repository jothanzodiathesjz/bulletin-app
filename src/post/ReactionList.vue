<template>
  <Dialog :open="data ? true : false" @update:open="$emit('close')">
    <DialogContent @interact-outside="$emit('close')" class="w-[23rem] md:w-full rounded-md" >
      <DialogHeader >
        <DialogTitle >Reactions</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col gap-2 max-h-[40rem] overflow-y-auto">
        <div 
        :key="index" v-for="(emoji, index) in data"
        class="w-full flex flex-row gap-2 items-center"
        >
            <span class="border rounded-full p-1 hover:scale-110 transition-all">{{ emoji.emoji }}</span>
            <span>{{ emoji.user.username }}</span>
        </div>
      </div>
      <DialogFooter>
        <!-- <ButtonBulletin @click="$emit('close')">Close</ButtonBulletin> -->
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EmojiAttributes } from "@/domain/Emoji";

defineProps<{
    data: EmojiAttributes[] | null
}>()

defineEmits<{
    (e: 'close'): void;
}>()

</script>
