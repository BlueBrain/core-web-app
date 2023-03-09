import React, { useRef, RefObject, ReactNode, useMemo, useState } from 'react';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import { useSetAtom, useAtomValue } from 'jotai/react';
import { TitleComponentProps } from './types';
import { BrainRegion } from '@/types/ontologies';
import brainAreaAtom from '@/state/connectome-editor/sidebar';
import { classNames } from '@/util/utils';
import {
  setSelectedPostBrainRegionAtom,
  setSelectedPreBrainRegionAtom,
  selectedPreBrainRegionsAtom,
  selectedPostBrainRegionsAtom,
  brainRegionsFilteredTreeAtom,
} from '@/state/brain-regions';
import BrainAreaSwitch from '@/components/ConnectomeEditorSidebar/BrainAreaSwitch';
import { NavValue } from '@/components/TreeNavItem';
import { Nav as BrainTreeNav, Search as BrainTreeSearch } from '@/components/BrainTree';

function NavTitle({
  className,
  id,
  onClick = () => {},
  title,
  trigger, // A callback that returns the <Accordion.Trigger/>
  content, // A callback that returns the <Accordion.Content/>
  multi = false,
  selectedBrainRegions,
}: TitleComponentProps) {
  let checkbox = null;

  if (multi && id) checkbox = <Checkbox checked={selectedBrainRegions.has(id)} />;

  return (
    <>
      <div className="py-3 flex justify-between items-center">
        <div className="flex gap-2 justify-between items-center">
          {checkbox}
          <button
            type="button"
            className="h-auto border-none flex gap-3 justify-end items-center"
            onClick={() => id && onClick()}
          >
            <span
              className={classNames(
                'font-bold mr-auto text-left text-white whitespace-pre-wrap',
                className
              )}
            >
              {title}
            </span>
          </button>
        </div>

        <div className="-mr-[4px] flex gap-2 justify-between items-center">
          {trigger?.({ fill: '#fff' })}
        </div>
      </div>
      {content?.({ className: '-mt-3 divide-y divide-neutral-7' })}
    </>
  );
}

function Header({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="text-base font-thin">Select the</div>
      {children}
    </div>
  );
}

// Finds the selected brain regions closest to the root of the tree
function findTopSelectedRegion(selectedRegions: Map<string, string>, tree: BrainRegion[] | null) {
  if (!selectedRegions.size) return '';

  const queue = [...(tree ?? [])];

  while (queue.length) {
    const region = queue.shift();
    if (region && selectedRegions.has(region.id)) return region.title;
    region?.items?.forEach((r) => queue.push(r));
  }

  return '';
}

function CollapsedSidebar() {
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);
  const tree = useAtomValue(brainRegionsFilteredTreeAtom);
  const setArea = useSetAtom(brainAreaAtom);
  const [topSelectedPreRegion, topSelectedPostRegion]: [string, string] = useMemo(
    () => [
      findTopSelectedRegion(preSynapticBrainRegions, tree),
      findTopSelectedRegion(postSynapticBrainRegions, tree),
    ],
    [preSynapticBrainRegions, postSynapticBrainRegions, tree]
  );

  return (
    <div className="flex flex-col items-center pt-2 w-[40px]">
      <Button
        className="mb-4"
        type="text"
        size="small"
        icon={<PlusOutlined style={{ color: 'white' }} />}
        onClick={() => setArea('pre')}
      />
      <div
        className="flex gap-x-3.5 items-center"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: '#8c8c8c',
        }}
        role="presentation"
      >
        <div
          className="text-lg mb-10 cursor-pointer"
          onClick={() => setArea('post')}
          role="presentation"
        >
          Post-synaptic{' '}
          <span className="text-highlightPost capitalize">{topSelectedPostRegion || 'Brain'}</span>
        </div>
        <div className="text-lg cursor-pointer" onClick={() => setArea('pre')} role="presentation">
          Pre-synaptic{' '}
          <span className="text-highlightPre capitalize">{topSelectedPreRegion || 'Brain'}</span>
        </div>
      </div>
    </div>
  );
}

export default function ConnectomeEditorSidebar() {
  const area = useAtomValue(brainAreaAtom);
  const setSelectedPreBrainRegion = useSetAtom(setSelectedPreBrainRegionAtom);
  const setSelectedPostBrainRegion = useSetAtom(setSelectedPostBrainRegionAtom);
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);
  const [navValue, setNavValue] = useState<NavValue>(null);
  const brainTreeNavRef: RefObject<HTMLDivElement> = useRef(null);
  const setArea = useSetAtom(brainAreaAtom);
  let selectedBrainRegions: Map<string, string> = new Map();
  if (area === 'post') selectedBrainRegions = postSynapticBrainRegions;
  if (area === 'pre') selectedBrainRegions = preSynapticBrainRegions;

  return (
    <div className="bg-black flex flex-1 flex-col h-screen">
      {!area ? (
        <CollapsedSidebar />
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto px-7 py-6 min-w-[300px]">
          <div className="grid">
            <div className="flex justify-between mb-7 items-start">
              <div className="flex space-x-2 justify-start items-center text-2xl text-white font-bold">
                <Header>
                  {area === 'post' ? (
                    <div className="text-highlightPost text-xl">Post-synaptic area</div>
                  ) : (
                    <div className="text-highlightPre text-xl">Pre-synaptic area</div>
                  )}
                </Header>
              </div>
              <Button
                type="text"
                size="small"
                icon={<MinusOutlined style={{ color: 'white' }} />}
                onClick={() => setArea(null)}
              />
            </div>

            <BrainAreaSwitch />

            <BrainTreeSearch
              brainTreeNav={brainTreeNavRef?.current}
              setValue={setNavValue}
              value={navValue}
            />
            <BrainTreeNav ref={brainTreeNavRef} setValue={setNavValue} value={navValue}>
              {({ colorCode, id, isExpanded, title, leaves, trigger, content }) => (
                <NavTitle
                  className="font-bold uppercase text-lg"
                  colorCode={colorCode}
                  id={id}
                  onClick={() =>
                    leaves && area === 'post'
                      ? setSelectedPostBrainRegion(id, title)
                      : setSelectedPreBrainRegion(id, title)
                  }
                  title={title}
                  isExpanded={isExpanded}
                  trigger={trigger}
                  content={content}
                  multi={!!area}
                  selectedBrainRegions={selectedBrainRegions}
                >
                  {({
                    colorCode: nestedColorCode,
                    id: nestedId,
                    isExpanded: nestedIsExpanded,
                    title: nestedTitle,
                    trigger: nestedTrigger,
                    content: nestedContent,
                  }) => (
                    <NavTitle
                      className={
                        !nestedIsExpanded
                          ? 'capitalize text-base font-light'
                          : 'capitalize text-base'
                      }
                      onClick={() =>
                        leaves && area === 'post'
                          ? setSelectedPostBrainRegion(nestedId, nestedTitle)
                          : setSelectedPreBrainRegion(nestedId, nestedTitle)
                      }
                      colorCode={nestedColorCode}
                      id={nestedId}
                      title={nestedTitle}
                      isExpanded={nestedIsExpanded}
                      trigger={nestedTrigger}
                      content={nestedContent}
                      multi={!!area}
                      selectedBrainRegions={selectedBrainRegions}
                    />
                  )}
                </NavTitle>
              )}
            </BrainTreeNav>
          </div>
        </div>
      )}
    </div>
  );
}
