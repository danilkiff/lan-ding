import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import App from '../../src/App.vue';
import { useLinksStore } from '../../src/stores/links';

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
    if (wrapper && typeof wrapper.unmount === 'function') {
      wrapper.unmount();
    }
  });


  it('uses category from localStorage if it is valid', () => {
    // Initially, the component is mounted with default = "Development"
    expect(wrapper.vm.activeCategory).toBe('Development');

    // Remount the component so onMounted takes the value from localStorage
    localStorage.setItem('activeCategory', 'Infrastructure');
    wrapper.unmount(); // unmount the old one
    wrapper = mount(App, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })]
      }
    });

    expect(wrapper.vm.activeCategory).toBe('Infrastructure');
  });

  it('keeps default category if localStorage value is invalid', () => {
    localStorage.setItem('activeCategory', 'НеизвестнаяКатегория');
    wrapper.unmount();
    wrapper = mount(App, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })]
      }
    });
    // The default is "Development"
    expect(wrapper.vm.activeCategory).toBe('Development');
  });

  it('saves category to localStorage when changed', async () => {
    // Change the category
    wrapper.vm.activeCategory = 'AI & DS';
    await wrapper.vm.$nextTick();

    // Check that the new value is in localStorage
    expect(localStorage.getItem('activeCategory')).toBe('AI & DS');
  });

  it('calls store.checkLinks() on mount', () => {
    expect(checkLinksSpy).toHaveBeenCalled();
  });
});