'use client';

import React, { RefObject, useRef, useState, useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { Button } from 'antd';
import { MinusOutlined, LoadingOutlined } from '@ant-design/icons';
import CollapsedBrainRegionsSidebar from './CollapsedBrainRegions';
import { TitleComponentProps } from './types';
import { classNames } from '@/util/utils';
import ColorBox from '@/components/ColorBox';
import { BrainIcon } from '@/components/icons';
import { Nav as BrainTreeNav, Search as BrainTreeSearch } from '@/components/BrainTree';
import {
  brainRegionOntologyViewsAtom,
  selectedBrainRegionAtom,
  setSelectedBrainRegionAtom,
  brainRegionsAtom,
  brainRegionsAlternateTreeAtom,
  addOrRemoveSelectedAlternateView,
} from '@/state/brain-regions';
import VisualizationTrigger from '@/components/VisualizationTrigger';
import { NavValue } from '@/components/TreeNavItem';
import { BrainRegion } from '@/types/ontologies';
import SelectDropdown from '@/components/SelectDropdown';

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
  const changeSelectedViews = useSetAtom(addOrRemoveSelectedAlternateView);
  const brainRegions = useAtomValue(brainRegionsAtom);

  const selectOptions = brainRegionViews?.map((view) => {
    const brainRegion = brainRegions?.find((br) => br.id === id);
    const isDisabled = !!(brainRegion && !brainRegion[view.childrenProperty as keyof BrainRegion]);

    return {
      value: view.id,
      label: view.title,
      // ts-ignore
      isDisabled,
    };
  });

  const defaultViewOption = useMemo(
    () => selectOptions?.find((view) => view.value === viewId),
    [selectOptions, viewId]
  );

  /**
   * Function to trigger the changing of view
   * @param newViewId the selected view id
   */
  const onChangeViewSelection = (newViewId: string) => {
    if (id) {
      changeSelectedViews(newViewId, id);
    }
  };

  return (
    <>
      <div className="py-3 flex justify-between items-center">
        <div className="flex gap-2 justify-between items-center">
          <button
            type="button"
            className="h-auto border-none flex font-bold gap-3 justify-end items-center"
            onClick={() => id && onClick()}
          >
            {colorCode ? <ColorBox color={colorCode} /> : null}
            <span
              className={classNames(
                className,
                'hover:text-white mr-auto whitespace-pre-wrap text-left',
                isExpanded || selectedBrainRegion?.id === id ? 'text-white' : 'text-primary-4'
              )}
            >
              {title}
            </span>
          </button>
        </div>

        <div className="-mr-[4px] ml-[6px] flex gap-2 justify-between items-center">
          {id === selectedBrainRegion?.id &&
          brainRegionViews &&
          selectOptions &&
          defaultViewOption ? (
            <SelectDropdown
              defaultOption={defaultViewOption}
              selectOptions={selectOptions}
              onChangeFunc={onChangeViewSelection}
            />
          ) : null}

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
  const setSelectedBrainRegion = useSetAtom(setSelectedBrainRegionAtom);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [navValue, setNavValue] = useState<NavValue>(null);
  const brainTreeNavRef: RefObject<HTMLDivElement> = useRef(null);

  return brainRegionsTree ? (
    <div className="bg-primary-8 flex flex-1 flex-col h-screen">
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
              {({ colorCode, id, isExpanded, title, leaves, trigger, content, view }) => (
                <NavTitle
                  className="uppercase text-lg"
                  colorCode={colorCode}
                  id={id}
                  onClick={() => leaves && setSelectedBrainRegion(id, title, leaves)}
                  title={title}
                  isExpanded={isExpanded}
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
                  }) => (
                    <NavTitle
                      className="capitalize text-base"
                      onClick={() => setSelectedBrainRegion(nestedId, nestedTitle, nestedLeaves)}
                      colorCode={nestedColorCode}
                      id={nestedId}
                      title={nestedTitle}
                      isExpanded={nestedIsExpanded}
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
