import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ParameterView from '.';
import sessionAtom from '@/state/session';
import { singleNeuronAtom } from '@/state/simulate/single-neuron';
import { SelectedSingleNeuronModel } from '@/types/simulate/single-neuron';
import { DataType } from '@/constants/explore-section/list-views';

describe('ParameterViewComponent', () => {
  test('only direct current injection form is visible if model of type MEModels is selected', async () => {
    renderComponent(meModel);
    await expectDirectInjectionFormToBeVisible();
    expect(screen.queryByText('Synapse')).not.toBeInTheDocument();
  });

  test('shows synapse config & direct current config by default if model of type SingleNeuronSynaptome is selected', async () => {
    renderComponent(singleNeuronSynaptom(['Test Synapse 1']));
    await expectDirectInjectionFormToBeVisible();

    screen.getByTestId(synapsesConfigTestId);
    screen.getByText(synapseConfigTitle());
  });

  test('adds synapse configuration when user clicks add button', async () => {
    const { user } = renderComponent(
      singleNeuronSynaptom(['Test Synapse 1', 'Test Synapse 2', 'Test Synapse 3'])
    );

    await screen.findByText(synapseConfigTitle());
    await user.click(screen.getByText('+ Add Synapse Configuration'));
    screen.getByText(synapseConfigTitle(2));
  });

  test('shows synapse form fields for each synapse in model', async () => {
    const { user } = renderComponent(singleNeuronSynaptom(['Test Synapse 1', 'Test Synapse 2']));

    await screen.findByText(synapseConfigTitle());
    await user.click(screen.getByText('+ Add Synapse Configuration'));
    screen.getByText(synapseConfigTitle(2));

    expect(screen.getAllByText('Delay')).toHaveLength(2);
    expect(screen.getAllByText('Duration')).toHaveLength(2);
    expect(screen.getAllByText('Frequency')).toHaveLength(2);
    expect(screen.getAllByText('Weight Scalar')).toHaveLength(2);
  });

  test('shows only direct current config for direct current if user selects OnlyDirectInjection option', async () => {
    const { user } = renderComponent(singleNeuronSynaptom(['Test Synapse 1']));

    screen.getByTestId(synapsesConfigTestId);

    await user.click(simulationTypeSelector());
    await user.click(screen.getByText('Only Direct Current Injection'));

    await expectDirectInjectionFormToBeVisible();
    expect(screen.queryByText(synapseConfigTitle())).not.toBeInTheDocument();
  });

  test('shows only config for synapses if user selects OnlySynapses option', async () => {
    const { user } = renderComponent(singleNeuronSynaptom(['Test Synapse 1']));

    screen.getByTestId(synapsesConfigTestId);
    screen.getByTestId(directCurrentConfigTestId);

    await user.click(simulationTypeSelector());
    await user.click(screen.getByText('Only Synapses'));

    screen.getByTestId(synapsesConfigTestId);
    expect(screen.queryByTestId(directCurrentConfigTestId)).not.toBeInTheDocument();
    expect(screen.queryByText('Protocol')).not.toBeInTheDocument();
  });

  const synapseConfigTitle = (index = 1) => `Synapse Configuration ${index}`;
  const synapsesConfigTestId = 'synapses-configuration';
  const directCurrentConfigTestId = 'direct-current-configuration';

  const renderComponent = (selectedModel: SelectedSingleNeuronModel) => {
    const user = userEvent.setup();
    render(ParameterViewComponentProvider(selectedModel));

    return { user };
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

  function ParameterViewComponentProvider(selectedModel: SelectedSingleNeuronModel) {
    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [singleNeuronAtom, selectedModel],
        ]}
      >
        <ParameterView />
      </TestProvider>
    );
  }

  const simulationTypeSelector = () => screen.getByText('Direct Current Injection + Synapses');

  const expectDirectInjectionFormToBeVisible = async () => {
    await screen.findByText('Location');
    screen.getByText('Stimulation mode');
    screen.getByText('Protocol');
    screen.getByText('Stop time');
    screen.getByText('Amperage [nA]');
  };
});

const meModel: SelectedSingleNeuronModel = {
  self: 'self-me-model',
  type: DataType.CircuitMEModel,
  source: {} as any,
};

const singleNeuronSynaptom = (synapses: string[]): SelectedSingleNeuronModel => {
  return {
    self: 'self-synaptome-model',
    type: DataType.SingleNeuronSynaptome,
    source: {
      synapses: synapses.map((s) => ({ id: s, name: s, description: s })),
    } as any,
  };
};
