import Tile from '@/components/Tile.vue';
import { mount } from '@vue/test-utils';

describe('Tile.vue', () => {
    const link = { url: 'https://a', name: 'A', icon: 'a.svg', category: 'Dev', available: true };
    it('renders the link name and icon', () => {
        const wrapper = mount(Tile, { props: { link } });
        expect(wrapper.text()).toContain(link.name);
        expect(wrapper.find('img').attributes('src')).toBe(link.icon);
    });
    it('renders as <a> when link is available', () => {
        const wrapper = mount(Tile, { props: { link } });
        expect(wrapper.find('a').exists()).toBe(true);
    });
    it('renders as <div> when link is unavailable', () => {
        const unavailable = { ...link, available: false };
        const wrapper = mount(Tile, { props: { link: unavailable } });
        expect(wrapper.find('a').exists()).toBe(false);
        expect(wrapper.find('div').exists()).toBe(true);
    });
});
