import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { act, fireEvent, render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import DangerZonePanel from './DangerZonePanel';
import sessionAtom from '@/state/session';
import { createMockVirtualLab } from '__tests__/__utils__/VirtualLab';
import { changeInputValue, getButton } from '__tests__/__utils__/utils';
import { VirtualLab } from '@/types/virtual-lab/lab';

jest.mock('@/services/virtual-lab/virtual-lab-service');

jest.mock('next/navigation', () => ({
  __esModule: true,
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

const successNotification = jest.fn();

jest.mock('src/hooks/notifications.tsx', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    success: successNotification,
    error: jest.fn(),
  })),
}));

describe('VirtualLabSettingsComponent', () => {
  const onDeleteVirtualLabClick = jest.fn().mockResolvedValue('true');

  beforeEach(() => {
    onDeleteVirtualLabClick.mockClear();
  });

  test('lab is only deleted if user types correct info in the input', async () => {
    const { virtualLab, user } = renderComponentWithLab('test-lab');

    click(getButton('Delete Virtual Lab'));

    screen.getByText('Are you sure you want to delete the virtual lab?');
    changeInputValue('confirm lab delete', `Delete ${virtualLab.name}`);
    await user.click(getButton('Confirm'));

    expect(onDeleteVirtualLabClick).toHaveBeenCalledTimes(1);
  });

  test('lab is not deleted if user did not type correct info in cofirmation input', async () => {
    const { virtualLab, user } = renderComponentWithLab('test-lab');

    click(getButton('Delete Virtual Lab'));

    changeInputValue('confirm lab delete', `${virtualLab.name}`);
    await user.click(getButton('Confirm'));
    screen.getByText('The word "Delete" is missing in your input');

    changeInputValue('confirm lab delete', 'Delete');
    await user.click(getButton('Confirm'));
    screen.getByText('The name of the virtual lab is incorrect');

    expect(onDeleteVirtualLabClick).not.toHaveBeenCalled();
  });

  const click = (element: HTMLElement) => {
    act(() => {
      fireEvent.click(element);
      fireEvent.focus(element);
      fireEvent.mouseDown(element);
    });
  };

  const renderComponentWithLab = (
    name: string,
    adminMode?: boolean,
    extra?: Partial<VirtualLab>
  ) => {
    const user = userEvent.setup();
    const virtualLab = createMockVirtualLab(name, extra);

    render(MembersPanelProvider(virtualLab));

    return { virtualLab, user };
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

  function MembersPanelProvider({ name }: VirtualLab) {
    return (
      <TestProvider initialValues={[[sessionAtom, { accessToken: 'abc' }]]}>
        <DangerZonePanel labName={name} onDeleteVirtualLabClick={onDeleteVirtualLabClick} />
      </TestProvider>
    );
  }
});
