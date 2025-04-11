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
        @click="$router.push({ name: 'dashboard-post-list' })"
        class="p-2 rounded-md hover:bg-gray-100 active:scale-95 active:opacity-75 transition-transform"
      >
        <ArrowLeftIcon class="cursor-pointer h-6 w-6 font-bold" />
      </button>
      <span class="text-lg">Form Post</span>
    </div>
    <div v-if="Loaded" class="lg:w-full h-full flex flex-col pt-6 gap-4">
      <div class="w-full flex flex-col gap-2">
        <span>Judul</span>
        <Input
          placeholder="Masukkan Judul"
          :value="data.title"
          @input="(v) => (data.title = v.toLocaleString())"
        />
      </div>
      <div class="w-full flex flex-col gap-2">
        <span>Description</span>
        <Textarea
          placeholder="Tulis Deksripsi"
          class="h-44"
          :value="data.body"
          @input="(v) => (data.body = v)"
          >test</Textarea
        >
      </div>
      <div class="w-full flex flex-col gap-2">
        <span>Visible</span>
        <div class="w-32 flex flex-row border rounded">
          <button
            @click="data.visible = false"
            class="w-full p-2"
            :class="!data.visible ? 'bg-gray-200' : ''"
          >
            No
          </button>
          <button
            @click="data.visible = true"
            class="w-full p-2"
            :class="data.visible ? 'bg-gray-200' : ''"
          >
            Yes
          </button>
        </div>
      </div>
      <div
        class="w-full flex flex-col gap-2"
      >
        <span>Board</span>
        <BoardList :selected="selected" @select="(v) => (selected = v)" />
      </div>
      <div class="w-full flex justify-start">
        <ButtonBulletin :disabled="state === 'LOADING'" @click="upsert()">
          <ReloadIcon
            v-if="state === 'LOADING'"
            class="w-4 h-4 mr-2 animate-spin"
          />
          {{ isUpdate ? "Update" : "Tambah" }}</ButtonBulletin
        >
      </div>
    </div>
    <div v-else class="w-full h-[50vh] flex justify-center items-center">
      Loading...
    </div>
  </div>
</template>

<script setup lang="ts">
import Textarea from "@/components/ui/textarea/Textarea.vue";
import Input from "@/components/ui/input/Input.vue";
import ButtonBulletin from "@/components/extra/button/Button.bulletin.vue";
import container from "@/di";
import { TOKENS } from "@/tokens";
import { onMounted, ref } from "vue";
import { DomainPost } from "@/domain/Post";
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

// const router = useRouter();
const route = useRoute();
const userData = localStorage.getItem("user");
const user = ref(userData ? JSON.parse(userData) : null);

const repository = container.get(TOKENS.PostRepository);

const data = ref(DomainPost.formDataEmpty());
const selected = ref<number | null>(user.value?.board_id ?? null);

const state = ref<RequestState>("IDLE");
const message = ref("");

const isUpdate = ref(false);
const Loaded = ref(true);

async function upsert() {
  const id = JSON.parse(localStorage.getItem("user") ?? "");
  data.value.user_id = id.id;
  state.value = "LOADING";
  try {
    if (isUpdate.value) {
      await repository.updatePost(
        {
          ...data.value,
          board_id: selected.value ?? user.value.board_id ?? 0,
        },
        route.params.id as string
      );
    } else {
      await repository.createPost({
        ...data.value,
        board_id: selected.value ?? id.board_id ?? 0,
      });
    }
    state.value = "SUCCESS";
    message.value = isUpdate.value
      ? "Post updated successfully"
      : "Post created successfully";
  } catch (error) {
    state.value = "ERROR";
    message.value = (error as unknown as Error).message;
  }

  if (state.value === "SUCCESS" || state.value === "ERROR") {
    setTimeout(() => {
      state.value === "IDLE";
      message.value = "";
    }, 2000);
  }
}

async function getPost() {
  Loaded.value = false;
  try {
    const result = await repository.get(route.params.id as string);
    data.value = {
      body: result.body,
      title: result.title,
      user_id: "",
      board_id: result.board_id,
      visible: result.visible,
    };
    selected.value = result.board_id;
  } catch (error) {
    console.log(error);
  } finally {
    Loaded.value = true;
  }
}

onMounted(async () => {
  if (route.params.id) {
    isUpdate.value = true;
    getPost();
  }
});
</script>
