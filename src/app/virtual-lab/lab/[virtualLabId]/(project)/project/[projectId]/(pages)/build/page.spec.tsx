import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VirtualLabProjectBuildPage from './page';
import sessionAtom from '@/state/session';
import { DataType } from '@/constants/explore-section/list-views';
import { items as carouselItems } from '@/components/VirtualLab/ScopeCarousel';
import { SimulationType } from '@/types/virtual-lab/lab';
import * as dataQuery from '@/queries/explore-section/data';
import { ExploreESHit } from '@/types/explore-section/es';

const buildMEModelLink = 'build/me-model/new/morphology/reconstructed';

const spy = jest.spyOn(dataQuery, 'default');

const meModelName = 'ME-MODEL-ID-1';
const synaptomeName = 'SYNAPTOME-MODEL-ID-1';

describe('VirtualLabProjectBuildPage', () => {
  beforeEach(() => {
    fetchEsResourcesByType.mockClear();
  });

  test('shows me-models by default', async () => {
    renderComponent();
    await waitFor(() => expect(fetchEsResourcesByType).toHaveBeenCalledTimes(1));
    await screen.findByText(meModelName);
  });

  test('shows synaptome models when user clicks synaptome from carousel', async () => {
    const { user } = renderComponent();
    await waitFor(() => expect(fetchEsResourcesByType).toHaveBeenCalledTimes(1));

    const synaptomCarouselItem = carouselItems.find((i) => i.key === SimulationType.Synaptome)!;

    await user.click(screen.getByText(synaptomCarouselItem.description));
    await screen.findByText(synaptomeName);
  });

  test('takes user to memodel build page when user clicks on ME-Model -> New model', async () => {
    const { user } = renderComponent();
    await waitFor(() => expect(fetchEsResourcesByType).toHaveBeenCalledTimes(1));
    await user.click(screen.getByText('New model +'));
    const url = navigateTo.mock.calls[0][0];
    expect(url).toContain(buildMEModelLink);
  });

  test('shows ME Models when user clicks Synaptome -> New model', async () => {
    const { user } = renderComponent();
    await waitFor(() => expect(fetchEsResourcesByType).toHaveBeenCalledTimes(1));

    const synaptomCarouselItem = carouselItems.find((i) => i.key === SimulationType.Synaptome)!;

    await user.click(screen.getByText(synaptomCarouselItem.description));
    expect(activeCarouselTabTitle()).toEqual(synaptomCarouselItem.title);
    await screen.findByText(synaptomeName);

    await user.click(buildSynaptomeButton());

    expect(activeCarouselTabTitle()).toEqual(synaptomCarouselItem.title);
    await screen.findByText(meModelName);
  });

  const activeCarouselTabTitle = () => {
    return screen.getByTestId('active-carousel-item').querySelector('h2')?.textContent;
  };

  const buildSynaptomeButton = () => screen.getByText('New synaptome model +');

  const renderComponent = () => {
    const user = userEvent.setup();

    render(VirtualLabProjectBuildPageProvider());

    return { user };
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

  function VirtualLabProjectBuildPageProvider() {
    return (
      <TestProvider initialValues={[[sessionAtom, { accessToken: 'abc' }]]}>
        <VirtualLabProjectBuildPage params={{ virtualLabId: '123', projectId: '456' }} />
      </TestProvider>
    );
  }
});

jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    __esModule: true,
    useRouter: () => ({
      push: (path: string) => navigateTo(path),
    }),
  };
});
const navigateTo = jest.fn();

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    // eslint-disable-next-line @next/next/no-img-element, react/jsx-props-no-spreading
    return <img alt="mock" />;
  },
}));

jest.mock('src/queries/explore-section/data.ts', () => {
  const actual = jest.requireActual('src/queries/explore-section/data.ts');
  return {
    ...actual,
    __esModule: true,
  };
});

jest.mock('src/api/explore-section/resources', () => {
  const actual = jest.requireActual('src/api/explore-section/resources');

  return {
    ...actual,
    __esModule: true,
    fetchEsResourcesByType: () => fetchEsResourcesByType(),
  };
});

const fetchEsResourcesByType = jest.fn().mockImplementation(() => {
  const type = spy.mock.lastCall?.[3];
  if (type === DataType.SingleNeuronSynaptome) {
    return esResponse([mockSynaptomeModel(synaptomeName)]);
  }
  if (type === DataType.CircuitMEModel) {
    return esResponse([mockMEModel(meModelName)]);
  }
  return esResponse([]);
});

const esResponse = (hits: ExploreESHit<any>[]) => {
  return {
    hits: [...hits],
    total: { relation: 'eq', value: hits.length },
    aggs: {
      contributors: {
        buckets: [{ doc_count: 9, key: 'Janelia Research Campus' }],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
    },
  };
};

const mockMEModel = (id: string) => ({
  sort: [1],
  _id: id,
  _index: id,
  _source: {
    name: id,
    '@id': id,
    description: id,
    _self: `https://secretagency.cc/${id}`,
    '@type': 'https://neuroshapes.org/MEModel',
    brainRegion: {
      '@id': '322',
      idLabel: 'Primary somatosensory area',
      identifier: '322',
      label: 'Primary somatosensory area',
    },
    eType: {
      '@id': '_:b1',
      identifier: '_:b1',
      label: 'cNAC',
    },
    mType: {
      '@id': '_:b2',
      identifier: '_:b2',
      label: 'L5_TPC:B',
    },
    memodel: {
      emodelResource: {
        '@id': 'meModelId',
        name: 'EModel1',
      },
      neuronMorphology: {
        '@id': 'morphId',
        name: 'Neuro Morph 1',
      },
      validated: true,
    },
  },
});

const mockSynaptomeModel = (id: string) => ({
  sort: [1],
  _id: id,
  _index: id,
  _source: {
    '@id': id,
    description: id,
    name: id,
    _self: `https://secretagency.cc/${id}`,
    '@type': 'https://neuroshapes.org/SingleNeuronSynaptome',
    brainRegion: {
      '@id': '322',
      idLabel: 'Primary somatosensory area',
      identifier: '322',
      label: 'Primary somatosensory area',
    },
    createdAt: '2024-05-29T13:36:36.908Z',
    deprecated: false,
  },
});
