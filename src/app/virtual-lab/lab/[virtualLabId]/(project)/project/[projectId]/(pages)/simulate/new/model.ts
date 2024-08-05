export const synaptomeModel = {
  _id: 'https://openbrainplatform.org/data/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6/8f5b39a6-1ace-44d0-91d0-fec035614919',
  _source: {
    '@context': [
      'https://bluebrain.github.io/nexus/contexts/metadata.json',
      'https://bbp.neuroshapes.org',
    ],
    '@id':
      'https://openbrainplatform.org/data/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6/8f5b39a6-1ace-44d0-91d0-fec035614919',
    '@type': 'SingleNeuronSynaptome',
    annotation: [
      {
        '@type': ['ETypeAnnotation', 'Annotation'],
        hasBody: {
          '@type': ['EType', 'AnnotationBody'],
          label: 'cNAC',
        },
        name: 'E-type annotation',
      },
      {
        '@type': ['MTypeAnnotation', 'Annotation'],
        hasBody: {
          '@type': ['MType', 'AnnotationBody'],
          label: 'L5_TPC:B',
        },
        name: 'M-type annotation',
      },
    ],
    brainLocation: {
      '@type': 'BrainLocation',
      brainRegion: {
        '@id': 'mba:322',
        label: 'Primary somatosensory area',
      },
      layer: {
        '@id': 'uberon:0005394',
        label: 'layer 5',
      },
    },
    description: '',
    distribution: {
      '@type': 'DataDownload',
      contentSize: {
        unitCode: 'bytes',
        value: 365,
      },
      contentUrl:
        'https://sbo-nexus-delta.shapes-registry.org/v1/files/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6/https:%2F%2Fopenbrainplatform.org%2Fdata%2F5f617dc9-3097-4c84-92ee-459cb684b5d5%2F77914d4a-01a9-43b1-a270-2b0a31fadac6%2F82906dc1-841d-413d-99fc-8ba7c0ba7718',
      digest: {
        algorithm: 'SHA-256',
        value: 'b7b3b61df5bd1b4cc6d4ee44ee859b604e1e03fc8dd8478b82950befc9cd9fb3',
      },
      encodingFormat: 'application/json',
      name: 'synaptome_config.json',
    },
    eModel: 'cNAC_L5_TPC:B',
    eType: 'cNAC',
    generation: {
      '@type': 'Generation',
      activity: {
        '@type': 'Activity',
        wasAssociatedWith: {
          '@type': 'SoftwareAgent',
          description: 'Run me-model-analysis using on-demand service in AWS.',
          name: 'me-model-analysis',
          softwareSourceCode: {
            '@type': 'SoftwareSourceCode',
            codeRepository: 'https://bbpgitlab.epfl.ch/project/sbo/me-model-analysis',
            programmingLanguage: 'Python',
            runtimePlatform: 3.7,
            version: '1.0.1',
          },
        },
      },
    },
    hasPart: [
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/67acf101-12f6-4b7b-8a89-5237aadf94db',
        '@type': 'EModel',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/255e007e-a6d1-4fc9-b984-1e0221e39ea3',
        '@type': 'NeuronMorphology',
      },
    ],
    holding_current: 0,
    image: [
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/ea0b79b5-66bb-48bf-8933-9b43b56959d5',
        about: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/traces',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/af301c80-0c51-4726-95b7-dc65e5e180fd',
        about: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/scores',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/e5e20e7a-87b5-47a2-abda-2d7212ab00e1',
        about: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/thumbnail',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/aea6c71b-41a9-4268-96e7-d0f9265693e1',
        about:
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/parameters_distribution',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/798bab6a-4caa-460b-bac7-a6f08672f11b',
        about: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/currentscape',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/ba3c8d1a-2839-4fdd-b13f-73950c84954a',
        about: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/currentscape',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/3cb119a2-6a3a-4e75-99c5-53f2405d3e91',
        about: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/currentscape',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/29dc72cb-bb9d-4966-bc3b-70e6ff65c6e3',
        about: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/currentscape',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/3819e25e-ace3-4809-9a96-964d5d9fb932',
        about: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/currentscape',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/33bcf9d3-b6db-4d2c-b3c6-3ea8a5932202',
        about: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/currentscape',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/2869d500-3c6e-4d15-bcae-b4ece55c5586',
        about: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/currentscape',
      },
      {
        '@id':
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/489673cc-27c1-46bf-ad6a-510ea124a4cc',
        about: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/currentscape',
      },
    ],
    iteration: 'hipp_rat-ch150801A1',
    mType: 'L5_TPC:B',
    name: 'Pair2',
    objectOfStudy: {
      '@id': 'http://bbp.epfl.ch/neurosciencegraph/taxonomies/objectsofstudy/singlecells',
      '@type': 'ObjectOfStudy',
      label: 'Single Cell',
    },
    score: 1678.8587116660485,
    seed: 100,
    status: 'done',
    subject: {
      '@type': 'Subject',
      species: {
        '@id': 'NCBITaxon:10116',
        label: 'Rattus norvegicus',
      },
    },
    project: {
      label:
        'https://sbo-nexus-delta.shapes-registry.org/v1/projects/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6',
    },
    threshold_current: 0.11091246623884962,
    validated: true,
    _constrainedBy: 'https://bluebrain.github.io/nexus/schemas/unconstrained.json',
    _createdAt: '2024-08-05T09:23:55.552430Z',
    _createdBy: 'https://sbo-nexus-delta.shapes-registry.org/v1/realms/SBO/users/dinika',
    _deprecated: false,
    _incoming:
      'https://sbo-nexus-delta.shapes-registry.org/v1/resources/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6/_/https:%2F%2Fopenbrainplatform.org%2Fdata%2F5f617dc9-3097-4c84-92ee-459cb684b5d5%2F77914d4a-01a9-43b1-a270-2b0a31fadac6%2F8f5b39a6-1ace-44d0-91d0-fec035614919/incoming',
    _outgoing:
      'https://sbo-nexus-delta.shapes-registry.org/v1/resources/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6/_/https:%2F%2Fopenbrainplatform.org%2Fdata%2F5f617dc9-3097-4c84-92ee-459cb684b5d5%2F77914d4a-01a9-43b1-a270-2b0a31fadac6%2F8f5b39a6-1ace-44d0-91d0-fec035614919/outgoing',
    _project:
      'https://sbo-nexus-delta.shapes-registry.org/v1/projects/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6',
    _rev: 1,
    _schemaProject:
      'https://sbo-nexus-delta.shapes-registry.org/v1/projects/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6',
    _self:
      'https://sbo-nexus-delta.shapes-registry.org/v1/resources/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6/_/https:%2F%2Fopenbrainplatform.org%2Fdata%2F5f617dc9-3097-4c84-92ee-459cb684b5d5%2F77914d4a-01a9-43b1-a270-2b0a31fadac6%2F8f5b39a6-1ace-44d0-91d0-fec035614919',
    _updatedAt: '2024-08-05T09:23:55.552430Z',
    _updatedBy: 'https://sbo-nexus-delta.shapes-registry.org/v1/realms/SBO/users/dinika',
  },
};
