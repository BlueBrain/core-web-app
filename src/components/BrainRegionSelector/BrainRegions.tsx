'use client';

import React, { RefObject, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { Button } from 'antd';
import { MinusOutlined, LoadingOutlined } from '@ant-design/icons';
import CollapsedBrainRegionsSidebar from './CollapsedBrainRegions';
import { TitleComponentProps } from './types';
import { classNames } from '@/util/utils';
import ColorBox from '@/components/ColorBox';
import { BrainIcon } from '@/components/icons';
import { Nav as BrainTreeNav, Search as BrainTreeSearch } from '@/components/BrainTree';
import { brainRegionsFilteredTreeAtom, setSelectedBrainRegionAtom } from '@/state/brain-regions';
import VisualizationTrigger from '@/components/VisualizationTrigger';
import { NavValue } from '@/components/TreeNavItem';

function NavTitle({
  className,
  colorCode,
  id,
  onClick = () => {},
  title,
  isExpanded,
  trigger, // A callback that returns the <Accordion.Trigger/>
  content, // A callback that returns the <Accordion.Content/>
}: TitleComponentProps) {
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
                isExpanded ? 'text-white' : 'text-primary-4'
              )}
            >
              {title}
            </span>
          </button>
        </div>

        <div className="-mr-[4px] flex gap-2 justify-between items-center">
          {id && colorCode && <VisualizationTrigger colorCode={colorCode} id={id} />}
          {trigger?.()}
        </div>
      </div>
      {content?.({ className: '-mt-3 divide-y divide-primary-6' })}
    </>
  );
}

export default function BrainRegions() {
  const brainRegionsTree = useAtomValue(brainRegionsFilteredTreeAtom);
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
              {({ colorCode, id, isExpanded, title, leaves, trigger, content }) => (
                <NavTitle
                  className="uppercase text-lg"
                  colorCode={colorCode}
                  id={id}
                  onClick={() => leaves && setSelectedBrainRegion(id, title, leaves)}
                  title={title}
                  isExpanded={isExpanded}
                  trigger={trigger}
                  content={content}
                >
                  {({
                    colorCode: nestedColorCode,
                    id: nestedId,
                    isExpanded: nestedIsExpanded,
                    title: nestedTitle,
                    trigger: nestedTrigger,
                    content: nestedContent,
                    leaves: nestedLeaves,
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
