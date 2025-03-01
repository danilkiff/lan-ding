<template>
  <div class="container">
    <h1 class="headline">
      Welcome to <span class="orange">z.pq3.ru</span>
    </h1>
  
    <div class="grid">
      <div v-for="link in store.links" :key="link.url" class="tile" :class="{ unavailable: !link.available }">
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
import { onMounted } from 'vue';
import { useLinksStore } from './stores/links';

export default {
  setup() {
    const store = useLinksStore();
    onMounted(() => {
      store.checkLinks();
      setInterval(() => store.checkLinks(), 5000);
    });
    return { store };
  }
};
</script>

<style>
a {
  text-decoration: none;
}

body {
  font-family: arial,"sans-serif";
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
}

.headline {
  font-size: 48px;
  font-weight: 600;
  text-align: center;
  color: #1d1c1c;
  margin-bottom: 5px;
}

.orange {
  color: #e66300;
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

.tile.unavailable {
  background: #e5e1dc;
  color: #9ca3af;
  box-shadow: none;
  pointer-events: none;
}
</style>