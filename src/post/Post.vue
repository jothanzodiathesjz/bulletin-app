<template>
  <div
    ref="cardContainer"
    class="relative w-full h-full min-h-0 flex flex-col overflow-auto pb-10"
  >
    <div class="w-full h-full min-h-0 flex flex-col p-2 lg:p-5 gap-3">
      <div class="w-full flex flex-col p-2 rounded-lg mb-3">
        <div class="w-full flex flex-row items-center gap-3 mt-4">
          <DateInput
            :value="datevalue"
            @update:value="
              (d) => [
                ((datevalue.start = d.start), (datevalue.end = d.end)),
                getDataUsingDate(),
              ]
            "
          />
          <Input
            class="bg-white"
            placeholder="Search"
            :value="search"
            :debounce="300"
            @input="(v) => [(search = v.toString()), handleSearch()]"
          />
        </div>
      </div>
      <div class="flex flex-col gap-5 p-3">
        <BulletinCard
          v-for="(test, key) in result.data"
          :key="key"
          :is="key"
          :data="test"
          class="bulletin-card"
        />
        <div class="w-full flex justify-center items-center" ref="tableEndEl">
          <span
            v-if="state === 'LOADING'"
            class="text-neutral-70 text-sm animate-pulse"
            >Loading....</span
          >
          <span v-if="state === 'SUCCESS' && result.data.length === 0"
            >Tidak ada data ditemukan</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/ui/input/Input.vue";
import DateInput from "@/components/extra/DateInput.vue";
import BulletinCard from "@/components/extra/BulletinCard.vue";
import type { PostResponseArray } from "@/domain/Post";
import container from "@/di";
import { TOKENS } from "@/tokens";
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import type { RequestState } from "@/http/state";
import type { DateRange } from "radix-vue";

const tableEndEl = ref<HTMLDivElement | null>(null);
const cardContainer = ref<HTMLDivElement | null>(null);

const repository = container.get(TOKENS.PostRepository);
const result = ref<PostResponseArray>({ data: [] });
const datevalue = ref({
  start: undefined,
  end: undefined,
}) as Ref<DateRange>;

const search = ref("");
const state = ref<RequestState>("SUCCESS");
const countPage = ref<number | null>(1);
const tampungElement = ref(new Set<string>([]));

async function getAllData() {
  console.log("sekarang dari getAlldata")
  if (datevalue.value.start) {
    return;
  }
  state.value = "LOADING";
  if (!countPage.value) {
    state.value = "SUCCESS";
    return;
  }
  try {
      const data = await repository.getAllPost();
      result.value = data;
    state.value = "SUCCESS";

    setTimeout(() => {
      setupBulletinCardObservers();
    }, 100);
  } catch (error) {
    state.value = "ERROR";
  }
}

async function getDataUsingDate() {
  console.log("sekarang dari date")
  result.value.data = [];
  state.value = "LOADING";
  try {
    console.log(datevalue.value);
    const data = await repository.getAllPost({
      start: datevalue.value.start?.toString(),
      end: datevalue.value.end?.toString(),
    });
    result.value = data;
    state.value = "SUCCESS";
  } catch (e) {}
}

async function paginate() {
  console.log("sekarang dari paginate")
  if(result.value.next_page === null){
    return
  }
  state.value = "LOADING";
  try {
    const data = await repository.getAllPost({
      page: result.value.next_page ? ((result.value.current_page ?? 0)+ 1).toString() : undefined,
    })
    result.value = {
          ...data,
          data: result.value.data.concat(data.data),
        };
        state.value = "SUCCESS";
  } catch (error) {
      console.log(error)
      state.value = "ERROR";
  }
    
}

async function handleSearch() {
  console.log("sekarang dari search")
  state.value = "LOADING";
  if (search.value.length === 0) {
    await getAllData();
    return;
  } else {
    try {
      const data = await repository.getAllPost({
        title: search.value,
      });
      result.value = data;
      state.value = "SUCCESS";
    } catch (error) {
      console.log(error);
    }
  }
}

function setupBulletinCardObservers() {
  const bulletinCards = document.querySelectorAll(".bulletin-card");

  bulletinCards.forEach((card) => {
    if (!tampungElement.value.has(card.id)) {
      useIntersectionObserver(
        card as HTMLElement,
        (entries) => {
          entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
              if (!tampungElement.value.has(entry.target.id)) {
                tampungElement.value.add(entry.target.id);
                await repository.postView(entry.target.id);
              }
            }
          });
        },
        {
          root: cardContainer.value,
        }
      );
    }
  });
}

let stopObserver = () => {};

onMounted(async () => {
  await getAllData();
  const { stop } = useIntersectionObserver(
    tableEndEl,
    async (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          console.log("intersecting end element");
         await paginate()
        }
      });
    },
    {
      root: cardContainer.value,
    }
  );

  stopObserver = stop;
  setupBulletinCardObservers();
});

onUnmounted(() => {
  stopObserver();
});
</script>
