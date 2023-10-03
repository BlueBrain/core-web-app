import { Button } from 'antd';

import { useSimulationSlots } from '../hooks';
import { useCurrentCampaignId } from '../hooks/current-campaign-id';
import { useSimulations } from '../hooks/simulations';
import { classNames } from '@/util/utils';

import styles from './slots-selector.module.css';

export interface SlotsSelectorProps {
  className?: string;
}

export default function SlotsSelector({ className }: SlotsSelectorProps) {
  const simulationSlots = useSimulationSlots();
  const campaignId = useCurrentCampaignId();
  const simulations = useSimulations(campaignId);
  return (
    <div className={classNames(styles.slotsSelector, className)}>
      <Button
        onClick={() =>
          simulationSlots.add({
            circuitPath:
              '/gpfs/bbp.cscs.ch/data/scratch/proj134/home/king/BBPP134-479_custom/full_shm800.b/simulation_config.json',
            populationName: 'root__neurons',
            report: { name: 'soma', type: 'compartment' },
          })
        }
      >
        Add a new slot
      </Button>
      <pre>{JSON.stringify(simulations, null, '    ')}</pre>
    </div>
  );
}
