import { BorderOutlined, CheckSquareOutlined, SlidersOutlined } from '@ant-design/icons';
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
  const [showFilters, setShowFilters] = useState(false);
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
        <div className="text-xl font-bold">Select simulations to display</div>
        <div className={styles.grid}>
          {availableCoords.map((coord) => (
            <CoordLabel key={coord.name} value={coord} className={styles.underlined} />
          ))}
          {availableCoords.length > 0 && <div className={styles.underlined} />}

          {!!simulations.length && (
            <>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
              <div onClick={() => setShowFilters(!showFilters)} className="cursor-pointer">
                <SlidersOutlined />
                <span className="inline-block ml-1 text-xs">Filter by value</span>
              </div>
              {Array.from({ length: availableCoords.length - 3 }, (_, i) => i).map((i) => (
                <div key={i} />
              ))}
              <div className={`${styles.span2} text-sm`}>
                Total simulations:
                <span className="font-bold inline-block ml-1">{simulations.length}</span>
              </div>
            </>
          )}
          {showFilters && (
            <>
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
            </>
          )}
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
        <div className="text-xl font-bold">Selected simulations</div>
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
        {slots.list.length !== 0 && (
          <Button onClick={() => setSlotSelectorVisible(false)}>Confirm</Button>
        )}
      </div>
    </div>
  );
}
