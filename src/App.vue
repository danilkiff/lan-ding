<template>
  <div class="container">
    <h1 class="headline">
      How <span class="bold">developers</span> <span class="orange">build successful products</span>
    </h1>

    <div class="tabs">
      <span 
        v-for="category in categories" 
        :key="category" 
        :class="['tab', { active: activeCategory === category }]" 
        @click="activeCategory = category"
      >
        {{ category }}
      </span>
    </div>

    <div class="grid">
      <div 
        v-for="link in filteredLinks" 
        :key="link.url" 
        class="tile" 
        :class="{ unavailable: !link.available }">
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
import { computed, ref, onMounted } from 'vue';
import { useLinksStore } from './stores/links';

export default {
  setup() {
    const store = useLinksStore();
    const categories = ref(["Development", "Infrastructure", "AI & DS"]);
    const activeCategory = ref("Development");

    const filteredLinks = computed(() => 
      store.links.filter(link => link.category === activeCategory.value)
    );

    onMounted(() => {
      store.checkLinks();
      setInterval(() => store.checkLinks(), 5000);
    });

    return { store, categories, activeCategory, filteredLinks };
  }
};
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f5f3ef;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #1d1c1c;
  flex-direction: column;
}

.container {
  text-align: center;
  padding: 20px;
}

.headline {
  font-size: 36px;
  font-weight: 700;
  color: #1d1c1c;
  margin-bottom: 20px;
}

.bold {
  color: black;
}

.orange {
  color: #e66300;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.tab {
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px;
  border-bottom: 3px solid transparent;
}

.tab.active {
  color: #e66300;
  border-bottom: 3px solid #e66300;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;
  max-width: 800px;
  width: 100%;
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  text-align: center;
  border: 1px solid #e5e1dc;
}

.tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.12);
}

.tile img {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.tile p {
  font-size: 16px;
  font-weight: 600;
  color: #1d1c1c;
  margin: 0;
}

a {
  text-decoration: none;
}

.tile.unavailable {
  background: #e5e1dc;
  color: #9ca3af;
  box-shadow: none;
  pointer-events: none;
}
</style>
