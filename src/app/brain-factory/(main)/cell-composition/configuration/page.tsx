'use client';

import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { scaleOrdinal, schemeTableau10 } from 'd3';
import { useAtom } from 'jotai';
import { Button, Image, Tabs } from 'antd';
import sankey from './sankey';
import {
  AboutNode,
  editorlinksReducer,
  sankeyLinksReducer,
  SankeyLinksReducerAcc,
  sankeyNodesReducer,
} from './util';
import { compositionAtom, Densities, Link, Node } from '@/components/BrainRegionSelector';
import { HorizontalSlider, VerticalSlider } from '@/components/Slider';
import { GripDotsVerticalIcon, ResetIcon, UndoIcon } from '@/components/icons';
import { basePath } from '@/config';

function CellPosition() {
  return (
    <Image
      src={`${basePath}/images/brain-factory/BBM_ComingSoon_221119.png`} // TODO: Fix this
      alt="Coming soon"
      className="object-contain"
    />
  );
}

function CellDistribution() {
  return (
    <Image
      src={`${basePath}/images/brain-factory/BBM_Distribution_V1_221119.png`} // TODO: Fix this
      alt="Coming soon"
      className="object-contain"
    />
  );
}

function CellDensityToolbar() {
  const items = [
    { key: 'density', children: 'Densities [mm³]' },
    { key: 'percentage', children: 'Percentage' },
    { icon: <UndoIcon />, key: 'undo', children: `Undo` },
    { icon: <ResetIcon />, key: 'reset', children: `Reset` },
  ];

  return (
    <div className="flex gap-2 justify-end">
      {items.map(({ icon, key, children }) => (
        <Button className="flex gap-2 items-center text-sm" icon={icon} key={key} type="text">
          {children}
        </Button>
      ))}
    </div>
  );
}

type DensityChartProps = { className?: string; colorScale?: Function; data: Densities };

function DensityChart({ className = '', colorScale, data }: DensityChartProps) {
  const ref: RefObject<SVGSVGElement> = useRef(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.innerHTML = ''; // Prevent duplication

      const args = [
        data,
        {
          nodeColorScale: colorScale,
          linkColor: 'source',
          linkTitle: (d: any) => `${d.source.label} → ${d.target.label}\n${d.source.value}`,
          nodeGroup: (d: any) => d.id,
          nodeLabel: (d: any) => `${d.label} (${d.value})`,
          width: 860,
        },
      ];

      sankey(ref, ...(args as any));
    }
  });

  return <svg className={className} ref={ref} />;
}

type DensityEditorProps = {
  colorScale: Function;
  nodes: AboutNode[];
  max: number;
  onChange?: (id: string, value: number | null) => void;
};

function handleToggleLock(
  id: string,
  disabled: string[],
  callback: Dispatch<SetStateAction<string[]>>
) {
  const existingIndex = disabled.indexOf(id);

  return existingIndex === -1
    ? callback([...disabled, id])
    : callback([...disabled.slice(0, existingIndex), ...disabled.slice(existingIndex + 1)]);
}

function Sliders({ colorScale, nodes, max, onChange }: DensityEditorProps) {
  const [disabled, setDisabled] = useState<string[]>([]);
  const [nestedDisabled, setNestedDisabled] = useState<string[]>([]);

  const [active, setActive] = useState<{
    id: string;
    index: number;
    nodes: AboutNode[];
    max: number;
  }>({
    id: '',
    index: -1,
    nodes: [],
    max: 0,
  });

  // Make sure that "active" takes the newly calculated values
  useEffect(
    () =>
      setActive({
        id: active.id,
        index: active.index,
        nodes: nodes[active.index] ? nodes[active.index].nodes : active.nodes,
        max: nodes[active.index] ? nodes[active.index].max : active.max,
      }),
    [active, nodes]
  );

  return (
    <div className="bg-white flex gap-10 p-3 w-full">
      <div className="flex max-w-3xl overflow-x-clip">
        {nodes.map(({ id, label, max: nestedMax, nodes: nestedSliders, value }, i) => (
          <VerticalSlider
            className="flex flex-col gap-2 h-64 pt-3 px-5 pb-5"
            color={colorScale(id)}
            disabled={disabled.includes(id) || nodes.length <= 1}
            isActive={active.id === id}
            key={id}
            label={label}
            max={max}
            onClick={() =>
              setActive({
                id,
                index: i,
                nodes: nestedSliders,
                max: nestedMax,
              })
            }
            onChange={(newValue) => onChange && onChange(id, newValue)}
            onToggleLock={() => handleToggleLock(id, disabled, setDisabled)}
            value={value}
          />
        ))}
      </div>
      <div className="flex flex-col basis-full">
        <div className="font-bold text-primary-7">BREAKDOWN</div>
        {active.nodes &&
          active.nodes.map(({ id: nestedId, label: nestedLabel, value: nestedValue }) => (
            <HorizontalSlider
              color={colorScale(nestedId)}
              disabled={nestedDisabled.includes(nestedId) || active.nodes.length <= 1}
              key={nestedId}
              label={nestedLabel}
              max={active.max}
              onChange={(newValue) => onChange && onChange(nestedId, newValue)}
              onToggleLock={() => handleToggleLock(nestedId, nestedDisabled, setNestedDisabled)}
              value={nestedValue}
            />
          ))}
      </div>
    </div>
  );
}

