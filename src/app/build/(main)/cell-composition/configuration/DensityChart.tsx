import { ReactNode, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import distinctColors from 'distinct-colors';
import shuffle from 'lodash/shuffle';
import { Select, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { SelectProps, DefaultOptionType } from 'antd/es/select';
import generatedPalette from './generated-color-palette.json';
import { getSankeyNodesReducer, getSankeyLinks } from './util';
import sankey from './sankey';
import { densityOrCountAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import { analysedCompositionAtom } from '@/state/build-composition';
import { cellTypesAtom } from '@/state/build-section/cell-types';
import { formatNumber } from '@/util/common';
import { classNames } from '@/util/utils';
import ColorBox from '@/components/build-section/BrainRegionSelector/ColorBox';
import './sankey.css'; // Tell webpack that Button.js uses these styles

type SelectedNodeOptionType<T extends DefaultOptionType['value']> = {
  label: ReactNode;
  value: T;
};

function MissingSelectedNodes({
  items,
  title,
}: {
  items: SelectedNodeOptionType<string>[];
  title?: string;
}) {
  const missingSelectedCellTypes =
    items.length === 1
      ? items.map(({ label, value }) => <span key={value}>{label}</span>)
      : items.map(({ label, value }, i) =>
          i < items.length - 1 ? (
            <span key={value}>{label}, </span>
          ) : (
            <span key={value}>and {label}</span>
          )
        );

  const renderMissing = <strong className="flex gap-1">{missingSelectedCellTypes}</strong>;

  return (
    !!items.length && (
      <div className="text-left w-full">
        <em>
          {items.length === 1 ? (
            <span className="flex gap-1">
              Note: {renderMissing} is not shown, as it is not represented in the cell composition
              for {title}.
            </span>
          ) : (
            <span className="flex gap-1">
              Note: {renderMissing} are not shown, as they are not represented in the cell
              composition for {title}.
            </span>
          )}
        </em>
      </div>
    )
  );
}

export default function DensityChart() {
  const classObjects = useAtomValue(useMemo(() => unwrap(cellTypesAtom), []));
  const composition = useAtomValue(analysedCompositionAtom);
  const densityOrCount = useAtomValue(densityOrCountAtom);

  const [selectedNodes, setSelectedNodes] = useState<SelectedNodeOptionType<string>[]>([]);

  const removeSelectedNode = useCallback(
    (index: number) =>
      setSelectedNodes([...selectedNodes.slice(0, index), ...selectedNodes.slice(index + 1)]),
    [selectedNodes]
  );

  const addOrRemoveSelectedNode = useCallback(
    (id: DefaultOptionType['value'], option: DefaultOptionType) => {
      const existingIndex = selectedNodes.findIndex(({ value }) => id === value);

      return existingIndex !== -1
        ? removeSelectedNode(existingIndex)
        : setSelectedNodes([...selectedNodes, option as SelectedNodeOptionType<string>]);
    },
    [removeSelectedNode, selectedNodes]
  );

  const onClear = useCallback<NonNullable<SelectProps['onClear']>>(() => setSelectedNodes([]), []);

  const onClickLink = useCallback(
    (link: { index: number; source: { id: string; label: string } }) =>
      addOrRemoveSelectedNode(link.source.id, { label: link.source.label, value: link.source.id }),
    [addOrRemoveSelectedNode]
  );

  const onClickSource = useCallback(
    ({ id: value, label }: { id: string; label: string }) =>
      addOrRemoveSelectedNode(value, { label, value }),
    [addOrRemoveSelectedNode]
  );

  const onDeselect = useCallback<NonNullable<SelectProps['onSelect']>>(
    (_labeledValue, selectedOption) => {
      const existingIndex = selectedNodes.findIndex(({ value }) => selectedOption.value === value);

      return removeSelectedNode(existingIndex);
    },
    [removeSelectedNode, selectedNodes]
  );

  const onSelect = useCallback<NonNullable<SelectProps['onSelect']>>(
    (_labeledValue, selectedOption: DefaultOptionType) =>
      addOrRemoveSelectedNode(selectedOption.value, selectedOption),
    [addOrRemoveSelectedNode]
  );

  const { nodes, links } = composition ?? { nodes: [], links: [] };

  const filteredForComposition = useMemo(
    () => selectedNodes.filter(({ value }) => nodes.find(({ id }) => id === value)),
    [nodes, selectedNodes]
  );

  const notInFilteredArray = selectedNodes.filter(
    ({ value }) =>
      !filteredForComposition.find(({ value: filteredValue }) => filteredValue === value)
  );

  const sankeyData = useMemo(() => {
    const sankeyLinks = getSankeyLinks(
      links,
      nodes,
      densityOrCount,
      filteredForComposition.map(({ value }) => value)
    );

    const sankeyNodes = nodes.reduce(
      getSankeyNodesReducer(
        filteredForComposition.map(({ value }) => value),
        sankeyLinks,
        densityOrCount
      ),
      []
    );

    return {
      links: sankeyLinks,
      nodes: sankeyNodes,
      value: densityOrCount,
    };
  }, [densityOrCount, links, nodes, filteredForComposition]);

  // This function will only be called if generated-color-palette.json is manually cleared.
  // The purpose of leaving this function in here is to make it easier to update the color-
  // mappings when new classes are added to the cell composition.
  const getNewDistinctColors = useCallback(() => {
    const nodesWithoutColors = shuffle(
      Object.entries(classObjects ?? {}).reduce<string[]>(
        (acc, [id, { color }]) => (!color ? [...acc, id] : acc),
        []
      )
    );

    return distinctColors({ count: nodesWithoutColors.length, quality: 250 }).reduce(
      (acc, color, i) => {
        const id = nodesWithoutColors[i];

        return { ...acc, [id]: color.hex() };
      },
      {}
    ); // Stringify and over-write generated-color-palette.json with this object when a refresh of the color mappings is needed.
  }, [classObjects]);

  // The condition below will always be TRUE unless generated-color-palette.json is manually cleared.
  // See the comment above the getNewDistinctColors() definition for more context.
  const palette: Record<string, string> = useMemo(
    () => (Object.keys(generatedPalette).length ? generatedPalette : getNewDistinctColors()),
    [getNewDistinctColors]
  );

  const colorScale = useCallback(
    (id: string) => classObjects?.[id]?.color ?? palette?.[`${id}`] ?? '#ccc',
    [classObjects, palette]
  );

  // Prevent SVG from rendering whenever zoom changes
  const chartRef: RefObject<SVGSVGElement & { reset: () => void; zoom: (value: number) => void }> =
    useRef(null);

  const [dimensions, setDimensions] = useState<DOMRect | undefined>();

  const wrapperRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setDimensions(node.getBoundingClientRect());
    }

    function handleResize() {
      setDimensions(node.getBoundingClientRect());
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { height, width } = dimensions ?? { height: undefined, width: undefined };

  useEffect(() => {
    if (chartRef.current !== null) {
      const ref = chartRef.current;

      ref.innerHTML = ''; // Prevent duplication

      const { links: sankeyLinks, nodes: sankeyNodes } = sankeyData;

      const args = [
        {
          links: sankeyLinks.map((link) =>
            selectedNodes.map(({ value }) => value).includes(link.source)
              ? { ...link, selected: true }
              : link
          ),
          nodes: sankeyNodes,
        },
        {
          linkColor: 'source',
          linkOpacity: selectedNodes.length ? 0.1 : 1,
          linkTitle: (d: any) => `${d.source.label} → ${d.target.label}\n${d.value}`,
          nodeColorScale: colorScale,
          nodeGroup: (d: any) => d.id,
          nodeLabel: (d: any) => `${d.label} (~${formatNumber(d.value)})`,
          nodeTitle: (d: any) => `${d.label} (~${formatNumber(d.value)})`,
          nodePadding: 4,
          height,
          width,
        },
      ];

      sankey(chartRef, onClickLink, onClickSource, ...(args as any));
    }
  }, [chartRef, colorScale, onClickLink, onClickSource, sankeyData, selectedNodes, height, width]);

  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);

  const tagRender = ({ closable, label, onClose, value }: CustomTagProps) => (
    <Tag
      className="flex font-semibold gap-2 items-center justify-between"
      closable={closable}
      closeIcon={
        <CloseOutlined className="text-primary-9" style={{ display: 'block', fontSize: 14 }} />
      }
      onClose={onClose}
      style={{ margin: '0.125rem 0.125rem 0.125rem auto' }}
    >
      <ColorBox
        color={classObjects?.[value]?.color ?? (palette as Record<string, string>)[value]}
      />
      <span className="text-lg text-primary-9">{label}</span>
    </Tag>
  );

  const densityCountLabel = useMemo(() => {
    switch (densityOrCount) {
      case 'count':
        return 'Counts [N]';
      case 'density':
        return 'Densities [/mm³]';
      default:
        return '';
    }
  }, [densityOrCount]);

  return (
    <div className="flex flex-col gap-5 h-full w-full">
      <h1 className="flex font-bold gap-1 items-baseline text-3xl text-primary-9">
        {selectedBrainRegion?.title ?? 'Please select a brain region.'}
        {!!selectedBrainRegion?.title && (
          <small className="font-light text-sm">{densityCountLabel}</small>
        )}
      </h1>
      {sankeyData.links.length > 0 && (
        <>
          <div className="flex flex-col gap-4 items-center">
            <Select
              allowClear
              autoClearSearchValue
              className="w-full"
              dropdownStyle={{ borderRadius: '4px' }}
              placeholder="Search for MTypes"
              onClear={onClear}
              onDeselect={onDeselect}
              onSelect={onSelect}
              filterOption={(input, option) =>
                ((option?.label as string)?.toLowerCase() ?? '').includes(input.toLowerCase())
              }
              options={nodes.reduce<{ label: string; value: string }[]>(
                (acc, { about, id: value, label }) =>
                  about === 'MType' ? [...acc, { label, value }] : acc,
                []
              )}
              mode="multiple"
              size="large"
              tagRender={tagRender}
              value={selectedNodes}
            />
            <MissingSelectedNodes items={notInFilteredArray} title={selectedBrainRegion?.title} />
          </div>
          <div className="h-full w-full" ref={wrapperRef}>
            <svg
              className={classNames(
                'h-full w-full sankey',
                selectedNodes.length ? 'is-selected' : ''
              )}
              ref={chartRef}
            />
          </div>
        </>
      )}
    </div>
  );
}
