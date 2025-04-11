<template>
  <div class="w-full h-full min-h-0 flex flex-col gap-3 pt-4">
    <div class="w-full flex flex-row items-end justify-between">
      <span class="text-lg font-bold">User List</span>
      <ButtonBulletin
        @click="
          $router.push({
            name: 'dashboard-user-create',
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
    <TableComponent
      :empty="result.length === 0"
      :items-per-page="0"
      :total-items="result.length"
      :loading="loading"
      :overflow-x="true"
      class="h-full"
      @update:current-page=""
    >
      <template v-if="width > 1024" #table-header>
        <tr>
          <th class="table-header-custom text-start">Nama</th>
          <th class="table-header-custom text-start">Username</th>
          <th class="table-header-custom text-start">Action</th>
        </tr>
      </template>
      <tr
        v-for="(user, index) in result"
        class="table-row-custom"
        :key="index"
        :class="width <= 1024 && 'hover:bg-gray-100 cursor-pointer'"
      >
        <td v-if="width > 1024" class="table-cell-custom">
          {{ user.fullname }}
        </td>
        <td v-if="width > 1024" class="table-cell-custom">
          {{ user.username }}
        </td>
        <td
          @click="
            width <= 1024 &&
              $router.push({
                name: 'dashboard-user-edit',
                params: { id: user.id },
              })
          "
          class="w-auto py-4 px-5 border-b text-dark-main table-cell relative"
        >
          <div class="flex flex-col gap-3">
            <div v-if="width <= 1024" class="w-full flex flex-col gap-3">
              <span class="font-medium">{{ user.fullname }}</span>
              <span class="text-primary-main text-sm font-semibold"
                >Id: {{ user.username }}</span
              >
              <div>
                <span
                  class="p-1 rounded border border-success-main text-gray-800"
                  >{{ printBoard(user.board_id) }}</span
                >
              </div>
            </div>
            <div v-if="width > 1024" class="flex flex-row gap-2 justify-start">
              <button
                class="p-2 rounded-md hover:bg-gray-100 active:scale-95 active:opacity-75 transition-transform"
                @click="
                  $router.push({
                    name: 'dashboard-user-edit',
                    params: { id: user.id },
                  })
                "
              >
                <Pencil2Icon class="cursor-pointer h-5 w-5" />
              </button>

              <!-- Trash Icon dengan Efek Tertekan -->
              <button
                class="p-2 rounded-md hover:bg-gray-100 active:scale-95 active:opacity-75 transition-transform"
                @click="toBeDelete = user"
              >
                <TrashIcon class="cursor-pointer h-5 w-5" />
              </button>
            </div>
          </div>
          <button
            v-if="width <= 1024"
            class="absolute top-0 right-0 p-2 rounded-md hover:bg-gray-100 active:scale-95 active:opacity-75 transition-transform"
            @click="
              (event) => {
                event.stopPropagation();
                toBeDelete = user;
              }
            "
          >
            <TrashIcon class="cursor-pointer h-6 w-6" />
          </button>
        </td>
      </tr>
    </TableComponent>
  </div>
</template>

<script setup lang="ts">
import TableComponent from "@/components/extra/Table.component.vue";
import { computed, onMounted, ref } from "vue";
import container from "@/di";
import { TOKENS } from "@/tokens";
import { Pencil2Icon, TrashIcon } from "@radix-icons/vue";
import ButtonBulletin from "@/components/extra/button/Button.bulletin.vue";
import ConfirmModal from "@/components/extra/Confirm.modal.vue";
import type { RequestState } from "@/http/state";
import type { DomainUser } from "@/domain/User";
import type { BoardAttributes } from "@/domain/Board";

const repository = container.get(TOKENS.UserRepository);
const board_repository = container.get(TOKENS.BoardRepository);
const result = ref<DomainUser[]>([]);
const loading = ref(false);

const deleteState = ref<RequestState>("SUCCESS");
const toBeDelete = ref<DomainUser | null>(null);

const boardList = ref<BoardAttributes[]>([]);

async function getBoards() {
  try {
    boardList.value = await board_repository.getAll();
  } catch (error) {
    console.log(error);
  }
}

async function getAllData() {
  loading.value = true;
  try {
    result.value = await repository.getAllUser();
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
}

async function deletePost() {
  if (!toBeDelete.value) return;
  deleteState.value = "LOADING";
  try {
    await repository.deleteUser(toBeDelete.value.id.toString());
    getAllData();
    deleteState.value = "SUCCESS";
    toBeDelete.value = null;
  } catch (error) {
    deleteState.value = "ERROR";
  }
}

function printBoard(boardId: number) {
  const board = boardList.value.find((board) => board.id === boardId);
  if (board) {
    return board.name;
  }
  return "No Board";
}

onMounted(async () => {
  await getBoards();
  getAllData();
});

const width = computed(() => {
  return window.innerWidth;
});
</script>
