'use client';

import Detail, { DetailProps, ListField } from '@/components/explore-section/Detail';
import SimulationReports from '@/components/explore-section/Simulations/SimulationReports';
import useDetailPage from '@/hooks/useDetailPage';
import usePathname from '@/hooks/pathname';

const fields: DetailProps[] = [
  {
    title: 'CAMPAIGN',
    field: ({ wasGeneratedBy }) => wasGeneratedBy,
  },
  {
    title: 'DIMENSION VALUES',
    field: ({ parameter }) => (
      <ListField
        items={
          parameter?.coords && Object.entries(parameter?.coords).map(([k]) => ({ id: k, label: k }))
        }
      />
    ),
  },
  {
    title: 'STARTED AT',
    field: ({ startedAtTime }) => startedAtTime,
  },
  {
    title: 'COMPLETED AT',
    field: ({ completedAt }) => completedAt,
  },
  {
    title: 'STATUS',
    field: ({ status }) => status,
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
