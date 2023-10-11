import { DeltaResource } from '@/types/explore-section/resources';
import { DetailProps } from '@/types/explore-section/application';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import { classNames } from '@/util/utils';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/explore-fields-config';

type FieldProps = { field: string; className?: string; data: DeltaResource };

export function Field({ field, className, data }: FieldProps) {
  const fieldObj = EXPLORE_FIELDS_CONFIG[field];

  return (
    <div className={classNames('text-primary-7 text-xs mr-10', className)}>
      <div className="text-xs uppercase text-neutral-4">{fieldObj.title}</div>
      <div className="mt-3">
        {fieldObj.render?.detailViewFn && fieldObj.render?.detailViewFn(data)}
      </div>
    </div>
  );
}

export default function DetailHeader({
  fields,
  detail,
  url,
}: {
  fields: DetailProps[];
  detail: DeltaResource | undefined;
  url?: string | null;
}) {
  if (!detail) return null;

  return (
    <div className="flex flex-col gap-10 max-w-screen-2xl">
      <DetailHeaderName detail={detail} url={url} />
      <div className="grid gap-4 grid-cols-6 break-words">
        {fields.map(({ className, field }) => (
          <Field key={field} className={className} field={field} data={detail} />
        ))}
      </div>
    </div>
  );
}
