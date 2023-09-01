'use client';

import Detail, { DetailProps } from '@/components/explore-section/Detail';
import SimulationReports from '@/components/explore-section/Simulations/SimulationReports';
import useDetailPage from '@/hooks/useDetailPage';
import usePathname from '@/hooks/pathname';

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
  useDetailPage(usePathname());

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
