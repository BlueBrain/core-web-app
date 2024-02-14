'use client';

import Detail from '@/components/explore-section/Detail';
import Simulations from '@/components/explore-section/Simulations';
import { DetailProps } from '@/types/explore-section/application';
import { Simulation } from '@/types/explore-section/delta-simulation-campaigns';
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
          <Simulations resource={detail as any as Simulation} />
          {/* TODO: We need a better way to differentiate between Simulations and Experiments */}
        </div>
      )}
    </Detail>
  );
}
