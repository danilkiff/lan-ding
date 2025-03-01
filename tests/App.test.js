// tests/App.test.js
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { useLinksStore } from '../src/stores/links';
import App from '../src/App.vue';

describe('App.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders links correctly', async () => {
    const wrapper = mount(App);
    const store = useLinksStore();
    store.links = [
      { url: 'https://example.com', name: 'Example', icon: 'example.svg', category: 'Development', available: true }
    ];
    await wrapper.vm.$nextTick();
    expect(wrapper.find('a').attributes('href')).toBe('https://example.com');
  });

  it('disables unavailable links', async () => {
    const wrapper = mount(App);
    const store = useLinksStore();
    store.links = [
      { url: 'https://example.com', name: 'Example', icon: 'example.svg', available: false }
    ];
    await wrapper.vm.$nextTick();
    expect(wrapper.find('a').exists()).toBe(false);
  });
});