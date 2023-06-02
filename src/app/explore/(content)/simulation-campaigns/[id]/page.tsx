'use client';

import { Key, ReactNode, Suspense } from 'react';
import mockData from './mock-data.json';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import { DetailProps, ListField } from '@/components/explore-section/Detail';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import { DeltaResource } from '@/types/explore-section';
import useExploreSerializedFields from '@/hooks/useExploreSerializedFields';
import { classNames } from '@/util/utils';
import Simulations from '@/components/explore-section/Simulations';

type FieldPropKeys = 'title' | 'field';

type FieldProps = Record<FieldPropKeys, ReactNode> & { className?: string };
function Field({ title, field, className }: FieldProps) {
  return (
    <div className={classNames('text-primary-7 text-xs mr-10', className)}>
      <div className="text-xs uppercase text-neutral-4">{title}</div>
      <div className="mt-3">{field}</div>
    </div>
  );
}

// TODO: This is a component that duplicates the Detail component to replace real data with mock. It should be replaced by <Detail />
function SimulationCampaignDetail({
  fields,
  children,
}: {
  fields: DetailProps[];
  children?: (detail: DeltaResource) => ReactNode;
}) {
  // @ts-ignore
  const detail = mockData as DeltaResource;
  // @ts-ignore
  const serializedFields = useExploreSerializedFields(mockData);
  return (
    <div className="flex h-screen">
      <div className="bg-white w-full h-full overflow-scroll p-7 pr-12 flex flex-col gap-7">
        <div className="flex flex-col gap-10 max-w-screen-2xl">
          <DetailHeaderName detail={detail} url="/simulation-campaigns/test" latestRevision={1} />
          <div className="grid gap-4 grid-cols-6">
            {fields.map(
              ({ className, field, title }) =>
                serializedFields && (
                  <Field
                    key={title as Key}
                    className={className}
                    title={typeof title === 'function' ? title(serializedFields) : title}
                    field={typeof field === 'function' ? field(serializedFields) : field}
                  />
                )
            )}
          </div>
        </div>
        {children && detail && children(detail)}
      </div>
    </div>
  );
}

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
    field: ({ dimensions }) => dimensions,
  },
  {
    title: 'Attribute',
    field: ({ attribute }) => attribute,
  },
  {
    title: 'Tags',
    field: ({ tags }) => tags,
  },
  {
    title: 'Status',
    field: ({ status }) => status,
  },
  {
    title: ({ contributors }) => (contributors?.length === 1 ? 'Contributor' : 'Contributors'),
    field: ({ contributors }) => <ListField items={contributors} />,
  },
  {
    title: 'Updated At',
    field: ({ updatedAt }) => updatedAt,
  },
];

export default function SimulationCampaignDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <SimulationCampaignDetail fields={fields}>
        {(detail: DeltaResource) => (
          <div>
            <hr />
            <Simulations resource={detail} />
          </div>
        )}
      </SimulationCampaignDetail>
    </Suspense>
  );
}
