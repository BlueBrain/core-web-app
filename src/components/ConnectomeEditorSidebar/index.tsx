import React, { useRef, RefObject, ReactNode, useMemo, useState, useEffect } from 'react';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import { useSetAtom, useAtomValue } from 'jotai';
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
  brainRegionLeavesUnsortedArrayAtom,
  leafIdsByRegionIdAtom,
} from '@/state/brain-regions';
import BrainAreaSwitch from '@/components/ConnectomeEditorSidebar/BrainAreaSwitch';
import { NavValue } from '@/components/TreeNavItem';
import { Nav as BrainTreeNav, Search as BrainTreeSearch } from '@/components/BrainTree';

function NavTitle({
  className,
  id,
  onClick,
  title,
  trigger, // A callback that returns the <Accordion.Trigger/>
  content, // A callback that returns the <Accordion.Content/>
  multi = false,
  selectedBrainRegions,
  isLeaf,
}: TitleComponentProps) {
  const leafIdsByRegionId = useAtomValue(leafIdsByRegionIdAtom);
  const checked = useMemo(
    () => leafIdsByRegionId[id ?? '']?.every((brId) => selectedBrainRegions.has(brId)) ?? false,
    [leafIdsByRegionId, id, selectedBrainRegions]
  );

  const indeterminate = useMemo(() => {
    if (checked) return false;
    return leafIdsByRegionId[id ?? '']?.some((brId) => selectedBrainRegions.has(brId)) ?? false;
  }, [leafIdsByRegionId, id, selectedBrainRegions, checked]);

  let checkbox = null;

  if (multi && id && id !== '8') {
    if (isLeaf) checkbox = <Checkbox checked={selectedBrainRegions.has(id)} />;
    else checkbox = <Checkbox checked={checked} indeterminate={indeterminate} />;
  }

  return (
    <>
      <div className="py-3 flex justify-between items-center">
        <div className="flex gap-2 justify-between items-center">
          {checkbox}
          <button
            type="button"
            className="h-auto border-none flex gap-3 justify-end items-center"
            onClick={onClick}
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
  const brainRegionLeaves = useAtomValue(brainRegionLeavesUnsortedArrayAtom);
  const leafIdsByRegionId = useAtomValue(leafIdsByRegionIdAtom);
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

  useEffect(() => {
    if (!brainRegionLeaves) return;
    brainRegionLeaves.forEach((l) => {
      setSelectedPreBrainRegion(l.id, l.title);
      setSelectedPostBrainRegion(l.id, l.title);
    });
  }, [brainRegionLeaves, setSelectedPostBrainRegion, setSelectedPreBrainRegion]);

  const leafTitleById = useMemo(() => {
    const map: { [id: string]: string } = {};
    brainRegionLeaves?.forEach((l) => {
      map[l.id] = l.title;
    });
    return map;
  }, [brainRegionLeaves]);

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
              {({
                colorCode,
                id,
                isExpanded,
                title,
                trigger,
                content,
                items,
                // eslint-disable-next-line arrow-body-style
              }) => {
                return (
                  <NavTitle
                    className="font-bold uppercase text-lg"
                    colorCode={colorCode}
                    id={id}
                    title={title}
                    isExpanded={isExpanded}
                    trigger={trigger}
                    content={content}
                    multi={!!area}
                    selectedBrainRegions={selectedBrainRegions}
                    isLeaf={!items || items.length === 0}
                  >
                    {({
                      colorCode: nestedColorCode,
                      id: nestedId,
                      isExpanded: nestedIsExpanded,
                      title: nestedTitle,
                      trigger: nestedTrigger,
                      content: nestedContent,
                      items: nestedItems,
                      // eslint-disable-next-line arrow-body-style
                    }) => {
                      return (
                        <NavTitle
                          className={
                            !nestedIsExpanded
                              ? 'capitalize text-base font-light'
                              : 'capitalize text-base'
                          }
                          onClick={() => {
                            const setFun =
                              area === 'post'
                                ? setSelectedPostBrainRegion
                                : setSelectedPreBrainRegion;
                            if (!nestedItems || nestedItems.length === 0)
                              setFun(nestedId, nestedTitle);
                            else {
                              const leafIds = leafIdsByRegionId[nestedId] ?? [];
                              const some = leafIds.some((rId) => selectedBrainRegions.has(rId));
                              leafIds.forEach((lid) => {
                                const leafTitle = leafTitleById[lid];
                                if (some) {
                                  if (selectedBrainRegions.has(lid)) setFun(lid, leafTitle); // Delete selected
                                } else setFun(lid, leafTitle); // Select everything
                              });
                            }
                          }}
                          colorCode={nestedColorCode}
                          id={nestedId}
                          title={nestedTitle}
                          isExpanded={nestedIsExpanded}
                          trigger={nestedTrigger}
                          content={nestedContent}
                          multi={!!area}
                          selectedBrainRegions={selectedBrainRegions}
                          isLeaf={!nestedItems || nestedItems.length === 0}
                        />
                      );
                    }}
                  </NavTitle>
                );
              }}
            </BrainTreeNav>
          </div>
        </div>
      )}
    </div>
  );
}
