import { useAtomValue } from 'jotai';
import {
  useEffect,
  useMemo,
  useState,
  useRef,
  SetStateAction,
  Dispatch,
  MutableRefObject,
} from 'react';
import Plotly, { Shape, Layout, Data, ColorScale } from 'plotly.js-dist-min';

import { getFlatArrayValueIdx } from '@/util/connectome';
import {
  brainRegionLeaveIdxByIdAtom,
  brainRegionLeavesUnsortedArrayAtom,
  selectedPostBrainRegionsAtom,
  selectedPreBrainRegionsAtom,
} from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';
import { usePrevious } from '@/hooks/hooks';
import { HemisphereDirection, WholeBrainConnectivityMatrix } from '@/types/connectome';

const ELECTRIC_SHARP: ColorScale = [
  [0, 'rgb(0,0,0)'],
  [0.0001, 'rgb(40,0,132)'],
  [0.001, 'rgb(161,0,132)'],
  [0.2, 'rgb(232,126,0)'],
  [0.5, 'rgb(255,253,0)'],
  [1, 'rgb(255,255,255)'],
];

function getDensitiesForNodes(
  srcNodes: Map<string, string>,
  dstNodes: Map<string, string>,
  brainRegionLeaves: BrainRegion[],
  idxByIdMap: Record<string, number> | null,
  connectivityFlatArray: Float64Array
): [number[][], string[], string[]] {
  if (!idxByIdMap) return [[], [], []];

  const filteredDensities: number[][] = [];

  const srcBrainRegions = brainRegionLeaves.filter((brainRegion) => srcNodes.has(brainRegion.id));
  const dstBrainRegions = brainRegionLeaves.filter((brainRegion) => dstNodes.has(brainRegion.id));

  const totalLeaves = brainRegionLeaves.length;

  srcBrainRegions.forEach((srcBrainRegion) => {
    const srcIdx = idxByIdMap[srcBrainRegion.id] as number;
    const values = new Array(dstBrainRegions.length);

    dstBrainRegions.forEach((dstBrainRegion, targetIdx) => {
      const dstIdx = idxByIdMap[dstBrainRegion.id] as number;
      const valueIdx = getFlatArrayValueIdx(totalLeaves, srcIdx, dstIdx);
      values[targetIdx] = connectivityFlatArray[valueIdx];
    });

    filteredDensities.push(values);
  });

  const srcLabels = srcBrainRegions.map((brainRegion) => brainRegion.notation);
  const dstLabels = dstBrainRegions.map((brainRegion) => brainRegion.notation);

  return [filteredDensities, srcLabels, dstLabels];
}

interface PlotDiv extends HTMLDivElement {
  on: (
    event: string,
    handler: ({
      points,
    }: {
      points: { pointIndex: [number, number]; data: { x: number[]; y: number[]; z: number[][] } }[];
    }) => void
  ) => void;
  layout: Layout;
}

interface Rect extends Partial<Shape> {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export default function MacroConnectome({
  zoom,
  select: selectProp,
  unselect,
  selected,
  setSelected,
  connectivityMatrix,
  hemisphereDirection,
  setMultiplier,
  setOffset,
  selectionShapes,
}: {
  zoom: boolean;
  select: boolean;
  unselect: boolean;
  selected: Set<string>;
  setSelected: Dispatch<SetStateAction<Set<string>>>;
  connectivityMatrix: WholeBrainConnectivityMatrix;
  hemisphereDirection: HemisphereDirection;
  setMultiplier: Dispatch<SetStateAction<number>>;
  setOffset: Dispatch<SetStateAction<number>>;
  selectionShapes: MutableRefObject<Rect[]>;
}) {
  const plotRef = useRef<PlotDiv>(null);

  const corner1 = useRef<[number, number] | null>(null);
  const corner2 = useRef<[number, number] | null>(null);
  const selectRef = useRef(false);
  const unselectRef = useRef(false);
  const selectedRef = useRef(new Set<string>());

  const [plotInitialized, setPlotInitialized] = useState(false);

  const brainRegionLeaves = useAtomValue(brainRegionLeavesUnsortedArrayAtom);
  const brainRegionLeaveIdxById = useAtomValue(brainRegionLeaveIdxByIdAtom);

  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);

  const select = selectProp && selectionShapes.current.length === 0;

  const [filteredDensities, srcLabels, dstLabels] = useMemo(
    () =>
      getDensitiesForNodes(
        preSynapticBrainRegions,
        postSynapticBrainRegions,
        brainRegionLeaves || [],
        brainRegionLeaveIdxById,
        connectivityMatrix[hemisphereDirection]
      ),
    [
      preSynapticBrainRegions,
      postSynapticBrainRegions,
      brainRegionLeaves,
      brainRegionLeaveIdxById,
      connectivityMatrix,
      hemisphereDirection,
    ]
  );

  const prevSrcLabels = usePrevious(srcLabels);
  const prevDstLabels = usePrevious(dstLabels);
  const userChangedRegions =
    prevSrcLabels?.length !== srcLabels.length || prevDstLabels?.length !== dstLabels.length;

