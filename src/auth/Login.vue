<template>
  <div
    class="w-full h-screen min-h-0 flex flex-col justify-center items-center bg-secondary-surface"
  >
    <div class="w-full lg:w-[50rem] border h-full flex flex-col ">
      <div
        class="h-full flex-shrink-0 w-full flex flex-col items-center p-5 gap-5 pprounded-t-[35px]"
      >
        <div class="w-full flex flex-col gap-6 mt-7">
          <span class="font-bold text-3xl">Login</span>
          <div class="w-full flex flex-col gap-3">
            <Label class="" for="email">Username</Label>
            <Input
              class="bg-white"
              :value="username"
              id="email"
              placeholder="Enter your username"
              @input="(v) => (username = v.toString())"
            />
          </div>
          <div class="w-full flex flex-col gap-3">
            <Label class="" for="password">Password</Label>
            <Input
              class="bg-white"
              type="password"
              :value="password"
              @input="(v) => (password = v.toString())"
              id="password"
              placeholder="Enter your username"
            />
          </div>
          <div class="w-full flex flex-col gap-4">
            <ButtonBulletin
              :disabled="disabled"
              class="w-full"
              @click="handleSubmit()"
            >
              <ReloadIcon v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              Login
            </ButtonBulletin>
            <Alert v-if="isError" variant="destructive">
              <ExclamationTriangleIcon class="w-4 h-4" />
              <AlertTitle>Coba Kembali</AlertTitle>
              <AlertDescription>
                Username atau password salah
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <span class="w-full border border-neutral-300"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import ButtonBulletin from "@/components/extra/button/Button.bulletin.vue";
import { ref, watch } from "vue";
import { DomainAuth } from "@/domain/Auth";
import { useAuthStore } from "./store/Auth.store";
import { ReloadIcon } from "@radix-icons/vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-icons/vue";

const $auth = useAuthStore();

const username = ref("");
const password = ref("");
const disabled = ref(true);
const loading = ref(false);
const isError = ref(false)


async function handleSubmit() {
  loading.value = true;
  try {
    disabled.value = true;
    await $auth.login(
      new DomainAuth({ username: username.value, password: password.value })
    );
    disabled.value = false;
  } catch (error) {
    disabled.value = false;
    isError.value = true;
  } finally {
    loading.value = false;
  }
}

watch(
    password,
    (newVal) => {
        if(newVal.length < 8) {
            disabled.value = true;
        }else {
            disabled.value = false; 
        }
    }
)

</script>
