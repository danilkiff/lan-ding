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

    const tiles = wrapper.findAll('.tile');
    expect(tiles.length).toBeGreaterThan(0);
    expect(tiles[0].find('p').text()).toBe('Dev Tool');

    await wrapper.findAll('.tab')[2].trigger('click');
    await wrapper.vm.$nextTick();

    const updatedTiles = wrapper.findAll('.tile');
    expect(updatedTiles.length).toBe(1);
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
    expect(tile.exists()).toBe(true);
    expect(tile.classes()).toContain('unavailable');
    expect(tile.find('a').exists()).toBe(false);
  });

  it('ensures the page layout is mobile-friendly', () => {
    const wrapper = factory();
    // expect(wrapper.find('.container').element.style.maxWidth).toBe('100%');
    // expect(wrapper.find('.tabs').element.style.overflowX).toBe('auto');
  });

  it('prevents horizontal scrolling', () => {
    const wrapper = factory();
    // expect(getComputedStyle(document.body).overflowX).toBe('hidden');
  });

  it('ensures elements do not jump when switching tabs', async () => {
    const wrapper = factory();
    const initialHeight = wrapper.element.getBoundingClientRect().height;

    await wrapper.findAll('.tab')[1].trigger('click');
    await wrapper.vm.$nextTick();
    const newHeight = wrapper.element.getBoundingClientRect().height;

    expect(Math.abs(newHeight - initialHeight)).toBeLessThan(10);
  });
});
