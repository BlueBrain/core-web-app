import { BorderOutlined, CheckSquareOutlined } from '@ant-design/icons';

import { useSimulationSlots } from '../hooks';
import { useCurrentCampaignId } from '../hooks/current-campaign-id';
import { useSimulations } from '../hooks/simulations';
import { useAvailableCoords } from '../hooks/available-coords';
import CoordLabel from '../CoordLabel';
import { classNames } from '@/util/utils';

import styles from './slots-selector.module.css';

export interface SlotsSelectorProps {
  className?: string;
}

export default function SlotsSelector({ className }: SlotsSelectorProps) {
  const slots = useSimulationSlots();
  const campaignId = useCurrentCampaignId();
  const simulations = useSimulations(campaignId);
  const availableCoords = useAvailableCoords(simulations);
  return (
    <div className={classNames(styles.slotsSelector, className)}>
      <div
        style={{
          '--custom-grid-columns': availableCoords.length + 1,
        }}
      >
        <h1>Select simulations to display</h1>
        <div className={styles.grid}>
          {availableCoords.map((coord) => (
            <CoordLabel key={coord.name} value={coord} />
          ))}
          <div />
          {simulations.map((sim) => (
            <>
              {availableCoords.map((coord) => (
                <div key={`${sim.id}/${coord.name}`} className={styles.underlined}>
                  {sim.coords[coord.name] ?? 'N/A'}
                </div>
              ))}
              <div className={classNames(styles.underlined, styles.icon)}>
                <CheckSquareOutlined />
                <BorderOutlined />
              </div>
            </>
          ))}
        </div>
      </div>
      <div>
        <h2>Selected simulations</h2>
      </div>
      {/* <Button
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
      <pre>{JSON.stringify(simulations, null, '    ')}</pre> */}
    </div>
  );
}
