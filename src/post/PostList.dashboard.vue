<template>
  <div class="w-full h-full min-h-0 flex flex-col gap-3 pt-4">
    <div class="w-full flex flex-row items-end justify-between">
      <span class="text-lg font-bold">Post List</span>
      <ButtonBulletin
        @click="
          $router.push({
            name: 'dashboard-post-create',
          })
        "
        >Tambah Data</ButtonBulletin
      >
      <ConfirmModal
        :open="toBeDelete !== null"
        :header="'Are you absolutely sure?'"
        :loading="deleteState === 'LOADING'"
        body="This action cannot be undone. This will permanently delete and remove your data from our servers."
        @confirm="deletePost()"
        @cancel="toBeDelete = null"
      />
    </div>
    <!-- <pre>{{ width }}</pre> -->
    <TableComponent
      :empty="false"
      :items-per-page="result.per_page ?? 0"
      :total-items="result.total ?? 0"
      :loading="loading"
      :overflow-x="true"
      class="h-full"
      @update:current-page="(v) => getAllData(v)"
    >
      <template v-if="width > 1024" #table-header>
        <tr>
          <th class="table-header-custom text-start">No</th>
          <th class="table-header-custom text-start">Tanggal</th>
          <th class="table-header-custom text-start">Judul</th>
          <th class="table-header-custom text-start">Action</th>
        </tr>
      </template>
      <tr v-for="(post, index) in result.data" class="table-row-custom hover:bg-gray-50">
        <td v-if="width > 1024" class="table-cell-custom">
          {{
            ((result.current_page ?? 0) - 1) * (result.per_page ?? 0) +
            (index + 1)
          }}
        </td>
        <td v-if="width > 1024" class="table-cell-custom">
          {{
            new Date(post.created_at).toLocaleDateString("ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          }}
        </td>
        <td v-if="width > 1024" class="table-cell-custom">{{ post.title }}</td>
        <td class="table-cell-custom">
          <div class="w-full flex flex-col gap-3">
            <div v-if="width <= 1024" class="w-full flex flex-col gap-2">
              <span class="font-medium">{{ post.title }}</span>
              <div class="w-full flex flex-row gap-2">
                <span class="p-1 text-sm border rounded border-primary-main"
                  >{{ post.comment_count }} Coments</span
                >
                <span class="p-1 text-sm border rounded border-primary-pressed"
                  >{{ post.viewcount }} Views</span
                >
                <span class="p-1 text-sm border rounded border-primary-border"
                  >{{ post.reaction_count }} Reactions</span
                >
              </div>
            </div>
            <div class="w-full flex flex-row gap-2 justify-start">
              <button
                class="p-2 border rounded-md hover:bg-gray-100 active:scale-95 active:opacity-75 transition-transform"
                @click="
                  $router.push({
                    name: 'dashboard-post-edit',
                    params: { id: post.id },
                  })
                "
              >
                <Pencil2Icon class="cursor-pointer h-5 w-5" />
              </button>

              <!-- Trash Icon dengan Efek Tertekan -->
              <button
                class="p-2 border rounded-md hover:bg-gray-100 active:scale-95 active:opacity-75 transition-transform"
                @click="toBeDelete = post"
              >
                <TrashIcon class="cursor-pointer h-5 w-5" />
              </button>
            </div>
          </div>
        </td>
      </tr>
    </TableComponent>
  </div>
</template>

<script setup lang="ts">
import TableComponent from "@/components/extra/Table.component.vue";
import { computed, onMounted, ref } from "vue";
import {
  type PostWithCommentsAndTags,
  type PostResponseArray,
} from "@/domain/Post";
import container from "@/di";
import { TOKENS } from "@/tokens";
import { Pencil2Icon, TrashIcon } from "@radix-icons/vue";
import ButtonBulletin from "@/components/extra/button/Button.bulletin.vue";
import ConfirmModal from "@/components/extra/Confirm.modal.vue";
import type { RequestState } from "@/http/state";

const repository = container.get(TOKENS.PostRepository);
const result = ref<PostResponseArray>({ data: [] });
const loading = ref(false);

const deleteState = ref<RequestState>("SUCCESS");
const toBeDelete = ref<PostWithCommentsAndTags | null>(null);

async function getAllData(page?: number) {
  loading.value = true;
  try {
    result.value = await repository.getAllPost({
      page: page?.toString(),
    });
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
}

async function deletePost() {
  if (!toBeDelete.value) return;
  deleteState.value = "LOADING";
  try {
    await repository.delete(toBeDelete.value.id.toString());

    getAllData();
    deleteState.value = "SUCCESS";
    toBeDelete.value = null;
  } catch (error) {
    deleteState.value = "ERROR";
  }
}

onMounted(() => {
  getAllData();
});

const width = computed(() => {
  return window.innerWidth;
});
</script>
