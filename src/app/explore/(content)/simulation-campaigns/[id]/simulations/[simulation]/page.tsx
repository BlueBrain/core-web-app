'use client';

import Detail from '@/components/explore-section/Detail';
import SimulationReports from '@/components/explore-section/Simulations/SimulationReports';
import { DetailProps } from '@/types/explore-section/application';

const fields: DetailProps[] = [
  {
    field: 'campaign',
  },
  {
    field: 'dimensions',
  },
  {
    field: 'startedAt',
  },
  {
    field: 'completedAt',
  },
  {
    field: 'simulationStatus',
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
