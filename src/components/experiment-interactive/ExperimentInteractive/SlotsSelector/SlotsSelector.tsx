/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions, arrow-body-style */
import { CloseOutlined, SlidersOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import { useState, useMemo, Fragment } from 'react';

import CoordFilter from '../CoordFilter';
import CoordLabel from '../CoordLabel';
import { useSimulationSlots } from '../hooks';
import { useAvailableCoords } from '../hooks/available-coords';
import { useCurrentCampaignDescriptor } from '../hooks/current-campaign-descriptor';
import { useSimulations } from '../hooks/simulations/simulations';
import { useSlotSelectorVisible } from '../hooks/slot-selector-visible';
import { classNames } from '@/util/utils';
import Spinner from '@/components/Spinner';

import styles from './slots-selector.module.css';

export interface SlotsSelectorProps {
  className?: string;
}

export default function SlotsSelector({ className }: SlotsSelectorProps) {
  const [, setSlotSelectorVisible] = useSlotSelectorVisible();
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [showFilters, setShowFilters] = useState(false);
  const slots = useSimulationSlots();
  const campaignId = useCurrentCampaignDescriptor();
  const simulations = useSimulations(campaignId);
  const filteredSimulations = useMemo(
    () =>
      simulations?.filter((s) =>
        Object.keys(filters).every(
          (key) => filters[key] === undefined || Number(filters[key]) === s.coords[key]
        )
      ) || [],
    [simulations, filters]
  );

  const availableCoords = useAvailableCoords(simulations);

  if (!simulations)
    return (
      <div className="w-full h-full bg-black absolute flex justify-center items-center">
        <Spinner> Loading...</Spinner>
      </div>
    );

  return (
    <div className={classNames(styles.slotsSelector, className)}>
      <div
        className={styles.panel}
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
              <div onClick={() => setShowFilters(!showFilters)} className="cursor-pointer">
                <SlidersOutlined />
                <span className="inline-block ml-1 text-xs">Filter by value</span>
              </div>
              {Array.from({ length: availableCoords.length - 2 }, (_, i) => i).map((i) => (
                <div key={i} />
              ))}
              <div className={`${styles.span2} text-sm`}>
                Total simulations:
                <span className="font-bold inline-block ml-1">{filteredSimulations.length}</span>
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
              <div onClick={() => setFilters({})} className="cursor-pointer">
                <UndoOutlined /> <span className="inline-block ml-1 text-sm">Reset</span>
              </div>
            </>
          )}
          {filteredSimulations.map((sim) => {
            const isSelected = Boolean(
              slots.list.find(
                (item) =>
                  sim.campaignId === item.campaignId && sim.simulationId === item.simulationId
              )
            );
            return (
              <Fragment key={sim.simulationId}>
                {availableCoords.map((coord) => (
                  <div key={`${sim.simulationId}/${coord.name}`} className={styles.underlined}>
                    {sim.coords[coord.name] ?? 'N/A'}
                  </div>
                ))}
                <div className={classNames(styles.underlined, styles.icon)}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => (isSelected ? slots.remove(sim) : slots.add(sim))}
                    disabled={!isSelected && slots.list.length === 9}
                  />
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
      <div
        className={styles.panel}
        style={{
          '--custom-grid-columns': availableCoords.length + 1,
        }}
      >
        <div className="flex">
          <div className="w-1/2">
            <div className="text-xl font-bold">Selected simulations</div>
            <div className="text-xs">
              Selected simulations
              <span className="font-bold inline-block ml-2">{slots.list.length}</span> / 9
            </div>
          </div>
          <div className="text-xs items-center flex justify-end w-1/2">
            You can only select a maximum of 9 simulations
          </div>
        </div>

        <div className={styles.grid}>
          {availableCoords.map((coord) => (
            <CoordLabel key={coord.name} value={coord} />
          ))}
          <div />
          {simulations.map((sim) => {
            const isSelected = Boolean(
              slots.list.find(
                (item) =>
                  sim.campaignId === item.campaignId && sim.simulationId === item.simulationId
              )
            );
            if (!isSelected) return null;

            return (
              <Fragment key={sim.simulationId}>
                {availableCoords.map((coord) => (
                  <div key={`${sim.simulationId}/${coord.name}`} className={styles.underlined}>
                    {sim.coords[coord.name] ?? 'N/A'}
                  </div>
                ))}
                <div className={classNames(styles.underlined, styles.icon)}>
                  <CloseOutlined onClick={() => slots.remove(sim)} className="text-sm" />
                </div>
              </Fragment>
            );
          })}
          {slots.list.length !== 0 && (
            <Button
              onClick={() => setSlotSelectorVisible(false)}
              style={{ width: 100, marginTop: 30 }}
            >
              Confirm
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
