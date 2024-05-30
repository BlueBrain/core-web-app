import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import userEvent from '@testing-library/user-event';
import { BookmarkItem } from '@/services/virtual-lab/bookmark';
import BookmarkList from '@/components/VirtualLab/Bookmarks/BookmarkList';
import sessionAtom from '@/state/session';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { mockBrainRegions } from '__tests__/__utils__/SelectedBrainRegions';
import { SelectedBrainRegion } from '@/state/brain-regions/types';
import { Filter } from '@/components/Filter/types';
import { DataType } from '@/constants/explore-section/list-views';
import esb from 'elastic-builder';
import { DataQuery } from '@/api/explore-section/resources';

const resourceProjectLabel = 'aLabel';

describe('Library', () => {
  const labId = '3';
  const projectId = '123';

  it('should render successfully', async () => {
    projectHasBookmarks(labId, projectId, [bookmarkItem('item1'), bookmarkItem('item2')]);
    elasticSearchReturns(['item1', 'item2']);
    renderComponent(labId, projectId);

    await screen.findByText('item1');
    screen.getByText('item2');

    const argsPassed = buildFilters.mock.calls[0];
    expect(argsPassed[3]).toEqual('ExperimentalNeuronMorphology');
    expect(argsPassed[4]).toEqual(['item1', 'item2']);
  });

  it('bookmark item links to detail page', async () => {
    projectHasBookmarks(labId, projectId, [bookmarkItem('item1'), bookmarkItem('item2')]);
    elasticSearchReturns(['item1', 'item2']);
    const user = renderComponent(labId, projectId);

    const nameCell = await screen.findByText('item1');
    await user.click(nameCell);
    const url = navigateTo.mock.calls[0][0];
    expect(url).toContain('morphology');
    expect(url).toContain(labId);
    expect(url).toContain(projectId);
  });

  it('does not show table with bookmarks if no resource is bookmarked', async () => {
    projectHasBookmarks(labId, projectId, []);
    elasticSearchReturns(['item1', 'item2']); // ES populates query atoms correctly

    renderComponent(labId, projectId);

    await screen.findByText('There are no pinned datasets for morphologies');
    expect(screen.queryByText('item1')).not.toBeInTheDocument();
  });
});

