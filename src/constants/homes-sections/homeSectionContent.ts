export type TypeSingleCard = {
  name: string;
  description: string;
  url: string;
  icon: string;
  children?: {
    name: string;
    subtitle: string;
    url: string;
  }[];
};

export const sectionContent: TypeSingleCard[] = [
  {
    name: 'Brain Models',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    url: '/explore/brain-models',
    icon: 'eye',
  },
  {
    name: 'Simulations',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    url: '/explore/simulation-campaigns',
    icon: 'eye',
  },
  {
    name: 'Experimental Data',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    url: '#',
    icon: 'plus',
    children: [
      {
        name: 'Neuron Electrophysiology',
        subtitle: '3,450 dataset',
        url: '/explore/electrophysiology',
      },
      {
        name: 'Neuron Morphology',
        subtitle: '3,450 dataset',
        url: '/explore/morphology',
      },
      {
        name: 'Bouton density',
        subtitle: '3,450 dataset',
        url: '/explore/bouton-density',
      },
      {
        name: 'Neuron density',
        subtitle: '3,450 dataset',
        url: '/explore/neuron-density',
      },
      {
        name: 'Layer Thickness',
        subtitle: '3,450 dataset',
        url: '/explore/layer-thickness',
      },
      {
        name: 'Synapse per connection',
        subtitle: '3,450 dataset',
        url: '/explore/synapse-per-connection',
      },
    ],
  },
  {
    name: 'Portals',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    url: '#',
    icon: 'plus',
    children: [
      {
        name: 'My portal number one',
        subtitle: '3,450 dataset',
        url: '#',
      },
      {
        name: 'My portal number two',
        subtitle: '3,450 dataset',
        url: '#',
      },
      {
        name: 'My portal number three',
        subtitle: '3,450 dataset',
        url: '#',
      },
    ],
  },
  {
    name: 'Gallery',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    url: '#',
    icon: 'plus',
    children: [
      {
        name: 'My gallery number one',
        subtitle: '3,450 dataset',
        url: '#',
      },
      {
        name: 'My gallery number two',
        subtitle: '3,450 dataset',
        url: '#',
      },
      {
        name: 'My gallery number three',
        subtitle: '3,450 dataset',
        url: '#',
      },
    ],
  },
  {
    name: 'Literature',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    url: '/explore/literature',
    icon: 'eye',
  },
];
