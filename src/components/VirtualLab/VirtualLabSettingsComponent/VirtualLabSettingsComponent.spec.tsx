/* eslint-disable no-restricted-syntax */
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import userEvent from '@testing-library/user-event';
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

  it('shows team name and reference when information panel is expanded', async () => {
    const renderedVirtualLab = renderComponentWithLab('test-lab');
    await openInformationPanel();

    const teamName = screen.getByLabelText('Team Name') as HTMLInputElement;
    expect(teamName.value).toEqual(renderedVirtualLab.name);
    const referenceEMail = screen.getByLabelText('Reference Contact') as HTMLInputElement;
    expect(referenceEMail.value).toEqual(renderedVirtualLab.referenceEMail);
  });

  it('does not show edit features if user is not admin', async () => {
    renderComponentWithLab('test-lab', false);
    await openInformationPanel();

    // Verify that all inputs are readonly
    const allInputs = Array.from(document.querySelectorAll('input')) as HTMLInputElement[];
    const readOnlyInputs = allInputs.filter((input) => input.readOnly);
    expect(allInputs.length).toEqual(readOnlyInputs.length);

    // No edit buttons are visible
    const editButtons = screen.queryAllByTitle('Edit virtual lab information');
    expect(editButtons.length).toEqual(0);
  });

  it('shows edit features if user is admin', async () => {
    renderComponentWithLab('test-lab', true);
    await openInformationPanel();

    const allInputs = Array.from(document.querySelectorAll('input')) as HTMLInputElement[];
    const readOnlyInputs = allInputs.filter((input) => input.readOnly);
    expect(allInputs.length).toEqual(readOnlyInputs.length);

    const editButtons = screen.queryAllByTitle('Edit virtual lab information');
    expect(editButtons.length).toEqual(3);
  });

  it('shows edittable inputs if any edit button is clicked', async () => {
    renderComponentWithLab('test-lab', true);
    await openInformationPanel();

    const editButtons = screen.queryAllByTitle('Edit virtual lab information');

    for await (const editButton of editButtons) {
      fireEvent.click(editButton);
      const allInputs = Array.from(document.querySelectorAll('input')) as HTMLInputElement[];
      const readOnlyInputs = allInputs.filter((input) => input.readOnly);
      expect(readOnlyInputs.length).toEqual(0);
    }
  });

  it('shows udpated information when user clicks save button', async () => {
    renderComponentWithLab('test-lab', true);
    await enableEditModeInInformation();

    changeInputValue('Team Name', 'New team name');

    await saveInformation();

    const teamNameInput = (await screen.findByLabelText('Team Name')) as HTMLInputElement;
    expect(teamNameInput.readOnly).toEqual(true);
    expect(teamNameInput.value).toEqual('New team name');
  });

  it('disables save button if user enters invalid virtual lab name', async () => {
    renderComponentWithLab('test-lab', true);
    await enableEditModeInInformation();

    changeInputValue('Team Name', '');

    const save = screen.getByText('Save').closest('button') as HTMLButtonElement;
    await waitFor(() => expect(save.disabled).toEqual(true));

    changeInputValue('Team Name', 'A valid name');
    await waitFor(() => expect(save.disabled).toEqual(false));
  });

  it('disables save button if user enters invalid reference email', async () => {
    renderComponentWithLab('test-lab', true);

    await enableEditModeInInformation();

    changeInputValue('Reference Contact', 'not_an_email');

    const save = screen.getByText('Save').closest('button') as HTMLButtonElement;
    await waitFor(() => expect(save.disabled).toEqual(true));

    changeInputValue('Reference Contact', 'such@valid.email');
    await waitFor(() => expect(save.disabled).toEqual(false));
  });

  it('shows error message when saving information fails', async () => {
    editVirtualLabMock().mockRejectedValueOnce(new Error('Mock error'));

    const renderedVirtualLab = renderComponentWithLab('test-lab', true);
    await enableEditModeInInformation();

    changeInputValue('Team Name', 'New valid team name');

    await saveInformation();

    await screen.findByText('There was an error in saving information.');

    const teamName = screen.getByLabelText('Team Name') as HTMLInputElement;
    expect(teamName.value).toEqual(renderedVirtualLab.name);
  });

  it('removes error message when saving information passes eventually', async () => {
    editVirtualLabMock().mockRejectedValueOnce(new Error('Mock error'));

    renderComponentWithLab('test-lab', true);

    await enableEditModeInInformation();

    changeInputValue('Team Name', 'This should fail');
    await saveInformation();

    await screen.findByText(informationPanelError);

    await enableEditModeInInformation(false);

    changeInputValue('Team Name', 'This should pass');
    await saveInformation();

    const teamNameInputAfter = (await screen.findByLabelText('Team Name')) as HTMLInputElement;
    expect(teamNameInputAfter.value).toEqual('This should pass');

    const errorMessage = screen.queryByText(informationPanelError);
    expect(errorMessage).not.toBeInTheDocument();
  });

  it('highlights currently selected plan when user expands Plan section', async () => {
    const lab = renderComponentWithLab('test-lab', true);
    await userEvent.click(screen.getByText('Plan'));
    const planElement = getElementForPlanType(lab.plan!);
    within(planElement!).getByText('Current Selection');
    const currentSelection = screen.getAllByText('Current Selection');
    expect(currentSelection).toHaveLength(1);
  });

  it('does not show Select plan buttons if user is not admin', async () => {
    renderComponentWithLab('test-lab', false);
    await userEvent.click(screen.getByText('Plan'));

    const planCollapseContent = screen.getByTestId('plans-collapsible-content');
    const selectPlanButtons = within(planCollapseContent).queryAllByText('Select', {
      selector: 'button span',
    });
    expect(selectPlanButtons).toHaveLength(0);
  });

  it('changes plan to entry level without asking for billing info', async () => {
    renderComponentWithLab('test-lab', true);
    await userEvent.click(screen.getByText('Plan'));

    const entryPlanElement = getElementForPlanType('entry');
    const selectPlanButton = within(entryPlanElement).getByText('Select', {
      selector: 'button span',
    });

    await userEvent.click(selectPlanButton);
    await userEvent.click(screen.getByText('Confirm'));
    screen.getByTestId('Saving changes');

    const entryPlanElementAfterChange = await findElementForPlanType('entry');
    within(entryPlanElementAfterChange).getByText(/Current Selection/i);
  });

  it('changes plan to new type after asking for billing info', async () => {
    const lab = renderComponentWithLab('test-lab', true);
    await userEvent.click(screen.getByText('Plan'));
    expect(lab.plan).not.toEqual('advanced');

    const advancedPlanElement = getElementForPlanType('advanced');
    const selectPlanButton = within(advancedPlanElement).getByText('Select', {
      selector: 'button span',
    });

    await userEvent.click(selectPlanButton);
    screen.getByTestId('billing-form');
    changeInputValue('Address', 'My new fake address');
    await userEvent.click(screen.getByText('Submit'));
    await userEvent.click(screen.getByText('Confirm'));

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

    const virtualLab = createMockVirtualLab(name);

    render(VirtualLabSettingsComponentProvider(virtualLab, adminMode));

    return virtualLab;
  };

  const openInformationPanel = async () => {
    const informationPanelHeader = screen.getByText('Information');
    await userEvent.click(informationPanelHeader);
  };

  const enableEditModeInInformation = async (openPanel: boolean = true) => {
    if (openPanel) {
      await openInformationPanel();
    }
    const editButton = screen.getAllByTitle('Edit virtual lab information')[0];
    // await userEvent.click(editButton);
    fireEvent.click(editButton);
  };

  const saveInformation = async () => {
    const save = screen.getByText('Save').closest('button') as HTMLButtonElement;
    await userEvent.click(save);
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
