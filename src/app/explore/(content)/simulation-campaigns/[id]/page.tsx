'use client';

import Detail, { DetailProps } from '@/components/explore-section/Detail';
import { SimulationCampaignResource } from '@/types/explore-section/resources';
import Simulations from '@/components/explore-section/Simulations';

const fields: DetailProps[] = [
  {
    field: 'description',
  },
  {
    field: 'brainConfiguration',
  },
  {
    field: 'dimensions',
  },
  {
    field: 'attributes',
  },
  {
    field: 'tags',
  },
  {
    field: 'simulationCampaignStatus',
  },
  {
    field: 'createdBy',
  },
  {
    field: 'createdAt',
  },
];

export default function SimulationCampaignDetailPage() {
  return (
    <Detail fields={fields}>
      {(detail) => (
        <div>
          <hr />
          <Simulations resource={detail as SimulationCampaignResource} />
        </div>
      )}
    </Detail>
  );
}
