'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';
import GenericButton from '@/components/Global/GenericButton';
import Link from '@/components/Link';

export default function VirtualLabProjectSimulatePage() {
  return (
    <div className="flex flex-col pt-14">
      <div className="flex">
        <GenericButton text="Simulations" className="bg-white text-2xl font-bold text-primary-8" />
        <div className="grow" />
        <Link href="simulate/new">
          <GenericButton text="New simulation ＋" className="bg-primary-6 text-white" />
        </Link>
      </div>
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
  );
}
