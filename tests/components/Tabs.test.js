import { mount } from '@vue/test-utils';
import Tabs from '@/components/Tabs.vue';

describe('Tabs.vue', () => {
  const categories = ['Dev', 'AI'];
  it('renders all categories', () => {
    const wrapper = mount(Tabs, { props: { categories, activeCategory: 'Dev' } });
    expect(wrapper.findAll('.tab').length).toBe(categories.length);
  });
  it('highlights the active tab', () => {
    const wrapper = mount(Tabs, { props: { categories, activeCategory: 'AI' } });
    const active = wrapper.find('.tab.active');
    expect(active.exists()).toBe(true);
    expect(active.text()).toBe('AI');
  });
  it('emits update:activeCategory when tab is clicked', async () => {
    const wrapper = mount(Tabs, { props: { categories, activeCategory: 'Dev' } });
    await wrapper.findAll('.tab')[1].trigger('click');
    expect(wrapper.emitted('update:activeCategory')).toBeTruthy();
    expect(wrapper.emitted('update:activeCategory')[0]).toEqual(['AI']);
  });
});
