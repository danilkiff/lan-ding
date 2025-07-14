<template>
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <h1 class="headline" style="margin: 0;">
      welcome to <span class="orange">hell /></span>
    </h1>
    <button
      class="theme-toggle"
      :aria-label="isDark ? 'Светлая тема' : 'Тёмная тема'"
      @click="$emit('toggle-theme')"
    >
      <span v-if="isDark" class="theme-icon">🌞</span>
      <span v-else class="theme-icon">🌙</span>
    </button>
  </div>
</template>

<script setup>
defineProps({ isDark: Boolean });
defineEmits(['toggle-theme']);
</script>
