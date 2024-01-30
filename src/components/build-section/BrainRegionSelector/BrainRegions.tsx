'use client';

import { RefObject, useRef, useState, useMemo, useEffect } from 'react';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import { Button } from 'antd';
import { MinusOutlined, LoadingOutlined } from '@ant-design/icons';
import { unwrap, useResetAtom } from 'jotai/utils';

import CollapsedBrainRegionsSidebar from './CollapsedBrainRegions';
import { TitleComponentProps } from './types';
import AlternateViewSelector from './AlternateViewSelector';
import { classNames, brainRegionTitleCaseExceptConjunctions } from '@/util/utils';
import { BrainIcon } from '@/components/icons';
import { Nav as BrainTreeNav, Search as BrainTreeSearch } from '@/components/BrainTree';
import {
  brainRegionOntologyViewsAtom,
  selectedBrainRegionAtom,
  setSelectedBrainRegionAtom,
  brainRegionsAtom,
  brainRegionsAlternateTreeAtom,
  brainRegionSidebarIsCollapsedAtom,
  brainRegionHierarchyStateAtom,
  resetSelectedBrainRegionAtom,
} from '@/state/brain-regions';
import { NavValue } from '@/state/brain-regions/types';
import { BrainRegion } from '@/types/ontologies';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import { atlasVisualizationAtom } from '@/state/atlas/atlas';
import { sectionAtom } from '@/state/application';
import { useExpandRegionTree, useSetBrainRegionToQuery } from '@/hooks/brain-region-panel';

/**
 * the line component is added for each NavTitle with absolue position
 * the height is calculated based on the container "NavTitle" height and the bottom padding of the title
 * we added some space to the top to not be too close to the title
 * @param TreeLineBar.height is the height of the title component
 * @returns absolute postionned dashed line
 */
