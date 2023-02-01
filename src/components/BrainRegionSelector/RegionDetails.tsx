import React, { useCallback, useState, ReactElement } from 'react';
import { useAtom, useAtomValue } from 'jotai/react';
import { arrayToTree } from 'performant-array-to-tree';
import { Button } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import * as Accordion from '@radix-ui/react-accordion';
import CollapsedRegionDetails from './CollapsedRegionDetails';
import { getMetric, handleNavValueChange } from './util';
import { CompositionUnit } from '@/types/atlas';
import { formatNumber } from '@/util/common';
import TreeNavItem, { NavValue } from '@/components/TreeNavItem';
import { brainRegionAtom, compositionAtom, densityOrCountAtom } from '@/state/brain-regions';
import { BrainRegionIcon } from '@/components/icons';
import VerticalSwitch from '@/components/VerticalSwitch';

/**
 * Maps metrics to units in order to appear in the sidebar
 */
const metricToUnit = {
  density: (
    <span>
      /mm<sup>3</sup>
    </span>
  ),
  count: <span>N</span>,
};

function NeuronCompositionTitle({
  composition,
  title,
  children, // Children is the Accordion.Trigger that triggers the drop-down
}: {
  composition?: JSX.Element;
  title?: string;
  children: ReactElement;
}) {
  return (
    <div className="flex gap-3 items-center justify-end py-3 text-left text-primary-3 w-full whitespace-nowrap hover:text-white">
      <span className="font-bold text-white">{title}</span>
      <span className="ml-auto text-white">{composition}</span>
      {children}
    </div>
  );
}

function NeuronCompositionSubTitle({
  composition,
  title,
}: {
  composition?: number;
  title?: string;
}) {
  return (
    <div className="flex gap-3 items-center justify-between py-3 text-secondary-4 whitespace-nowrap">
      <span className="font-bold whitespace-nowrap">{title}</span>
      <span>~&nbsp;{composition && formatNumber(composition)}</span>
    </div>
  );
}

function MeTypeDetails({
  neuronComposition,
  meTypeNavValue,
  onValueChange,
}: {
  neuronComposition: CompositionUnit;
  meTypeNavValue: NavValue;
  onValueChange: (newValue: string[], path: string[]) => void;
}) {
  const densityOrCount = useAtomValue(densityOrCountAtom);
  const composition = useAtomValue(compositionAtom);

  const neurons =
    composition &&
    arrayToTree(
      composition.nodes.map(({ neuronComposition: nodeNeuronComposition, label, ...node }) => ({
        ...node,
        composition: nodeNeuronComposition[densityOrCount],
        title: label,
      })),
      {
        dataField: null,
        parentId: 'parentId',
        childrenField: 'items',
      }
    );

  return (
    <>
      <h2 className="flex font-bold justify-between text-white text-lg">
        <span className="justify-self-start">NEURONS [{metricToUnit[densityOrCount]}]</span>
        <small className="font-normal text-base">
          ~ {getMetric(neuronComposition, densityOrCount)}
        </small>
      </h2>
      {neurons && (
        <Accordion.Root
          type="multiple"
          className="divide-y divide-primary-6 -ml-5"
          value={Object.keys(meTypeNavValue)}
          onValueChange={(newValue) => onValueChange(newValue, [])}
        >
          {neurons.map(({ id, items, composition: c, title }) => {
            const normalizedComposition = c ? <span>~&nbsp;{formatNumber(c)}</span> : c;

            return (
              <TreeNavItem
                id={id}
                items={items}
                key={id}
                className="ml-5 divide-y divide-primary-6"
                path={[id]}
                value={meTypeNavValue[id]}
                onValueChange={onValueChange}
              >
                <NeuronCompositionTitle composition={normalizedComposition} title={title}>
                  <NeuronCompositionSubTitle />
                </NeuronCompositionTitle>
              </TreeNavItem>
            );
          })}
        </Accordion.Root>
      )}
    </>
  );
}

export default function RegionDetails() {
  const brainRegion = useAtomValue(brainRegionAtom);
  const [densityOrCount, setDensityOrCount] = useAtom(densityOrCountAtom);
  const [isMeTypeOpen, setisMeTypeOpen] = useState<boolean>(true);

  const [meTypeNavValue, setNavValue] = useState<NavValue>({});

  const onValueChange = useCallback(
    (newValue: string[], path: string[]) => {
      const callback = handleNavValueChange(meTypeNavValue, setNavValue);

      return callback(newValue, path);
    },
    [meTypeNavValue, setNavValue]
  );

  return (
    brainRegion && (
      <div className="bg-primary-7 flex h-screen overflow-hidden">
        {!isMeTypeOpen && brainRegion && (
          <CollapsedRegionDetails title={brainRegion?.title} setisMeTypeOpen={setisMeTypeOpen} />
        )}
        {isMeTypeOpen && (
          <div className="flex flex-col gap-5 overflow-y-auto px-6 py-6 min-w-[300px]">
            <div className="flex justify-between mb-5">
              <div className="flex space-x-2 justify-start items-center text-2xl text-white font-bold">
                <BrainRegionIcon style={{ height: '1em' }} />
                <span className="text-secondary-4">{brainRegion?.title}</span>
              </div>
              <Button
                className="p-2"
                type="text"
                icon={<MinusOutlined style={{ color: 'white' }} />}
                onClick={() => setisMeTypeOpen(false)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-2 py-4 border-y border-primary-6">
                <div className="flex flex-row gap-3">
                  <VerticalSwitch
                    isChecked={densityOrCount === 'count'}
                    onChange={(checked: boolean) => {
                      const toSet = checked ? 'count' : 'density';
                      // @ts-ignore
                      setDensityOrCount(toSet);
                    }}
                  />
                  <div className="flex flex-col gap-1 text-primary-1">
                    <div>Densities [{metricToUnit.density}]</div>
                    <div>Counts [{metricToUnit.count}]</div>
                  </div>
                </div>
              </div>
            </div>
            <MeTypeDetails
              neuronComposition={brainRegion.composition.neuronComposition}
              meTypeNavValue={meTypeNavValue}
              onValueChange={onValueChange}
            />
          </div>
        )}
      </div>
    )
  );
}
