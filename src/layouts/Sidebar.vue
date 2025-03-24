<template>
  <SheetContent :side="'left'">
    <SheetHeader class="border-b pb-2">
      <SheetTitle class="text-start">Chenwoo Bulletin</SheetTitle>
    </SheetHeader>
    <div class="w-full flex flex-col py-5 gap-2 items-center">
      <Avatar :size="'base'">
        <AvatarFallback>GS</AvatarFallback>
      </Avatar>
      <div class="p-2">{{ user ? user.fullname : "Guest" }}</div>
    </div>
    <div class="w-full flex flex-col gap-3">
      <div v-if="user" class="flex flex-col gap-3">
        <div
          @click="$router.push({ name: 'dashboard-post-list' })"
          class="p-2 cursor-pointer border rounded-md"
        >
          Dashboard
        </div>
        <div
          @click="handleLogout()"
          class="p-2 cursor-pointer border rounded-md"
        >
          Log Out
        </div>
      </div>
      <div
        v-else
        @click="$router.push({ name: 'login' })"
        class="p-2 cursor-pointer border rounded-md"
      >
        Login
      </div>
    </div>
    <div class=""></div>
  </SheetContent>
</template>

<script setup lang="ts">
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { onMounted, onUnmounted, ref } from "vue";

const userData = localStorage.getItem("user");
const user = ref(userData ? JSON.parse(userData) : null);

function handleLogout() {
  localStorage.clear();
  window.location.reload();
}

const screenWidth = ref(window.innerWidth);
const screenHeight = ref(window.innerHeight);

// Function to update screen size
const updateScreenSize = () => {
  screenWidth.value = window.innerWidth;
  screenHeight.value = window.innerHeight;
};

// Add event listener for window resize
onMounted(() => {
  window.addEventListener("resize", updateScreenSize);
});

// Remove event listener when component is unmounted
onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});
</script>
