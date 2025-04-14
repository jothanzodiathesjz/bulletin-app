<template>
  <div
    class="w-full rounded-2xl shadow-md p-5 bg-white relative overflow-hidden cursor-pointer border border-primary-surface"
    :id="data.id.toString()"
    @click="$router.push({ name: 'post', params: { id: data.id } })"
  >
    <!-- Card Content -->
    <div  class="flex flex-col h-full pt-3">
      <span class="text-gray-800 font-bold text-xl mb-2"
        >{{ data.title }}</span
      >

      <div
        class="text-gray-600 text-md mb-6 h-[12rem] pt-3 overflow-hidden"
      >
        {{ data.body }} . . .
      </div>

      <div class="text-gray-400 text-xs flex items-center mt-auto ">
        <span>{{ data.viewcount }} views</span>
        <span class="mx-2">|</span>
        <span>{{ data.comment_count }} comments</span>
        <span class="ml-auto">{{
          new Date(data.created_at).toLocaleDateString("ID", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Makassar", // Zona waktu WITA (UTC+8)
            weekday: "short", // Opsional, bisa dihapus jika tidak diperlukan
          })
        }}</span>
      </div>
    </div>

    
  </div>
</template>

<script setup lang="ts">
import type { PostAttributes } from "@/domain/Post";

defineProps<{
  data: PostAttributes;
}>();

// const backgroundColors = ref([
//   "#FFFFFF", // Putih
//   "#E3F2FD", // Biru muda
//   "#F5F5F5", // Abu-abu muda
//   "#E8F5E9", // Hijau pastel
//   "#FFFDE7", // Kuning muda
//   "#FCE4EC", // Merah muda
//   "#F3E5F5", // Ungu muda
//   "#FFF3E0", // Oranye muda
//   "#E0F2F1", // Teal muda
//   "#EDE7F6", // Lavender
// ]);

// function getRandomBackgroundColor() {
//   // Generate indeks acak berdasarkan panjang array
//   const randomIndex = Math.floor(Math.random() * backgroundColors.value.length);
//   // Kembalikan warna background sesuai indeks acak
//   return backgroundColors.value[randomIndex];
// }

</script>

<style scoped></style>
