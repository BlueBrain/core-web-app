'use client';

import Detail from '@/components/explore-section/Detail';
import SimulationReports from '@/components/explore-section/Simulations/SimulationReports';
import { DetailProps } from '@/types/explore-section/application';
import { Field } from '@/constants/explore-section/fields-config/enums';

const fields: DetailProps[] = [
  {
    field: Field.Campaign,
  },
  {
    field: Field.Dimensions,
  },
  {
    field: Field.StartedAt,
  },
  {
    field: Field.CompletedAt,
  },
  {
    field: Field.SimulationCampaignStatus,
  },
];

export default function SimulationDetailPage() {
  return (
    <Detail fields={fields}>
      {() => (
        <div>
          <hr />
          <SimulationReports />
        </div>
      )}
    </Detail>
  );
}
