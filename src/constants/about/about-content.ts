import { basePath } from '@/config';

export const INTRODUCTION_PARAGRAPH = [
  'The Blue Brain Open Platform is a groundbreaking open-source simulation neuroscience platform developed by the Blue Brain Project.',
  'Our mission is to advance the understanding of the brain by providing access to state-of-the-art data exploration, modeling, and simulation techniques.',
  'By integrating a wide range of open-source tools and models, especially those created by Blue Brain, we offer an invaluable resource for the neuroscience community to leverage simulation neuroscience.',
];

export const FEATURES_BLOCK = {
  title: 'Features',
  subtitle: 'of the blue brain open platform',
  paragraphs: [
    'The Blue Brain Open Platform enables atlas-driven exploration of brain data, from molecular models of metabolic systems to single-cell morphologies and complex brain region simulations. ',
    'Users can customize their models, run personalized simulations, and leverage machine learning for comparative data analyses. This flexibility accelerates and enhances neuroscience research.',
  ],
  image: `${basePath}/images/about/bbop_3d_rat_brain_image_01.png`,
};

export const ORIGIN_BLOCK = {
  title: 'Origin',
  subtitle: 'of the blue brain open platform',
  paragraphs: [
    'Since its inception in 2005, the Blue Brain Project has been a leader in establishing simulation neuroscience as a complement to experimental and theoretical neuroscience. It has achieved this primarily by creating biologically detailed digital reconstructions and simulations of the mouse brain. ',
    'All the tools and models created and used by Blue Brain are brought together in one platform to be shared with the neuroscience community. This is the result of significant investment and collaborations with more than 30 institutes worldwide, underscoring the importance of international cooperation and open science.',
  ],
  image: `${basePath}/images/about/BBOP_image_origin.png`,
};

export const IN_SHORT_LIST = {
  title: 'In Short',
  list: [
    'Swiss-based initiative',
    'Hosted at the Ecole Polytechnique Fédérale de Lausanne (EPFL)',
    '19+ years pioneering simulation neuroscience',
    'Around 40 international projects',
    'In collaboration with 35+ institutes',
    '270+ peer-reviewed publications',
    '1,000+ contributing authors',
    '20k+ citations garnered',
    'Open Science: 260+ public repositories released',
  ],
};

export const SIMULATION_NEUROSCIENCE_BLOCK = [
  {
    title: 'Feasibility',
    description:
      'Provides a scalable, cost-effective environment for brain mapping across different ages, species, and diseases.',
    image: `${basePath}/images/about/simulation_neuroscience/bbop_about_image-feasability.jpg`,
  },
  {
    title: 'Expertise',
    description:
      'Reduces the need for extensive multidisciplinary training by offering a virtual platform accessible to diverse researchers.',
    image: `${basePath}/images/about/simulation_neuroscience/bbop_about_image-expertise.jpg`,
  },
  {
    title: 'Equipment',
    description:
      'Circumvents the necessity for expensive hardware, democratizing research opportunities.',
    image: `${basePath}/images/about/simulation_neuroscience/bbop_about_image-equipment.jpg`,
  },
  {
    title: 'Cost',
    description:
      'Minimizes financial and temporal investments by conducting simulations in a virtual environment.',
    image: `${basePath}/images/about/simulation_neuroscience/bbop_about_image-cost.jpg`,
  },
  {
    title: 'Complexity',
    description: 'Allows comprehensive study of brain interactions and emergent properties.',
    image: `${basePath}/images/about/simulation_neuroscience/bbop_about_image-complexity.jpg`,
  },
  {
    title: 'Fragmentation',
    description: 'Integrates global research efforts, fostering collaboration and progress.',
    image: `${basePath}/images/about/simulation_neuroscience/bbop_about_image-fragmentation.jpg`,
  },
  {
    title: 'Standardization',
    description:
      'Facilitates tracing of brain functions to cellular and molecular mechanisms through a unified framework.',
    image: `${basePath}/images/about/simulation_neuroscience/bbop_about_image-standardization.jpg`,
  },
  {
    title: 'Reproducibility',
    description:
      'Enhances the accuracy and reliability of findings through controlled replication and validation.',
    image: `${basePath}/images/about/simulation_neuroscience/bbop_about_image-reproductibility.jpg`,
  },
  {
    title: 'Diagnostics',
    description: 'Centralizes brain data and knowledge, improving diagnostic accuracy.',
    image: `${basePath}/images/about/simulation_neuroscience/bbop_about_image-diagnostic.jpg`,
  },
  {
    title: 'Consolidation',
    description:
      'Systematically integrates data from diverse brain functions and diseases, aiding comprehensive brain mapping.',
    image: `${basePath}/images/about/simulation_neuroscience/bbop_about_image-consolidation.jpg`,
  },
];

export const COMPLEMENTING = {
  title: 'Complementing',
  subtitle: 'theory and experiments',
  paragraphs: [
    'While simulation neuroscience is a powerful tool, it complements rather than replaces experimental and theoretical approaches.',
    'Virtual experiments allow users to prototype experiments, test hypotheses and explore a wide range of applications that are difficult to do in experiments directly.',
  ],
  image: `${basePath}/images/about/long_foot_image.png`,
};

