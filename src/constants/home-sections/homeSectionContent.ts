import { SingleCard } from "@/types/explore-section/application";


export const sectionContent: SingleCard[] = [
  {
    name: 'Brain Models',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    url: '/explore/brain-models',
    icon: 'eye',
    image: 'images/explore/explore_home_bgImg-01.jpg',
    items: null,
  },
  {
    name: 'Simulations',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    url: '/explore/simulation-campaigns',
    icon: 'eye',
    image: 'images/explore/explore_home_bgImg-02.jpg',
    items: null,
  },
  {
    name: 'Experimental Data',
    description: 'A set of experimental data to build models',
    url: '#',
    icon: 'plus',
    image: 'images/explore/explore_home_bgImg-03.jpg',
    items: [
      {
        name: 'Neuron electrophysiology',
        type: 'https://neuroshapes.org/Trace',
        url: '/explore/electrophysiology',
      },
      {
        name: 'Neuron morphology',
        type: 'https://neuroshapes.org/NeuronMorphology',
        url: '/explore/morphology',
      },
      {
        name: 'Bouton density',
        type: 'https://neuroshapes.org/BoutonDensity',
        url: '/explore/bouton-density',
      },
      {
        name: 'Neuron density',
        type: 'https://neuroshapes.org/NeuronDensity',
        url: '/explore/neuron-density',
      },
      {
        name: 'Layer thickness',
        type: 'https://neuroshapes.org/LayerThickness',
        url: '/explore/layer-thickness',
      },
      {
        name: 'Synapse per connection',
        type: 'https://neuroshapes.org/SynapsePerConnection',
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
    image: 'images/explore/explore_home_bgImg-04.jpg',
    items: [
      {
        name: 'My portal number one',
        type: '3,450 dataset',
        url: '#',
      },
      {
        name: 'My portal number two',
        type: '3,450 dataset',
        url: '#',
      },
      {
        name: 'My portal number three',
        type: '3,450 dataset',
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
    image: 'images/explore/explore_home_bgImg-05.jpg',
    items: [
      {
        name: 'My gallery number one',
        type: '3,450 dataset',
        url: '#',
      },
      {
        name: 'My gallery number two',
        type: '3,450 dataset',
        url: '#',
      },
      {
        name: 'My gallery number three',
        type: '3,450 dataset',
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
    image: 'images/explore/explore_home_bgImg-06.jpg',
    items: null,
  },
];
