'use client';

import React, { RefObject, useRef, useState, useMemo, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { Button } from 'antd';
import { MinusOutlined, LoadingOutlined } from '@ant-design/icons';
import CollapsedBrainRegionsSidebar from './CollapsedBrainRegions';
import { TitleComponentProps } from './types';
import AlternateViewSelector from './AlternateViewSelector';
import { classNames } from '@/util/utils';
import { BrainIcon } from '@/components/icons';
import { Nav as BrainTreeNav, Search as BrainTreeSearch } from '@/components/BrainTree';
import {
  brainRegionOntologyViewsAtom,
  selectedBrainRegionAtom,
  setSelectedBrainRegionAtom,
  brainRegionsAtom,
  brainRegionsAlternateTreeAtom,
} from '@/state/brain-regions';
import { NavValue } from '@/components/TreeNavItem';
import { BrainRegion } from '@/types/ontologies';
import ColorBox from '@/components/build-section/BrainRegionSelector/ColorBox';
import VisualizationTrigger from '@/components/build-section/BrainRegionSelector/VisualizationTrigger';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import { resetAtlasVisualizationAtom } from '@/state/atlas/atlas';

function NavTitle({
  className,
  colorCode,
  id,
  onClick = () => {},
  title,
  isExpanded,
  trigger, // A callback that returns the <Accordion.Trigger/>
  content, // A callback that returns the <Accordion.Content/>
  viewId,
}: TitleComponentProps) {
  const brainRegionViews = useAtomValue(brainRegionOntologyViewsAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brainRegions = useAtomValue(brainRegionsAtom);

  const selectOptions = brainRegionViews?.map((view) => {
    const brainRegion = brainRegions?.find((br) => br.id === id);
    const isDisabled = !!(brainRegion && !brainRegion[view.childrenProperty as keyof BrainRegion]);

    return {
      value: view.id,
      label: view.title,
      isDisabled,
    };
  });

  const defaultViewOption = useMemo(
    () => selectOptions?.find((view) => view.value === viewId),
    [selectOptions, viewId]
  );

  return (
    <>
      <div className="py-3 flex items-center justify-between">
        <button
          type="button"
          className="h-auto border-none flex font-bold gap-3 justify-end items-center"
          onClick={() => id && onClick()}
        >
          {colorCode && <ColorBox color={colorCode} />}
          <span
            className={classNames(
              'hover:text-white mr-auto whitespace-pre-wrap text-left',
              isExpanded || selectedBrainRegion?.id === id ? 'text-white' : 'text-primary-4',
              className
            )}
          >
            {title}
          </span>
        </button>
        <div className="-mr-[4px] ml-[6px] flex gap-2 justify-between items-center">
          <AlternateViewSelector
            brainRegionViews={brainRegionViews}
            defaultViewOption={defaultViewOption}
            id={id}
            selectOptions={selectOptions}
            selectedBrainRegion={selectedBrainRegion?.id}
          />
          {id && colorCode && <VisualizationTrigger colorCode={colorCode} id={id} />}
          {trigger?.()}
        </div>
      </div>
      {content?.({ className: '-mt-3 divide-y divide-primary-6' })}
    </>
  );
}

export default function BrainRegions() {
  const brainRegionsTree = useAtomValue(brainRegionsAlternateTreeAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const resetBrainRegion = useSetAtom(selectedBrainRegionAtom);
  const setSelectedBrainRegion = useSetAtom(setSelectedBrainRegionAtom);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [navValue, setNavValue] = useState<NavValue>(null);
  const brainTreeNavRef: RefObject<HTMLDivElement> = useRef(null);
  const brainModelConfigId = useAtomValue(brainModelConfigIdAtom);
  const [localSelectedBrainModelConfigId, setLocalSelectedBrainModelConfigId] = useState('');
  const setResetAtlasVisualization = useSetAtom(resetAtlasVisualizationAtom);

  useEffect(() => {
    if (!brainModelConfigId) return;
    if (brainModelConfigId === localSelectedBrainModelConfigId) return;

    setLocalSelectedBrainModelConfigId(brainModelConfigId);
    setNavValue(null); // reset tree
    resetBrainRegion(null); // reset brain region
    setResetAtlasVisualization(); // reset meshes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brainModelConfigId, localSelectedBrainModelConfigId]);

  return brainRegionsTree ? (
    <div className="bg-primary-8 flex flex-1 flex-col h-full">
      {isCollapsed ? (
        <CollapsedBrainRegionsSidebar setIsCollapsed={setIsCollapsed} />
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto px-7 py-6 min-w-[300px]">
          <div className="grid">
            <div className="flex justify-between mb-7 items-start">
              <div className="flex space-x-2 justify-start items-center text-2xl text-white font-bold">
                <BrainIcon style={{ height: '1em' }} />
                <span>Brain region</span>
              </div>
              <Button
                type="text"
                size="small"
                icon={<MinusOutlined style={{ color: 'white' }} />}
                onClick={() => setIsCollapsed(true)}
              />
            </div>
            <BrainTreeSearch
              brainTreeNav={brainTreeNavRef?.current}
              setValue={setNavValue}
              value={navValue}
            />
            <BrainTreeNav ref={brainTreeNavRef} setValue={setNavValue} value={navValue}>
              {({
                colorCode,
                id,
                isExpanded,
                title,
                leaves,
                trigger,
                content,
                view,
                representedInAnnotation,
                itemsInAnnotation,
              }) => (
                <NavTitle
                  className="uppercase text-lg"
                  colorCode={colorCode}
                  id={id}
                  onClick={() =>
                    leaves && setSelectedBrainRegion(id, title, leaves, representedInAnnotation)
                  }
                  title={title}
                  isExpanded={isExpanded}
                  isHidden={!representedInAnnotation && !itemsInAnnotation}
                  trigger={trigger}
                  content={content}
                  selectedBrainRegion={selectedBrainRegion}
                  viewId={view}
                >
                  {({
                    colorCode: nestedColorCode,
                    id: nestedId,
                    isExpanded: nestedIsExpanded,
                    title: nestedTitle,
                    trigger: nestedTrigger,
                    content: nestedContent,
                    leaves: nestedLeaves,
                    view: nestedView,
                    representedInAnnotation: nestedRepresentedInAnnotation,
                    itemsInAnnotation: nestedItemsInAnnotation,
                  }) => (
                    <NavTitle
                      className="capitalize text-base"
                      onClick={() =>
                        setSelectedBrainRegion(
                          nestedId,
                          nestedTitle,
                          nestedLeaves,
                          nestedRepresentedInAnnotation
                        )
                      }
                      colorCode={nestedColorCode}
                      id={nestedId}
                      title={nestedTitle}
                      isExpanded={nestedIsExpanded}
                      isHidden={!nestedRepresentedInAnnotation && !nestedItemsInAnnotation}
                      trigger={nestedTrigger}
                      content={nestedContent}
                      selectedBrainRegion={selectedBrainRegion}
                      viewId={nestedView}
                    />
                  )}
                </NavTitle>
              )}
            </BrainTreeNav>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="bg-primary-8 h-screen w-[40px] text-neutral-1 text-3xl flex justify-center items-center">
      <LoadingOutlined />
    </div>
  );
}
