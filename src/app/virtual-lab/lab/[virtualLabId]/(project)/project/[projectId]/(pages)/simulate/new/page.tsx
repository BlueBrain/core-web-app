'use client';

import GenericButton from '@/components/Global/GenericButton';
import Link from '@/components/Link';
import { ServerSideComponentProp } from '@/types/common';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';

export default function VirtualLabProjectSimulateNewPage({
  params: { virtualLabId, projectId },
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const simulatePage = `/virtual-lab/lab/${virtualLabId}/project/${projectId}/simulate`;

  return (
    <div className="flex flex-col pt-14">
      <div className="flex align-middle">
        <div className="text-2xl font-bold text-white">Create new simulation</div>
        <div className="grow" />
        <Link href={simulatePage}>
          <GenericButton text="Cancel" className="text-white hover:text-white" />
        </Link>
      </div>
      {/* TODO: replace this list with items saved in Model Library */}
      <div className="h-[70vh]" id="explore-table-container-for-observable">
        <ExploreSectionListingView
          dataType={DataType.CircuitMEModel}
          brainRegionSource="selected"
          selectionType="radio"
          enableDownload
          renderButton={() => (
            <Btn className="fit-content sticky bottom-0 ml-auto w-fit bg-secondary-2">
              New Simulation
            </Btn>
          )}
        />
      </div>
    </div>
  );
}
