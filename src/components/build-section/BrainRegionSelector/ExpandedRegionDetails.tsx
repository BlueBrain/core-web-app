'use client';

import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { arrayToTree } from 'performant-array-to-tree';

import { loadable, unwrap } from 'jotai/utils';

import { getMetric } from './util';
import { handleNavValueChange } from '@/components/BrainTree/util';
import TreeNav from '@/components/TreeNavItem';
import { NavValue } from '@/state/brain-regions/types';
import { densityOrCountAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import VerticalSwitch from '@/components/VerticalSwitch';
import { isConfigEditableAtom } from '@/state/brain-model-config';
import { analysedCompositionAtom, computeAndSetCompositionAtom } from '@/state/build-composition';
import {
  CalculatedCompositionNeuronGlia,
  CalculatedCompositionNode,
} from '@/types/composition/calculation';
import { cellTypesByIdAtom } from '@/state/build-section/cell-types';
import METypeTreeItem from '@/components/common/METypeHierarchy/METypeTreeItem';
import { ClassNexus } from '@/api/ontologies/types';
import { METypeItem } from '@/components/common/METypeHierarchy/METypeTreeItem/types';
import { SelectedBrainRegionTitle } from '@/components/common/METypeHierarchy/SelectedBrainRegionTitle';
import { NoCompositionAvailable } from '@/components/common/METypeHierarchy/NoCompositionAvailable';
import { metricToUnit } from '@/components/common/METypeHierarchy/MetricToUnit';
import { useLoadable } from '@/hooks/hooks';

function MeTypeDetails({
  neuronComposition,
  meTypeNavValue,
  onValueChange,
  editMode,
  meTypesMetadata,
}: {
  neuronComposition: CalculatedCompositionNeuronGlia;
  meTypeNavValue: NavValue;
  onValueChange: (newValue: string[], path: string[]) => void;
  editMode: boolean;
  meTypesMetadata: Record<string, ClassNexus> | undefined | null;
}) {
  const densityOrCount = useAtomValue(densityOrCountAtom);
  const composition = useAtomValue(analysedCompositionAtom);
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

  /**
   * This callback handles the change of a given slider
   */
  const handleSliderChange = useCallback(
    (changedNode: CalculatedCompositionNode, value: number) => {
      modifyComposition(changedNode, value).then();
    },
    [modifyComposition]
  );

  return (
    <>
      <h2 className="flex justify-between text-lg font-bold text-white">
        <span className="justify-self-start">NEURONS [{metricToUnit[densityOrCount]}]</span>
        <small className="text-base font-normal">
          ~ {getMetric(neuronComposition.neuron, densityOrCount)}
        </small>
      </h2>

      {neurons && (
        <TreeNav items={neurons} onValueChange={onValueChange} value={meTypeNavValue}>
          {({ composition: renderedComposition, content, title, trigger, id, parentId, about }) => (
            <METypeTreeItem
              content={content}
              metadata={meTypesMetadata?.[id]}
              densityOrCount={densityOrCount}
              title={title}
              trigger={trigger}
              composition={renderedComposition}
              onSliderChange={(newValue: number) => {
                const node = neuronsToNodes[id];
                handleSliderChange(node, newValue);
              }}
              isEditable={editMode}
              isLeaf={false}
              about={about}
              id={id}
            >
              {({
                content: nestedContent,
                composition: nestedComposition,
                title: nestedTitle,
                trigger: nestedTrigger,
                id: nestedId,
                about: nestedAbout,
              }: METypeItem) => (
                <METypeTreeItem
                  content={nestedContent}
                  metadata={meTypesMetadata?.[id]}
                  densityOrCount={densityOrCount}
                  onSliderChange={(newValue: number) => {
                    const node = neuronsToNodes[parentId].items.find(
                      (nestedNode: CalculatedCompositionNode) => nestedNode.id === nestedId
                    );
                    handleSliderChange(node, newValue);
                  }}
                  composition={nestedComposition}
                  title={nestedTitle}
                  trigger={nestedTrigger}
                  isEditable={editMode}
                  about={nestedAbout}
                  isLeaf
                  id={nestedId}
                />
              )}
            </METypeTreeItem>
          )}
        </TreeNav>
      )}
    </>
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
      <div className="flex flex-row gap-2 border-y border-primary-6 py-4">
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

function ExpandedRegionDetails({
  editMode,
  setIsSidebarExpanded,
}: {
  editMode: boolean;
  setIsSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  const brainRegion = useAtomValue(selectedBrainRegionAtom);
  const [densityOrCount, setDensityOrCount] = useAtom(densityOrCountAtom);
  const composition = useLoadable(loadable(analysedCompositionAtom), null);
  const isConfigEditable = useAtomValue(isConfigEditableAtom);
  const [meTypeNavValue, setNavValue] = useState<NavValue>({});
  const meTypesMetadata = useAtomValue(useMemo(() => unwrap(cellTypesByIdAtom), []));

  const onValueChange = useCallback(
    (newValue: string[], path: string[]) => {
      const callback = handleNavValueChange(meTypeNavValue, setNavValue);

      return callback(newValue, path);
    },
    [meTypeNavValue, setNavValue]
  );

  const title = useMemo(
    () => (
      <SelectedBrainRegionTitle
        title={brainRegion?.title}
        onClick={() => setIsSidebarExpanded(false)}
      />
    ),
    [brainRegion?.title, setIsSidebarExpanded]
  );

  if (!brainRegion) {
    return null;
  }

  return composition?.totalComposition.neuron ? (
    <div className="flex min-w-[300px] flex-col gap-5 overflow-y-auto px-6 py-6">
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
          neuronComposition={composition.totalComposition}
          meTypeNavValue={meTypeNavValue}
          onValueChange={onValueChange}
          editMode={editMode && !!isConfigEditable}
          meTypesMetadata={meTypesMetadata}
        />
      ) : (
        <div>Composition could not be calculated</div>
      )}
    </div>
  ) : (
    <div className="flex w-[300px] flex-col gap-5 overflow-y-auto px-6 py-6">
      {title}
      <NoCompositionAvailable />
    </div>
  );
}

export default ExpandedRegionDetails;
