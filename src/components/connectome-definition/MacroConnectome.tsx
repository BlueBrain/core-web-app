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
import usePrevious from '@/hooks/hooks';

const VIRIDIS_W_ZERO_CUTOFF: ColorScale = [
  [0, '#000000'],
  [0.0001, '#440154'],
  [0.06274509803921569, '#48186a'],
  [0.12549019607843137, '#472d7b'],
  [0.18823529411764706, '#424086'],
  [0.25098039215686274, '#3b528b'],
  [0.3137254901960784, '#33638d'],
  [0.3764705882352941, '#2c728e'],
  [0.4392156862745098, '#26828e'],
  [0.5019607843137255, '#21918c'],
  [0.5647058823529412, '#1fa088'],
  [0.6274509803921569, '#28ae80'],
  [0.6901960784313725, '#3fbc73'],
  [0.7529411764705882, '#5ec962'],
  [0.8156862745098039, '#84d44b'],
  [0.8784313725490196, '#addc30'],
  [0.9411764705882353, '#d8e219'],
  [1, '#fde725'],
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
  connectivityFlatArray,
  setMultiplier,
  setOffset,
  shapes,
}: {
  zoom: boolean;
  select: boolean;
  unselect: boolean;
  selected: Set<string>;
  setSelected: Dispatch<SetStateAction<Set<string>>>;
  connectivityFlatArray: Float64Array;
  setMultiplier: Dispatch<SetStateAction<number>>;
  setOffset: Dispatch<SetStateAction<number>>;
  shapes: MutableRefObject<Rect[]>;
}) {
  const plotRef = useRef<PlotDiv>(null);

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

  const select = selectProp && shapes.current.length === 0;

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
        colorscale: VIRIDIS_W_ZERO_CUTOFF,
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
          // eslint-disable-next-line no-param-reassign
          shapes.current = shapes.current.filter(
            (s) => !(point.x >= s.x0 && point.x <= s.x1 && point.y <= s.y0 && point.y >= s.y1)
          );

          const selectedCopy = new Set(selectedRef.current);
          // eslint-disable-next-line no-restricted-syntax
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
              selectedCopy.add(
                JSON.stringify([points[0].data.x[x], points[0].data.y[y], points[0].data.z[y][x]])
              );
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
    userChangedRegions,
    setMultiplier,
    setOffset,
    shapes,
  ]);

  return (
    <div style={{ gridArea: 'matrix-container' }} className="h-full">
      <div className="h-full" ref={plotRef} />
    </div>
  );
}
