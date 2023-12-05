/* eslint-disable no-restricted-syntax */
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { Session } from 'next-auth';
import { Plan } from './PlanPanel';
import VirtualLabSettingsComponent from '.';
import sessionAtom from '@/state/session';
import * as MockVirtualLabModule from '@/services/virtual-lab/virtual-lab-service';
import { VirtualLab } from '@/services/virtual-lab/types';
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

    screen.getByText('Information');
    screen.getByText('Members');
    screen.getByText('Plan');
  });

  it('shows lab name and reference when information panel is expanded', async () => {
    const { virtualLab, user } = renderComponentWithLab('test-lab');
    await openInformationPanel(user);

    const teamName = screen.getByLabelText('Lab Name') as HTMLInputElement;
    expect(teamName.value).toEqual(virtualLab.name);
    const referenceEMail = screen.getByLabelText('Reference Contact') as HTMLInputElement;
    expect(referenceEMail.value).toEqual(virtualLab.referenceEMail);
  });

  it('does not show edit features if user is not admin', async () => {
    const { user } = renderComponentWithLab('test-lab', false);
    await openInformationPanel(user);

    // Verify that all inputs are readonly
    const allInputs = Array.from(document.querySelectorAll('input')) as HTMLInputElement[];
    const readOnlyInputs = allInputs.filter((input) => input.readOnly);
    expect(allInputs.length).toEqual(readOnlyInputs.length);

    // No edit buttons are visible
    const editButtons = screen.queryAllByTitle('Edit virtual lab information');
    expect(editButtons.length).toEqual(0);
  });

  it('shows edit features if user is admin', async () => {
    const { user } = renderComponentWithLab('test-lab', true);
    await openInformationPanel(user);

    const allInputs = Array.from(document.querySelectorAll('input')) as HTMLInputElement[];
    const readOnlyInputs = allInputs.filter((input) => input.readOnly);
    expect(allInputs.length).toEqual(readOnlyInputs.length);

    const editButtons = screen.queryAllByTitle('Edit virtual lab information');
    expect(editButtons.length).toEqual(3);
  });

  it('shows edittable inputs if any edit button is clicked', async () => {
    const { user } = renderComponentWithLab('test-lab', true);
    await openInformationPanel(user);

    const editButtons = screen.queryAllByTitle('Edit virtual lab information');

    for await (const editButton of editButtons) {
      fireEvent.click(editButton);
      const allInputs = Array.from(document.querySelectorAll('input')) as HTMLInputElement[];
      const readOnlyInputs = allInputs.filter((input) => input.readOnly);
      expect(readOnlyInputs.length).toEqual(0);
    }
  });

  it('shows udpated information when user clicks save button', async () => {
    const { user } = renderComponentWithLab('test-lab', true);
    await enableEditModeInInformation(user);

    changeInputValue('Lab Name', 'New team name');

    await saveInformation(user);

    const teamNameInput = (await screen.findByLabelText('Lab Name')) as HTMLInputElement;
    expect(teamNameInput.readOnly).toEqual(true);
    expect(teamNameInput.value).toEqual('New team name');
  });

  it('disables save button if user enters invalid virtual lab name', async () => {
    const { user } = renderComponentWithLab('test-lab', true);
    await enableEditModeInInformation(user);

    changeInputValue('Lab Name', '');

    const save = screen.getByText('Save').closest('button') as HTMLButtonElement;
    await waitFor(() => expect(save.disabled).toEqual(true));

    changeInputValue('Lab Name', 'A valid name');
    await waitFor(() => expect(save.disabled).toEqual(false));
  });

  it('disables save button if user enters invalid reference email', async () => {
    const { user } = renderComponentWithLab('test-lab', true);

    await enableEditModeInInformation(user);

    changeInputValue('Reference Contact', 'not_an_email');

    const save = screen.getByText('Save').closest('button') as HTMLButtonElement;
    await waitFor(() => expect(save.disabled).toEqual(true));

    changeInputValue('Reference Contact', 'such@valid.email');
    await waitFor(() => expect(save.disabled).toEqual(false));
  });

  it('shows error message when saving information fails', async () => {
    editVirtualLabMock().mockRejectedValueOnce(new Error('Mock error'));

    const { virtualLab, user } = renderComponentWithLab('test-lab', true);
    await enableEditModeInInformation(user);

    changeInputValue('Lab Name', 'New valid team name');

    await saveInformation(user);

    await screen.findByText('There was an error in saving information.');

    const teamName = screen.getByLabelText('Lab Name') as HTMLInputElement;
    expect(teamName.value).toEqual(virtualLab.name);
  });

  it('removes error message when saving information passes eventually', async () => {
    editVirtualLabMock().mockRejectedValueOnce(new Error('Mock error'));

    const { user } = renderComponentWithLab('test-lab', true);

    await enableEditModeInInformation(user);

    changeInputValue('Lab Name', 'This should fail');
    await saveInformation(user);

    await screen.findByText(informationPanelError);

    await enableEditModeInInformation(user, false);

    changeInputValue('Lab Name', 'This should pass');
    await saveInformation(user);

    const teamNameInputAfter = (await screen.findByLabelText('Lab Name')) as HTMLInputElement;
    expect(teamNameInputAfter.value).toEqual('This should pass');

    const errorMessage = screen.queryByText(informationPanelError);
    expect(errorMessage).not.toBeInTheDocument();
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
    const { user } = renderComponentWithLab('test-lab', true);
    await user.click(screen.getByText('Plan'));

    const entryPlanElement = getElementForPlanType('entry');
    const selectPlanButton = within(entryPlanElement).getByText('Select', {
      selector: 'button span',
    });

    await user.click(selectPlanButton);
    await user.click(screen.getByText('Confirm'));
    screen.getByTestId('Saving changes');

    const entryPlanElementAfterChange = await findElementForPlanType('entry');
    within(entryPlanElementAfterChange).getByText(/Current Selection/i);
  });

  it('changes plan to new type after asking for billing info', async () => {
    const { virtualLab, user } = renderComponentWithLab('test-lab', true);
    await user.click(screen.getByText('Plan'));
    expect(virtualLab.plan).not.toEqual('advanced');

    const advancedPlanElement = getElementForPlanType('advanced');
    const selectPlanButton = within(advancedPlanElement).getByText('Select', {
      selector: 'button span',
    });

    await user.click(selectPlanButton);
    screen.getByTestId('billing-form');
    changeInputValue('Address', 'My new fake address');
    await user.click(screen.getByText('Submit'));
    await user.click(screen.getByText('Confirm'));

    screen.getByTestId('Saving changes');

    const advancedPlanElementAfterChange = await findElementForPlanType('advanced');
    within(advancedPlanElementAfterChange).getByText(/Current Selection/i);
    expect(screen.queryByTestId('billing-form')).not.toBeInTheDocument();
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

  const renderComponentWithLab = (name: string, adminMode?: boolean) => {
    cleanup();

    const user = userEvent.setup();

    const virtualLab = createMockVirtualLab(name);
    render(VirtualLabSettingsComponentProvider(virtualLab, adminMode));

    return { virtualLab, user };
  };

  const openInformationPanel = async (user: UserEvent) => {
    const informationPanelHeader = screen.getByText('Information');
    await user.click(informationPanelHeader);
  };

  const enableEditModeInInformation = async (user: UserEvent, openPanel: boolean = true) => {
    if (openPanel) {
      await openInformationPanel(user);
    }
    const editButton = screen.getAllByTitle('Edit virtual lab information')[0];
    fireEvent.click(editButton);
  };

  const saveInformation = async (user: UserEvent) => {
    const save = screen.getByText('Save').closest('button') as HTMLButtonElement;
    await user.click(save);
  };

  const changeInputValue = (label: string, value: string) => {
    const inputElement = screen.getByLabelText(label) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value } });
  };

  const informationPanelError = 'There was an error in saving information.';

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
