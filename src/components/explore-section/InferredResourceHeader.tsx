import { Key, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import Image from 'next/image';
import { Field } from './DetailHeader';
import { DetailProps, ResourceInfo } from '@/types/explore-section/application';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import { detailAtom } from '@/state/explore-section/detail-view-atoms';
import { basePath } from '@/config';

export default function InferredResourceHeader({
  fields,
  resourceInfo,
  url,
}: {
  fields: DetailProps[];
  resourceInfo: ResourceInfo;
  url?: string | null;
}) {
  const detail = useAtomValue(useMemo(() => unwrap(detailAtom(resourceInfo)), [resourceInfo]));

  if (!detail) {
    return <div>No data available</div>;
  }

  return (
    <div className="flex flex-col w-full gap-1 max-w-fit 0 pl-8">
      <h1 className="text-primary-7 text-xl font-thin mx-0">Morphology Source</h1>
      <div className="flex flex-row">
        <div className="w-1/2 pr-2">
          <DetailHeaderName detail={detail} url={url} withRevision={false} />
          <div className="grid gap-4 grid-cols-3 break-words mt-2">
            {fields.map(({ className, field }) => (
              <Field key={field as Key} className={className} field={field} data={detail} />
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-2">
          <Image
            src={`${basePath}/images/explore/morph-header.png`}
            alt="morphology plugin image"
            width={500}
            height={500}
            className="w-full max-h-full border border-gray-200"
          />
        </div>
      </div>
      <h1 className="mt-4 text-primary-7 font-bold text-xl">
        We found these morphologies that have a similar shape:
      </h1>
    </div>
  );
}
