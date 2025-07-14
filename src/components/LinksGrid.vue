<template>
  <div class="grid-wrapper"><div class="grid">
    <Tile
      v-for="link in links"
      :key="link.url"
      :link="link"
    />
  </div></div>
</template>

<script setup>
import Tile from './Tile.vue';
defineProps({ links: Array });
</script>