function TreeLineBar({ show, height }: { show: boolean; height?: number }) {
  if (!show) return null;
  return (
    <div
      className="absolute w-px border-l border-dashed border-primary-4 left-px"
      style={
        height
          ? {
              top: `calc(${height}px - 0.75rem + .25rem)`,
              height: `calc(100% - ${height}px - 0.75rem + .25rem)`,
            }
          : {}
      }
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
  viewId,
}: TitleComponentProps) {
  const section = useAtomValue(sectionAtom);
  if (!section) {
    throw new Error('Section is not set');
  }

  const brainRegionViews = useAtomValue(brainRegionOntologyViewsAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brainRegions = useAtomValue(brainRegionsAtom);
  const navTitleRef = useRef<HTMLDivElement>(null);
  const [height, setTitleHeight] = useState<number>(0);

  const selected = id && selectedBrainRegion?.id === id;

  const viewOptions = brainRegionViews?.map((view) => {
    const brainRegion = brainRegions?.find((br) => br.id === id);
    const isDisabled = !!(brainRegion && !brainRegion[view.childrenProperty as keyof BrainRegion]);

    return {
      value: view.id,
      label: view.title,
      isDisabled,
    };
  });

  const defaultViewOption = useMemo(
    () => viewOptions?.find((view) => view.value === viewId),
    [viewOptions, viewId]
  );

  useEffect(() => {
    if (!navTitleRef || !navTitleRef.current) return;
    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const currentTitle = entries[0];
      setTitleHeight(currentTitle.target.clientHeight);
    });
    resizeObserver.observe(navTitleRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [navTitleRef]);

  useEffect(() => {
    if (navTitleRef.current && selected) {
      navTitleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [navTitleRef, selected]);

  return (
    <>
      <div ref={navTitleRef} className="py-3 first:border-none group">
        <div
          className={classNames(
            'w-full flex items-center justify-between py-1 rounded-full gap-x-1',
            '[&:has(.brain-regions-views-open)]:rounded-md [&:has(.brain-regions-views-open)]:items-start will-change-[transform,height]',
            '[&:has(.brain-regions-views-open)]:transition-background [&:has(.brain-regions-views-open)]:ease-out [&:has(.brain-regions-views-open)]:py-3',
            selected && 'px-2 transition-all ease-out duration-200 hover:shadow-md'
          )}
          style={selected ? { backgroundColor: colorCode } : {}}
        >
          <button
            type="button"
            className="flex items-center justify-end h-auto gap-3 font-bold border-none"
            onClick={() => id && onClick()}
          >
            <span
              title={title}
              className={classNames(
                'mr-auto whitespace-pre-wrap text-left',
                isExpanded || selectedBrainRegion?.id === id
                  ? !selected && 'text-primary-4 font-medium'
                  : !selected && 'text-primary-1 font-light',
                selected && 'font-bold text-primary-8 line-clamp-1',
                className
              )}
            >
              {title}
            </span>
          </button>
          <div
            className={classNames(
              'flex gap-2 justify-between items-center',
              '[&:not(:has(button.accordion-trigger))]:pr-6 [&:has(.brain-regions-views-open)]:items-start'
            )}
          >
            <AlternateViewSelector
              selectedBrainRegion={selectedBrainRegion?.id}
              {...{
                id,
                colorCode,
                brainRegionViews,
                defaultViewOption,
                viewOptions,
              }}
            />
            {trigger?.()}
          </div>
        </div>
      </div>
      <TreeLineBar show={isExpanded} height={height} />
      {content?.({ className: '-mt-3 divide-y divide-primary-6' })}
    </>
  );
}

export default function BrainRegions() {
  const brainRegionsTree = useAtomValue(useMemo(() => unwrap(brainRegionsAlternateTreeAtom), []));
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const setSelectedBrainRegion = useSetAtom(setSelectedBrainRegionAtom);
  const [isCollapsed, setIsCollapsed] = useAtom(brainRegionSidebarIsCollapsedAtom);
  const [brainRegionHierarchyState, setBrainRegionHierarchyState] = useAtom<NavValue>(
    brainRegionHierarchyStateAtom
  );
  const brainTreeNavRef: RefObject<HTMLDivElement> = useRef(null);
  const brainModelConfigId = useAtomValue(brainModelConfigIdAtom);
  const [localSelectedBrainModelConfigId, setLocalSelectedBrainModelConfigId] = useState('');
  const setResetAtlasVisualization = useResetAtom(atlasVisualizationAtom);
  const resetSelectedBrainRegion = useSetAtom(resetSelectedBrainRegionAtom);
  useExpandRegionTree();
  useSetBrainRegionToQuery();

  useEffect(() => {
    if (!brainModelConfigId) return;
    if (brainModelConfigId === localSelectedBrainModelConfigId) return;

    setLocalSelectedBrainModelConfigId(brainModelConfigId);
    setResetAtlasVisualization(); // reset meshes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brainModelConfigId, localSelectedBrainModelConfigId]);

  return brainRegionsTree ? (
    <div className="flex flex-col flex-1 h-screen bg-primary-8 overflow-hidden">
      {isCollapsed ? (
        <CollapsedBrainRegionsSidebar setIsCollapsed={setIsCollapsed} />
      ) : (
        <div className="flex flex-col px-6 py-6 h-full min-w-[340px]">
          <div className="flex items-start justify-between mb-7">
            <div className="flex items-center justify-start space-x-2 text-2xl font-bold text-white">
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
            setValue={setBrainRegionHierarchyState}
            onClear={resetSelectedBrainRegion}
          />
          <div className="overflow-y-auto no-scrollbar">
            <BrainTreeNav
              ref={brainTreeNavRef}
              setValue={setBrainRegionHierarchyState}
              value={brainRegionHierarchyState}
            >
              {({ colorCode, id, isExpanded, title, leaves, trigger, content, view }) => (
                <NavTitle
                  className="text-base"
                  colorCode={colorCode}
                  id={id}
                  onClick={() => setSelectedBrainRegion(id, title, leaves)}
                  title={brainRegionTitleCaseExceptConjunctions(title)}
                  isExpanded={isExpanded}
                  trigger={trigger}
                  content={content}
                  selectedBrainRegion={selectedBrainRegion}
                  viewId={view}
                />
              )}
            </BrainTreeNav>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="w-[300px] bg-primary-8 h-screen text-neutral-1 text-3xl flex justify-center items-center">
      <LoadingOutlined />
    </div>
  );
}
