<template>
  <div class="tabs">
    <span
      v-for="category in categories"
      :key="category"
      :class="['tab', { active: activeCategory === category }]"
      @click="$emit('update:activeCategory', category)"
    >
      {{ category }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  categories: Array,
  activeCategory: String
});
defineEmits(['update:activeCategory']);
</script>
