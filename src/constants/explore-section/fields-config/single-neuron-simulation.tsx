import { Empty } from 'antd';
import { NO_DATA_STRING } from '../queries';
import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { SingleNeuronSimulation } from '@/types/nexus';

export const SINGLE_NEURON_FIELDS_CONFIG: ExploreFieldsConfigProps<SingleNeuronSimulation> = {
  [Field.SingleNeuronSimulationUsedModelName]: {
    title: 'Model',
    filter: null,
    render: {
      esResourceViewFn: (_t, r) => {
        return r._source.singleNeuronSimulation?.emodel?.name || NO_DATA_STRING;
      },
    },
    vocabulary: {
      plural: 'Models',
      singular: 'Model',
    },
  },
  [Field.SingleNeuronSimulationStimulus]: {
    title: 'Stimulus',
    filter: null,
    render: {
      esResourceViewFn: () => (
        <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ),
    },
    vocabulary: {
      plural: 'Stimuli',
      singular: 'Stimulus',
    },
  },
  [Field.SingleNeuronSimulationResponse]: {
    title: 'Response',
    filter: null,
    render: {
      esResourceViewFn: () => (
        <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ),
    },
    vocabulary: {
      plural: 'Responses',
      singular: 'Response',
    },
  },
  [Field.SingleNeuronSimulationInjectionLocation]: {
    title: 'Injection location',
    filter: null,
    render: {
      esResourceViewFn: (_t, r) => {
        return r._source.singleNeuronSimulation?.injectionLocation || NO_DATA_STRING;
      },
    },
    vocabulary: {
      plural: 'Injection locations',
      singular: 'Injection location',
    },
    style: { width: 80 },
  },
  [Field.SingleNeuronSimulationRecordingLocation]: {
    title: 'Recording location',
    filter: null,
    render: {
      esResourceViewFn: (_t, r) => {
        return r._source.singleNeuronSimulation?.recordingLocation || NO_DATA_STRING;
      },
    },
    vocabulary: {
      plural: 'Recording locations',
      singular: 'Recording location',
    },
    style: { width: 80 },
  },
};
