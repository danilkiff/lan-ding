import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App.vue';

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

  it('switches theme on button click', async () => {
    const wrapper = mount(App, { global: { plugins: [createTestingPinia({ stubActions: false })] } });
    // По умолчанию светлая тема
    expect(wrapper.vm.isDark).toBe(false);
    expect(document.body.classList.contains('dark')).toBe(false);
    // Клик по кнопке
    await wrapper.find('.theme-toggle').trigger('click');
    expect(wrapper.vm.isDark).toBe(true);
    expect(document.body.classList.contains('dark')).toBe(true);
    // Клик обратно
    await wrapper.find('.theme-toggle').trigger('click');
    expect(wrapper.vm.isDark).toBe(false);
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  it('initializes dark theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    const wrapper = mount(App, { global: { plugins: [createTestingPinia({ stubActions: false })] } });
    expect(wrapper.vm.isDark).toBe(true);
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('initializes light theme from localStorage', () => {
    localStorage.setItem('theme', 'light');
    const wrapper = mount(App, { global: { plugins: [createTestingPinia({ stubActions: false })] } });
    expect(wrapper.vm.isDark).toBe(false);
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  it('initializes dark theme from system if no localStorage', () => {
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

  it('sets correct aria-label and icon', async () => {
    const wrapper = mount(App, { global: { plugins: [createTestingPinia({ stubActions: false })] } });
    // Светлая тема по умолчанию
    expect(wrapper.find('.theme-toggle').attributes('aria-label')).toMatch(/Тёмная тема/);
    expect(wrapper.find('.theme-icon').text()).toBe('🌙');
    // Переключаем на тёмную
    await wrapper.find('.theme-toggle').trigger('click');
    expect(wrapper.find('.theme-toggle').attributes('aria-label')).toMatch(/Светлая тема/);
    expect(wrapper.find('.theme-icon').text()).toBe('🌞');
  });
});
