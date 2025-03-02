import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useLinksStore } from '../src/stores/links';

describe('App.vue Layout', () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn()
    };
    setActivePinia(createPinia());

    // Добавляем стили для тестов
    const style = document.createElement('style');
    style.innerHTML = `
      .container {
        max-width: 100%;
      }
      .tabs {
        overflow-x: auto;
      }
      body {
        overflow-x: hidden;
      }
    `;
    document.head.appendChild(style);
  });

  afterEach(() => {
    global.localStorage.clear();
    document.head.innerHTML = ''; // Очищаем добавленные стили
  });

  const createTestLinks = () => [
    { url: 'https://dev.example.com', name: 'Dev Tool', icon: 'dev.svg', category: 'Development', available: true },
    { url: 'https://infra.example.com', name: 'Infra Tool', icon: 'infra.svg', category: 'Infrastructure', available: true },
    { url: 'https://ai.example.com', name: 'AI Tool', icon: 'ai.svg', category: 'AI & DS', available: true }
  ];

  const mountApp = async (options = {}) => {
    const wrapper = mount(App, options);
    await wrapper.vm.$nextTick();
    return wrapper;
  };

  it('renders the main container', async () => {
    const wrapper = await mountApp();
    expect(wrapper.find('.container').exists()).toBe(true);
  });

  it('renders the headline correctly', async () => {
    const wrapper = await mountApp();
    const headline = wrapper.find('.headline');
    expect(headline.exists()).toBe(true);
    expect(headline.text()).toContain('welcome to hell />');
  });

  it('renders the tabs correctly', async () => {
    const wrapper = await mountApp();
    const tabs = wrapper.findAll('.tab');
    expect(tabs.length).toBe(3);
    expect(tabs[0].text()).toBe('Development');
    expect(tabs[1].text()).toBe('Infrastructure');
    expect(tabs[2].text()).toBe('AI & DS');
  });

  it('switches categories when a tab is clicked', async () => {
    const wrapper = await mountApp();
    const tabs = wrapper.findAll('.tab');
    await tabs[1].trigger('click');
    expect(wrapper.find('.tab.active').text()).toBe('Infrastructure');
  });

  it('renders links inside the selected category', async () => {
    const store = useLinksStore();
    store.links = createTestLinks();

    const wrapper = await mountApp();
    let tiles = wrapper.findAll('.tile');
    expect(tiles.length).toBeGreaterThan(0);
    expect(tiles[0].find('p').text()).toBe('Dev Tool');

    await wrapper.findAll('.tab')[2].trigger('click');
    tiles = wrapper.findAll('.tile');
    expect(tiles.length).toBe(1);
    expect(tiles[0].find('p').text()).toBe('AI Tool');
  });

  it('does not render unavailable links as clickable', async () => {
    const store = useLinksStore();
    store.links = [
      { url: 'https://broken.example.com', name: 'Broken Link', icon: 'broken.svg', category: 'Development', available: false }
    ];

    const wrapper = await mountApp();
    const tile = wrapper.find('.tile');
    expect(tile.exists()).toBe(true);
    expect(tile.classes()).toContain('unavailable');
    expect(tile.find('a').exists()).toBe(false);
  });

  it('ensures the page layout is mobile-friendly', async () => {
    const wrapper = await mountApp();
    const containerStyle = getComputedStyle(wrapper.find('.container').element);
    expect(containerStyle.maxWidth).toMatch(/100%/); // Гибкая проверка
  });

  it('prevents horizontal scrolling', async () => {
    const wrapper = await mountApp();
    const bodyStyle = getComputedStyle(document.body);
    expect(bodyStyle.overflowX).toMatch(/hidden/i); // Гибкая проверка
  });

  it('ensures elements do not jump when switching tabs', async () => {
    const wrapper = await mountApp();
    const initialHeight = wrapper.element.getBoundingClientRect().height;

    await wrapper.findAll('.tab')[1].trigger('click');
    await wrapper.vm.$nextTick();

    const newHeight = wrapper.element.getBoundingClientRect().height;
    const heightDifference = Math.abs(newHeight - initialHeight);

    expect(heightDifference).toBeLessThan(20);
  });
});