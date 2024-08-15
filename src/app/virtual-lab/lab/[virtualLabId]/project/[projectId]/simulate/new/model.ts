const defaultId =
  'https://openbluebrain.com/data/bb848ba6-9436-4871-be45-84ec201909f8/6fef27da-359a-43b2-a524-a6dad7b9ff44/81f8ebe5-d825-4103-833c-433da750cfd5';

export const getSynaptomeModel = (id = defaultId) => {
  const [org, project] = id.split('/data/')[1].split('/');

  const projectLabel = `https://openbluebrain.com/v1/projects/${org}/${project}`;
  const contentUrl = `https://openbluebrain.com/v1/files/${org}/${project}/${encodeURIComponent(id)}`;

  return {
    _id: id,
    _source: {
      project: {
        label: projectLabel,
      },
      '@context': [
        'https://bluebrain.github.io/nexus/contexts/metadata.json',
        'https://bbp.neuroshapes.org',
      ],
      '@id': id,
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
          value: 660,
        },
        contentUrl,
        digest: {
          algorithm: 'SHA-256',
          value: '11fd8b203005319d1bab34f0245f6861e1fce0b9ab97407af4663a5e0c09dcc0',
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
      name: 'Rebased on develop',
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
      threshold_current: 0.11091246623884962,
      validated: true,
      _constrainedBy: 'https://bluebrain.github.io/nexus/schemas/unconstrained.json',
      _createdAt: '2024-08-12T14:13:44.615153Z',
      _createdBy: 'https://sbo-nexus-delta.shapes-registry.org/v1/realms/SBO/users/dinika',
      _deprecated: false,
      _incoming:
        'https://sbo-nexus-delta.shapes-registry.org/v1/resources/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6/_/https:%2F%2Fopenbrainplatform.org%2Fdata%2F5f617dc9-3097-4c84-92ee-459cb684b5d5%2F77914d4a-01a9-43b1-a270-2b0a31fadac6%2Fbd3863fa-3591-4fb9-88d0-3fda95642c0a/incoming',
      _outgoing:
        'https://sbo-nexus-delta.shapes-registry.org/v1/resources/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6/_/https:%2F%2Fopenbrainplatform.org%2Fdata%2F5f617dc9-3097-4c84-92ee-459cb684b5d5%2F77914d4a-01a9-43b1-a270-2b0a31fadac6%2Fbd3863fa-3591-4fb9-88d0-3fda95642c0a/outgoing',
      _project: projectLabel,
      _rev: 1,
      _schemaProject: projectLabel,
      _self:
        'https://sbo-nexus-delta.shapes-registry.org/v1/resources/5f617dc9-3097-4c84-92ee-459cb684b5d5/77914d4a-01a9-43b1-a270-2b0a31fadac6/_/https:%2F%2Fopenbrainplatform.org%2Fdata%2F5f617dc9-3097-4c84-92ee-459cb684b5d5%2F77914d4a-01a9-43b1-a270-2b0a31fadac6%2Fbd3863fa-3591-4fb9-88d0-3fda95642c0a',
      _updatedAt: '2024-08-12T14:13:44.615153Z',
      _updatedBy: 'https://sbo-nexus-delta.shapes-registry.org/v1/realms/SBO/users/dinika',
    },
  };
};

export const synaptomeModel = {
  _id: 'https://openbrainplatform.org/data/cad43d74-f697-48d6-9242-28cb6b4a4956/f9b265b2-22c3-4a92-9ad5-79dff37e39ca/6afb3968-9c5d-468d-b131-9025d0875adf',
  _source: {
    project: {
      label:
        'https://sbo-nexus-delta.shapes-registry.org/v1/projects/cad43d74-f697-48d6-9242-28cb6b4a4956/f9b265b2-22c3-4a92-9ad5-79dff37e39ca',
    },
    '@context': [
      'https://bluebrain.github.io/nexus/contexts/metadata.json',
      'https://bbp.neuroshapes.org',
    ],
    '@id':
      'https://openbrainplatform.org/data/cad43d74-f697-48d6-9242-28cb6b4a4956/f9b265b2-22c3-4a92-9ad5-79dff37e39ca/6afb3968-9c5d-468d-b131-9025d0875adf',
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
        value: 847,
      },
      contentUrl:
        'https://sbo-nexus-delta.shapes-registry.org/v1/files/cad43d74-f697-48d6-9242-28cb6b4a4956/f9b265b2-22c3-4a92-9ad5-79dff37e39ca/https:%2F%2Fopenbrainplatform.org%2Fdata%2Fcad43d74-f697-48d6-9242-28cb6b4a4956%2Ff9b265b2-22c3-4a92-9ad5-79dff37e39ca%2F37f4bc32-dad2-487e-b1c0-5c7531cd6ae0',
      digest: {
        algorithm: 'SHA-256',
        value: '6eb742476b0d7c6d630c74b30109425722e2d04eaae111759ad5252c53d87809',
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
    name: 'syanptome-model-189',
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
    threshold_current: 0.11091246623884962,
    validated: true,
    _constrainedBy: 'https://bluebrain.github.io/nexus/schemas/unconstrained.json',
    _createdAt: '2024-08-12T11:59:28.406469Z',
    _createdBy: 'https://sbo-nexus-delta.shapes-registry.org/v1/realms/SBO/users/bilalesi',
    _deprecated: false,
    _incoming:
      'https://sbo-nexus-delta.shapes-registry.org/v1/resources/cad43d74-f697-48d6-9242-28cb6b4a4956/f9b265b2-22c3-4a92-9ad5-79dff37e39ca/_/https:%2F%2Fopenbrainplatform.org%2Fdata%2Fcad43d74-f697-48d6-9242-28cb6b4a4956%2Ff9b265b2-22c3-4a92-9ad5-79dff37e39ca%2F6afb3968-9c5d-468d-b131-9025d0875adf/incoming',
    _outgoing:
      'https://sbo-nexus-delta.shapes-registry.org/v1/resources/cad43d74-f697-48d6-9242-28cb6b4a4956/f9b265b2-22c3-4a92-9ad5-79dff37e39ca/_/https:%2F%2Fopenbrainplatform.org%2Fdata%2Fcad43d74-f697-48d6-9242-28cb6b4a4956%2Ff9b265b2-22c3-4a92-9ad5-79dff37e39ca%2F6afb3968-9c5d-468d-b131-9025d0875adf/outgoing',
    _project:
      'https://sbo-nexus-delta.shapes-registry.org/v1/projects/cad43d74-f697-48d6-9242-28cb6b4a4956/f9b265b2-22c3-4a92-9ad5-79dff37e39ca',
    _rev: 1,
    _schemaProject:
      'https://sbo-nexus-delta.shapes-registry.org/v1/projects/cad43d74-f697-48d6-9242-28cb6b4a4956/f9b265b2-22c3-4a92-9ad5-79dff37e39ca',
    _self:
      'https://sbo-nexus-delta.shapes-registry.org/v1/resources/cad43d74-f697-48d6-9242-28cb6b4a4956/f9b265b2-22c3-4a92-9ad5-79dff37e39ca/_/https:%2F%2Fopenbrainplatform.org%2Fdata%2Fcad43d74-f697-48d6-9242-28cb6b4a4956%2Ff9b265b2-22c3-4a92-9ad5-79dff37e39ca%2F6afb3968-9c5d-468d-b131-9025d0875adf',
    _updatedAt: '2024-08-12T11:59:28.406469Z',
    _updatedBy: 'https://sbo-nexus-delta.shapes-registry.org/v1/realms/SBO/users/bilalesi',
  },
};
