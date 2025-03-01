// tests/linksStore.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLinksStore } from '@/stores/links';

describe('links store', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useLinksStore();
  });

  it('формирует массив уникальных категорий (categories)', () => {
    store.links = [
      { url: '1', category: 'Dev' },
      { url: '2', category: 'Dev' },
      { url: '3', category: 'Ops' }
    ];
    expect(store.categories).toEqual(['Dev', 'Ops']);
  });

  it('checkLinks устанавливает link.available в зависимости от ответа fetch', async () => {
    store.links = [
      { url: 'https://success.com', category: 'Dev', available: false },
      { url: 'https://fail.com', category: 'Dev', available: false }
    ];

    // Мокаем глобальный fetch
    global.fetch = vi.fn((url, { method }) => {
      if (url.includes('success')) {
        return Promise.resolve({ status: 200 });
      } else {
        return Promise.resolve({ status: 500 });
      }
    });

    await store.checkLinks();

    expect(store.links[0].available).toBe(true);
    expect(store.links[1].available).toBe(false);
  });
});
