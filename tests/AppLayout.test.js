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
    expect(headline.text()).toContain('Welcome to z.pq3.ru');
  });

  it('renders the grid layout', () => {
    const wrapper = factory();
    expect(wrapper.find('.grid').exists()).toBe(true);
  });

  it('renders links inside tiles correctly', async () => {
    const store = useLinksStore();
    store.links = [
      { url: 'https://example.com', name: 'Example', icon: 'example.svg', available: true }
    ];

    const wrapper = factory();
    await wrapper.vm.$nextTick(); // Дождаться обновления

    expect(wrapper.find('.tile a').exists()).toBe(true);
    expect(wrapper.find('.tile img').attributes('src')).toBe('example.svg');
  });

  it('renders unavailable tiles with disabled styling', async () => {
    const store = useLinksStore();
    store.links = [
      { url: 'https://example.com', name: 'Example', icon: 'example.svg', available: false }
    ];

    const wrapper = factory();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.tile.unavailable').exists()).toBe(true);
    expect(wrapper.find('.tile a').exists()).toBe(false);
  });
});
