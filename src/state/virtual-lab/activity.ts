import { atom } from 'jotai';
import { MEModelResource } from '@/types/me-model';
import sessionAtom from '@/state/session';
import { getNotValidatedMEModelQuery } from '@/queries/es';
import { queryES } from '@/api/nexus';

const mockMEModelResources: MEModelResource[] = [
  {
    '@id': '1',
    '@type': 'MEModel',
    '@context': 'Context 1',
    name: 'Model 1',
    description: 'Description 1',
    hasPart: [
      {
        '@type': 'EModel',
        '@id': 'EModel1',
      },
      {
        '@type': 'NeuronMorphology',
        '@id': 'NeuronMorphology1',
      },
    ],
    validated: false,
    status: 'initialized',
    _createdAt: '2022-01-01T00:00:00Z',
    _createdBy: 'John Smith',
    _deprecated: false,
    _incoming: 'Incoming 1',
    _outgoing: 'Outgoing 1',
    _rev: 1,
    _self: 'Self 1',
    _updatedBy: 'John Smith',
    _updatedAt: '2022-01-01T00:00:00Z',
    _project: 'Project 1',
  },
  {
    '@id': '2',
    '@type': 'MEModel',
    '@context': 'Context 2',
    name: 'Model 2',
    description: 'Description 2',
    hasPart: [
      {
        '@type': 'EModel',
        '@id': 'EModel2',
      },
      {
        '@type': 'NeuronMorphology',
        '@id': 'NeuronMorphology2',
      },
    ],
    validated: false,
    status: 'processing',
    _createdAt: '2022-02-02T00:00:00Z',
    _createdBy: 'Jane Doe',
    _deprecated: false,
    _incoming: 'Incoming 2',
    _outgoing: 'Outgoing 2',
    _rev: 1,
    _self: 'Self 2',
    _updatedBy: 'Jane Doe',
    _updatedAt: '2022-02-02T00:00:00Z',
    _project: 'Project 2',
  },
  {
    '@id': '3',
    '@type': 'MEModel',
    '@context': 'Context 3',
    name: 'Model 3',
    description: 'Description 3',
    hasPart: [
      {
        '@type': 'EModel',
        '@id': 'EModel3',
      },
      {
        '@type': 'NeuronMorphology',
        '@id': 'NeuronMorphology3',
      },
    ],
    validated: false,
    status: 'done',
    _createdAt: '2022-03-03T00:00:00Z',
    _createdBy: 'Alice Johnson',
    _deprecated: false,
    _incoming: 'Incoming 3',
    _outgoing: 'Outgoing 3',
    _rev: 1,
    _self: 'Self 3',
    _updatedBy: 'Alice Johnson',
    _updatedAt: '2022-03-03T00:00:00Z',
    _project: 'Project 3',
  },
  {
    '@id': '4',
    '@type': 'MEModel',
    '@context': 'Context 4',
    name: 'Model 4',
    description: 'Description 4',
    hasPart: [
      {
        '@type': 'EModel',
        '@id': 'EModel4',
      },
      {
        '@type': 'NeuronMorphology',
        '@id': 'NeuronMorphology4',
      },
    ],
    validated: false,
    status: 'error',
    _createdAt: '2022-04-04T00:00:00Z',
    _createdBy: 'Bob Williams',
    _deprecated: false,
    _incoming: 'Incoming 4',
    _outgoing: 'Outgoing 4',
    _rev: 1,
    _self: 'Self 4',
    _updatedBy: 'Bob Williams',
    _updatedAt: '2022-04-04T00:00:00Z',
    _project: 'Project 4',
  },
  {
    '@id': '5',
    '@type': 'MEModel',
    '@context': 'Context 5',
    name: 'Model 5',
    description: 'Description 5',
    hasPart: [
      {
        '@type': 'EModel',
        '@id': 'EModel5',
      },
      {
        '@type': 'NeuronMorphology',
        '@id': 'NeuronMorphology5',
      },
    ],
    validated: false,
    status: 'running',
    _createdAt: '2022-05-05T00:00:00Z',
    _createdBy: 'Charlie Brown',
    _deprecated: false,
    _incoming: 'Incoming 5',
    _outgoing: 'Outgoing 5',
    _rev: 1,
    _self: 'Self 5',
    _updatedBy: 'Charlie Brown',
    _updatedAt: '2022-05-05T00:00:00Z',
    _project: 'Project 5',
  },
];

export const notValidatedMEModelsAtom = atom<Promise<MEModelResource[] | undefined>>(
  async (get) => {
    const session = get(sessionAtom);

    if (!session) return;

    if (mockMEModelResources) return Promise.resolve(mockMEModelResources);

    const query = getNotValidatedMEModelQuery(session.user.username);

    return queryES<MEModelResource>(query, session);
  }
);
