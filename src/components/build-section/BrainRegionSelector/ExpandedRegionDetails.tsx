'use client';

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { arrayToTree } from 'performant-array-to-tree';
import { Button, ConfigProvider, Spin, Tooltip } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import { unwrap, loadable } from 'jotai/utils';
import ContextualTrigger from '../ContextualLiterature/Trigger';
import { getMetric } from './util';
import { NeuronCompositionEditorProps, NeuronCompositionItem } from './types';
import { handleNavValueChange } from '@/components/BrainTree/util';
import TreeNav, { NavValue } from '@/components/TreeNavItem';
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
import { cellTypesAtom } from '@/state/build-section/cell-types';

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

function CompositionTooltip({ title, subclasses }: { title?: string; subclasses?: string[] }) {
  const renderType = () => {
    if (subclasses?.includes('https://neuroshapes.org/MType')) {
      return 'M-type';
    }
    if (subclasses?.includes('https://neuroshapes.org/EType')) {
      return 'E-type';
    }
    return undefined;
  };

  if (!title || !subclasses) {
    return <div className="text-primary-8">Cell type information could not be retrieved</div>;
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="grow text-primary-8 font-bold">{title}</div>
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

  const classObjects = useAtomValue(useMemo(() => unwrap(cellTypesAtom), []));

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
            className={isEditable ? 'ml-1 h-max mb-1' : ''}
            about={about as QuestionAbout}
            subject={title}
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
      <h2 className="flex font-bold justify-between text-white text-lg">
        <span className="justify-self-start">NEURONS [{metricToUnit[densityOrCount]}]</span>
        <small className="font-normal text-base">
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

function NoVolumeAnnotations({ message }: { message: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 text-center mt-48">
      <MissingData className="w-full" style={{ color: '#fff' }} />
      {message}
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
  const composition = useAtomValue(useMemo(() => loadable(analysedCompositionAtom), []));
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
  if (composition.state === 'loading') {
    return <Spin />;
  }
  if (composition.state === 'hasError') {
    return (
      <div className="flex flex-col gap-5 overflow-y-auto px-6 py-6 w-[300px]">
        {title}
        <NoVolumeAnnotations
          message={
            <h3 className="font-semibold text-base text-white">
              Cell composition could not be fetched
            </h3>
          }
        />
      </div>
    );
  }

  return brainRegion.representedInAnnotation && composition.data?.totalComposition.neuron ? (
    <div className="flex flex-col gap-5 overflow-y-auto px-6 py-6 min-w-[300px]">
      {title}
      <UnitsToggle
        isChecked={densityOrCount === 'count'}
        onChange={(checked: boolean) => {
          const toSet = checked ? 'count' : 'density';
          setDensityOrCount(toSet);
        }}
      />
      {composition.data ? (
        <MeTypeDetails
          neuronComposition={composition.data.totalComposition}
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
      <NoVolumeAnnotations
        message={
          <h3 className="font-semibold text-base text-white">
            No volume annotations
            <br />
            available for this brain region
          </h3>
        }
      />
    </div>
  );
}

export default ExpandedRegionDetails;
