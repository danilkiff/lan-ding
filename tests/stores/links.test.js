import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLinksStore } from '@/stores/links';

describe('Links Store', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useLinksStore();
  });

  describe('checkLinks', () => {
    it('handles request timeout correctly', async () => {
      global.fetch = vi.fn(() => new Promise(resolve => 
        setTimeout(() => resolve({ status: 200 }), 1000)
      ));
      
      await store.checkLinks();
      expect(store.links.every(l => !l.available)).toBe(true);
    });

    it('handles network errors', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));
      
      await store.checkLinks();
      expect(store.links.some(l => l.available)).toBe(false);
    });

    it('preserves existing properties when updating availability', async () => {
      const originalLinks = [...store.links];
      await store.checkLinks();
      
      expect(store.links).toEqual(expect.arrayContaining(
        originalLinks.map(link => expect.objectContaining({
          url: link.url,
          name: link.name,
          icon: link.icon,
          category: link.category
        }))
      ));
    });

    it.each([
      [200, true],
      [204, true], 
      [301, false], // Редиректы не считаются успешными для HEAD
      [404, false],
      [503, false]
    ])('handles %i status correctly', async (status, expected) => {
      global.fetch = vi.fn(() => Promise.resolve({ status, ok: status >= 200 && status < 300 }));
      store.links = [{ url: 'test', category: 'Test', available: !expected }];
      
      await store.checkLinks();
      expect(store.links[0].available).toBe(expected);
    });

    it('processes links in parallel', async () => {
      const start = Date.now();
      store.links = Array(10).fill().map(() => ({ url: 'https://test.com', category: 'Test' }));
      
      global.fetch = vi.fn(() => 
        new Promise(resolve => setTimeout(() => resolve({ status: 200 }), 100))
      );
      
      await store.checkLinks();
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(200); // Проверка параллельной обработки
    });
  });

  describe('categories getter', () => {
    it('generates unique categories list from links', () => {
      const CATEGORIES = { DEV: 'Dev', OPS: 'Ops' };

      store.links = [
        { url: 'dummy-1', category: CATEGORIES.DEV },
        { url: 'dummy-2', category: CATEGORIES.DEV }, // Дубликат категории
        { url: 'dummy-3', category: CATEGORIES.OPS }
      ];

      const expectedCategories = [CATEGORIES.DEV, CATEGORIES.OPS];

      expect(store.categories).toEqual(expectedCategories);
      expect(store.categories).toHaveLength(expectedCategories.length);
    });
  });

  describe('updateLinkAvailability', () => {
    it('correctly updates link availability based on fetch response', async () => {
      const SUCCESS_URL = 'https://success.com';
      const FAIL_URL = 'https://fail.com';
      const CATEGORY = 'Dev';
      
      store.links = [
        { url: SUCCESS_URL, category: CATEGORY, available: false },
        { url: FAIL_URL, category: CATEGORY, available: false }
      ];

      global.fetch = vi.fn((url) => {
        const mockResponse = url === SUCCESS_URL 
          ? { status: 200, ok: true } 
          : { status: 500, ok: false };
        return Promise.resolve(mockResponse);
      });

      await store.checkLinks();

      const [successLink, failLink] = store.links;
      
      expect(global.fetch).toHaveBeenCalledTimes(store.links.length);
      expect(successLink.available).toBe(true);
      expect(failLink.available).toBe(false);
    });
  });
});