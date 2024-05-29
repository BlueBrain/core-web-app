'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import ScopeCarousel from '@/components/VirtualLab/ScopeCarousel';
import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';

export default function VirtualLabProjectBuildPage() {
  return (
    <div className="flex flex-col gap-10 pt-14">
      <ScopeCarousel />
      <div className="flex flex-col gap-2 bg-white px-4 pt-10">
        <h3 className="text-3xl font-bold text-primary-8">Model library</h3>
        <ExploreSectionListingView
          dataType={DataType.CircuitMEModel}
          brainRegionSource="selected"
          selectionType="radio"
          enableDownload
          renderButton={() => (
            <Btn className="fit-content sticky bottom-0 ml-auto w-fit bg-secondary-2">
              Use ME-Model
            </Btn>
          )}
        />
      </div>
    </div>
  );
}
