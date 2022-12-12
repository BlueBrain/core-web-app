import React from 'react';
import { useAtomValue } from 'jotai/utils';
import DensityChart from '@/components/configuration-view/cell-density/DensityChart';
import DensityEditor from '@/components/configuration-view/cell-density/density-editor/DensityEditor';
import CellDensityToolbar from '@/components/configuration-view/cell-density/CellDensityToolbar';
import { compositionAtom } from '@/components/BrainRegionSelector';

export default function CellDensity() {
  const composition = useAtomValue(compositionAtom);

  return (
    <div>
      {composition && <DensityChart className="w-full" data={composition} />}
      <CellDensityToolbar />
      <DensityEditor />
    </div>
  );
}
