<template>
  <div ref="tableContainer" class="relative bg-white">
    <div class="flex flex-col w-full overflow-auto">
        <div v-if="loading" class="w-full flex justify-center py-4">
      <span class="text-neutral-60">Loading...</span>
    </div>
    <table v-else class="border-collapse w-full border overflow-auto" :class="tableClass">
      <thead
        class="bg-white border-b border-t table-header border-collapse p-3 items-center text-sm text-neutral-40 border-neutral-80 sticky z-[1] top-0"
      >
        <slot name="table-header"></slot>
      </thead>
      <tbody v-if="!empty" class="table-body-custom">
        <slot></slot>
      </tbody>
      <tfoot class="border-t border-b border-neutral-70 sticky bottom-0">
        <slot name="table-foot"></slot>
      </tfoot>
    </table>

    <div ref="tableEndEl" class="w-full flex justify-center items-center p-1">
      <!-- Intersection observer target -->
    </div>
    </div>
    
    <!-- Pagination Controls -->
    <div
      class="sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
    >
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="handlePrevPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          Previous
        </button>
        <button
          @click="handleNextPage"
          :disabled="isLastPage"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': isLastPage }"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ startIndex }}</span>
            to
            <span class="font-medium">{{ endIndex }}</span>
            of
            <span class="font-medium">{{ totalItems }}</span>
            results
          </p>
        </div>
        <div>
          <nav
            class="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              @click="handlePrevPage()"
              :disabled="currentPage === 1 || loading"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              :class="{
                'opacity-50 cursor-not-allowed': currentPage === 1 || loading,
              }"
            >
              <span class="sr-only">Previous</span>
              &larr;
            </button>
            <span
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
            >
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button
              @click="handleNextPage()"
              :disabled="isLastPage || loading"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              :class="{
                'opacity-50 cursor-not-allowed': isLastPage || loading,
              }"
            >
              <span class="sr-only">Next</span>
              &rarr;
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const tableContainer = ref<HTMLDivElement | null>(null);
const tableEndEl = ref<HTMLDivElement | null>(null);
const currentPage = ref(1);

const props = defineProps<{
  empty: boolean;
  scroolHeight?: number;
  overflowX?: boolean;
  tableClass?: string;
  loading?: boolean;
  itemsPerPage: number;
  totalItems: number;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
  (e: "paginate"): void;
  (e: "update:currentPage", page: number): void;
}>();

// Computed properties for pagination
const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
);
const isLastPage = computed(() => currentPage.value >= totalPages.value);
const startIndex = computed(
  () => (currentPage.value - 1) * props.itemsPerPage + 1
);
const endIndex = computed(() =>
  Math.min(currentPage.value * props.itemsPerPage, props.totalItems)
);

// Pagination handlers
const handleNextPage = () => {
  if (!isLastPage.value) {
    currentPage.value++;
    emit("update:currentPage", currentPage.value);
  }
};

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    emit("update:currentPage", currentPage.value);
  }
};

function calculateRowNumber(
  currentPage: number,
  perPage: number,
  indexInPage: number
) {
  return (currentPage - 1) * perPage + indexInPage;
}

// Contoh penggunaan

// Intersection Observer setup
let stopObserver = () => {};
onMounted(() => {
  const { stop } = useIntersectionObserver(
    tableEndEl,
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          emit("paginate");
        }
      });
    },
    {
      root: tableContainer,
    }
  );
  stopObserver = stop;
});

onUnmounted(stopObserver);

watch(currentPage, (newPage) => {
  for (let indexInPage = 1; indexInPage <= props.itemsPerPage; indexInPage++) {
    const rowNumber = calculateRowNumber(
      newPage,
      props.itemsPerPage,
      indexInPage
    );
    console.log(
      `Nomor baris untuk item ke-${indexInPage} di halaman ${currentPage} adalah: ${rowNumber}`
    );
  }
});
</script>

<style scoped>
th {
  resize: horizontal;
  overflow: auto;
}
</style>
