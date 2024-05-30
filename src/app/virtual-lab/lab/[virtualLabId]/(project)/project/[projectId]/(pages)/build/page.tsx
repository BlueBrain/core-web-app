'use client';

import WithExploreEModel from '@/components/explore-section/EModel/WithExploreEModel';
import ScopeCarousel from '@/components/VirtualLab/ScopeCarousel';
import { DataType } from '@/constants/explore-section/list-views';

export default function VirtualLabProjectBuildPage() {
  return (
    <div className="flex flex-col gap-10 pt-14">
      <ScopeCarousel />
      <div className="flex flex-col gap-2 bg-white px-4 pt-10">
        <h3 className="text-3xl font-bold text-primary-8">Model library</h3>
        <WithExploreEModel dataType={DataType.CircuitEModel} brainRegionSource="selected" />
      </div>
    </div>
  );
}
