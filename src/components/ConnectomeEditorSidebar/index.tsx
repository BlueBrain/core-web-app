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
  selectedBrainRegionAtom,
} from '@/state/brain-regions';
import BrainAreaSwitch from '@/components/ConnectomeEditorSidebar/BrainAreaSwitch';
import { NavValue } from '@/state/brain-regions/types';
import { Nav as BrainTreeNav, Search as BrainTreeSearch } from '@/components/BrainTree';
import { BASIC_CELL_GROUPS_AND_REGIONS_ID } from '@/constants/brain-hierarchy';

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
  const navTitleRef = useRef<HTMLDivElement>(null);
  const leafIdsByRegionId = useAtomValue(leafIdsByRegionIdAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const checked = useMemo(
    () => leafIdsByRegionId[id ?? '']?.every((brId) => selectedBrainRegions.has(brId)) ?? false,
    [leafIdsByRegionId, id, selectedBrainRegions]
  );
  const selected = id && selectedBrainRegion?.id === id;

  const indeterminate = useMemo(() => {
    if (checked) return false;
    return leafIdsByRegionId[id ?? '']?.some((brId) => selectedBrainRegions.has(brId)) ?? false;
  }, [leafIdsByRegionId, id, selectedBrainRegions, checked]);

  let checkbox = null;

  if (multi && id && id !== BASIC_CELL_GROUPS_AND_REGIONS_ID) {
    if (isLeaf) checkbox = <Checkbox checked={selectedBrainRegions.has(id)} onClick={onClick} />;
    else checkbox = <Checkbox checked={checked} indeterminate={indeterminate} onClick={onClick} />;
  }

  useEffect(() => {
    if (navTitleRef.current && selected) {
      navTitleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [navTitleRef, selected]);

  return (
    <>
      <div ref={navTitleRef} className="flex items-center justify-between py-3">
        <div className="flex items-center justify-between gap-2">
          {checkbox}
          <button
            type="button"
            className="flex h-auto items-center justify-end gap-3 border-none"
            onClick={onClick}
          >
            <span
              className={classNames(
                'mr-auto whitespace-pre-wrap text-left font-bold text-white',
                className
              )}
            >
              {title}
            </span>
          </button>
        </div>

        <div className="-mr-[4px] flex items-center justify-between gap-2">
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
    <div className="flex w-[40px] flex-col items-center pt-2">
      <Button
        className="mb-2"
        type="text"
        size="small"
        icon={<PlusOutlined style={{ color: 'white' }} />}
        onClick={() => setArea('pre')}
      />
      <div
        className="flex items-center gap-x-3.5"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: '#8c8c8c',
        }}
        role="presentation"
      >
        <div
          className="mb-10 cursor-pointer text-lg"
          onClick={() => setArea('post')}
          role="presentation"
        >
          Post-synaptic{' '}
          <span className="capitalize text-highlightPost">{topSelectedPostRegion || 'Brain'}</span>
        </div>
        <div className="cursor-pointer text-lg" onClick={() => setArea('pre')} role="presentation">
          Pre-synaptic{' '}
          <span className="capitalize text-highlightPre">{topSelectedPreRegion || 'Brain'}</span>
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
  const [brainRegionsLoaded, setBrainRegionsLoaded] = useState(false);

  useEffect(() => {
    if (brainRegionsLoaded || brainRegionLeaves === null) return;

    brainRegionLeaves.forEach((l) => {
      setSelectedPreBrainRegion(l.id, l.title);
      setSelectedPostBrainRegion(l.id, l.title);
    });

    setBrainRegionsLoaded(true);
  }, [
    brainRegionLeaves,
    brainRegionsLoaded,
    setSelectedPostBrainRegion,
    setSelectedPreBrainRegion,
  ]);

  const leafTitleById = useMemo(() => {
    const map: { [id: string]: string } = {};
    brainRegionLeaves?.forEach((l) => {
      map[l.id] = l.title;
    });
    return map;
  }, [brainRegionLeaves]);

  return (
    <div className="flex h-screen flex-1 flex-col bg-black">
      {!area ? (
        <CollapsedSidebar />
      ) : (
        <div className="flex min-w-[300px] flex-1 flex-col overflow-y-auto px-7 py-6">
          <div className="grid">
            <div className="mb-7 flex items-start justify-between">
              <div className="flex items-center justify-start space-x-2 text-2xl font-bold text-white">
                <Header>
                  {area === 'post' ? (
                    <div className="text-xl text-highlightPost">Post-synaptic area</div>
                  ) : (
                    <div className="text-xl text-highlightPre">Pre-synaptic area</div>
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

            <BrainTreeSearch setValue={setNavValue} />
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
                    className="text-lg font-bold uppercase"
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
                              ? 'text-base font-light capitalize'
                              : 'text-base capitalize'
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
