import { mount } from '@vue/test-utils';
import Header from '@/components/Header.vue';

describe('Header.vue', () => {
  it('renders the title and theme button', () => {
    const wrapper = mount(Header, { props: { isDark: false } });
    expect(wrapper.text()).toContain('welcome to');
    expect(wrapper.find('.theme-toggle').exists()).toBe(true);
  });

  it('emits toggle-theme when button is clicked', async () => {
    const wrapper = mount(Header, { props: { isDark: false } });
    await wrapper.find('.theme-toggle').trigger('click');
    expect(wrapper.emitted('toggle-theme')).toBeTruthy();
  });
});
