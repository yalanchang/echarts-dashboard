<script setup lang="ts">
const authStore = useAuthStore()

onMounted(() => {
  authStore.hydrate()
  if (authStore.token) authStore.fetchMe()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>