const renderComponent = (labId: string, projectId: string) => {
  const user = userEvent.setup();

  render(BookmarkListProvider(labId, projectId));
  return user;
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

function BookmarkListProvider(labId: string, projectId: string) {
  return (
    <TestProvider
      initialValues={[
        [sessionAtom, { accessToken: 'abc' }],
        [
          selectedBrainRegionAtom,
          {
            id: mockBrainRegions[1].id,
            title: mockBrainRegions[1].title,
            leaves: mockBrainRegions[1].leaves,
            representedInAnnotation: mockBrainRegions[1].representedInAnnotation,
          } as SelectedBrainRegion,
        ],
      ]}
    >
      <BookmarkList labId={labId} projectId={projectId} />
    </TestProvider>
  );
}

const bookmarkItem = (id: string, projectLabel: string = resourceProjectLabel): BookmarkItem => ({
  resourceId: id,
  projectLabel,
});

const projectHasBookmarks = (labId: string, projectId: string, items: BookmarkItem[]) => {
  getBookmarkedItems.mockImplementation((aLab, aProject) => {
    if (labId === aLab && projectId === aProject) {
      return Promise.resolve(items);
    }
    return Promise.resolve([]);
  });
};

const elasticSearchReturns = (hitIds: string[]) => {
  fetchEsResourcesByType.mockResolvedValue({
    hits: hitIds.map(mockHit),
    total: { relation: 'eq', value: hitIds.length },
    aggs: {
      contributors: {
        buckets: [{ doc_count: 9, key: 'Janelia Research Campus' }],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      createdAt: {
        avg: 1.6881596779622222e12,
        avg_as_string: '2023-06-30T21:14:37.962Z',
        count: 9,
      },
      mType: {
        buckets: [{ doc_count: hitIds.length, key: 'Interneuron' }],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
      subjectSpecies: {
        buckets: [{ doc_count: hitIds.length, key: 'Mus musculus' }],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
    },
  });
};

jest.mock('src/services/virtual-lab/bookmark', () => ({
  __esModule: true,
  getBookmarkedItems: (lab: string, project: string): string[] => {
    return getBookmarkedItems(lab, project);
  },
}));

jest.mock('src/queries/explore-section/filters', () => {
  const actual = jest.requireActual('src/queries/explore-section/filters');

  return {
    ...actual,
    __esModule: true,
    default: (
      filters: Filter[],
      searchString?: string,
      descendantIds?: string[],
      dataType?: DataType,
      resourceIds?: string[]
    ) => buildFilters(filters, searchString, descendantIds, dataType, resourceIds),
  };
});

jest.mock('src/api/explore-section/resources', () => {
  const actual = jest.requireActual('src/api/explore-section/resources');

  return {
    ...actual,
    __esModule: true,
    fetchEsResourcesByType: (accessToken: string, dataQuery: DataQuery) =>
      fetchEsResourcesByType(accessToken, dataQuery),
  };
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

const getBookmarkedItems = jest.fn();
const buildFilters = jest.fn();
const fetchEsResourcesByType = jest.fn();
const navigateTo = jest.fn();
const filtersQuery = new esb.BoolQuery();

const mockHit = (resourceId: string) => ({
  sort: [1692256614916],
  _id: resourceId,
  _index:
    'nexus_search_b5db4c20-8200-47f9-98d9-0ca8fa3be422_b5db4c20-8200-47f9-98d9-0ca8fa3be422_16',
  _source: {
    '@id': resourceId,
    '@type': [
      'https://neuroshapes.org/ReconstructedNeuronMorphology',
      'https://neuroshapes.org/NeuronMorphology',
    ],
    brainRegion: {
      '@id': 'http://api.brain-map.org/api/v2/data/Structure/648',
      idLabel: 'http://api.brain-map.org/api/v2/data/Structure/648|Primary motor area, layer 5',
      identifier: 'http://api.brain-map.org/api/v2/data/Structure/648',
      label: 'Primary motor area, layer 5',
    },
    contributors: [
      {
        '@id': 'https://www.grid.ac/institutes/grid.443970.d',
        '@type': ['http://schema.org/Organization', 'http://www.w3.org/ns/prov#Agent'],
        idLabel: 'https://www.grid.ac/institutes/grid.443970.d|Janelia Research Campus',
        label: 'Janelia Research Campus',
      },
    ],
    coordinatesInBrainAtlas: { valueX: '3586.003', valueY: '3229.3972', valueZ: '8268.21' },
    createdAt: '2023-08-17T07:16:54.916Z',
    createdBy: 'https://sbo-nexus-delta.shapes-registry.org/v1/realms/bbp/users/cgonzale',
    curated: true,
    deprecated: false,
    derivation: [
      {
        '@type': ['http://schema.org/Dataset', 'http://www.w3.org/ns/prov#Entity'],
        identifier:
          'https://bbp.epfl.ch/nexus/v1/resources/bbp/mouselight/_/a8b7f31c-78a5-4452-aa16-3de296fac582',
        label: 'Source file for AA1190',
      },
    ],
    description:
      'Annotation Space: CCFv3.0 Axes> X: Anterior-Posterior; Y: Inferior-Superior; Z:Left-Right',
    distribution: [
      {
        contentSize: 571421,
        contentUrl:
          'https://sbo-nexus-delta.shapes-registry.org/v1/files/bbp/mouselight/https:%2F%2Fbbp.epfl.ch%2Fnexus%2Fv1%2Fresources%2Fbbp%2Fmouselight%2F_%2Fb962a87f-6439-432d-af15-0a483bc25a67',
        encodingFormat: 'application/asc',
        label: 'AA1190.asc',
      },
    ],
    generation: {
      endedAt: '2023-08-17T09:16:50.000Z',
      startedAt: '2023-08-17T09:16:50.000Z',
    },
    license: {
      '@id': 'https://creativecommons.org/licenses/by-nc/4.0/',
      identifier: 'https://creativecommons.org/licenses/by-nc/4.0/',
    },
    name: resourceId,
    project: {
      '@id': 'https://sbo-nexus-delta.shapes-registry.org/v1/projects/bbp/mouselight',
      identifier: 'https://sbo-nexus-delta.shapes-registry.org/v1/projects/bbp/mouselight',
      label: 'bbp/mouselight',
    },
    subjectSpecies: {
      '@id': 'http://purl.obolibrary.org/obo/NCBITaxon_10090',
      identifier: 'http://purl.obolibrary.org/obo/NCBITaxon_10090',
      label: 'Mus musculus',
    },
    updatedAt: '2024-01-11T11:46:29.211Z',
    updatedBy: 'https://sbo-nexus-delta.shapes-registry.org/v1/realms/bbp/users/cgonzale',
    _self:
      'https://sbo-nexus-delta.shapes-registry.org/v1/resources/bbp/mouselight/_/https:%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2Fneuronmorphologies%2FAA1190',
  },
});

buildFilters.mockReturnValue(filtersQuery);
