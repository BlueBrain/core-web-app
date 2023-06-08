import { Key, ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import Error from 'next/error';
import { useSession } from 'next-auth/react';
import { loadable } from 'jotai/utils';
import { DetailsPageSideBackLink } from '@/components/explore-section/Sidebar';
import { detailAtom } from '@/state/explore-section/detail-atoms-constructor';
import usePathname from '@/hooks/pathname';
import { DeltaResource, SideLink, SerializedDeltaResource, IdLabel } from '@/types/explore-section';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import useExploreSerializedFields from '@/hooks/useExploreSerializedFields';
import { classNames } from '@/util/utils';

type FieldPropKeys = 'title' | 'field';

type FieldProps = Record<FieldPropKeys, ReactNode> & { className?: string };

export type DetailProps = Record<
  FieldPropKeys,
  ReactNode | ((detail: SerializedDeltaResource) => ReactNode)
> & { className?: string };

function Field({ title, field, className }: FieldProps) {
  return (
    <div className={classNames('text-primary-7 text-xs mr-10', className)}>
      <div className="text-xs uppercase text-neutral-4">{title}</div>
      <div className="mt-3">{field}</div>
    </div>
  );
}

export function ListField({ items }: { items: IdLabel[] | undefined | null }) {
  if (!items) return null;
  return (
    <ul>
      {items?.map((item) => (
        <li key={item.id} className="break-words">
          {item.label}
        </li>
      ))}
    </ul>
  );
}

const detailAtomLoadable = loadable(detailAtom);

export default function Detail({
  fields,
  children,
  links,
}: {
  fields: DetailProps[];
  children?: (detail: DeltaResource) => ReactNode;
  links: Array<SideLink>;
}) {
  const { data: session } = useSession();
  const path = usePathname();
  const detail = useAtomValue(detailAtomLoadable);

  const serializedFields = useExploreSerializedFields(
    detail.state === 'hasData' ? detail?.data : null
  );

  if (detail.state === 'loading' || !session) {
    return <CentralLoadingSpinner />;
  }

  if (detail.state === 'hasError') {
    return <Error statusCode={400} title="Something went wrong while fetching the data" />;
  }

  if (detail?.data?.reason) {
    return <Error statusCode={404} title={detail?.data?.reason} />;
  }

  if (detail.data === null) {
    return <>Not Found</>;
  }

  return (
    <div className="flex h-screen">
      <DetailsPageSideBackLink links={links} />
      <div className="bg-white w-full h-full overflow-scroll p-7 pr-12 flex flex-col gap-7">
        <div className="flex flex-col gap-10 max-w-screen-2xl">
          <DetailHeaderName detail={detail.data} url={path} />
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
        {children && detail.data && children(detail.data)}
      </div>
    </div>
  );
}
