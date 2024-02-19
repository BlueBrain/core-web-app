'use client';

import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { arrayToTree } from 'performant-array-to-tree';
import { Button, ConfigProvider, Spin, Tooltip } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import { unwrap } from 'jotai/utils';

import ContextualTrigger from '../ContextualLiterature/Trigger';
import { getMetric } from './util';
import { NeuronCompositionEditorProps, NeuronCompositionItem } from './types';
import { metricToUnit } from './MetricToUnit';
import { handleNavValueChange } from '@/components/BrainTree/util';
import TreeNav from '@/components/TreeNavItem';
import { NavValue } from '@/state/brain-regions/types';
import { densityOrCountAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import { BrainRegionIcon, MissingData } from '@/components/icons';
import VerticalSwitch from '@/components/VerticalSwitch';
import { formatNumber } from '@/util/common';
import CompositionInput from '@/components/build-section/BrainRegionSelector/CompositionInput';
import { isConfigEditableAtom } from '@/state/brain-model-config';
import { analysedCompositionAtom, computeAndSetCompositionAtom } from '@/state/build-composition';
import {
  CalculatedCompositionNeuronGlia,
  CalculatedCompositionNode,
} from '@/types/composition/calculation';
import { QuestionAbout } from '@/types/literature';
import { cellTypesByIdAtom } from '@/state/build-section/cell-types';
import { ETYPE_NEXUS_TYPE, MTYPE_NEXUS_TYPE } from '@/constants/ontologies';

function CompositionTooltip({ title, subclasses }: { title?: string; subclasses?: string[] }) {
  const renderType = () => {
    if (subclasses?.includes(MTYPE_NEXUS_TYPE)) {
      return 'M-type';
    }
    if (subclasses?.includes(ETYPE_NEXUS_TYPE)) {
      return 'E-type';
    }
    return undefined;
  };

  if (!title || !subclasses) {
    return <div className="text-primary-8">Cell type information could not be retrieved</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="grow font-bold text-primary-8">{title}</div>
      <div className="flex-none text-neutral-4">{renderType()}</div>
    </div>
  );
}

function NeuronCompositionEditor({
  composition,
  title,
  onSliderChange,
  trigger, // A callback that returns the <Accordion.Trigger/>
  content, // A callback that returns the <Accordion.Content/>
  isEditable,
  isLeaf,
  about,
  id,
}: NeuronCompositionEditorProps) {
  const [compositionValue, setCompositionValue] = useState<number>(composition);
  const densityOrCount = useAtomValue(densityOrCountAtom);

  useEffect(() => {
    setCompositionValue(composition);
  }, [composition]);

  // different container classes based on whether its leaf or not
  const containerClasses = useMemo(() => {
    const baseClasses = 'flex items-center justify-between whitespace-nowrap';
    return isLeaf
      ? `${baseClasses} gap-3 mt-5 pb-0 text-secondary-4`
      : `${baseClasses} gap-2 py-3 text-left text-primary-3 w-full hover:text-white`;
  }, [isLeaf]);

  const classObjects = useAtomValue(useMemo(() => unwrap(cellTypesByIdAtom), []));
  const questionSubject = classObjects?.[id]?.prefLabel ?? title;

  return (
    <>
      <div className={containerClasses}>
        <div className="flex items-center gap-3">
          <ConfigProvider
            theme={{
              components: {
                Tooltip: {
                  borderRadius: 0,
                  paddingSM: 15,
                  paddingXS: 15,
                },
              },
            }}
          >
            <Tooltip
              overlayStyle={{ width: 'fit-content', maxWidth: '500px' }}
              color="#FFF"
              title={
                classObjects ? (
                  <CompositionTooltip
                    title={classObjects?.[id]?.prefLabel}
                    subclasses={classObjects?.[id]?.subClassOf}
                  />
                ) : (
                  <Spin />
                )
              }
            >
              <span className={`font-bold ${isLeaf ? 'whitespace-nowrap' : 'text-white'}`}>
                {title}
              </span>
            </Tooltip>
          </ConfigProvider>

          <ContextualTrigger
            className={isEditable ? 'mb-1 ml-1 h-max' : ''}
            about={about as QuestionAbout}
            subject={questionSubject}
            densityOrCount={densityOrCount}
          />
        </div>
        <div className={`flex items-center ${isLeaf ? 'gap-3' : 'gap-2'}`}>
          {isEditable ? (
            <CompositionInput
              composition={compositionValue}
              compositionChangeFunc={onSliderChange}
            />
          ) : (
            <span className="ml-auto text-white">{formatNumber(composition)}</span>
          )}
          {!isLeaf && trigger?.()}
        </div>
      </div>
      {isLeaf && trigger?.()}
      {isLeaf ? content?.() : content?.({ className: '-mt-3' })}
    </>
  );
}

function MeTypeDetails({
  neuronComposition,
  meTypeNavValue,
  onValueChange,
  editMode,
}: {
  neuronComposition: CalculatedCompositionNeuronGlia;
  meTypeNavValue: NavValue;
  onValueChange: (newValue: string[], path: string[]) => void;
  editMode: boolean;
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
            <NeuronCompositionEditor
              content={content}
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
              }: NeuronCompositionItem) => (
                <NeuronCompositionEditor
                  content={nestedContent}
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
            </NeuronCompositionEditor>
          )}
        </TreeNav>
      )}
    </>
  );
}

function Title({ title, onClick }: { title?: string; onClick?: () => void }) {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div className="flex items-center justify-start space-x-2 text-2xl font-bold text-white">
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

function NoVolumeAnnotations() {
  return (
    <div className="mt-48 flex flex-col gap-3 text-center">
      <MissingData className="w-full" style={{ color: '#fff' }} />
      <h3 className="text-base font-semibold text-white">
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
        />
      ) : (
        <div>Composition could not be calculated</div>
      )}
    </div>
  ) : (
    <div className="flex w-[300px] flex-col gap-5 overflow-y-auto px-6 py-6">
      {title}
      <NoVolumeAnnotations />
    </div>
  );
}

export default ExpandedRegionDetails;
