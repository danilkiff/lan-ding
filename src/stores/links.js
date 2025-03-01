import { defineStore } from 'pinia';

export const useLinksStore = defineStore('links', {
  state: () => ({
    links: [
      { url: 'https://dev1.example.com', name: 'Dev Tool', icon: 'dev.svg', category: 'Development', available: true },
      { url: 'https://dev2.example.com', name: 'Dev Tool', icon: 'dev.svg', category: 'Development', available: true },
      { url: 'https://dev3.example.com', name: 'Dev Tool', icon: 'dev.svg', category: 'Development', available: true },

      { url: 'https://infra1.example.com', name: 'Infra Tool', icon: 'infra.svg', category: 'Infrastructure', available: true },
      { url: 'https://infra2.example.com', name: 'Infra Tool', icon: 'infra.svg', category: 'Infrastructure', available: true },
      { url: 'https://infra3.example.com', name: 'Infra Tool', icon: 'infra.svg', category: 'Infrastructure', available: true },

      { url: 'https://ai1.example.com', name: 'AI Tool', icon: 'ai.svg', category: 'AI & DS', available: true },
      { url: 'https://ai2.example.com', name: 'AI Tool', icon: 'ai.svg', category: 'AI & DS', available: true },
      { url: 'https://ai3.example.com', name: 'AI Tool', icon: 'ai.svg', category: 'AI & DS', available: true },
    ]
  }),

  actions: {
    async checkLinks() {
      for (const link of this.links) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 1000);
          const response = await fetch(link.url, { method: 'HEAD', signal: controller.signal });
          clearTimeout(timeout);
          link.available = response.status === 200;
        } catch {
          link.available = false;
        }
      }
    }
  }
});
