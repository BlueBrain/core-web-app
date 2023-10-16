import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Select } from 'antd';
import { SelectProps, DefaultOptionType } from 'antd/es/select';
import { getSankeyNodesReducer, getSankeyLinks } from './util';
import sankey from './sankey';
import { densityOrCountAtom } from '@/state/brain-regions';
import { analysedCompositionAtom } from '@/state/build-composition';
import { cellTypesAtom } from '@/state/build-section/cell-types';
import { formatNumber } from '@/util/common';
import { classNames } from '@/util/utils';
import './sankey.css'; // Tell webpack that Button.js uses these styles

type SelectedNodeOptionType<T extends DefaultOptionType['value']> = {
  label: DefaultOptionType['label'];
  value: T;
};

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

  const sankeyData = useMemo(() => {
    const sankeyLinks = getSankeyLinks(
      links,
      nodes,
      densityOrCount,
      selectedNodes.map(({ value }) => value)
    );

    return {
      links: sankeyLinks,
      nodes: nodes.reduce(
        getSankeyNodesReducer(
          selectedNodes.map(({ value }) => value),
          sankeyLinks,
          densityOrCount
        ),
        []
      ),
      value: densityOrCount,
    };
  }, [densityOrCount, links, nodes, selectedNodes]);

  const colorScale = useCallback(
    (id: string) => classObjects?.[id]?.color ?? '#ccc',
    [classObjects]
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

  return (
    sankeyData.links.length > 0 && (
      <div className="flex flex-col gap-5 h-full w-full">
        <div className="flex gap-4 items-center">
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
            value={selectedNodes}
          />
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
      </div>
    )
  );
}
