// tests/AppLayout.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useLinksStore } from '../src/stores/links';

describe('App.vue Layout', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const factory = () => {
    return mount(App);
  };

  it('renders the main container', () => {
    const wrapper = factory();
    expect(wrapper.find('.container').exists()).toBe(true);
  });

  it('renders the headline correctly', () => {
    const wrapper = factory();
    const headline = wrapper.find('.headline');
    expect(headline.exists()).toBe(true);
    expect(headline.text()).toContain('How developers build successful products');
  });

  it('renders the tabs correctly', () => {
    const wrapper = factory();
    const tabs = wrapper.findAll('.tab');
    expect(tabs.length).toBe(3);
    expect(tabs[0].text()).toBe('Development');
    expect(tabs[1].text()).toBe('Infrastructure');
    expect(tabs[2].text()).toBe('AI & DS');
  });

  it('switches categories when a tab is clicked', async () => {
    const wrapper = factory();
    const tabs = wrapper.findAll('.tab');
    await tabs[1].trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.tab.active').text()).toBe('Infrastructure');
  });

  it('renders links inside the selected category', async () => {
    const store = useLinksStore();
    store.links = [
      { url: 'https://dev.example.com', name: 'Dev Tool', icon: 'dev.svg', category: 'Development', available: true },
      { url: 'https://infra.example.com', name: 'Infra Tool', icon: 'infra.svg', category: 'Infrastructure', available: true },
      { url: 'https://ai.example.com', name: 'AI Tool', icon: 'ai.svg', category: 'AI & DS', available: true }
    ];

    const wrapper = factory();
    await wrapper.vm.$nextTick();

    // Убедимся, что плитки появились
    const tiles = wrapper.findAll('.tile');
    expect(tiles.length).toBeGreaterThan(0);
    expect(tiles[0].find('p').text()).toBe('Dev Tool');

    // Переключаемся на другую вкладку
    await wrapper.findAll('.tab')[2].trigger('click');
    await wrapper.vm.$nextTick();

    const updatedTiles = wrapper.findAll('.tile');
    expect(updatedTiles.length).toBeGreaterThan(0);
    expect(updatedTiles[0].find('p').text()).toBe('AI Tool');
  });

  it('does not render unavailable links as clickable', async () => {
    const store = useLinksStore();
    store.links = [
      { url: 'https://broken.example.com', name: 'Broken Link', icon: 'broken.svg', category: 'Development', available: false }
    ];

    const wrapper = factory();
    await wrapper.vm.$nextTick();

    const tile = wrapper.find('.tile');
    expect(tile.classes()).toContain('unavailable');
    expect(tile.find('a').exists()).toBe(false);
  });
});
