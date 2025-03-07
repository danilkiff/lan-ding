// tests/App.test.js
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useLinksStore } from '../src/stores/links';
import App from '../src/App.vue';

describe('App.vue', () => {
  let store;
  let checkLinksSpy;
  let wrapper;

  beforeEach(() => {
    localStorage.clear();
    const pinia = createTestingPinia({
      stubActions: false
    });

    store = useLinksStore();
    checkLinksSpy = vi.spyOn(store, 'checkLinks');
    wrapper = mount(App, {
      global: {
        plugins: [pinia]
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
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

  it('использует категорию из localStorage, если она валидна', () => {
    // Сначала смонтировался компонент с default = "Development"
    expect(wrapper.vm.activeCategory).toBe('Development');

    // Теперь перемаунтим компонент, чтобы onMounted взял значение из localStorage
    localStorage.setItem('activeCategory', 'Infrastructure');
    wrapper.unmount(); // размонтируем старый
    wrapper = mount(App, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })]
      }
    });

    expect(wrapper.vm.activeCategory).toBe('Infrastructure');
  });

  it('если в localStorage невалидная категория, оставляет дефолтную', () => {
    localStorage.setItem('activeCategory', 'НеизвестнаяКатегория');
    wrapper.unmount();
    wrapper = mount(App, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })]
      }
    });
    // У нас по умолчанию "Development"
    expect(wrapper.vm.activeCategory).toBe('Development');
  });

  it('сохраняет категорию в localStorage при изменении', async () => {
    // Меняем категорию
    wrapper.vm.activeCategory = 'AI & DS';
    await wrapper.vm.$nextTick();

    // Проверяем, что в localStorage лежит новое значение
    expect(localStorage.getItem('activeCategory')).toBe('AI & DS');
  });

  it('вызывает store.checkLinks() при маунте', () => {
    expect(checkLinksSpy).toHaveBeenCalled();
  });
});