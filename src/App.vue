<template>
  <div class="container">
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <h1 class="headline" style="margin: 0;">
        welcome to <span class="orange">hell /></span>
      </h1>
      <button
        class="theme-toggle"
        :aria-label="isDark ? 'Светлая тема' : 'Тёмная тема'"
        @click="toggleTheme"
      >
        <span v-if="isDark" class="theme-icon">🌞</span>
        <span v-else class="theme-icon">🌙</span>
      </button>
    </div>

    <div class="tabs">
      <span v-for="category in categories" :key="category" :class="['tab', { active: activeCategory === category }]"
        @click="activeCategory = category">
        {{ category }}
      </span>
    </div>
    
    <div class="grid-wrapper"><div class="grid">
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
    </div></div>
  </div>
</template>

<script>
import '@/assets/styles/dark.css';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useLinksStore } from './stores/links';

export default {
  setup() {
    const store = useLinksStore();
    const categories = computed(() => store.categories);
    const activeCategory = ref('');
    const isDark = ref(false);
    const intervalId = ref(null);

    const filteredLinks = computed(() =>
      store.links.filter(
        link => link.category === activeCategory.value
      )
    );

    const setTheme = (dark) => {
      isDark.value = dark;
      document.body.classList.toggle('dark', dark);
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    };
    const toggleTheme = () => setTheme(!isDark.value);

    onMounted(() => {
      // При первом посещении берём сохраненную вкладку из localStorage (если есть)
      const savedCategory = localStorage.getItem('activeCategory');
      if (savedCategory && categories.value.includes(savedCategory)) {
        activeCategory.value = savedCategory;
      } else {
        // категория невалидна. Берём первую категорию, если есть 
        activeCategory.value = categories.value[0] || '';
      }

      // Применяем тему из localStorage или по умолчанию (по системной теме)
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setTheme(true);
      } else {
        setTheme(false);
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

    return { store, categories, activeCategory, filteredLinks, isDark, toggleTheme };
  }
};
</script>

<style src="@/assets/styles/App.css">
.theme-toggle {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.theme-toggle:hover {
  background: #f5f3ef;
}
body.dark .theme-toggle:hover {
  background: #232129;
}
.theme-icon {
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>