function updatedNodesReducer(
  { links, nodes, id, value }: { links: Link[]; nodes: Node[]; id: string; value: number },
  { id: curId, neuron_composition, ...rest }: Node
) {
  return {
    links,
    nodes: [
      ...nodes,
      id === curId
        ? { id: curId, ...rest, neuron_composition: { ...neuron_composition, count: value } }
        : { id: curId, ...rest, neuron_composition },
    ],
    id,
    value,
  };
}

// TODO: There's probaly a nice way to combine the different reducers here...
// ... Including the sidebar composition reducer as well.
function CellDensity() {
  const [composition, setComposition] = useAtom(compositionAtom);
  const { nodes, links } = composition !== null ? composition : { nodes: [], links: [] };

  const sankeyData = links.reduce(sankeyLinksReducer, {
    links: [],
    nodes: nodes.reduce(sankeyNodesReducer, []),
    type: 'neuron_composition',
    value: 'count',
  } as SankeyLinksReducerAcc);

  const { accNodes: editorNodes, max } =
    links && links.reduce(editorlinksReducer, { accNodes: {}, allNodes: nodes, max: 0 });

  // Prevent colorScale from ever changing after initial render
  const colorScale = useCallback(
    scaleOrdinal(
      Object.entries(sankeyData.nodes).map((id) => id), // eslint-disable-line @typescript-eslint/no-unused-vars
      schemeTableau10
    ),
    []
  );

  const handleSlidersChange = useCallback(
    (id: string, value: number | null) => {
      const { links: newLinks, nodes: newNodes } = nodes.reduce(updatedNodesReducer, {
        links,
        nodes: [],
        id,
        value,
      } as {
        links: Link[];
        nodes: Node[];
        id: string;
        value: number;
      });

      return setComposition({ links: newLinks, nodes: newNodes });
    },
    [links, nodes, setComposition]
  );

  return (
    <>
      {sankeyData.links.length > 0 && (
        <DensityChart className="w-full" colorScale={colorScale} data={sankeyData} />
      )}
      <CellDensityToolbar />
      <Tabs
        // TODO: See whether Ant-D ConfigProvider can be used instead of renderTabBar
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} className="bg-white" style={{ margin: 0 }} /> // eslint-disable-line react/jsx-props-no-spreading
        )}
        items={Object.entries(editorNodes).map(([about, sliderNodes]) => ({
          label: (
            <div className="flex gap-4 items-center px-5">
              <GripDotsVerticalIcon />
              <span>{`By ${about}`}</span>
            </div>
          ),
          key: about,
          children: (
            <Sliders
              nodes={sliderNodes}
              colorScale={colorScale}
              max={max}
              onChange={handleSlidersChange}
            />
          ),
        }))}
      />
    </>
  );
}

export default function ConfigurationView() {
  return (
    <Tabs
      // TODO: There may be a way to improve this using Ant-D's ConfigProvider
      renderTabBar={(props, DefaultTabBar) => (
        <DefaultTabBar {...props} style={{ margin: '0 0 30px 0' }} /> // eslint-disable-line react/jsx-props-no-spreading
      )}
      className="mx-4 my-10"
      items={[
        {
          label: 'Density',
          key: 'density',
          children: <CellDensity />,
        },
        { label: 'Distribution', key: 'distribution', children: <CellDistribution /> },
        { label: 'Position', key: 'position', children: <CellPosition /> },
      ]}
    />
  );
}
