import { RightOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import ConditionsDetails from './ConditionsDetails';
import SynapticInputs from './SynapticInputs';
import StimulationDetails from './StimulationDetails';
import { SimulationPayload } from '@/types/simulation/single-neuron';

type Props = {
  simulation: SimulationPayload;
};

function CollapseIcon({ isActive }: { isActive?: boolean }) {
  return <RightOutlined rotate={isActive ? 90 : 0} className="!font-bold !text-primary-8" />;
}

export default function SimulationConfigurationTab({ simulation }: Props) {
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1', '2', '3']}
      expandIconPosition="end"
      ghost
      expandIcon={CollapseIcon}
      items={[
        {
          key: '1',
          label: <h4 className="text-xl font-bold text-primary-8">Experiment setup</h4>,
          children: <ConditionsDetails conditions={simulation.config.conditions} />,
        },
        {
          key: '2',
          label: <h4 className="text-xl font-bold text-primary-8">Synaptic Inputs</h4>,
          children: <SynapticInputs synapses={simulation.config.synaptome ?? []} />,
        },
        {
          key: '3',
          label: <h4 className="text-xl font-bold text-primary-8">Stimulation Protocol</h4>,
          children: (
            <StimulationDetails
              currentInjection={simulation.config.currentInjection}
              stimulusData={simulation.stimulus}
            />
          ),
        },
      ]}
    />
  );
}
