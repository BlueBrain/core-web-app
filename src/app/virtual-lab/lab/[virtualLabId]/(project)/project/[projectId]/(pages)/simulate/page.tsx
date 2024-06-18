'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';
import GenericButton from '@/components/Global/GenericButton';

export default function VirtualLabProjectSimulatePage() {
  return (
    <div className="flex h-full flex-col pt-14">
      <div className="flex justify-between">
        <GenericButton text="Simulations" className="bg-white text-2xl font-bold text-primary-8" />
        <GenericButton
          text="New simulation ＋"
          className="bg-primary-6 text-white"
          href="simulate/new"
        />
      </div>
      <div id="explore-table-container-for-observable" className="h-screen">
        <ExploreSectionListingView
          dataType={DataType.SimulationCampaigns}
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
