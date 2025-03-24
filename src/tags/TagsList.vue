<template>
  <div class="w-full h-full">
    <div v-if="state === 'SUCCESS'" class="w-full flex flex-row gap-3 flex-wrap">
      <button
        v-for="(tag, key) in tagsList"
        :key="key"
        class="border border-primary-border p-3 rounded"
        :class="selected.has(tag.id) ? 'bg-secondary-pressed' : ''"
        @click="$emit('select', tag.id)"
      >
        {{ tag.name }}
      </button>
    </div>
    <Skeleton v-if="state === 'LOADING'" class="h-14 w-[400px]"/>
  </div>
</template>

<script setup lang="ts">
import container from "@/di";
import type { TagsAttributes } from "@/domain/Post";
import type { RequestState } from "@/http/state";
import { TOKENS } from "@/tokens";
import { onMounted, ref } from "vue";
import { Skeleton } from '@/components/ui/skeleton';

defineProps<{
  selected: Set<number>;
}>()

defineEmits<{
    (e: 'select', id: number): void;
}>()

const repository = container.get(TOKENS.TagsRepository);
const state = ref<RequestState>("LOADING");
const tagsList = ref<TagsAttributes[]>([]);


async function getTags() {
  state.value = "LOADING";
  try {
    tagsList.value = await repository.get();
    state.value = "SUCCESS";
  } catch (error) {
    state.value = "ERROR";
  }
}


onMounted(async () => {
  getTags();
});
</script>
