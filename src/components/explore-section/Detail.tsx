import { Key, ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import Error from 'next/error';
import { useSession } from 'next-auth/react';
import { loadable } from 'jotai/utils';
import { DetailsPageSideBackLink } from '@/components/explore-section/Sidebar';
import { detailAtom } from '@/state/explore-section/detail-view-atoms';
import usePathname from '@/hooks/pathname';
import { ExploreDeltaResource, SimulationCampaign } from '@/types/explore-section/delta';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import { classNames } from '@/util/utils';
import EXPLORE_FIELDS_CONFIG, {
  ExploreFieldConfig,
} from '@/constants/explore-section/explore-fields-config';

type FieldProps = { field: string; className?: string; data: ExploreDeltaResource };

export type DetailProps = { field: string; className?: string };

function Field({ field, className, data }: FieldProps) {
  const fieldObj = EXPLORE_FIELDS_CONFIG[field] as ExploreFieldConfig;
  return (
    <div className={classNames('text-primary-7 text-xs mr-10', className)}>
      <div className="text-xs uppercase text-neutral-4">{fieldObj.title}</div>
      <div className="mt-3">
        {fieldObj.render?.detailViewFn && fieldObj.render?.detailViewFn(data)}
      </div>
    </div>
  );
}

const detailAtomLoadable = loadable(detailAtom);

export default function Detail({
  fields,
  children,
}: {
  fields: DetailProps[];
  children?: (detail: ExploreDeltaResource | SimulationCampaign) => ReactNode;
}) {
  const { data: session } = useSession();
  const path = usePathname();
  const detail = useAtomValue(detailAtomLoadable);

  if (detail.state === 'loading' || !session) {
    return <CentralLoadingSpinner />;
  }

  if (detail.state === 'hasError') {
    return <Error statusCode={400} title="Something went wrong while fetching the data" />;
  }

  // if (detail?.data?.reason) {
  //     return <Error statusCode={404} title={detail?.data?.reason} />;
  //   }

  if (detail.data === null) {
    return <>Not Found</>;
  }

  return (
    <div className="flex h-screen">
      <DetailsPageSideBackLink />
      <div className="bg-white w-full h-full overflow-scroll p-7 pr-12 flex flex-col gap-7">
        <div className="flex flex-col gap-10 max-w-screen-2xl">
          <DetailHeaderName detail={detail.data} url={path} />
          <div className="grid gap-4 grid-cols-6 break-words">
            {fields.map(
              ({ className, field }) =>
                detail.data && (
                  <Field
                    key={field as Key}
                    className={className}
                    field={field}
                    data={detail.data}
                  />
                )
            )}
          </div>
        </div>
        {children && detail.data && children(detail.data)}
      </div>
    </div>
  );
}
