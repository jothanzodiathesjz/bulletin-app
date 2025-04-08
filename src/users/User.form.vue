<template>
  <div class="w-full flex flex-col relative">
    <Alert
      class="w-full lg:w-80 absolute right-0 bg-white shadow-md"
      v-if="message"
      variant="destructive"
    >
      <ExclamationTriangleIcon v-if="state === 'ERROR'" class="w-4 h-4" />
      <CheckCircledIcon v-if="state === 'SUCCESS'" class="w-4 h-4" />
      <AlertTitle>{{ state === "SUCCESS" ? "Success" : "Error" }}</AlertTitle>
      <AlertDescription>
        {{ message }}
      </AlertDescription>
    </Alert>
    <div class="w-full flex flex-row justify-start gap-3 items-center">
      <button
        @click="$router.push({ name: 'dashboard-user-list' })"
        class="p-2 rounded-md hover:bg-gray-100 active:scale-95 active:opacity-75 transition-transform"
      >
        <ArrowLeftIcon class="cursor-pointer h-6 w-6 font-bold" />
      </button>
      <span class="text-lg">Form User</span>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 h-full pt-6 gap-4 px-2">
      <div class="w-full flex flex-col gap-2">
        <div class="w-full flex flex-col gap-2">
          <span>Nama Lengkap</span>
          <Input
            placeholder="Nama Lengkap"
            :value="data.fullname"
            @input="(v) => (data.fullname = v.toLocaleString())"
          />

        </div>
        <div class="w-full flex flex-col gap-2">
          <span>Username</span>
          <Input
            placeholder="Username"
            :value="data.username"
            @input="(v) => (data.username = v.toLocaleString())"
            @focus="() => usernameInputFocus = true"
            @blur="() => usernameInputFocus = false"
          />
          <span v-if="data.username.length < 6 && usernameInputFocus" class="text-red-500 text-sm">Username minimal 6 karakter</span>
        </div>
        <div v-if="!isUpdate" class="w-full flex flex-col gap-2">
          <span>Password</span>
          <Input
            placeholder="Password"
            :value="password"
            type="password"
            @input="(v) => (password = v.toLocaleString())"
          />
        </div>
        <div v-if="!isUpdate" class="w-full flex flex-col gap-2">
          <span>Ulangi Password</span>
          <Input
            placeholder="Ulangi Password"
            type="password"
            :value="confirmPassword"
            @input="(v) => (confirmPassword = v.toLocaleString())"
          />
          <span v-if="confirmPassword !== password && confirmPassword.length > 0" class="text-red-500 text-sm">Password tidak sesuai</span>
        </div>
      </div>
      
      <div class="w-full flex flex-col gap-2">
        <div class="w-full flex flex-col gap-2">
        <span>Apakah Kepala Divisi?</span>
        <div class="w-32 flex flex-row border rounded">
          <button @click="isHead = 0" class="w-full p-2" :class="!isHead ? 'bg-gray-200' : ''">No</button>
          <button @click="isHead = 1" class="w-full p-2" :class="isHead ? 'bg-gray-200' : ''">Yes</button>
        </div>
      </div>
        <span>Board</span>
        <BoardList :selected="selected" @select="(v) => (selected = v)" />
      </div>
      <div class="w-full flex justify-start">
        <ButtonBulletin :disabled="
          state === 'LOADING' || 
          data.username.length < 6 ||
          !selected ||
          (password !== confirmPassword && !isUpdate)
          " @click="upsert()">
          <ReloadIcon
            v-if="state === 'LOADING'"
            class="w-4 h-4 mr-2 animate-spin"
          />
          {{ isUpdate ? "Update" : "Tambah" }}</ButtonBulletin
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/ui/input/Input.vue";
import ButtonBulletin from "@/components/extra/button/Button.bulletin.vue";
import container from "@/di";
import { TOKENS } from "@/tokens";
import { onMounted, ref } from "vue";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  ReloadIcon,
} from "@radix-icons/vue";
import type { RequestState } from "@/http/state";
import Alert from "@/components/ui/alert/Alert.vue";
import AlertTitle from "@/components/ui/alert/AlertTitle.vue";
import AlertDescription from "@/components/ui/alert/AlertDescription.vue";
import { useRoute } from "vue-router";
import BoardList from "@/board/BoardList.vue";
import { DomainUser } from "@/domain/User";

// const router = useRouter();
const route = useRoute();

const repository = container.get(TOKENS.UserRepository);

const data = ref(DomainUser.empty());
const selected = ref<number | null>(null);

const state = ref<RequestState>("IDLE");
const message = ref("");
const password = ref("");
const confirmPassword = ref("");
const isHead = ref(0);
const usernameInputFocus = ref(false);

const isUpdate = ref(false);

async function upsert() {
  // const id = JSON.parse(localStorage.getItem("user") ?? "");
  // data.value.user_id = id.id;
  state.value = "LOADING";
  try {
    if (isUpdate.value) {
      data.value.board_id = selected.value ?? 1
      const response = await repository.update(data.value);
      console.log(response)
    } else {
      data.value.board_id = selected.value ?? 1
      data.value.is_head = isHead.value;
      const response = await repository.create(
        {
          password: password.value,
          password_confirmation: confirmPassword.value,
        },
        data.value
      );
      console.log(response);
    }
    state.value = "SUCCESS";
    message.value = "Post created successfully";
  } catch (error) {
    state.value = "ERROR";
    console.log(error);
    message.value = "Failed to create post";
  }

  if (state.value === "SUCCESS" || state.value === "ERROR") {
    setTimeout(() => {
      state.value === "IDLE";
      message.value = "";
    }, 2000);
  }
}

async function getUser() {
  const result = await repository.get(route.params.id as string);
  data.value = result;
  selected.value = result.board_id;
  isHead.value = result.is_head
}

onMounted(async () => {
  if (route.params.id) {
    isUpdate.value = true;
    getUser();
  }
});
</script>
