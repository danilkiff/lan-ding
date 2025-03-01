// src/stores/links.js
import { defineStore } from 'pinia';

export const useLinksStore = defineStore('links', {
  state: () => ({
    links: [
      { url: 'https://n8n.z.pq3.ru', name: 'N8N', icon: '/icons/n8n.svg', available: true },
      { url: 'https://pihole.z.pq3.ru/admin/login', name: 'Pi-hole', icon: '/icons/pihole.svg', available: true },
      { url: 'https://ai.z.pq3.ru', name: 'AI Service', icon: '/icons/ai.svg', available: true },

      { url: 'https://n8n.z.pq3.ru', name: 'N8N', icon: '/icons/n8n.svg', available: true },
      { url: 'https://pihole.z.pq3.ru/admin/login', name: 'Pi-hole', icon: '/icons/pihole.svg', available: true },
      { url: 'https://ai.z.pq3.ru', name: 'AI Service', icon: '/icons/ai.svg', available: true },

      { url: 'https://n8n.z.pq3.ru', name: 'N8N', icon: '/icons/n8n.svg', available: true },
      { url: 'https://pihole.z.pq3.ru/admin/login', name: 'Pi-hole', icon: '/icons/pihole.svg', available: true },
      { url: 'https://ai.z.pq3.ru', name: 'AI Service', icon: '/icons/ai.svg', available: true }
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