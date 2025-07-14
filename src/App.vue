<template>
  <div class="container">
    <Header :isDark="isDark" @toggle-theme="toggleTheme" />
    <Tabs :categories="categories" :activeCategory="activeCategory" @update:activeCategory="val => activeCategory = val" />
    <LinksGrid :links="filteredLinks" />
  </div>
</template>

<script>
import '@/assets/styles/dark.css';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import Header from './components/Header.vue';
import LinksGrid from './components/LinksGrid.vue';
import Tabs from './components/Tabs.vue';
import { useLinksStore } from './stores/links';

export default {
  components: { Header, Tabs, LinksGrid },
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
      const savedCategory = localStorage.getItem('activeCategory');
      if (savedCategory && categories.value.includes(savedCategory)) {
        activeCategory.value = savedCategory;
      } else {
        activeCategory.value = categories.value[0] || '';
      }

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

    watch(activeCategory, (newVal) => {
      localStorage.setItem('activeCategory', newVal);
    });

    return { categories, activeCategory, filteredLinks, isDark, toggleTheme };
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