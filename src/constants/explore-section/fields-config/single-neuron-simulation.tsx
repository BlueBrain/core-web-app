import { Empty } from 'antd';
import { DisplayMessages } from '@/constants/display-messages';
import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { SingleNeuronSimulation } from '@/types/nexus';

import { ensureArray } from '@/util/nexus';
import { DataType } from '@/constants/explore-section/list-views';
import PreviewThumbnail from '@/components/explore-section/ExploreSectionListingView/PreviewThumbnail';
import { SIMULATION_CONFIG_FILE_NAME_BASE } from '@/state/simulate/single-neuron-setter';

export const SINGLE_NEURON_FIELDS_CONFIG: ExploreFieldsConfigProps<SingleNeuronSimulation> = {
  [Field.SingleNeuronSimulationUsedModelName]: {
    title: 'Model',
    filter: null,
    render: {
      esResourceViewFn: (_t, r) => {
        return r._source.singleNeuronSimulation?.emodel?.name || DisplayMessages.NO_DATA_STRING;
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
    style: {
      width: 184,
    },
    render: {
      esResourceViewFn: (value) => {
        const distribution = ensureArray(value._source.distribution).find(
          (o) => o.label && o.label.startsWith(SIMULATION_CONFIG_FILE_NAME_BASE)
        );
        if (!distribution) {
          return (
            <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          );
        }
        return (
          <PreviewThumbnail
            className="max-h-[116px] border border-neutral-2"
            contentUrl={distribution.contentUrl}
            height={116}
            type={DataType.SingleNeuronSimulation}
            width={184}
            target="stimulus"
          />
        );
      },
    },
    vocabulary: {
      plural: 'Stimuli',
      singular: 'Stimulus',
    },
  },
  [Field.SingleNeuronSimulationResponse]: {
    title: 'Response',
    filter: null,
    style: {
      width: 184,
    },
    render: {
      esResourceViewFn: (value) => {
        const distribution = ensureArray(value._source.distribution).find(
          (o) => o.label && o.label.startsWith(SIMULATION_CONFIG_FILE_NAME_BASE)
        );
        if (!distribution) {
          return (
            <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          );
        }
        return (
          <PreviewThumbnail
            className="max-h-[116px] border border-neutral-2"
            contentUrl={distribution.contentUrl}
            height={116}
            type={DataType.SingleNeuronSimulation}
            width={184}
            target="simulation"
          />
        );
      },
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
        return (
          r._source.singleNeuronSimulation?.injectionLocation || DisplayMessages.NO_DATA_STRING
        );
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
        return (
          r._source.singleNeuronSimulation?.recordingLocation || DisplayMessages.NO_DATA_STRING
        );
      },
    },
    vocabulary: {
      plural: 'Recording locations',
      singular: 'Recording location',
    },
    style: { width: 80 },
  },
};
