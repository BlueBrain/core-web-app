import { SingleCard } from '@/types/explore-section/application';

export const sectionContent: SingleCard[] = [
  {
    prefixIcon: 'images/explore/interactive_exploration_icon.svg',
    name: 'Interactive exploration',
    description:
      'Explore each brain region and discover all the experimental data, virtual experiments targeting these regions and the literature associated to those.',
    url: '/explore/interactive',
    icon: 'eye',
    image: 'images/explore/explore_home_bgImg-03.jpg',
  },
  {
    name: 'Literature',
    description: 'Explore the literature and query publications using a chatbot.',
    url: '/explore/literature',
    icon: 'eye',
    image: 'images/explore/explore_home_bgImg-06.jpg',
    items: null,
  },
  {
    name: 'Portals',
    description: 'Explore our existing data portals.',
    url: '/explore/portals',
    icon: 'eye',
    image: 'images/explore/explore_home_bgImg-04.jpg',
    items: null,
  },
  {
    name: 'Gallery',
    description: 'Explore our brain models visualizations.',
    url: '/explore/gallery',
    icon: 'eye',
    image: 'images/explore/explore_home_bgImg-05.jpg',
    items: null,
  },
];
