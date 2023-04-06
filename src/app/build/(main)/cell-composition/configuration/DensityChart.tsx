import { useEffect, Dispatch, RefObject, SetStateAction } from 'react';
import sankey from './sankey';
import { formatNumber } from '@/util/common';
import { SankeyLinksReducerAcc } from '@/app/build/(main)/cell-composition/configuration/types';

export default function DensityChart({
  className = '',
  colorScale,
  data,
  chartRef,
  onZoom,
}: {
  className?: string;
  colorScale?: Function;
  data: SankeyLinksReducerAcc;
  onZoom: Dispatch<SetStateAction<number>>;
  chartRef: RefObject<SVGSVGElement>;
}) {
  useEffect(() => {
    if (chartRef.current !== null) {
      const ref = chartRef.current;

      ref.innerHTML = ''; // Prevent duplication

      const args = [
        data,
        {
          linkColor: 'source',
          linkTitle: (d: any) => `${d.source.label} → ${d.target.label}\n${d.source.value}`,
          nodeColorScale: colorScale,
          nodeGroup: (d: any) => d.id,
          nodeLabel: (d: any) => `${d.label} (~${formatNumber(d.value)})`,
          nodePadding: 4,
          width: 860,
          height: 425,
        },
      ];

      sankey(chartRef, onZoom, ...(args as any));
    }
  });

  return <svg className={className} ref={chartRef} />;
}
