'use client';

import { Key, ReactNode, Suspense } from 'react';
import { useAtomValue } from 'jotai';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import { DetailProps, ListField } from '@/components/explore-section/Detail';
import { DeltaResource } from '@/types/explore-section/resources';
import useExploreSerializedFields from '@/hooks/useExploreSerializedFields';
import { classNames } from '@/util/utils';
import SimulationReports from '@/components/explore-section/Simulations/SimulationReports';
import { simulationAtom } from '@/state/explore-section/simulation-campaign';
import SimulationCampaignTitle from '@/components/explore-section/SimulationCampaignTitle';

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
function SimulationDetail({
  fields,
  children,
}: {
  fields: DetailProps[];
  children?: (detail: DeltaResource) => ReactNode;
}) {
  // @ts-ignore
  const detail = useAtomValue(simulationAtom) as DeltaResource;
  // @ts-ignore
  const serializedFields = useExploreSerializedFields(detail);
  return (
    <div className="flex h-screen">
      <div className="bg-white w-full h-full overflow-scroll p-7 pr-12 flex flex-col gap-7">
        <div className="flex flex-col gap-10 max-w-screen-2xl">
          <div className="grid gap-4 grid-cols-6 break-words">
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
    title: 'CAMPAIGN',
    field: () => <SimulationCampaignTitle />,
  },
  {
    title: 'DIMENSION VALUES',
    field: ({ dimensions }) => <ListField items={dimensions} />,
  },
  {
    title: 'STARTED AT',
    field: ({ startedAt }) => startedAt,
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
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <SimulationDetail fields={fields}>{() => <SimulationReports />}</SimulationDetail>
    </Suspense>
  );
}
