import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { render, screen } from '@testing-library/react';
import { useParams } from 'next/navigation';

import VirtualLabSettingsPage from '@/app/virtual-lab/lab/[virtualLabId]/(lab)/page';
import sessionAtom from '@/state/session';
import * as MockVirtualLabModule from '@/services/virtual-lab/virtual-lab-service';

jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: 'admin' },
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: 'authenticated' }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

jest.mock('@/services/virtual-lab/virtual-lab-service');

jest.mock('next/navigation', () => ({
  __esModule: true,
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe('VirtualLabSettingsPage', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    virtualLabServiceMock().mockClear();
    getVirtualLabMock().mockClear();
  });

  it('displays name of the lab that the user navigated to', async () => {
    renderComponentWithRoute('lab1');
    await screen.findByText('Mock Lab lab1', { selector: 'h3[data-testid="virtual-lab-name"]' });

    renderComponentWithRoute('lab2');
    await screen.findByText('Mock Lab lab2', { selector: 'h3[data-testid="virtual-lab-name"]' });
  });

  it('displays error message when requested lab is not found', async () => {
    getVirtualLabMock().mockRejectedValueOnce(new Error('Some error'));

    renderComponentWithRoute('not-found-lab-id');
    await screen.findByText(`No lab with id not-found-lab-id found.`);
  });

  const renderComponentWithRoute = (name?: string) => {
    const routeSpy = useParams as unknown as jest.Mock;
    routeSpy.mockReturnValue({ virtualLabId: name });

    render(VirtualLabSettingsPageProvider());
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

  function VirtualLabSettingsPageProvider() {
    return (
      <TestProvider initialValues={[[sessionAtom, { accessToken: 'abc' }]]}>
        <VirtualLabSettingsPage />
      </TestProvider>
    );
  }

  const virtualLabServiceMock = () => (MockVirtualLabModule as any).default as jest.Mock;
  const getVirtualLabMock = () => (MockVirtualLabModule as any).getVirtualLabMock as jest.Mock;
});
