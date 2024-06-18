'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import ScopeCarousel from '@/components/VirtualLab/ScopeCarousel';
import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';
import GenericButton from '@/components/Global/GenericButton';

export default function VirtualLabProjectBuildPage() {
  return (
    <div className="flex h-full flex-col gap-10 pt-14">
      <ScopeCarousel />
      <div className="flex h-full flex-col">
        <div className="flex justify-between">
          <GenericButton text="Models" className="bg-white text-2xl font-bold text-primary-8" />
          <GenericButton
            text="New model ＋"
            className="bg-primary-6 text-white"
            href="build/me-model/new/morphology/reconstructed"
          />
        </div>
        <div id="explore-table-container-for-observable" className="h-full">
          <ExploreSectionListingView
            dataType={DataType.CircuitMEModel}
            brainRegionSource="selected"
            selectionType="radio"
            enableDownload
            renderButton={() => (
              <Btn className="fit-content sticky bottom-0 ml-auto w-fit bg-secondary-2" disabled>
                Use ME-Model
              </Btn>
            )}
          />
        </div>
      </div>
    </div>
  );
}
