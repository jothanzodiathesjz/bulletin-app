<template>
  <Popover>
    <PopoverTrigger as-child>
      <ButtonBulletin variant="outline" :size="'lg'" class="px-5">
        <CalendarIcon class="h-4 w-4" />
      </ButtonBulletin>
    </PopoverTrigger>
    <PopoverContent :align="'start'" class="w-auto p-0">
      <RangeCalendar
        v-model="dateValue"
        initial-focus
        :number-of-months="1"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import type { DateRange } from "radix-vue";
import ButtonBulletin from "./button/Button.bulletin.vue";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RangeCalendar } from "@/components/ui/range-calendar";
import { CalendarIcon } from "@radix-icons/vue";
import { computed } from "vue";

const props = defineProps<{
  value: DateRange;
}>();

const emit = defineEmits<{
  (event: "update:value", date: DateRange): void;
}>();

// Computed property untuk mengimplementasikan v-model
const dateValue = computed({
  get: () => props.value,
  set: (newValue) => emit('update:value', newValue)
});
</script>