<script setup lang="ts">
import { ref } from "vue";
const toggled = ref(false);
</script>
<template>
  <button
    h-12
    w-12
    flex="~ items-center justify-center"
    rounded-full
    :class="[toggled ? 'toggleButtonToggled' : 'toggleButton']"
    @click="toggled = ! toggled"
  >
    <span :class="['material-symbols-rounded', {'translate-x-0.4 translate-y-0.4':toggled}]"> folder_open </span>
  </button>
</template>
