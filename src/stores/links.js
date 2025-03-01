import { defineStore } from 'pinia';

export const useLinksStore = defineStore('links', {
  state: () => ({
    links: [
      // dev
      { url: 'https://sonar.z.pq3.ru', name: 'SonarQube', icon: '/icons/sonar.svg', category: 'Development', available: true },
      { url: 'https://gitea.z.pq3.ru', name: 'Gitea', icon: '/icons/gitea.svg', category: 'Development', available: true },

      // infra
      { url: 'https://grafana.z.pq3.ru/', name: 'Grafana', icon: '/icons/grafana.svg', category: 'Infrastructure', available: true },
      { url: 'https://pihole.z.pq3.ru/admin/login', name: 'Pihole DNS', icon: '/icons/pihole.svg', category: 'Infrastructure', available: true },
    
      // ai & ds
      { url: 'https://n8n.z.pq3.ru', name: 'n8n', icon: '/icons/n8n.svg', category: 'AI & DS', available: true },
      { url: 'https://airflow.z.pq3.ru', name: 'Airflow', icon: '/icons/airflow.svg', category: 'AI & DS', available: true },
    ]
  }),

  actions: {
    async checkLinks() {
      for (const link of this.links) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 500);
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
