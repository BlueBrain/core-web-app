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
  brainRegionAtom,
  compositionAtom,
  densityOrCountAtom,
  setCompositionAtom,
} from '@/state/brain-regions';
import { BrainRegionIcon, LockIcon, LockOpenIcon } from '@/components/icons';
import VerticalSwitch from '@/components/VerticalSwitch';
import { CompositionDataSet } from '@/app/brain-factory/(main)/cell-composition/configuration/types';
import IconButton from '@/components/IconButton';
import HorizontalSlider from '@/components/HorizontalSlider';
import { recalculateAndGetNewNodes } from '@/app/brain-factory/(main)/cell-composition/configuration/util';
import useCompositionHistory from '@/app/brain-factory/(main)/cell-composition/configuration/use-composition-history';

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
  isExpanded,
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
        <IconButton onClick={setLockedFunc}>{lockIcon}</IconButton>
        <span className="ml-auto text-white">{normalizedComposition}</span>
        {trigger?.()}
      </div>
      {isExpanded ? (
        <div className="bg-primary-6 px-[12px] py-2 rounded-[4px]">
          <HorizontalSlider
            value={composition}
            color="#FFF"
            max={max}
            step={1}
            disabled={isLocked}
            onChange={(newValue) => onSliderChange && onSliderChange(newValue)}
          />
        </div>
      ) : null}
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
          <IconButton onClick={setLockedFunc}>{lockIcon}</IconButton>
          <span className="ml-auto">~&nbsp;{composition && formatNumber(composition)}</span>
        </div>
        {isOpen ? (
          <HorizontalSlider
            value={composition}
            color="#95DE64"
            max={max || 0}
            step={1}
            disabled={isLocked}
            onChange={(newValue) => onSliderChange && onSliderChange(newValue)}
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
  const composition = useAtomValue(compositionAtom);
  const setComposition = useSetAtom(setCompositionAtom);
  const { nodes, links } = composition ?? { nodes: [], links: [] };
  const [lockedNodeIds, setLockedNodeIds] = useState<string[]>([]);
  const { appendToHistory } = useCompositionHistory();

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

  /**
   * This callback handles the change of a given slider
   */
  const handleSliderChange = useCallback(
    (about: string, changedNode: Node, value: number | null, parentId: string | null) => {
      const newComposition = {
        links,
        nodes: recalculateAndGetNewNodes(
          about,
          changedNode,
          value,
          nodes,
          parentId,
          densityOrCount,
          lockedNodeIds
        ),
        id: changedNode.id,
        value,
      } as CompositionDataSet;

      setComposition(newComposition);
      appendToHistory(newComposition);
    },
    [densityOrCount, links, nodes, setComposition, appendToHistory, lockedNodeIds]
  );
  const max = useMemo(
    () => (neurons ? neurons.reduce((acc, a) => acc + a.composition, 0) : 0),
    [neurons]
  );

  const setLocked = useCallback(
    (id: string) => {
      if (lockedNodeIds.includes(id)) {
        setLockedNodeIds(lockedNodeIds.filter((nodeId) => nodeId !== id));
      } else {
        setLockedNodeIds([...lockedNodeIds, id]);
      }
    },
    [lockedNodeIds]
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
            about,
            parentId,
            isExpanded,
          }) => (
            <NeuronCompositionParent
              content={content}
              title={title}
              trigger={trigger}
              isLocked={lockedNodeIds.includes(id)}
              setLockedFunc={() => setLocked(id)}
              composition={renderedComposition}
              onSliderChange={(newValue) => {
                const node = neuronsToNodes[id];
                handleSliderChange(about, node, newValue, parentId);
              }}
              isExpanded={isExpanded}
              max={max}
            >
              {({
                content: nestedContent,
                composition: nestedComposition,
                title: nestedTitle,
                trigger: nestedTrigger,
                about: nestedAbout,
                id: nestedId,
                parentId: nestedParentId,
              }: NeuronCompositionItem) => {
                const lockId = `${parentId}__${id}`;
                const isLocked = lockedNodeIds.includes(lockId);

                return (
                  <NeuronCompositionLeaf
                    content={nestedContent}
                    onSliderChange={(newValue) => {
                      const node = neuronsToNodes[parentId].items.find(
                        (nestedNode: Node) => nestedNode.id === nestedId
                      );
                      handleSliderChange(nestedAbout, node, newValue, node.parentId);
                    }}
                    composition={nestedComposition}
                    title={nestedTitle}
                    trigger={nestedTrigger}
                    isLocked={isLocked}
                    setLockedFunc={() => setLocked(lockId)}
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
