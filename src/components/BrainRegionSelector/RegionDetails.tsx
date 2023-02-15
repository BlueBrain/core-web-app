'use client';

import React, { useCallback, useState, useMemo } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { arrayToTree } from 'performant-array-to-tree';
import { Button } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import CollapsedRegionDetails from './CollapsedRegionDetails';
import { getMetric, handleNavValueChange } from './util';
import { CompositionTitleProps, NeuronCompositionItem } from './types';
import { CompositionUnit, Node } from '@/types/atlas';
import { formatNumber } from '@/util/common';
import TreeNav, { NavValue } from '@/components/TreeNavItem';
import {
  analysedCompositionAtom,
  computeAndSetCompositionAtom,
  densityOrCountAtom,
  selectedBrainRegionAtom,
} from '@/state/brain-regions';
import { BrainRegionIcon, LockIcon, LockOpenIcon } from '@/components/icons';
import VerticalSwitch from '@/components/VerticalSwitch';
import IconButton from '@/components/IconButton';
import HorizontalSlider from '@/components/HorizontalSlider';
import computeSystemLockedIds from '@/components/BrainRegionSelector/locking';

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

function NeuronCompositionParent({
  composition,
  title,
  onSliderChange,
  max,
  isLocked,
  setLockedFunc,
  lockIsDisabled,
  trigger, // A callback that returns the <Accordion.Trigger/>
  content, // A callback that returns the <Accordion.Content/>
}: CompositionTitleProps) {
  const normalizedComposition = composition ? (
    <span>~&nbsp;{formatNumber(composition)}</span>
  ) : (
    composition
  );

  const lockIcon = useMemo(() => {
    if (isLocked) {
      return <LockIcon fill="#91D5FF" />;
    }
    return <LockOpenIcon fill="#91D5FF" />;
  }, [isLocked]);

  return (
    <>
      <div className="flex gap-3 items-center justify-end py-3 text-left text-primary-3 w-full whitespace-nowrap hover:text-white">
        <span className="font-bold text-white">{title}</span>
        <IconButton disabled={lockIsDisabled} onClick={setLockedFunc}>
          {lockIcon}
        </IconButton>
        <span className="ml-auto text-white">{normalizedComposition}</span>
        {trigger?.()}
      </div>
      <div className="bg-primary-6 px-[12px] py-2 rounded-[4px]">
        <HorizontalSlider
          value={composition}
          color="#FFF"
          max={max}
          step={1}
          disabled={isLocked}
          onChange={(newValue) => onSliderChange && newValue && onSliderChange(newValue)}
        />
      </div>
      {content?.()}
    </>
  );
}

