import { DetailProps } from '@/types/explore-section/application';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import { classNames } from '@/util/utils';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { DetailType } from '@/constants/explore-section/fields-config/types';
import { COMMON_FIELDS } from '@/constants/explore-section/detail-views-fields';

type FieldProps = {
  field: string;
  className?: string;
  data: DetailType;
};

export function Field({ field, className, data }: FieldProps) {
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

export default function DetailHeader({
  fields,
  detail,
  url,
}: {
  fields: DetailProps[];
  detail?: DetailType | undefined;
  url?: string | null;
}) {
  if (!detail) return null;

  return (
    <div className="flex max-w-screen-2xl flex-col gap-10">
      <DetailHeaderName detail={detail} url={url} />
      <div className="flex w-full flex-row gap-x-8">
        <div className="grid w-1/2 auto-rows-max grid-cols-3 gap-x-8 gap-y-6">
          {COMMON_FIELDS.map(({ className, field }) => (
            <Field key={field} className={className} field={field} data={detail} />
          ))}
        </div>
        <div className="grid w-1/2 auto-rows-min grid-cols-3 gap-x-8 gap-y-6">
          {fields.map(({ className, field }) => (
            <Field key={field} className={className} field={field} data={detail} />
          ))}
        </div>
      </div>
    </div>
  );
}
