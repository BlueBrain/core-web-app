import { render, screen, within } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import { METypeDetails } from '../SelectedBrainRegionMETypes/METypeDetails';
import sessionAtom from '@/state/session';
import { idAtom } from '@/state/brain-model-config';
import { AnalysedComposition } from '@/types/composition/calculation';
import { sectionAtom } from '@/state/application';
import { click } from '__tests__/__utils__/utils';
import { formatNumber } from '@/util/common';

jest.mock('next/navigation', () => ({
  __esModule: true,
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe('SelectedBrainRegionMETypes', () => {
  beforeEach(() => {
    renderComponent();
  });

  test('Shows m-types for selected brain region', async () => {
    await screen.findByText('M-TYPES', { selector: 'h6' });
    const parentNodes = screen.getAllByTitle(new RegExp('(MType)'));

    expect(parentNodes).toHaveLength(2);
    expect(parentNodes[0].textContent).toEqual('Parent Node 1');
    expect(parentNodes[1].textContent).toEqual('Parent Node 2');
  });

  test('Shows nested e-types when parent is expanded', async () => {
    await screen.findByText('M-TYPES', { selector: 'h6' });

    const parent = expandParent('id_of_parent_2', 'Parent Node 2');
    within(parent).getByText('E-TYPES');
    expect(within(parent).getAllByText(new RegExp('Child'))).toHaveLength(2);
  });

  test('Shows count for parents by default', async () => {
    const parent1 = getParent('id_of_parent_1');
    within(parent1.element).getByText(formattedNumber(parent1.data.neuronComposition.count));

    const parent2 = getParent('id_of_parent_2');
    within(parent2.element).getByText(formattedNumber(parent2.data.neuronComposition.count));
  });

  test('Shows count for children by default', async () => {
    expandParent('id_of_parent_2', 'Parent Node 2');

    testChildDensityOrCount('id_of_parent_2', 'count');
  });

  test('Shows density when toggle is clicked once', async () => {
    const densityOrCountToggle = screen.getByTitle('density or count');
    click(densityOrCountToggle);

    const parent1 = getParent('id_of_parent_1');
    within(parent1.element).getByText(formattedNumber(parent1.data.neuronComposition.density));

    const parent2 = getParent('id_of_parent_2');
    within(parent2.element).getByText(formattedNumber(parent2.data.neuronComposition.density));

    expandParent(parent1.data.id, parent1.data.label);
    testChildDensityOrCount('id_of_parent_1', 'density');
  });

  test('Shows total neuron count by default', () => {
    const totalElement = screen.getByTestId('total-count-or-density').textContent;
    expect(totalElement).toContain('[N]');
    expect(totalElement).toContain(formattedNumber(mockComposition.totalComposition.neuron.count));
  });

  test('Shows total neuron density when toggle is clicked once', () => {
    const densityOrCountToggle = screen.getByTitle('density or count');
    click(densityOrCountToggle);

    const totalElement = screen.getByTestId('total-count-or-density').textContent;
    expect(totalElement).toContain('[/mm3]');
    expect(totalElement).toContain(
      formattedNumber(mockComposition.totalComposition.neuron.density)
    );
  });

  const testChildDensityOrCount = (
    parentId: string,
    densityOrCount: 'density' | 'count' = 'count'
  ) => {
    const parentElement = getParent(parentId).element;
    const children = mockNodes.filter((nodes) => nodes.parentId === parentId);

    children.forEach((child) => {
      const childElement = within(parentElement)
        .getByText(child.label)
        .closest(`[data-tree-id="${child.id}"]`) as HTMLElement;
      within(childElement).getByText(formattedNumber(child.neuronComposition[densityOrCount]));
    });
  };

  const getParent = (id: string) => {
    const parentData = mockNodes.find((node) => node.id === id)!;
    expect(parentData).not.toBeUndefined();

    const parentElement = screen
      .getByText(parentData.label)
      .closest(`[data-tree-id="${id}"]`) as HTMLElement;
    return { element: parentElement, data: parentData };
  };

  const expandParent = (id: string, label: string) => {
    const parentElement = screen.getByText(label).closest(`[data-tree-id="${id}"]`);
    expect(parentElement).toBeVisible();
    const expandButton = within((parentElement as HTMLElement)!).getByRole('button');
    click(expandButton);
    return (parentElement as HTMLElement)!;
  };

  const formattedNumber = (n: number) => {
    return formatNumber(n);
  };

  const renderComponent = () => {
    render(SelectedBrainRegionMETypesProvider());
  };

  const HydrateAtoms = ({ initialValues, children }: any) => {
    useHydrateAtoms(initialValues);
    return children;
  };

  function TestProvider({ initialValues, children }: any) {
    return (
      <Provider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
      </Provider>
    );
  }

  function SelectedBrainRegionMETypesProvider() {
    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [sectionAtom, 'explore'],
          [idAtom, 'mock-config'],
        ]}
      >
        <METypeDetails composition={mockComposition} meTypesMetadata={mockMetadata as any} />
      </TestProvider>
    );
  }
});

