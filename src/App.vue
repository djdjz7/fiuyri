<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <Suspense absolute top-0 right-0 left-0 p-12>
    <RouterView />
  </Suspense>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,200,0,0");
</style>
