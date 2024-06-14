'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import ScopeCarousel from '@/components/VirtualLab/ScopeCarousel';
import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';
import GenericButton from '@/components/Global/GenericButton';
import Link from '@/components/Link';

export default function VirtualLabProjectBuildPage() {
  return (
    <div className="flex flex-col gap-10 pt-14">
      <ScopeCarousel />
      <div className="flex flex-col">
        <div className="flex justify-between">
          <GenericButton text="Models" className="bg-white text-2xl font-bold text-primary-8" />
          <Link href="/build/me-model/build/morphology/reconstructed">
            <GenericButton text="New model ＋" className="bg-primary-6 text-white" />
          </Link>
        </div>
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
