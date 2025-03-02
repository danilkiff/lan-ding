import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLinksStore } from '@/stores/links';

describe('links store', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useLinksStore();
  });

  it('should handle request timeout correctly', async () => {
    global.fetch = vi.fn(() => new Promise(resolve => 
      setTimeout(() => resolve({ status: 200 }), 1000)
    ));
    
    await store.checkLinks();
    expect(store.links.every(l => !l.available)).toBe(true);
  });

  it('should handle network errors', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));
    
    await store.checkLinks();
    expect(store.links.some(l => l.available)).toBe(false);
  });

  it('should preserve existing properties when updating availability', async () => {
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
  ])('should handle %i status correctly', async (status, expected) => {
    // Мокаем ответ с правильным свойством ok
    global.fetch = vi.fn(() => Promise.resolve({
      status,
      ok: status >= 200 && status < 300  // Имитируем реальное поведение fetch
    }));
    
    // Подготавливаем тестовые данные
    store.links = [{ url: 'test', category: 'Test', available: !expected }];
    
    await store.checkLinks();
    expect(store.links[0].available).toBe(expected);
  });

  it.each([
    [200, true],
    [204, true], 
    [301, false], // Редиректы не считаются успешными для HEAD
    [404, false],
    [503, false]
  ])('should sync availability for duplicates with status %i', async (status, expected) => {
    global.fetch = vi.fn(() => Promise.resolve({ status, ok: status >= 200 && status < 300 }));
    
    store.links = [
      { url: 'https://dup.com', category: 'Test', available: !expected },
      { url: 'https://dup.com', category: 'Test', available: !expected }
    ];
    
    await store.checkLinks();
    expect(store.links.every(l => l.available === expected)).toBe(true);
  });


  it('should not cross-update different URLs', async () => {
    global.fetch = vi.fn(url => 
      Promise.resolve({ 
        ok: url === 'https://good.com' 
      })
    );

    store.links = [
      { url: 'https://good.com', available: false },
      { url: 'https://bad.com', available: true }
    ];
    
    await store.checkLinks();
    
    expect(store.links[0].available).toBe(true);
    expect(store.links[1].available).toBe(false);
  });

  it('should use proper state mutation methods', async () => {
    const spy = vi.spyOn(store, '$patch');
    await store.checkLinks();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle duplicate URLs correctly', async () => {
    global.fetch = vi.fn(() => 
      Promise.resolve({ 
        status: 200, 
        ok: true 
      })
    );

    store.links = [
      { url: 'https://duplicate.com', category: 'Test', available: false },
      { url: 'https://duplicate.com', category: 'Test', available: false }
    ];
    
    await store.checkLinks();
    
    const [firstLink, secondLink] = store.links;
    expect(firstLink.available).toBe(true); // Оба должны стать true
    expect(secondLink.available).toBe(true);
  });

  it('should process links in parallel', async () => {
    const start = Date.now();
    store.links = Array(10).fill().map(() => ({ 
      url: 'https://test.com', 
      category: 'Test' 
    }));
    
    global.fetch = vi.fn(() => 
      new Promise(resolve => setTimeout(() => resolve({ status: 200 }), 100))
    );
    
    await store.checkLinks();
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(200); // Проверка параллельной обработки
  });

  it('generates unique categories list from links', () => {
    const CATEGORIES = {
      DEV: 'Dev',
      OPS: 'Ops'
    };

    store.links = [
      { url: 'dummy-1', category: CATEGORIES.DEV },
      { url: 'dummy-2', category: CATEGORIES.DEV }, // Дубликат категории
      { url: 'dummy-3', category: CATEGORIES.OPS }
    ];

    const expectedCategories = [CATEGORIES.DEV, CATEGORIES.OPS];

    expect(store.categories).toEqual(expectedCategories);
    expect(store.categories).toHaveLength(expectedCategories.length);
  });

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
    
    expect(fetch).toHaveBeenCalledTimes(store.links.length);
    expect(successLink.available).toBe(true);
    expect(failLink.available).toBe(false);
  });
});
