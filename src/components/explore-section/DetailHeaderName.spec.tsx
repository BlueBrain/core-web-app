import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import userEvent from '@testing-library/user-event';
import DetailHeaderName from './DetailHeaderName';
import sessionAtom from '@/state/session';
import { DeltaResource } from '@/types/explore-section/resources';

describe('DetailHeaderName', () => {
  const virtualLabId = '456';
  const projectId = '123';

  it('allows a user to save a resource to a project library', async () => {
    weAreInProject(virtualLabId, projectId);
    const user = renderComponent();

    const saveButton = screen.getByText('Save to library');
    await user.click(saveButton);
    expect(addBookmark).toHaveBeenCalledWith(mockDeltaResource['@id'], virtualLabId, projectId);
  });

  it('do not allow a user to save a resource to a project library if we are not in a project', async () => {
    weAreNotInProject();

    renderComponent();

    expect(screen.queryByText('Save to library')).toBeNull();
  });
});

const renderComponent = () => {
  const user = userEvent.setup();

  render(DetailHeaderNameProvider());
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

function DetailHeaderNameProvider() {
  return (
    <TestProvider initialValues={[[sessionAtom, { accessToken: 'abc' }]]}>
      <DetailHeaderName detail={mockDeltaResource as DeltaResource} />
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
jest.mock('src/services/virtual-lab/bookmark', () => ({
  __esModule: true,
  addBookmark: (resourceId: string, lab: string, project: string) => {
    return addBookmark(resourceId, lab, project);
  },
}));

const weAreInProject = (virtualLabId: string, projectId: string) => {
  useParams.mockReturnValue({ virtualLabId, projectId });
  usePathname.mockReturnValue(
    `/virtual-lab/lab/${virtualLabId}/project/${projectId}/explore/interactive/experimental/morphology/somename`
  );
};

const weAreNotInProject = () => {
  useParams.mockReturnValue({});
  usePathname.mockReturnValue('/explore/interactive/experimental/morphology/somename');
};
