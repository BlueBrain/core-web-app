import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import userEvent from '@testing-library/user-event';
import DetailHeaderName from './DetailHeaderName';
import sessionAtom from '@/state/session';
import { DeltaResource } from '@/types/explore-section/resources';
import { DataType } from '@/constants/explore-section/list-views';
import { ExperimentTypeNames } from '@/constants/explore-section/data-types/experiment-data-types';
import { Bookmark } from '@/types/virtual-lab/bookmark';

describe('DetailHeaderName', () => {
  const virtualLabId = '456';
  const projectId = '123';

  it.only('allows a user to save a resource to a project library', async () => {
    weAreInRoute({ virtualLabId, projectId, experimentType: ExperimentTypeNames.MORPHOLOGY });
    bookmarksInclude([]);

    const user = renderComponent();

    const saveButton = await screen.findByText('Save to library');
    await user.click(saveButton);
    expect(addBookmark).toHaveBeenCalledWith(virtualLabId, projectId, {
      resourceId: mockDeltaResource['@id'],
      category: DataType.ExperimentalNeuronMorphology,
    } as Bookmark);
  });

  it('do not allow a user to save a resource to a project library if we are not in experiment within a project', async () => {
    weAreNotInProject();

    renderComponent();

    expect(screen.queryByText('Save to library')).toBeNull();
  });

  it('shows remove bookmark option if resource is already bookmarked', async () => {
    const resource = mockDeltaResource;

    weAreInRoute({ virtualLabId, projectId, experimentType: ExperimentTypeNames.MORPHOLOGY });
    bookmarksInclude([resource['@id']]);
    renderComponent(resource);

    await screen.findByText('Remove from library');
  });

  it('changes button label when user saves or removes resource from library', async () => {
    weAreInRoute({ virtualLabId, projectId, experimentType: ExperimentTypeNames.MORPHOLOGY });
    bookmarksInclude([]);

    const user = renderComponent(mockDeltaResource);

    const saveButton = await screen.findByText('Save to library');
    bookmarksInclude([mockDeltaResource['@id']]); // Simulate resource saved to db
    await user.click(saveButton);

    const removeButton = await screen.findByText('Remove from library');
    bookmarksInclude([]); // Simulate resource removed from db
    await user.click(removeButton);

    await screen.findByText('Save to library');
  });
});

const renderComponent = (resource = mockDeltaResource) => {
  const user = userEvent.setup();

  render(DetailHeaderNameProvider(resource as DeltaResource));
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

function DetailHeaderNameProvider(resource: DeltaResource) {
  return (
    <TestProvider initialValues={[[sessionAtom, { accessToken: 'abc' }]]}>
      <DetailHeaderName detail={resource} />
    </TestProvider>
  );
}

const mockDeltaResource = {
  name: 'Mock resource',
  _rev: 12,
  _self:
    'https://delta/v1/resources/bbp/mouselight/_/https:%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2Fneuronmorphologies%2FAA1190',
  '@id': 'https://bbp.epfl.ch/neurosciencegraph/data/neuronmorphologies/AA1190',
};

const useParams = jest.fn();
const usePathname = jest.fn();

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: () => usePathname(),
  useParams: () => useParams(),
  useSearchParams: jest.fn(),
}));

const addBookmark = jest.fn();
const getBookmarksByCategory = jest.fn();

jest.mock('src/services/virtual-lab/bookmark', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  addBookmark: (lab: string, project: string, resourceId: string) => {
    return addBookmark(lab, project, resourceId);
  },
  getBookmarksByCategory: (lab: string, project: string): string[] => {
    return getBookmarksByCategory(lab, project);
  },
  removeBookmark: jest.fn(),
}));

const weAreInRoute = ({
  virtualLabId,
  projectId,
  experimentType,
}: {
  virtualLabId: string;
  projectId: string;
  experimentType: ExperimentTypeNames;
}) => {
  useParams.mockReturnValue({ virtualLabId, projectId, experimentType });
  usePathname.mockReturnValue(
    `/virtual-lab/lab/${virtualLabId}/project/${projectId}/explore/interactive/experimental/morphology/somename`
  );
};

const bookmarksInclude = (resourceIds: string[]) => {
  getBookmarksByCategory.mockResolvedValue({
    [DataType.ExperimentalNeuronMorphology]: resourceIds.map((r) => ({
      resourceId: r,
      category: DataType.ExperimentalNeuronMorphology,
    })),
  });
};

const weAreNotInProject = () => {
  useParams.mockReturnValue({});
  usePathname.mockReturnValue('/explore/interactive/experimental/morphology/somename');
};
