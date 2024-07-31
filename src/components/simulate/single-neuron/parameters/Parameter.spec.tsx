import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ParameterView from '.';
import sessionAtom from '@/state/session';
import { singleNeuronAtom } from '@/state/simulate/single-neuron';
import { ModelResource } from '@/types/simulate/single-neuron';
import { DataType } from '@/constants/explore-section/list-views';
import { ResourceMetadata } from '@/types/nexus';
import { MEModelResource } from '@/types/me-model';
import { SynaptomeModelResource } from '@/types/explore-section/delta-model';

describe('ParameterViewComponent', () => {
  test('only direct current injection form is visible if model of type MEModels is selected', async () => {
    renderComponent(meModelResource);
    await expectDirectInjectionFormToBeVisible();
    expect(screen.queryByText('Synapse')).not.toBeInTheDocument();
  });

  test('shows synapse config & direct current config by default if model of type SingleNeuronSynaptome is selected', async () => {
    renderComponent(synaptomResource(['Test Synapse 1']));
    await expectDirectInjectionFormToBeVisible();

    screen.getByTestId(synapsesConfigTestId);
    screen.getByText(synapseConfigTitle());
  });

  test('adds synapse configuration when user clicks add button', async () => {
    const { user } = renderComponent(
      synaptomResource(['Test Synapse 1', 'Test Synapse 2', 'Test Synapse 3'])
    );

    await screen.findByText(synapseConfigTitle());
    await user.click(screen.getByText('+ Add Synapse Configuration'));
    screen.getByText(synapseConfigTitle(2));
  });

  test('shows synapse form fields for each synapse in model', async () => {
    const { user } = renderComponent(synaptomResource(['Test Synapse 1', 'Test Synapse 2']));

    await screen.findByText(synapseConfigTitle());
    await user.click(screen.getByText('+ Add Synapse Configuration'));
    screen.getByText(synapseConfigTitle(2));

    expect(screen.getAllByText('Delay')).toHaveLength(2);
    expect(screen.getAllByText('Duration')).toHaveLength(2);
    expect(screen.getAllByText('Frequency')).toHaveLength(2);
    expect(screen.getAllByText('Weight Scalar')).toHaveLength(2);
  });

  test('shows only direct current config for direct current if user selects OnlyDirectInjection option', async () => {
    const { user } = renderComponent(synaptomResource(['Test Synapse 1']));

    screen.getByTestId(synapsesConfigTestId);

    await user.click(simulationTypeSelector());
    await user.click(screen.getByText('Only Direct Current Injection'));

    await expectDirectInjectionFormToBeVisible();
    expect(screen.queryByText(synapseConfigTitle())).not.toBeInTheDocument();
  });

  test('shows only config for synapses if user selects OnlySynapses option', async () => {
    const { user } = renderComponent(synaptomResource(['Test Synapse 1']));

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

  const renderComponent = (selectedModel: ModelResource) => {
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

  function ParameterViewComponentProvider(selectedModel: ModelResource) {
    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [singleNeuronAtom, selectedModel],
        ]}
      >
        <ParameterView resource={selectedModel} />
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

const baseResource: ResourceMetadata = {
  _createdAt: '2024-07-25T14:09:24.167Z',
  _createdBy: 'malory',
  _deprecated: false,
  _incoming: 'mock-incoming',
  _outgoing: 'mock-outgoing',
  _project: 'mock-project',
  _rev: 1,
  _self: 'self',
  _updatedAt: '2024-07-25T14:09:24.167Z',
  _updatedBy: 'lana',
};

const meModelResource: MEModelResource = {
  ...baseResource,
  _self: 'self-memodel-model',
  '@id': 'self-memodel-model',
  '@type': [DataType.CircuitMEModel],
  '@context': ['boo'],
  name: 'meModel',
  description: 'meModel',
  hasPart: [
    {
      '@type': 'EModel',
      '@id': 'meModel',
    },
    {
      '@type': 'NeuronMorphology',
      '@id': 'morph',
    },
  ],
  validated: true,
  status: 'initalized',
};

const synaptomResource = (synapses: string[]): SynaptomeModelResource => ({
  ...baseResource,
  _self: 'self-synaptome-model',
  '@id': 'self-synaptome-model',
  '@type': [DataType.SingleNeuronSynaptome],
  '@context': ['boo'],
  synapses: synapses.map((s) => ({ id: s })),
});