export const mockNodes = [
  {
    about: 'EType',
    id: 'child_1_of_parent_1',
    label: 'GEN_etype',
    parentId: 'id_of_parent_1',
    neuronComposition: {
      density: 82570.2739040429,
      count: 3521371,
    },
    leaves: [],
    relatedNodes: [],
    extendedNodeId: 'id_of_parent_1__extended',
  },
  {
    about: 'MType',
    id: 'id_of_parent_1',
    label: 'Parent Node 1',
    parentId: null,
    neuronComposition: {
      density: 82570.2739040429,
      count: 3521371,
    },
    leaves: [
      'http://api.brain-map.org/api/v2/data/Structure/727',
      'http://api.brain-map.org/api/v2/data/Structure/20',
    ],
    relatedNodes: [],
    extendedNodeId: 'id_of_parent_1',
  },
  {
    about: 'EType',
    id: 'child_1_of_parent_2',
    label: 'Child 1 of Parent 2',
    parentId: 'id_of_parent_2',
    neuronComposition: {
      density: 0.09696143321901855,
      count: 4,
    },
    leaves: [],
    relatedNodes: [],
    extendedNodeId: 'id_of_parent_2__http://uri.interlex.org/base/ilx_0738203',
  },
  {
    about: 'EType',
    id: 'child_2_of_parent_2',
    label: 'Child 2 of Parent 2',
    parentId: 'id_of_parent_2',
    neuronComposition: {
      density: 0.08580341999959308,
      count: 4,
    },
    leaves: [],
    relatedNodes: [],
    extendedNodeId: 'id_of_parent_2__extended',
  },
  {
    about: 'MType',
    id: 'id_of_parent_2',
    label: 'Parent Node 2',
    parentId: null,
    neuronComposition: {
      density: 0.18276485321861163,
      count: 8,
    },
    leaves: [
      'http://api.brain-map.org/api/v2/data/Structure/589508447',
      'http://api.brain-map.org/api/v2/data/Structure/484682508',
    ],
    relatedNodes: [],
    extendedNodeId: 'id_of_parent_2',
  },
];

const mockComposition: AnalysedComposition = {
  nodes: mockNodes,
  totalComposition: {
    neuron: {
      density: 103410.90433886173,
      count: 4410159.989953295,
    },
    glia: {
      density: 0,
      count: 0,
    },
  },
  links: [],
  composition: {
    hasPart: {},
    version: 1,
    unitCode: {
      density: 'mm^-3',
    },
  },
};

export const mockMetadata = {
  'https://bbp.epfl.ch/ontologies/core/bmo/GenericExcitatoryNeuronEType': {
    prefLabel: 'Generic Excitatory Neuron EType',
    subClassOf: [
      'https://neuroshapes.org/EType',
      'https://bbp.epfl.ch/ontologies/core/bmo/BrainCellType',
    ],
  },
  id_of_parent_1: {
    prefLabel: 'Generic Excitatory Neuron MType',
    subClassOf: [
      'https://neuroshapes.org/MType',
      'https://bbp.epfl.ch/ontologies/core/bmo/BrainCellType',
    ],
  },
  'http://uri.interlex.org/base/ilx_0738203': {
    prefLabel: 'Burst non-accommodating electrical type',
    subClassOf: ['https://neuroshapes.org/EType'],
  },
  'http://uri.interlex.org/base/ilx_0738201': {
    prefLabel: 'Continuous non-accommodating electrical type',
    subClassOf: ['https://neuroshapes.org/EType'],
  },
  id_of_parent_2: {
    prefLabel: 'Layer 1 Descending Axon Cell',
    subClassOf: ['https://neuroshapes.org/MType'],
  },
};
