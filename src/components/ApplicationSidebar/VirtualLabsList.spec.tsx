import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { act, fireEvent, render, screen, within } from '@testing-library/react';

import VirtualLabsList from './VirtualLabsList';
import sessionAtom from '@/state/session';
import { createMockVirtualLab } from '__tests__/__utils__/VirtualLab';
import * as MockVirtualLabModule from '@/services/virtual-lab';
import { currentVirtualLabIdAtom } from '@/state/virtual-lab/lab';

jest.mock('@/services/virtual-lab/virtual-lab-service');

jest.mock('next/navigation', () => ({
  __esModule: true,
  useParams: jest.fn(),
  useRouter: jest.fn(),
  push: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('VirtualLabsList', () => {
  beforeEach(() => {
    virtualLabServiceMock().mockClear();
    mockListAll().mockClear();
  });

  test('Shows nothing if user has no virtual labs', async () => {
    mockListAll().mockResolvedValueOnce([]);
    render(VirtualLabsListProvider());

    expect(screen.queryByTestId('all-user-labs')).not.toBeInTheDocument();
  });

  test('Shows first lab as current lab if no current lab already exists', async () => {
    render(VirtualLabsListProvider());

    const currentLabElement = await screen.findByTestId('current-virtual-lab');
    within(currentLabElement).getByText('Mock Lab 123');
    within(currentLabElement).getByText('Virtual Lab settings');
  });

  test('Shows all labs when list is expanded', async () => {
    render(VirtualLabsListProvider());

    const currentLabElement = await screen.findByTestId('current-virtual-lab');
    click(currentLabElement);

    const allVirtualLabButtons = within(document.querySelector('ul')!).getAllByRole('button');
    expect(allVirtualLabButtons).toHaveLength(3);
  });

  test('Changes current virtual lab when new lab is clicked', async () => {
    render(VirtualLabsListProvider());

    const currentLabElement = await screen.findByTestId('current-virtual-lab');
    within(currentLabElement).getByText('Mock Lab 123');
    click(currentLabElement);

    const anotherLabButton = within(document.querySelector('ul')!).getByText('Mock Lab 798', {
      selector: 'button span',
    });
    click(anotherLabButton);
    expect(currentLabElement.textContent).toContain('Mock Lab 798');
    expect(currentLabElement.textContent).not.toContain('Mock Lab 123');
  });

  test('Does not show expand list button if only one virtual lab exists', async () => {
    mockListAll().mockResolvedValueOnce([createMockVirtualLab('Only Lab')]);
    render(VirtualLabsListProvider());

    const currentLabElement = await screen.findByTestId('current-virtual-lab');
    within(currentLabElement).getByText('Mock Lab Only Lab');
    expect(within(currentLabElement).queryByTestId('expand-list-icon')).not.toBeInTheDocument();
    click(currentLabElement);

    expect(document.querySelector('ul')).not.toBeInTheDocument();
  });

  test('Does not overwrite virtual lab if one is already selected', async () => {
    render(VirtualLabsListProvider('456'));

    const currentLabElement = await screen.findByTestId('current-virtual-lab');
    within(currentLabElement).getByText('Mock Lab 456');
    expect(currentLabElement.textContent).not.toContain('Mock Lab 123');
  });

  test('Uses first atom in list if current atom id does not exist anymore', async () => {
    render(VirtualLabsListProvider('id-deleted'));

    const currentLabElement = await screen.findByTestId('current-virtual-lab');
    within(currentLabElement).getByText('Mock Lab 123');
  });

  const click = (element: HTMLElement) => {
    act(() => {
      fireEvent.click(element);
      fireEvent.focus(element);
      fireEvent.mouseDown(element);
    });
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

  function VirtualLabsListProvider(currentVirtualLab?: string) {
    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [currentVirtualLabIdAtom, currentVirtualLab ?? null],
        ]}
      >
        <VirtualLabsList />
      </TestProvider>
    );
  }

  const virtualLabServiceMock = () => (MockVirtualLabModule as any).default as jest.Mock;
  const mockListAll = () => (MockVirtualLabModule as any).mockListAll as jest.Mock;
});