export const BBP_TIMELINE = [
  {
    title: 'microcircuits',
    description:
      'A cortical microcircuit model comprises all six cortical layers with a horizontal extent that captures the entire dendritic tree of the most central neurons. Neurons within have the same anatomical and physiological level of detail as single neuron models. All synapses between the contained neurons are included, plus more abstract models of thalamo-cortical axons that serve as user-controlled inputs. This setup can be used to study the local processing of thalamic inputs, and the roles of individual subpopulations during that process.',
    neurons: '31k',
    synapses: '37M',
    image: `${basePath}/images/about/timeline/bbp_timeline_step-microcircuit.webp`,
  },
  {
    title: 'thalamus',
    description:
      'This model of the thalamus comprises three thalamic nuclei. It is constructed in a volumetric atlas and hence takes the shape of the modeled regions into account. Neurons are placed according to experimentally measured cell densities. The entirety of the model can be simulated, or user-specified parts of it. The model can be used to study the anatomy and activity of this pivotal brain region.',
    neurons: '331k',
    synapses: '40M',
    image: `${basePath}/images/about/timeline/bbp_timeline_step-thalamus.webp`,
  },
  {
    title: 'hippocampus',
    description:
      'This model of the CA1 regions of the rodent hippocampus is constructed in a volumetric atlas. It takes the shape of the modeled regions into account. Neurons within are placed according to experimentally measured cell densities. The entirety of the model, or only user-specified parts, can be simulated. The hippocampal CA1 model facilitates the study of both the anatomical structure and neural activity in this brain region.',
    neurons: '460k',
    synapses: '800M',
    image: `${basePath}/images/about/timeline/bbp_timeline_step-hippocampus.webp`,
  },
  {
    title: 'Non Barrel Somatosensory Cortex',
    description:
      'This model of the non-barrel somatosensory regions of rodent cortex is constructed in a volumetric atlas and takes the shape of the modeled regions into account. Neurons are placed according to experimentally measured cell densities. Both the entirety or user-specified parts of the model can be simulated in order to facilitate the study of both the anatomical structure and neural activity in this brain region.',
    neurons: '1.7M',
    synapses: '4.7B',
    image: `${basePath}/images/about/timeline/bbp_timeline_step-somatosensorycortex.webp`,
  },
  {
    title: 'Neocortex',
    description:
      'Building upon the somatosensory cortex model, this extends the model to cover all regions of the mouse neocortex. It can be analyzed or simulated in its entirety, or selected regions only; as such, it can be used to study the dynamic interactions between the various regions.',
    neurons: '10.7M',
    synapses: '88B',
    image: `${basePath}/images/about/timeline/bbp_timeline_step-neocortex.webp`,
  },
  {
    title: 'Neuro-glia vascular System',
    description:
      'This enhanced model of the neuro-glia-vascular system combines a microcircuit model with models of astrocytes in biological densities as well as blood vessels innervating the volume. The dynamic interactions between neurons, the astrocytes and the vascular system are also modeled and can be readily simulated to gain a deep insight into their functionalities.',
    neurons: '88K',
    astrocytes: '14K',
    image: `${basePath}/images/about/timeline/bbp_timeline_step-ngv_system.webp`,
  },
  {
    title: 'Whole Brain with Olfactory Bulb and Cerebellum',
    description:
      'This extremely large model combines the neocortex model with models for the various other parts of the brain. The models for the olfactory bulb and cerebellum were constructed in collaboration with experts from the community to accurately capture their specific anatomy and their physiology.',
    neurons: '71.5M',
    image: `${basePath}/images/about/timeline/bbp_timeline_step-point_neuron.webp`,
  },
  {
    title: 'Brain vascular system',
    description:
      'This version of the model of the neuro-glia-vascular system has been scaled up to encompass the whole brain.',
    neurons: '71.5M',
    image: `${basePath}/images/about/timeline/bbp_timeline_step-whole_brain_last.webp`,
    width: 1200,
    height: 675,
  },
];

export const DOWNLOADABLE_DOCUMENTS = [
  {
    name: 'Open Platform Brochure',
    id: 'openPlatformBrochure',
    description:
      'The Blue Brain Open Platform offers the capability of exploring, building and simulating brain models. Discover a brief overview in this introduction to the platform.',
    url: `${basePath}/downloads/open_blue_brain_platform_Introduction_no_restrictions.pdf`,
    access: 'public',
  },
  {
    name: 'Introduction to Digital Brain Models',
    id: 'digitalBrainModels',
    description:
      'The Blue Brain Open Platform uses digital brain models developed by the Blue Brain Project. Learn about the different models in this brief overview.',
    url: `${basePath}/downloads/intro_to_digital_brains.pdf`,
    access: 'restricted',
  },
  {
    name: 'Biological Fidelity',
    id: 'biologicalFidelity',
    description:
      'The Blue Brain Open Platform is a fully integrated tool for simulation neuroscience using a series of algorithms and models. In this overview, the structural and functional validations of the models are described.',
    url: `${basePath}/downloads/biological_fidelity_Model_validations.pdf`,
    access: 'restricted',
  },
];
