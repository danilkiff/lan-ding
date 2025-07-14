import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App.vue';

describe('App.vue theme (dark/light) logic', () => {
  let originalMatchMedia;
  let setItemSpy, getItemSpy;
  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem');
    getItemSpy = vi.spyOn(window.localStorage.__proto__, 'getItem');
    localStorage.clear();
    document.body.classList.remove('dark');
  });
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
    document.body.classList.remove('dark');
  });

  it('toggles theme when button is clicked', async () => {
    const wrapper = mount(App, { global: { plugins: [createTestingPinia({ stubActions: false })] } });
    // Light theme by default
    expect(wrapper.vm.isDark).toBe(false);
    expect(document.body.classList.contains('dark')).toBe(false);
    // Click the button
    await wrapper.find('.theme-toggle').trigger('click');
    expect(wrapper.vm.isDark).toBe(true);
    expect(document.body.classList.contains('dark')).toBe(true);
    // Click again to switch back
    await wrapper.find('.theme-toggle').trigger('click');
    expect(wrapper.vm.isDark).toBe(false);
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  it('initializes dark theme if localStorage is dark', () => {
    localStorage.setItem('theme', 'dark');
    const wrapper = mount(App, { global: { plugins: [createTestingPinia({ stubActions: false })] } });
    expect(wrapper.vm.isDark).toBe(true);
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('initializes light theme if localStorage is light', () => {
    localStorage.setItem('theme', 'light');
    const wrapper = mount(App, { global: { plugins: [createTestingPinia({ stubActions: false })] } });
    expect(wrapper.vm.isDark).toBe(false);
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  it('initializes dark theme from system preference if no localStorage', () => {
    localStorage.removeItem('theme');
    window.matchMedia = vi.fn().mockImplementation(query => ({ matches: query.includes('dark') }));
    const wrapper = mount(App, { global: { plugins: [createTestingPinia({ stubActions: false })] } });
    expect(wrapper.vm.isDark).toBe(true);
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('saves theme to localStorage when toggled', async () => {
    const wrapper = mount(App, { global: { plugins: [createTestingPinia({ stubActions: false })] } });
    await wrapper.find('.theme-toggle').trigger('click');
    expect(localStorage.getItem('theme')).toBe('dark');
    await wrapper.find('.theme-toggle').trigger('click');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('sets correct aria-label and icon for theme button', async () => {
    const wrapper = mount(App, { global: { plugins: [createTestingPinia({ stubActions: false })] } });
    // Light theme by default
    expect(wrapper.find('.theme-toggle').attributes('aria-label')).toMatch(/Тёмная тема/);
    expect(wrapper.find('.theme-icon').text()).toBe('🌙');
    // Switch to dark theme
    await wrapper.find('.theme-toggle').trigger('click');
    expect(wrapper.find('.theme-toggle').attributes('aria-label')).toMatch(/Светлая тема/);
    expect(wrapper.find('.theme-icon').text()).toBe('🌞');
  });
});
