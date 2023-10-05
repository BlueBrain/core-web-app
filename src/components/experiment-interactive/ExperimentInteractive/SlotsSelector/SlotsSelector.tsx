import { BorderOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';

import CoordFilter from '../CoordFilter';
import CoordLabel from '../CoordLabel';
import { useSimulationSlots } from '../hooks';
import { useAvailableCoords } from '../hooks/available-coords';
import { useCurrentCampaignId } from '../hooks/current-campaign-id';
import { useSimulations } from '../hooks/simulations';
import { useSlotSelectorVisible } from '../hooks/slot-selector-visible';
import { classNames } from '@/util/utils';

import styles from './slots-selector.module.css';

export interface SlotsSelectorProps {
  className?: string;
}

export default function SlotsSelector({ className }: SlotsSelectorProps) {
  const [, setSlotSelectorVisible] = useSlotSelectorVisible();
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
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
          {availableCoords.map((coord) => (
            <CoordFilter
              key={coord.name}
              coord={coord}
              value={filters[coord.name] ?? ''}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  [coord.name]: v,
                })
              }
            />
          ))}
          <div>Reset</div>
          {simulations.map((sim) => {
            const isSelected = Boolean(
              slots.list.find(
                (item) =>
                  sim.campaignId === item.campaignId && sim.simulationId === item.simulationId
              )
            );
            return (
              <>
                {availableCoords.map((coord) => (
                  <div key={`${sim.simulationId}/${coord.name}`} className={styles.underlined}>
                    {sim.coords[coord.name] ?? 'N/A'}
                  </div>
                ))}
                <div className={classNames(styles.underlined, styles.icon)}>
                  {isSelected ? (
                    <CheckSquareOutlined onClick={() => slots.remove(sim)} />
                  ) : (
                    <BorderOutlined onClick={() => slots.add(sim)} />
                  )}
                </div>
              </>
            );
          })}
        </div>
      </div>
      <div
        style={{
          '--custom-grid-columns': availableCoords.length,
        }}
      >
        <h2>Selected simulations</h2>
        <div className={styles.grid}>
          {availableCoords.map((coord) => (
            <CoordLabel key={coord.name} value={coord} />
          ))}
          {simulations.map((sim) => {
            const isSelected = Boolean(
              slots.list.find(
                (item) =>
                  sim.campaignId === item.campaignId && sim.simulationId === item.simulationId
              )
            );
            if (!isSelected) return null;

            return (
              <>
                {availableCoords.map((coord) => (
                  <div key={`${sim.simulationId}/${coord.name}`} className={styles.underlined}>
                    {sim.coords[coord.name] ?? 'N/A'}
                  </div>
                ))}
              </>
            );
          })}
        </div>
        <Button disabled={slots.list.length === 0} onClick={() => setSlotSelectorVisible(false)}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
