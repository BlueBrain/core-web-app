'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import GenericButton from '@/components/Global/GenericButton';

export default function VirtualLabProjectSimulatePage() {
  return (
    <div className="flex h-full flex-col pt-14">
      <div className="flex justify-between">
        <GenericButton
          text="Single neuron simulations"
          className="bg-white text-2xl font-bold text-primary-8"
        />
        <GenericButton
          text="New simulation ＋"
          className="bg-primary-6 text-white"
          href="simulate/new"
        />
      </div>
      <div id="explore-table-container-for-observable" className="h-screen">
        <ExploreSectionListingView
          dataType={DataType.SingleNeuronSimulation}
          brainRegionSource="selected"
          selectionType="radio"
          enableDownload
          renderButton={() => (
            <div className="mr-5 flex items-center justify-end gap-2">
              <GenericButton disabled className="bg-slate-400" text="View simulation" />
              <GenericButton disabled className="bg-slate-400" text="New simulation" />
            </div>
          )}
        />
      </div>
    </div>
  );
}
