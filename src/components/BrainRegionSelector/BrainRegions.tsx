'use client';

import React, { useCallback, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { Button } from 'antd';
import { MinusOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { handleNavValueChange } from './util';
import CollapsedBrainRegionsSidebar from './CollapsedBrainRegions';
import { TitleComponentProps } from './types';
import { classNames } from '@/util/utils';
import ColorBox from '@/components/ColorBox';
import { BrainIcon } from '@/components/icons';
import TreeNav, { NavValue } from '@/components/TreeNavItem';
import {
  brainRegionsAtom,
  meshDistributionsAtom,
  setSelectedBrainRegionAtom,
} from '@/state/brain-regions';
import BrainRegionVisualizationTrigger from '@/components/BrainRegionVisualizationTrigger';

function VisualizationTrigger({ colorCode, id }: { colorCode: string; id: string }) {
  const meshDistributions = useAtomValue(meshDistributionsAtom);

  if (meshDistributions === undefined) {
    return <LoadingOutlined />;
  }

  const meshDistribution =
    meshDistributions && meshDistributions.find(({ id: distributionId }) => distributionId === id);

  if (meshDistribution && colorCode) {
    return (
      <BrainRegionVisualizationTrigger
        regionID={id}
        distribution={meshDistribution}
        colorCode={colorCode}
      />
    );
  }

  return (
    <Button
      className="border-none items-center justify-center flex"
      type="text"
      disabled
      icon={<EyeOutlined style={{ color: '#F5222D' }} />}
    />
  );
}

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
          <Button
            className="-ml-[15px] h-auto border-none flex font-bold gap-3 justify-end items-center"
            type="text"
            onKeyDown={() => id && onClick()}
            onClick={() => id && onClick()}
            icon={colorCode ? <ColorBox color={colorCode} /> : null}
          >
            <span
              className={classNames(
                className,
                'hover:bg-primary-8 hover:text-white mr-auto whitespace-pre-wrap text-left',
                isExpanded ? 'text-white' : 'text-primary-4'
              )}
            >
              {title}
            </span>
          </Button>
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
  const brainRegions = useAtomValue(brainRegionsAtom);
  const setSelectedBrainRegion = useSetAtom(setSelectedBrainRegionAtom);
  const [isRegionSelectorOpen, setIsRegionSelectorOpen] = useState<boolean>(true);
  const [brainRegionsNavValue, setNavValue] = useState<NavValue>(null);

  const onValueChange = useCallback(
    (newValue: string[], path: string[]) => {
      const callback = handleNavValueChange(brainRegionsNavValue, setNavValue);

      return callback(newValue, path);
    },
    [brainRegionsNavValue, setNavValue]
  );

  return brainRegions ? (
    <div className="bg-primary-8 flex flex-1 flex-col h-screen">
      {!isRegionSelectorOpen ? (
        <CollapsedBrainRegionsSidebar setIsRegionSelectorOpen={setIsRegionSelectorOpen} />
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
                onClick={() => setIsRegionSelectorOpen(false)}
              />
            </div>
            <div className="border-b border-white focus-within:border-primary-2 mb-10">
              <input
                type="text"
                className="block w-full py-3 text-primary-4 placeholder-primary-4 border-0 border-b border-transparent bg-transparent focus:border-primary-4 focus:ring-0"
                disabled
                placeholder="Search region..."
              />
            </div>
            <TreeNav
              items={brainRegions}
              onValueChange={onValueChange}
              value={brainRegionsNavValue}
            >
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
            </TreeNav>
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
