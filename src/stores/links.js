import { defineStore } from 'pinia';

export const useLinksStore = defineStore('links', {
  state: () => ({
    links: [
      // dev
      { url: 'https://sonar.z.pq3.ru', name: 'SonarQube', icon: '/icons/sonar.svg', category: 'Development', available: true },
      { url: 'https://gitea.z.pq3.ru', name: 'Gitea', icon: '/icons/gitea.svg', category: 'Development', available: true },
      { url: 'https://cloud.z.pq3.ru', name: 'OwnCloud', icon: '/icons/cloud.svg', category: 'Development', available: true },

      // infra
      { url: 'https://grafana.z.pq3.ru/', name: 'Grafana', icon: '/icons/grafana.svg', category: 'Infrastructure', available: true },
      { url: 'https://pihole.z.pq3.ru/admin/login', name: 'Pihole DNS', icon: '/icons/pihole.svg', category: 'Infrastructure', available: true },

      // ai & ds
      { url: 'https://n8n.z.pq3.ru', name: 'n8n', icon: '/icons/n8n.svg', category: 'AI & DS', available: true },
      { url: 'https://owui.z.pq3.ru', name: 'OpenWebUI', icon: '/icons/openwebui.png', category: 'AI & DS', available: true },
      { url: 'https://airflow.z.pq3.ru', name: 'Airflow', icon: '/icons/airflow.svg', category: 'AI & DS', available: true },
      { url: 'https://langflow.z.pq3.ru', name: 'Langflow', icon: '/icons/langflow.svg', category: 'AI & DS', available: true },
    ]
  }),

  getters: {
    categories: (state) => {
      return [...new Set(
        state.links.map(link => link.category)
      )];
    }
  },

  actions: {
    async checkLinks() {
      const updates = await this.fetchLinkStatuses();
      await this.updateLinkAvailability(updates);
    },

    async fetchLinkStatus(link) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(
          () => controller.abort(), 500
        );
        const response = await fetch(link.url, {
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(timeout);
        return {
          url: link.url,
          available: response.ok
        };
      } catch {
        return {
          url: link.url,
          available: false
        };
      }
    },

    async fetchLinkStatuses() {
      return Promise.all(
        this.links.map(
          async (link) => await this.fetchLinkStatus(link)
        ));
    },

    async updateLinkAvailability(updates) {
      this.$patch((state) => {
        state.links.forEach((link) => {
          const update = updates.find(
            (u) => u.url === link.url
          );
          if (update) {
            link.available = update.available;
          }
        });
      });
    }
  }
});
