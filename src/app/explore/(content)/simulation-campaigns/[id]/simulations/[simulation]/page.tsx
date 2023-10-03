'use client';

import Detail, { DetailProps } from '@/components/explore-section/Detail';
import SimulationReports from '@/components/explore-section/Simulations/SimulationReports';

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
