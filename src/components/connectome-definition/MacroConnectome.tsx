import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState, useRef, SetStateAction } from 'react';
import Plotly, { Shape, Layout, Data, ColorScale } from 'plotly.js-dist-min';

import { WholeBrainConnectivityMatrix, HemisphereDirection } from '@/types/connectome';
import {
  brainRegionLeaveIdxByIdAtom,
  brainRegionLeaveIdxByNotationMapAtom,
  brainRegionLeavesUnsortedArrayAtom,
  selectedPostBrainRegionsAtom,
  selectedPreBrainRegionsAtom,
} from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';
import usePrevious from '@/hooks/hooks';

const PICNIC_W_ZERO_CUTOFF: ColorScale = [
  [0, 'rgb(0,0,0)'],
  [0.0001, 'rgb(0,0,255)'],
  [0.1, 'rgb(51,153,255)'],
  [0.2, 'rgb(102,204,255)'],
  [0.3, 'rgb(153,204,255)'],
  [0.4, 'rgb(204,204,255)'],
  [0.5, 'rgb(255,255,255)'],
  [0.6, 'rgb(255,204,255)'],
  [0.7, 'rgb(255,153,255)'],
  [0.8, 'rgb(255,102,204)'],
  [0.9, 'rgb(255,102,102)'],
  [1, 'rgb(255,0,0)'],
];

function getFlatArrayValueIdx(totalLeaves: number, srcIdx: number, dstIdx: number) {
  return srcIdx * totalLeaves + dstIdx;
}

function getDensitiesForNodes(
  srcNodes: Map<string, string>,
  dstNodes: Map<string, string>,
  brainRegionLeaves: BrainRegion[],
  idxByIdMap: Record<string, number> | null,
  connectivityFlatArray: Float64Array
): [number[][], string[], string[]] {
  if (!idxByIdMap) return [[], [], []];

  console.time('createChartData');

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

  console.timeEnd('createChartData');

  return [filteredDensities, srcLabels, dstLabels];
}

