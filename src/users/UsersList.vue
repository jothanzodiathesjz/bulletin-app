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
        :empty="false"
        :items-per-page="0"
        :total-items="result.length"
        :loading="loading"
        :overflow-x="true"
        class="h-full"
        @update:current-page=""
      >
        <template #table-header>
          <tr>
            <th class="table-header-custom text-start">Nama</th>
            <th class="table-header-custom text-start">Username</th>
            <th class="table-header-custom text-start">Action</th>
          </tr>
        </template>
        <tr v-for="(user, index) in result" class="table-row-custom" :key="index">
          <td class="table-cell-custom">
            {{
              user.fullname
            }}
          </td>
          <td class="table-cell-custom">{{ user.username }}</td>
          <td class="table-cell-custom">
            <div class="flex flex-row gap-2 justify-start">
              <button
                class="p-2 rounded-md hover:bg-gray-100 active:scale-95 active:opacity-75 transition-transform"
                @click="$router.push({name: 'dashboard-user-edit', params: {id: user.id}})"
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
          </td>
        </tr>
      </TableComponent>
    </div>
  </template>
  
  <script setup lang="ts">
  import TableComponent from "@/components/extra/Table.component.vue";
  import { onMounted, ref } from "vue";
  import container from "@/di";
  import { TOKENS } from "@/tokens";
  import { Pencil2Icon, TrashIcon } from "@radix-icons/vue";
  import ButtonBulletin from "@/components/extra/button/Button.bulletin.vue";
  import ConfirmModal from "@/components/extra/Confirm.modal.vue";
  import type { RequestState } from "@/http/state";
import type { DomainUser } from "@/domain/User";
  
  const repository = container.get(TOKENS.UserRepository);
  const result = ref<DomainUser[]>([]);
  const loading = ref(false)
  
  
  const deleteState = ref<RequestState>('SUCCESS');
  const toBeDelete = ref<DomainUser | null>(null)
  
  async function getAllData() {
      loading.value = true
      try {
          result.value = await repository.getAllUser()
          loading.value = false;
      } catch (error) {
          loading.value = false
      }
  }
  
  async function deletePost() {
    if(!toBeDelete.value) return;
      deleteState.value = 'LOADING'
    try {
          await repository.deleteUser(toBeDelete.value.id.toString());
            getAllData();
            deleteState.value = "SUCCESS";
            toBeDelete.value = null;
      } catch (error) {
        deleteState.value = "ERROR"
      }
  }
  
  onMounted(() => {
    getAllData();
  });
  </script>
  