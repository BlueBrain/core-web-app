'use client';

import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { arrayToTree } from 'performant-array-to-tree';
import { Button } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import difference from 'lodash/difference';
import uniq from 'lodash/uniq';

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
import { BrainRegionIcon, LockIcon, LockOpenIcon, MissingData } from '@/components/icons';
import VerticalSwitch from '@/components/VerticalSwitch';
import IconButton from '@/components/IconButton';
import HorizontalSlider from '@/components/HorizontalSlider';
import { formatNumber } from '@/util/common';
import CompositionInput from '@/components/BrainRegionSelector/CompositionInput';
import { calculateMax } from '@/util/composition/utils';
import iterateAndComputeSystemLockedIds from '@/util/composition/locking';
import { isConfigEditableAtom } from '@/state/brain-model-config';

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
      <div className="flex gap-2 items-center justify-between py-3 text-left text-primary-3 w-full whitespace-nowrap hover:text-white">
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
      {isEditable ? (
        <HorizontalSlider
          className="bg-primary-6 px-[12px] rounded-[4px]"
          value={composition}
          color="#FFF"
          max={max}
          step={1}
          disabled={isLocked}
          onChange={(newValue) => onSliderChange && newValue && onSliderChange(newValue)}
        />
      ) : null}
      {content?.({ className: '-mt-3' })}
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

  // blocked node ids are the ones that are blocked by the system since they
  // are undividable (cannot be split)
  const blockedNodeIds = useMemo(
    () => (composition ? composition.blockedNodeIds : []),
    [composition]
  );

  // system locked ids are the ones that are locked by the system due to changes
  // by the user
  const systemLockedIds = useMemo(() => {
    if (composition?.nodes) {
      // we calculate the system locks twice so that the second time we will take
      // into consideration the calculations of the first time
      const system = iterateAndComputeSystemLockedIds(composition.nodes, [
        ...userLockedIds,
        ...blockedNodeIds,
      ]);
      return difference(system, userLockedIds);
    }
    return [];
  }, [blockedNodeIds, composition?.nodes, userLockedIds]);
  const allLockedIds = useMemo(
    () => uniq([...systemLockedIds, ...userLockedIds, ...blockedNodeIds]),
    [blockedNodeIds, systemLockedIds, userLockedIds]
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
    (extendedNodeId: string) => {
      if (userLockedIds.includes(extendedNodeId)) {
        setUserLockedIds(userLockedIds.filter((nodeId) => nodeId !== extendedNodeId));
      } else {
        setUserLockedIds([...userLockedIds, extendedNodeId]);
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
            relatedNodes,
            about,
            path,
          }) => (
            <NeuronCompositionParent
              content={content}
              title={title}
              trigger={trigger}
              isLocked={allLockedIds.includes(path.join('__'))}
              setLockedFunc={() => setLocked(path.join('__'))}
              composition={renderedComposition}
              onSliderChange={(newValue: number) => {
                const node = neuronsToNodes[id];
                handleSliderChange(node, newValue);
              }}
              lockIsDisabled={
                systemLockedIds.includes(path.join('__')) ||
                blockedNodeIds.includes(path.join('__'))
              }
              isExpanded={isExpanded}
              max={calculateMax(relatedNodes, id, about, allLockedIds, neuronsToNodes)}
              isEditable={editMode}
            >
              {({
                content: nestedContent,
                composition: nestedComposition,
                title: nestedTitle,
                trigger: nestedTrigger,
                id: nestedId,
                parentId: nestedParentId,
                path: nestedPath,
              }: NeuronCompositionItem) => {
                const expandedNodeId = nestedPath ? nestedPath?.join('__') : '';
                const isDisabled =
                  systemLockedIds.includes(expandedNodeId) ||
                  blockedNodeIds.includes(expandedNodeId);
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
                    isLocked={allLockedIds.includes(expandedNodeId)}
                    lockIsDisabled={isDisabled}
                    setLockedFunc={() => setLocked(expandedNodeId)}
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

function Title({ title, onClick }: { title?: string; onClick?: () => void }) {
  return (
    <div className="flex justify-between items-start mb-5">
      <div className="flex space-x-2 justify-start items-center text-2xl text-white font-bold">
        <BrainRegionIcon style={{ height: '1em' }} />
        <span className="text-secondary-4">{title}</span>
      </div>
      <Button
        type="text"
        icon={<MinusOutlined style={{ color: 'white' }} />}
        onClick={onClick}
        style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
}

function UnitsToggle({
  isChecked,
  onChange,
}: {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-2 py-4 border-y border-primary-6">
        <div className="flex flex-row gap-3">
          <VerticalSwitch isChecked={isChecked} onChange={onChange} />
          <div className="flex flex-col gap-1 text-primary-1">
            <div>Densities [{metricToUnit.density}]</div>
            <div>Counts [{metricToUnit.count}]</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoVolumeAnnotations() {
  return (
    <div className="flex flex-col gap-3 text-center mt-48">
      <MissingData className="w-full" style={{ color: '#fff' }} />
      <h3 className="font-semibold text-base text-white">
        No volume annotations
        <br />
        available for this brain region
      </h3>
    </div>
  );
}

function ExpandedRegionDetails({
  editMode,
  setIsSidebarExpanded,
}: {
  editMode: boolean;
  setIsSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  const brainRegion = useAtomValue(selectedBrainRegionAtom);
  const [densityOrCount, setDensityOrCount] = useAtom(densityOrCountAtom);
  const composition = useAtomValue(analysedCompositionAtom);
  const isConfigEditable = useAtomValue(isConfigEditableAtom);
  const [meTypeNavValue, setNavValue] = useState<NavValue>({});

  const onValueChange = useCallback(
    (newValue: string[], path: string[]) => {
      const callback = handleNavValueChange(meTypeNavValue, setNavValue);

      return callback(newValue, path);
    },
    [meTypeNavValue, setNavValue]
  );

  const title = useMemo(
    () => <Title title={brainRegion?.title} onClick={() => setIsSidebarExpanded(false)} />,
    [brainRegion?.title, setIsSidebarExpanded]
  );

  if (!brainRegion) {
    return null;
  }

  return brainRegion.representedInAnnotation ? (
    <div className="flex flex-col gap-5 overflow-y-auto px-6 py-6 min-w-[300px]">
      {title}
      <UnitsToggle
        isChecked={densityOrCount === 'count'}
        onChange={(checked: boolean) => {
          const toSet = checked ? 'count' : 'density';

          setDensityOrCount(toSet);
        }}
      />
      {composition ? (
        <MeTypeDetails
          neuronComposition={composition.totalComposition.neuron}
          meTypeNavValue={meTypeNavValue}
          onValueChange={onValueChange}
          editMode={editMode && !!isConfigEditable}
        />
      ) : (
        <div>Composition could not be calculated</div>
      )}
    </div>
  ) : (
    <div className="flex flex-col gap-5 overflow-y-auto px-6 py-6 w-[300px]">
      {title}
      <NoVolumeAnnotations />
    </div>
  );
}

export default ExpandedRegionDetails;
