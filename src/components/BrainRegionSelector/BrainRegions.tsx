'use client';

import React, { useCallback, useRef, RefObject, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { Button, Checkbox } from 'antd';
import { MinusOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { set } from 'lodash/fp';
import { handleNavValueChange } from './util';
import CollapsedBrainRegionsSidebar from './CollapsedBrainRegions';
import { TitleComponentProps } from './types';
import Search from './Search';
import { classNames } from '@/util/utils';
import ColorBox from '@/components/ColorBox';
import { BrainIcon } from '@/components/icons';
import TreeNav, { NavValue } from '@/components/TreeNavItem';
import {
  brainRegionsFilteredTreeAtom,
  meshDistributionsAtom,
  setSelectedBrainRegionAtom,
} from '@/state/brain-regions';
import BrainRegionVisualizationTrigger from '@/components/BrainRegionVisualizationTrigger';

function VisualizationTrigger({ colorCode, id }: { colorCode: string; id: string }) {
  const meshDistributions = useAtomValue(meshDistributionsAtom);

  if (meshDistributions === undefined) {
    return <LoadingOutlined />;
  }

  const meshDistribution = meshDistributions && meshDistributions[id];

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
  multi = false,
  selectedBrainRegionIds,
}: TitleComponentProps) {
  let checkbox = null;
  if (multi && !!selectedBrainRegionIds && id)
    checkbox = <Checkbox checked={selectedBrainRegionIds.has(id)} />;

  return (
    <>
      <div className="py-3 flex justify-between items-center">
        <div className="flex gap-2 justify-between items-center">
          {checkbox}
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

export function ExpandedBrainRegionsSidebar({
  setIsRegionSelectorOpen,
  setSelectedBrainRegion,
  header,
  selectedBrainRegionIds,
}: {
  header?: React.ReactNode;
  selectedBrainRegionIds?: Set<string>;
  setIsRegionSelectorOpen: (value: boolean) => void;
  setSelectedBrainRegion: (
    selectedBrainRegionId: string,
    selectedBrainRegionTitle: string,
    selectedBrainRegionLeaves: string[] | null
  ) => void;
}) {
  const multi = !!header;
  const brainRegions = useAtomValue(brainRegionsFilteredTreeAtom);
  const [brainRegionsNavValue, setNavValue] = useState<NavValue>(null);

  const brainRegionsRef: RefObject<HTMLDivElement> = useRef(null);
  const onValueChange = useCallback(
    (newValue: string[], path: string[]) => {
      const callback = handleNavValueChange(brainRegionsNavValue, setNavValue);

      return callback(newValue, path);
    },
    [brainRegionsNavValue, setNavValue]
  );

  if (!brainRegions) return null;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-7 py-6 min-w-[300px]">
      <div className="grid">
        <div className="flex justify-between mb-7 items-start">
          <div className="flex space-x-2 justify-start items-center text-2xl text-white font-bold">
            {header}
            {!header && (
              <>
                <BrainIcon style={{ height: '1em' }} />
                <span>Brain region</span>
              </>
            )}
          </div>
          <Button
            type="text"
            size="small"
            icon={<MinusOutlined style={{ color: 'white' }} />}
            onClick={() => setIsRegionSelectorOpen(false)}
          />
        </div>
        <Search
          onSelect={(_labeledValue, option) => {
            const { ancestors, value, label, leaves } = option;

            setNavValue(
              set(
                ancestors ?? [],
                null,
                brainRegionsNavValue ?? {} // Preserve any already expanded items
              )
            );

            setSelectedBrainRegion(value, label, leaves ?? null);

            // This timeout seems to be necessary to "wait" until the nav item has been rendered before attemping to scroll to it.
            setTimeout(() => {
              const selectedNavItem = brainRegionsRef?.current?.querySelector(
                `[data-tree-id="${value}"]`
              );

              selectedNavItem?.scrollIntoView();
            }, 500);
          }}
        />
        <TreeNav
          items={brainRegions}
          onValueChange={onValueChange}
          ref={brainRegionsRef}
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
              multi={multi}
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
                  multi={multi}
                  selectedBrainRegionIds={selectedBrainRegionIds}
                />
              )}
            </NavTitle>
          )}
        </TreeNav>
      </div>
    </div>
  );
}

export default function BrainRegions() {
  const brainRegionsTree = useAtomValue(brainRegionsFilteredTreeAtom);
  const setSelectedBrainRegion = useSetAtom(setSelectedBrainRegionAtom);
  const [isRegionSelectorOpen, setIsRegionSelectorOpen] = useState<boolean>(true);

  return brainRegionsTree ? (
    <div className="bg-primary-8 flex flex-1 flex-col h-screen">
      {!isRegionSelectorOpen ? (
        <CollapsedBrainRegionsSidebar setIsRegionSelectorOpen={setIsRegionSelectorOpen} />
      ) : (
        <ExpandedBrainRegionsSidebar
          setIsRegionSelectorOpen={setIsRegionSelectorOpen}
          setSelectedBrainRegion={setSelectedBrainRegion}
        />
      )}
    </div>
  ) : (
    <div className="bg-primary-8 h-screen w-[40px] text-neutral-1 text-3xl flex justify-center items-center">
      <LoadingOutlined />
    </div>
  );
}