interface PlotDiv extends HTMLDivElement {
  on: (
    event: string,
    handler: ({
      points,
    }: {
      points: { pointIndex: [number, number]; data: { x: number[]; y: number[] } }[];
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
  select,
  unselect,
  selected,
  setSelected,
  connectivityFlatArray,
}: {
  zoom: boolean;
  select: boolean;
  unselect: boolean;
  selected: Set<string>;
  setSelected: React.Dispatch<SetStateAction<Set<string>>>;
  connectivityFlatArray: Float64Array;
}) {
  const plotRef = useRef<PlotDiv>(null);
  const shapes = useRef<Rect[]>([]);

  const selecting = useRef(false);
  const corner1 = useRef<[number, number]>([0, 0]);
  const corner2 = useRef<[number, number]>([0, 0]);
  const selectRef = useRef(false);
  const unselectRef = useRef(false);
  const selectedRef = useRef(new Set<string>());

  const [plotInitialized, setPlotInitialized] = useState(false);

  const brainRegionLeaves = useAtomValue(brainRegionLeavesUnsortedArrayAtom);
  const brainRegionLeaveIdxById = useAtomValue(brainRegionLeaveIdxByIdAtom);

  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);

  const [filteredDensities, srcLabels, dstLabels] = useMemo(
    () =>
      getDensitiesForNodes(
        preSynapticBrainRegions,
        postSynapticBrainRegions,
        brainRegionLeaves || [],
        brainRegionLeaveIdxById,
        connectivityFlatArray
      ),
    [
      preSynapticBrainRegions,
      postSynapticBrainRegions,
      brainRegionLeaves,
      brainRegionLeaveIdxById,
      connectivityFlatArray,
    ]
  );

  const prevsrcLabels = usePrevious(srcLabels);
  const prevdstLabels = usePrevious(dstLabels);

  useEffect(() => {
    selectRef.current = select;
    unselectRef.current = unselect;
    selectedRef.current = selected;
    const container = plotRef.current;

    const userChangedRegions = prevsrcLabels !== srcLabels || prevdstLabels !== dstLabels;

    if (selected.size === 0) {
      shapes.current = [];
    }

    if (!container || filteredDensities.length === 0) return;

    const data: Data[] = [
      {
        z: filteredDensities,
        x: dstLabels,
        y: srcLabels,
        type: 'heatmap',
        colorscale: PICNIC_W_ZERO_CUTOFF,
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
          shapes: shapes.current,
        },
        {
          responsive: true,
        }
      );
      setPlotInitialized(true);

      container.on('plotly_click', ({ points }) => {
        if (unselectRef.current) {
          const point = { x: points[0].pointIndex[1], y: points[0].pointIndex[0] };
          const deletedShapes = shapes.current.filter(
            (s) => point.x >= s.x0 && point.x <= s.x1 && point.y <= s.y0 && point.y >= s.y1
          );
          shapes.current = shapes.current.filter(
            (s) => !(point.x >= s.x0 && point.x <= s.x1 && point.y <= s.y0 && point.y >= s.y1)
          );

          const selectedCopy = new Set(selectedRef.current);
          // eslint-disable-next-line no-restricted-syntax
          for (const s of deletedShapes) {
            for (let x = s.x0; x <= s.x1; x += 1)
              for (let y = s.y1; y <= s.y0; y += 1) {
                if (x >= s.x0 && x <= s.x1 && y <= s.y0 && y >= s.y1) {
                  selectedCopy.delete(JSON.stringify([points[0].data.x[x], points[0].data.y[y]]));
                }
              }
          }
          setSelected(selectedCopy);
          Plotly.relayout(container, { shapes: shapes.current });
        }

        if (!selectRef.current) return;
        if (!selecting.current) {
          corner1.current = [points[0].pointIndex[1], points[0].pointIndex[0]];
          selecting.current = true;
          return;
        }

        const c1 = corner1.current;
        const c2 = corner2.current;

        shapes.current.push({
          type: 'rect',
          x0: Math.min(c1[0], c2[0]),
          y0: Math.max(c1[1], c2[1]),
          x1: Math.max(c2[0], c1[0]),
          y1: Math.min(c2[1], c1[1]),
          opacity: 0.5,
          fillcolor: 'green',
          line: {
            color: 'transparent',
          },
        });

        const selectedCopy = new Set(selectedRef.current);
        for (let x = c1[0]; x <= c2[0]; x += 1) {
          for (let y = c2[1]; y <= c1[1]; y += 1) {
            if (x >= c1[0] && x <= c2[0] && y <= c1[1] && y >= c2[1]) {
              selectedCopy.add(JSON.stringify([points[0].data.x[x], points[0].data.y[y]]));
            }
          }
        }

        setSelected(selectedCopy);

        Plotly.relayout(container, {
          shapes: shapes.current,
        });

        corner1.current = [0, 0];
        corner2.current = [0, 0];

        selecting.current = false;
      });

      container.on('plotly_hover', ({ points }) => {
        const point = { x: points[0].pointIndex[1], y: points[0].pointIndex[0] };
        if (unselectRef.current) {
          Plotly.relayout(container, {
            shapes: shapes.current.map((s) => ({
              ...s,
              fillcolor:
                point.x >= s.x0 && point.x <= s.x1 && point.y <= s.y0 && point.y >= s.y1
                  ? 'red'
                  : 'green',
            })),
          });
          return;
        }
        if (!selecting.current) return;

        corner2.current = [points[0].pointIndex[1], points[0].pointIndex[0]];

        Plotly.update(
          container,
          {},
          {
            shapes: [
              ...shapes.current,
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
        shapes: shapes.current,
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
    prevdstLabels,
    prevsrcLabels,
  ]);

  return (
    <div style={{ gridArea: 'matrix-container' }} className="h-full">
      <div className="h-full" ref={plotRef} />
    </div>
  );
}