  useEffect(() => {
    selectRef.current = select;
    unselectRef.current = unselect;
    selectedRef.current = selected;
    const container = plotRef.current;

    if (!container) return;

    const data: Data[] = [
      {
        z: filteredDensities,
        x: dstLabels,
        y: srcLabels,
        type: 'heatmap',
        colorscale: ELECTRIC_SHARP,
        colorbar: {
          title: 'Syns/μm³',
        },
        hovertemplate:
          'Post-synaptic: %{x} <br>Pre-synaptic: %{y} <br>Connection strength: %{z} synapses/μm³ <extra></extra>',
      },
    ];

    if (!plotInitialized) {
      Plotly.newPlot(
        plotRef.current,
        data,
        {
          margin: {
            t: 24,
          },
          paper_bgcolor: '#000',
          plot_bgcolor: '#000',
          xaxis: {
            color: '#DCDCDC',
            tickfont: {
              size: 8,
            },
          },
          yaxis: {
            color: '#DCDCDC',
            tickfont: {
              size: 8,
            },
          },
          shapes: selectionShapes.current,
        },
        {
          responsive: true,
        }
      );
      setPlotInitialized(true);

      container.on('plotly_click', ({ points }) => {
        if (unselectRef.current) {
          const point = { x: points[0].pointIndex[1], y: points[0].pointIndex[0] };
          const deletedShapes = selectionShapes.current.filter(
            (s) => point.x >= s.x0 && point.x <= s.x1 && point.y <= s.y0 && point.y >= s.y1
          );
          // eslint-disable-next-line no-param-reassign
          selectionShapes.current = selectionShapes.current.filter(
            (s) => !(point.x >= s.x0 && point.x <= s.x1 && point.y <= s.y0 && point.y >= s.y1)
          );

          const selectedCopy = new Set(selectedRef.current);

          for (const s of deletedShapes) {
            for (let x = s.x0; x <= s.x1; x += 1)
              for (let y = s.y1; y <= s.y0; y += 1) {
                if (x >= s.x0 && x <= s.x1 && y <= s.y0 && y >= s.y1) {
                  selectedCopy.delete(
                    JSON.stringify([
                      points[0].data.x[x],
                      points[0].data.y[y],
                      points[0].data.z[y][x],
                    ])
                  );
                }
              }
          }
          setSelected(selectedCopy);
          setMultiplier(1);
          setOffset(0);
          Plotly.relayout(container, { shapes: selectionShapes.current });
        }

        if (!selectRef.current) return;
        if (corner1.current === null) {
          corner1.current = [points[0].pointIndex[1], points[0].pointIndex[0]];
          return;
        }

        if (corner2.current === null) return;

        const c1 = corner1.current;
        const c2 = corner2.current;

        const x0 = Math.min(c1[0], c2[0]);
        const y0 = Math.max(c1[1], c2[1]);
        const x1 = Math.max(c2[0], c1[0]);
        const y1 = Math.min(c2[1], c1[1]);

        selectionShapes.current.push({
          type: 'rect',
          x0,
          y0,
          x1,
          y1,
          opacity: 0.5,
          fillcolor: 'green',
          line: {
            color: 'transparent',
          },
        });

        const selectedCopy = new Set(selectedRef.current);

        for (let x = x0; x <= x1; x += 1) {
          for (let y = y1; y <= y0; y += 1) {
            if (x >= x0 && x <= x1 && y <= y0 && y >= y1) {
              selectedCopy.add(
                JSON.stringify([points[0].data.x[x], points[0].data.y[y], points[0].data.z[y][x]])
              );
            }
          }
        }

        setSelected(selectedCopy);

        Plotly.relayout(container, {
          shapes: selectionShapes.current,
        });

        corner1.current = null;
        corner2.current = null;
      });

      container.on('plotly_hover', ({ points }) => {
        const point = { x: points[0].pointIndex[1], y: points[0].pointIndex[0] };
        if (unselectRef.current) {
          Plotly.relayout(container, {
            shapes: selectionShapes.current.map((s) => ({
              ...s,
              fillcolor:
                point.x >= s.x0 && point.x <= s.x1 && point.y <= s.y0 && point.y >= s.y1
                  ? 'red'
                  : 'green',
            })),
          });
          return;
        }
        if (corner1.current === null) return;

        corner2.current = [points[0].pointIndex[1], points[0].pointIndex[0]];

        Plotly.update(
          container,
          {},
          {
            shapes: [
              ...selectionShapes.current,
              {
                type: 'rect',
                x0: corner1.current[0],
                y0: corner1.current[1],
                x1: corner2.current[0],
                y1: corner2.current[1],
                line: {
                  color: 'green',
                },
              },
            ],
          }
        );
      });

      return;
    }

    Plotly.react(
      plotRef.current,
      data,
      {
        margin: {
          t: 24,
        },
        paper_bgcolor: '#000',
        plot_bgcolor: '#000',
        xaxis: {
          color: '#DCDCDC',
          tickfont: {
            size: 8,
          },
          range: userChangedRegions ? undefined : container.layout.xaxis.range,
          fixedrange: !zoom,
        },
        yaxis: {
          color: '#DCDCDC',
          tickfont: {
            size: 8,
          },
          range: userChangedRegions ? undefined : container.layout.yaxis.range,
          fixedrange: !zoom,
        },
        shapes: selectionShapes.current,
      },
      { responsive: true }
    );
  }, [
    filteredDensities,
    dstLabels,
    srcLabels,
    plotInitialized,
    select,
    unselect,
    zoom,
    selected,
    setSelected,
    userChangedRegions,
    setMultiplier,
    setOffset,
    selectionShapes,
  ]);

  return (
    <div style={{ gridArea: 'matrix-container' }} className="h-full">
      <div className="h-full" ref={plotRef} />
    </div>
  );
}
