'use client';

import Detail from '@/components/explore-section/Detail';
import { SimulationCampaignResource } from '@/types/explore-section/resources';
import Simulations from '@/components/explore-section/Simulations';
import { DetailProps } from '@/types/explore-section/application';
import { Field } from '@/constants/explore-section/fields-config/enums';

const fields: DetailProps[] = [
  {
    field: Field.Description,
  },
  {
    field: Field.BrainConfiguration,
  },
  {
    field: Field.Dimensions,
  },
  {
    field: Field.Attributes,
  },
  {
    field: Field.Tags,
  },
  {
    field: Field.SimulationCampaignStatus,
  },
  {
    field: Field.CreatedBy,
  },
  {
    field: Field.CreatedAt,
  },
];

export default function SimulationCampaignDetailPage() {
  return (
    <Detail fields={fields}>
      {(detail) => (
        <div>
          <hr />
          <Simulations resource={detail as unknown as SimulationCampaignResource} />
        </div>
      )}
    </Detail>
  );
}
