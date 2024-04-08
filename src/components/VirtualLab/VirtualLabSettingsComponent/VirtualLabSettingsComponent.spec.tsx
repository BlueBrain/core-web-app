import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import userEvent from '@testing-library/user-event';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import { Session } from 'next-auth';
import { Plan } from './PlanPanel';
import VirtualLabSettingsComponent from '.';
import sessionAtom from '@/state/session';
import * as MockVirtualLabModule from '@/services/virtual-lab/virtual-lab-service';
import { VirtualLab, VirtualLabPlanType } from '@/services/virtual-lab/types';
import { createMockVirtualLab } from '__tests__/__utils__/VirtualLab';
import { getButton } from '__tests__/__utils__/utils';

jest.mock('@/services/virtual-lab/virtual-lab-service');

jest.mock('next/navigation', () => ({
  __esModule: true,
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe('VirtualLabSettingsComponent', () => {
  jest.setTimeout(10_000);

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    virtualLabServiceMock().mockClear();
    getComputeTimeMock().mockClear();
    editVirtualLabMock().mockClear();
  });

  it('shows error when loading compute time fails', async () => {
    getComputeTimeMock().mockRejectedValueOnce(new Error('Error fetching compute time'));
    renderComponentWithLab('test-lab');

    await screen.findByText('There was an error while retrieving compute time.');
  });

  it('shows collapsible panels for virtual lab information, members and plan', () => {
    renderComponentWithLab('test-lab');

    screen.getByText('Lab Settings');
    screen.getByText('Plan');
  });

  it('highlights currently selected plan when user expands Plan section', async () => {
    const { virtualLab, user } = renderComponentWithLab('test-lab', true);
    await user.click(screen.getByText('Plan'));
    const planElement = getElementForPlanType(virtualLab.plan!);
    within(planElement!).getByText('Current Selection');
    const currentSelection = screen.getAllByText('Current Selection');
    expect(currentSelection).toHaveLength(1);
  });

  it('does not show Select plan buttons if user is not admin', async () => {
    const { user } = renderComponentWithLab('test-lab', false);
    await user.click(screen.getByText('Plan'));

    const planCollapseContent = screen.getByTestId('plans-collapsible-content');
    const selectPlanButtons = within(planCollapseContent).queryAllByText('Select', {
      selector: 'button span',
    });
    expect(selectPlanButtons).toHaveLength(0);
  });

  it('changes plan to entry level without asking for billing info', async () => {
    const { user } = renderComponentWithLab('test-lab', true, {
      plan: VirtualLabPlanType.advanced,
    });
    await user.click(screen.getByText('Plan'));

    const entryPlanElement = getElementForPlanType(VirtualLabPlanType.entry);
    const selectPlanButton = within(entryPlanElement).getByText('Select', {
      selector: 'button span',
    });

    await user.click(selectPlanButton);
    await user.click(screen.getByText('Confirm'));

    const entryPlanElementAfterChange = await findElementForPlanType(VirtualLabPlanType.entry);
    within(entryPlanElementAfterChange).getByText(/Current Selection/i);
  });

  it('non admins do not see danger zone panel', () => {
    renderComponentWithLab('test-lab', false);
    expect(screen.queryByText(/Danger Zone/i)).not.toBeInTheDocument();
  });

  it('admins see danger zone panel', () => {
    renderComponentWithLab('test-lab', true);
    fireEvent.click(screen.getByText(/Danger Zone/i));
    expect(getButton('Delete Virtual Lab')).toBeVisible();
  });

  const getElementForPlanType = (plan: Plan) => {
    const planElement = screen
      .getByText(new RegExp(plan, 'i'))
      .closest('[data-testid="plan-details"]') as HTMLElement;
    expect(planElement).toBeVisible();
    return planElement;
  };

  const findElementForPlanType = async (plan: Plan) => {
    const planElement = (
      await screen.findByText(new RegExp(plan, 'i'), { selector: 'h2' })
    ).closest('[data-testid="plan-details"]') as HTMLElement;
    expect(planElement).toBeVisible();
    return planElement;
  };

  const renderComponentWithLab = (
    name: string,
    adminMode: boolean = false,
    extra?: Partial<VirtualLab>
  ) => {
    cleanup();

    const user = userEvent.setup();

    const virtualLab = createMockVirtualLab(name, extra);
    render(VirtualLabSettingsComponentProvider(virtualLab, adminMode));

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

  function VirtualLabSettingsComponentProvider(virtualLab: VirtualLab, adminMode?: boolean) {
    if (adminMode) {
      // eslint-disable-next-line react/destructuring-assignment
      const anAdmin = virtualLab.members.find((member) => member.role === 'admin')!;
      expect(anAdmin).toBeTruthy();
      const user: Session['user'] = {
        username: anAdmin.email,
        email: anAdmin.email,
        name: anAdmin.name,
      };
      return (
        <TestProvider initialValues={[[sessionAtom, { accessToken: 'abc' }]]}>
          <VirtualLabSettingsComponent virtualLab={virtualLab} user={user} />
        </TestProvider>
      );
    }

    return (
      <TestProvider initialValues={[[sessionAtom, { accessToken: 'abc' }]]}>
        <VirtualLabSettingsComponent virtualLab={virtualLab} user={{ username: 'Archer' }} />
      </TestProvider>
    );
  }

  const virtualLabServiceMock = () => (MockVirtualLabModule as any).default as jest.Mock;
  const getComputeTimeMock = () => (MockVirtualLabModule as any).getComputeTimeMock as jest.Mock;
  const editVirtualLabMock = () => (MockVirtualLabModule as any).editVirtualLabMock as jest.Mock;
});
