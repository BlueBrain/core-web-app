import { DetailProps } from '@/types/explore-section/application';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import { classNames } from '@/util/utils';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { EntityResource } from '@/types/nexus';

type FieldProps<T> = {
  field: string;
  className?: string;
  data: EntityResource<T>;
};

export function Field<T>({ field, className, data }: FieldProps<T>) {
  const fieldObj = EXPLORE_FIELDS_CONFIG[field];

  return (
    <div className={classNames('mr-10 text-primary-7', className)}>
      <div className="uppercase text-neutral-4">{fieldObj.title}</div>
      <div className="mt-2">
        {fieldObj.render?.deltaResourceViewFn && fieldObj.render?.deltaResourceViewFn(data)}
      </div>
    </div>
  );
}

export default function DetailHeader<T>({
  fields,
  detail,
  url,
}: {
  fields: DetailProps[];
  detail?: EntityResource<T>;
  url?: string | null;
}) {
  if (!detail) return null;

  return (
    <div className="flex max-w-screen-2xl flex-col gap-10">
      <DetailHeaderName detail={detail} url={url} />
      <div className="grid grid-cols-6 gap-4 break-words">
        {fields.map(({ className, field }) => (
          <Field key={field} className={className} field={field} data={detail} />
        ))}
      </div>
    </div>
  );
}
