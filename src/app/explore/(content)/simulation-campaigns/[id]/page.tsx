'use client';

import Detail, { DetailProps, ListField } from '@/components/explore-section/Detail';
import { SimulationCampaignResource } from '@/types/explore-section/resources';
import Simulations from '@/components/explore-section/Simulations';
import useDetailPage from '@/hooks/useDetailPage';
import usePathname from '@/hooks/pathname';
import SimulationCampaignStatus from '@/components/explore-section/SimulationCampaignStatus';

const fields: DetailProps[] = [
  {
    title: 'Description',
    field: ({ description }) => description,
  },
  {
    title: 'Brain Configuration',
    field: ({ brainConfiguration }) => brainConfiguration,
  },
  {
    title: 'Dimensions',
    field: ({ parameter }) => (
      <ListField
        items={
          parameter?.coords && Object.entries(parameter?.coords).map(([k]) => ({ id: k, label: k }))
        }
      />
    ),
  },
  {
    title: 'Attributes',
    field: ({ parameter }) => (
      <ListField
        items={
          parameter?.attrs && Object.entries(parameter?.attrs).map(([k]) => ({ id: k, label: k }))
        }
      />
    ),
  },
  {
    title: 'Tags',
    field: ({ tags }) => tags,
  },
  {
    title: 'Status',
    field: <SimulationCampaignStatus />,
  },
  {
    title: 'Created By',
    field: ({ createdBy }) => createdBy,
  },
  {
    title: 'Updated',
    field: ({ updatedAt }) => updatedAt,
  },
];

export default function SimulationCampaignDetailPage() {
  useDetailPage(usePathname());

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
