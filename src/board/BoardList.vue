<template>
    <div class="w-full h-full">
      <div v-if="state === 'SUCCESS'" class="w-full flex flex-row gap-3 flex-wrap">
        <button
          v-for="(tag, key) in boardList.filter((v) => validateAdmin() ? true :  filterBoard.includes(v.id))"
          :key="key"
          class="border border-primary-border p-3 rounded"
          :class="selected === tag.id ? 'bg-primary-surface' : ''"
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
  import type { RequestState } from "@/http/state";
  import { TOKENS } from "@/tokens";
  import { onMounted, ref } from "vue";
  import { Skeleton } from '@/components/ui/skeleton';
import type { BoardAttributes } from "@/domain/Board";
  
  defineProps<{
    selected: number | null;
  }>()
  
  defineEmits<{
      (e: 'select', id: number): void;
  }>()
  const user = JSON.parse(localStorage.getItem("user") ?? "");
  
  const repository = container.get(TOKENS.BoardRepository);
  const state = ref<RequestState>("LOADING");
  const boardList = ref<BoardAttributes[]>([]);
  const filterBoard = ref([1,2]);

  function validateAdmin() {
    if (user.id === 1 || user.id === 4) {
      return true;
    }

    return false
  }
  
  async function getTags() {
    state.value = "LOADING";
    try {
      boardList.value = await repository.getAll();
      state.value = "SUCCESS";
    } catch (error) {
      state.value = "ERROR";
    }
  }
  
  
  onMounted(async () => {
    getTags();
    filterBoard.value.push(user.board_id);
  });
  </script>
  