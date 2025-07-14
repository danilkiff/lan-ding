<template>
  <div class="tile" :class="{ unavailable: !link.available }">
    <a v-if="link.available" :href="link.url" target="_blank">
      <img :src="link.icon" :alt="link.name" />
      <p>{{ link.name }}</p>
    </a>
    <div v-else>
      <img :src="link.icon" :alt="link.name" />
      <p>{{ link.name }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ link: Object });
</script>