function NeuronCompositionLeaf({
  composition,
  title,
  onSliderChange,
  max,
  isLocked,
  setLockedFunc,
  lockIsDisabled,
  trigger, // A callback that returns the <Accordion.Trigger/>
  content, // A callback that returns the <Accordion.Content/>
}: Omit<CompositionTitleProps, 'isExpanded'>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const lockIcon = useMemo(() => {
    if (isLocked) {
      return <LockIcon fill="#91D5FF" />;
    }
    return <LockOpenIcon fill="#91D5FF" />;
  }, [isLocked]);

  return (
    <>
      <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        <div className="flex gap-3 justify-between py-3 text-secondary-4 whitespace-nowrap">
          <span className="font-bold whitespace-nowrap">{title}</span>
          <IconButton disabled={lockIsDisabled} onClick={setLockedFunc}>
            {lockIcon}
          </IconButton>
          <span className="ml-auto">~&nbsp;{composition && formatNumber(composition)}</span>
        </div>
        {isOpen ? (
          <HorizontalSlider
            value={composition}
            color="#95DE64"
            max={max || 0}
            step={1}
            disabled={isLocked}
            onChange={(newValue) => onSliderChange && newValue && onSliderChange(newValue)}
          />
        ) : null}
        {trigger?.()}
      </div>
      {content?.()}
    </>
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
  const composition = useAtomValue(analysedCompositionAtom);
  const [userLockedIds, setUserLockedIds] = useState<string[]>([]);
  const modifyComposition = useSetAtom(computeAndSetCompositionAtom);
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

  const neuronsToNodes = neurons
    ? neurons.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {})
    : {};

  // get system locked node ids
  const systemLockedIds = useMemo(
    () => (composition?.nodes ? computeSystemLockedIds(composition.nodes, userLockedIds) : []),
    [composition, userLockedIds]
  );

  const allLockedIds = useMemo(
    () => [...systemLockedIds, ...userLockedIds],
    [systemLockedIds, userLockedIds]
  );
  /**
   * This callback handles the change of a given slider
   */
  const handleSliderChange = useCallback(
    (changedNode: Node, value: number) => {
      modifyComposition(changedNode, value, allLockedIds).then();
    },
    [allLockedIds, modifyComposition]
  );

  // calculating the max value of the unlocked sliders
  const unlockedMax = useMemo(
    () =>
      neurons
        ? neurons.reduce((acc, a) => {
            if (!allLockedIds.includes(a.id)) {
              return acc + a.composition;
            }
            return acc;
          }, 0)
        : 0,
    [neurons, allLockedIds]
  );

  // calculating the max value of the locked sliders
  const lockedMax = useMemo(
    () =>
      neurons
        ? neurons.reduce((acc, a) => {
            if (allLockedIds.includes(a.id)) {
              return acc + a.composition;
            }
            return acc;
          }, 0)
        : 0,
    [neurons, allLockedIds]
  );

  // sets modified the locked ids based on the changed node
  const setLocked = useCallback(
    (id: string, childrenNodes: Node[]) => {
      const childrenIds = childrenNodes.map((childNode) => `${id}__${childNode.id}`);

      if (userLockedIds.includes(id)) {
        setUserLockedIds(
          userLockedIds.filter((nodeId) => nodeId !== id && !childrenIds.includes(nodeId))
        );
      } else {
        setUserLockedIds([...userLockedIds, id]);
      }
    },
    [userLockedIds]
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
        <TreeNav items={neurons} onValueChange={onValueChange} value={meTypeNavValue}>
          {({
            composition: renderedComposition,
            content,
            title,
            trigger,
            id,
            parentId,
            isExpanded,
            items,
          }) => (
            <NeuronCompositionParent
              content={content}
              title={title}
              trigger={trigger}
              isLocked={allLockedIds.includes(id)}
              setLockedFunc={() => setLocked(id, items)}
              composition={renderedComposition}
              onSliderChange={(newValue: number) => {
                const node = neuronsToNodes[id];
                handleSliderChange(node, newValue);
              }}
              lockIsDisabled={systemLockedIds.includes(id)}
              isExpanded={isExpanded}
              max={allLockedIds.includes(id) ? lockedMax : unlockedMax}
            >
              {({
                content: nestedContent,
                composition: nestedComposition,
                title: nestedTitle,
                trigger: nestedTrigger,
                id: nestedId,
                parentId: nestedParentId,
              }: NeuronCompositionItem) => {
                const lockId = `${parentId}__${id}`;

                return (
                  <NeuronCompositionLeaf
                    content={nestedContent}
                    onSliderChange={(newValue: number) => {
                      const node = neuronsToNodes[parentId].items.find(
                        (nestedNode: Node) => nestedNode.id === nestedId
                      );
                      handleSliderChange(node, newValue);
                    }}
                    composition={nestedComposition}
                    title={nestedTitle}
                    trigger={nestedTrigger}
                    isLocked={allLockedIds.includes(lockId)}
                    lockIsDisabled={systemLockedIds.includes(lockId)}
                    setLockedFunc={() => setLocked(lockId, [])}
                    max={neuronsToNodes[nestedParentId].composition}
                  />
                );
              }}
            </NeuronCompositionParent>
          )}
        </TreeNav>
      )}
    </>
  );
}

export default function RegionDetails() {
  const brainRegion = useAtomValue(selectedBrainRegionAtom);
  const [densityOrCount, setDensityOrCount] = useAtom(densityOrCountAtom);
  const [isMeTypeOpen, setisMeTypeOpen] = useState<boolean>(true);
  const [meTypeNavValue, setNavValue] = useState<NavValue>({});
  const composition = useAtomValue(analysedCompositionAtom);

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
            {composition ? (
              <MeTypeDetails
                neuronComposition={composition.totalComposition.neuron}
                meTypeNavValue={meTypeNavValue}
                onValueChange={onValueChange}
              />
            ) : (
              <div>Composition could not be calculated</div>
            )}
          </div>
        )}
      </div>
    )
  );
}
