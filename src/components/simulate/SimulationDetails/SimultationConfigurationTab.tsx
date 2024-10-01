import { RightOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import ConditionsDetails from './ConditionsDetails';
import SynapticInputs from './SynapticInputs';
import StimulationDetails from './StimulationDetails';
import RecordingLocations from './RecordingLocations';
import { SimulationPayload } from '@/types/simulation/single-neuron';
import { SimulationType } from '@/types/simulation/common';

type Props = {
  type: SimulationType;
  simulation: SimulationPayload;
};

function CollapseIcon({ isActive }: { isActive?: boolean }) {
  return <RightOutlined rotate={isActive ? 90 : 0} className="!font-bold !text-primary-8" />;
}

export default function SimulationConfigurationTab({ simulation, type }: Props) {
  const allItems = [
    {
      key: 'conditions-config',
      label: <h4 className="text-xl font-bold text-primary-8">Experiment setup</h4>,
      children: <ConditionsDetails conditions={simulation.config.conditions} />,
    },
    {
      key: 'synaptic-inputs',
      label: <h4 className="text-xl font-bold text-primary-8">Synaptic Inputs</h4>,
      children: <SynapticInputs synapses={simulation.config.synaptome ?? []} />,
    },
    {
      key: 'stimulation-config',
      label: <h4 className="text-xl font-bold text-primary-8">Stimulation Protocol</h4>,
      children: (
        <StimulationDetails
          currentInjection={simulation.config.currentInjection}
          stimulusData={simulation.stimulus}
        />
      ),
    },
    {
      key: 'recording-locations',
      label: <h4 className="text-xl font-bold text-primary-8">Recordings</h4>,
      children: <RecordingLocations recordingLocations={simulation.config.recordFrom} />,
    },
  ];

  const items =
    type === 'single-neuron-simulation'
      ? allItems.filter((o) => o.key !== 'synaptic-inputs')
      : allItems;

  return (
    <Collapse
      ghost
      bordered={false}
      defaultActiveKey={[
        'conditions-config',
        'synaptic-inputs',
        'stimulation-config',
        'recording-locations',
      ]}
      expandIconPosition="end"
      expandIcon={CollapseIcon}
      items={items}
    />
  );
}
