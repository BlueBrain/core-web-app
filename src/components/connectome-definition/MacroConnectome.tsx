import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState, useRef, SetStateAction } from 'react';
import Plotly, { Shape, Layout, Data } from 'plotly.js-dist-min';

import { WholeBrainConnectivityMatrix } from '@/types/connectome';
import {
  brainRegionLeavesUnsortedArrayAtom,
  selectedPostBrainRegionsAtom,
  selectedPreBrainRegionsAtom,
} from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';

function getDensitiesForNodes(
  srcNodes: Map<string, string>,
  dstNodes: Map<string, string>,
  brainRegionLeaves: BrainRegion[],
  connectivity: WholeBrainConnectivityMatrix
): [number[][], string[], string[]] {
  const filteredDensities: number[][] = [];

  const srcBrainRegions = brainRegionLeaves.filter((brainRegion) => srcNodes.has(brainRegion.id));
  const dstBrainRegions = brainRegionLeaves.filter((brainRegion) => dstNodes.has(brainRegion.id));

  srcBrainRegions.forEach((srcBrainRegion) => {
    const targetObj = connectivity[srcBrainRegion.id];

    const values = targetObj
      ? dstBrainRegions.map((dstBrainRegion) => targetObj?.[dstBrainRegion.id] ?? 0)
      : new Array(dstBrainRegions.length).fill(0);

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
  connectivityMatrix,
}: {
  zoom: boolean;
  select: boolean;
  unselect: boolean;
  selected: Set<string>;
  setSelected: React.Dispatch<SetStateAction<Set<string>>>;
  connectivityMatrix: WholeBrainConnectivityMatrix;
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

  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);

  const [filteredDensities, srcLabels, dstLabels] = useMemo(
    () =>
      getDensitiesForNodes(
        preSynapticBrainRegions,
        postSynapticBrainRegions,
        brainRegionLeaves || [],
        connectivityMatrix
      ),
    [preSynapticBrainRegions, postSynapticBrainRegions, connectivityMatrix, brainRegionLeaves]
  );

  useEffect(() => {
    selectRef.current = select;
    unselectRef.current = unselect;
    selectedRef.current = selected;
    const container = plotRef.current;

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
        colorscale: 'Hot',
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
              size: 7,
            },
          },
          yaxis: {
            color: '#DCDCDC',
            tickfont: {
              size: 7,
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
            size: 7,
          },
          range: container.layout.xaxis.range,
          fixedrange: !zoom,
        },
        yaxis: {
          color: '#DCDCDC',
          tickfont: {
            size: 7,
          },
          range: container.layout.yaxis.range,
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
  ]);

  return (
    <div style={{ gridArea: 'matrix-container' }} className="h-full">
      <div className="h-full" ref={plotRef} />
    </div>
  );
}
