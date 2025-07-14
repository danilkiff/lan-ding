import { mount } from '@vue/test-utils';
import LinksGrid from '@/components/LinksGrid.vue';

describe('LinksGrid.vue', () => {
  const links = [
    { url: 'https://a', name: 'A', icon: 'a.svg', category: 'Dev', available: true },
    { url: 'https://b', name: 'B', icon: 'b.svg', category: 'AI', available: false }
  ];
  it('renders all links as tiles', () => {
    const wrapper = mount(LinksGrid, { props: { links } });
    expect(wrapper.findAll('.tile').length).toBe(links.length);
  });
});
