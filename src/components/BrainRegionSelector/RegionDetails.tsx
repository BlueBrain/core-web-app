'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { arrayToTree } from 'performant-array-to-tree';
import { Button } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import _ from 'lodash';
import CollapsedRegionDetails from './CollapsedRegionDetails';
import { getMetric } from './util';
import { CompositionTitleProps, NeuronCompositionItem } from './types';
import { handleNavValueChange } from '@/components/BrainTree/util';
import { CompositionNode, CompositionUnit } from '@/types/composition';
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
import { formatNumber } from '@/util/common';
import CompositionInput from '@/components/BrainRegionSelector/CompositionInput';

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
  isEditable,
}: CompositionTitleProps) {
  const lockIcon = useMemo(() => {
    if (isLocked) {
      return <LockIcon fill="#91D5FF" />;
    }
    return <LockOpenIcon fill="#91D5FF" />;
  }, [isLocked]);

  return (
    <>
      <div className="flex gap-2 items-center justify-between  py-3 text-left text-primary-3 w-full whitespace-nowrap hover:text-white">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white">{title}</span>
          <IconButton disabled={lockIsDisabled} onClick={setLockedFunc}>
            {lockIcon}
          </IconButton>
        </div>
        <div className="flex items-center gap-2">
          {isEditable ? (
            <CompositionInput
              composition={composition}
              compositionChangeFunc={onSliderChange}
              max={max}
              isDisabled={isLocked}
            />
          ) : (
            <span className="ml-auto text-white">{formatNumber(composition)}</span>
          )}
          {trigger?.()}
        </div>
      </div>
      <div className="bg-primary-6 px-[12px] rounded-[4px]">
        {isEditable ? (
          <HorizontalSlider
            value={composition}
            color="#FFF"
            max={max}
            step={1}
            disabled={isLocked}
            onChange={(newValue) => onSliderChange && newValue && onSliderChange(newValue)}
          />
        ) : null}
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
  isEditable,
}: Omit<CompositionTitleProps, 'isExpanded'>) {
  const lockIcon = useMemo(() => {
    if (isLocked) {
      return <LockIcon fill="#91D5FF" />;
    }
    return <LockOpenIcon fill="#91D5FF" />;
  }, [isLocked]);

  return (
    <>
      <div className="flex gap-3 items-center justify-between pt-3 pb-0 text-secondary-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <span className="font-bold whitespace-nowrap">{title}</span>
          <IconButton disabled={lockIsDisabled} onClick={setLockedFunc}>
            {lockIcon}
          </IconButton>
        </div>
        <div className="flex items-center gap-3">
          {isEditable ? (
            <CompositionInput
              composition={composition}
              compositionChangeFunc={onSliderChange}
              max={max}
              isDisabled={isLocked}
            />
          ) : (
            <span className="ml-auto text-white">{formatNumber(composition)}</span>
          )}
        </div>
      </div>
      {isEditable ? (
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
      {content?.()}
    </>
  );
}

function MeTypeDetails({
  neuronComposition,
  meTypeNavValue,
  onValueChange,
  editMode,
}: {
  neuronComposition: CompositionUnit;
  meTypeNavValue: NavValue;
  onValueChange: (newValue: string[], path: string[]) => void;
  editMode: boolean;
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
    (changedNode: CompositionNode, value: number) => {
      modifyComposition(changedNode, value, allLockedIds).then();
    },
    [allLockedIds, modifyComposition]
  );

  // sets modified the locked ids based on the changed node
  const setLocked = useCallback(
    (id: string, childrenNodes: CompositionNode[]) => {
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

  /**
   * Calculates the max value that a neuron composition can take
   * @param relatedNodes the set of related nodes
   * @param id the id of the node
   * @param about the about value of the node
   */
  const calculateMax = (relatedNodes: string[], id: string, about: string) => {
    let max = 0;
    relatedNodes.forEach((relatedNodeId: string) => {
      if (
        relatedNodeId in neuronsToNodes &&
        neuronsToNodes[relatedNodeId].about === about &&
        // if both relatedNodeId and id are locked or none of them
        (_.difference([id, relatedNodeId], allLockedIds).length === 0 ||
          _.difference([id, relatedNodeId], allLockedIds).length === 2)
      ) {
        max += neuronsToNodes[relatedNodeId].composition;
      }
    });
    return max;
  };

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
            relatedNodes,
            about,
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
              max={calculateMax(relatedNodes, id, about)}
              isEditable={editMode}
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
                        (nestedNode: CompositionNode) => nestedNode.id === nestedId
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
                    isEditable={editMode}
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

export default function RegionDetails({ editMode }: { editMode: boolean }) {
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
                editMode={editMode}
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
