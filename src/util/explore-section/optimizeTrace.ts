import { LTTB, DataPoint } from 'downsample';

interface RawData {
  y: number[];
  sweepName: string;
  name: string;
  line: {
    color: string;
  };
}

const optimizePlotData = (
  rawData: RawData[],
  deltaTime: number,
  {
    xstart,
    xend,
  }: {
    xstart?: number;
    xend?: number;
  }
) => {
  if (!rawData) return [];

  const start = xstart ? Math.ceil(xstart / deltaTime) : 0;
  const end = xend && Math.ceil(xend / deltaTime);

  const results = rawData.map((sweep) => {
    const ySelected = Array.from(sweep.y.slice(start, end));

    const points = ySelected.map((y, index): DataPoint => [(index + start) * deltaTime, y]);
    const downsampledPoints = LTTB(points, 1000) as DataPoint[];

    return {
      ...sweep,
      x: downsampledPoints.map(([x]: any) => x),
      y: downsampledPoints.map(([, y]: any) => y),
    };
  });

  return results;
};

export default optimizePlotData;
