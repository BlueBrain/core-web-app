import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { render, screen } from '@testing-library/react';

import VirtualLabSettingsComponent from '.';
import sessionAtom from '@/state/session';
import * as MockVirtualLabModule from '@/services/virtual-lab/virtual-lab-service';
import { VirtualLab } from '@/services/virtual-lab/types';
import { createMockVirtualLab } from '__tests__/__utils__/VirtualLab';

jest.mock('@/services/virtual-lab/virtual-lab-service');

jest.mock('next/navigation', () => ({
  __esModule: true,
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe('VirtualLabSettingsComponent', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    virtualLabServiceMock().mockClear();
    getComputeTimeMock().mockClear();
  });

  it('shows error when loading compute time fails', async () => {
    getComputeTimeMock().mockRejectedValueOnce(new Error('Error fetching compute time'));
    renderComponentWithLab('test-lab');

    await screen.findByText('There was an error while retrieving compute time.');
  });

  it('shows collapsible panels for virtual lab information, members and plan', () => {
    renderComponentWithLab('test-lab');

    screen.getByText('Information');
    screen.getByText('Members');
    screen.getByText('Plan');
  });

  const renderComponentWithLab = (name: string) => {
    const virtualLab = createMockVirtualLab(name);
    render(VirtualLabSettingsPageProvider(virtualLab));
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

  function VirtualLabSettingsPageProvider(virtualLab: VirtualLab) {
    return (
      <TestProvider initialValues={[[sessionAtom, { accessToken: 'abc' }]]}>
        <VirtualLabSettingsComponent virtualLab={virtualLab} />
      </TestProvider>
    );
  }

  const virtualLabServiceMock = () => (MockVirtualLabModule as any).default as jest.Mock;
  const getComputeTimeMock = () => (MockVirtualLabModule as any).getComputeTimeMock as jest.Mock;
});
