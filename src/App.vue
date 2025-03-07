<template>
  <div class="container">
    <h1 class="headline">
      welcome to <span class="orange">hell /></span>
    </h1>

    <div class="tabs">
      <span v-for="category in categories" :key="category" :class="['tab', { active: activeCategory === category }]"
        @click="activeCategory = category">
        {{ category }}
      </span>
    </div>

    <div class="grid">
      <div v-for="link in filteredLinks" :key="link.url" class="tile" :class="{ unavailable: !link.available }">
        <a v-if="link.available" :href="link.url" target="_blank">
          <img :src="link.icon" :alt="link.name" />
          <p>{{ link.name }}</p>
        </a>
        <div v-else>
          <img :src="link.icon" :alt="link.name" />
          <p>{{ link.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { useLinksStore } from './stores/links';

export default {
  setup() {
    const store = useLinksStore();
    const categories = computed(() => store.categories);
    const activeCategory = ref('');

    const filteredLinks = computed(() =>
      store.links.filter(
        link => link.category === activeCategory.value
      )
    );

    const intervalId = ref(null);

    onMounted(() => {
      // При первом посещении берём сохраненную вкладку из localStorage (если есть)
      const savedCategory = localStorage.getItem('activeCategory');
      if (savedCategory && categories.value.includes(savedCategory)) {
        activeCategory.value = savedCategory;
      } else {
        // категория невалидна. Берём первую категорию, если есть 
        activeCategory.value = categories.value[0] || '';
      }

      store.checkLinks();
      intervalId.value = setInterval(
        () => store.checkLinks(), 
        5000
      );
    });

    onUnmounted(() => {
      clearInterval(intervalId.value);
    });

    // Следим за изменениями activeCategory, при любом изменении пишем в localStorage
    watch(activeCategory, (newVal) => {
      localStorage.setItem('activeCategory', newVal);
    });

    return { store, categories, activeCategory, filteredLinks };
  }
};
</script>

<style src="@/assets/styles/App.css">

</style>