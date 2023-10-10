import { Key, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Field } from './DetailHeader';
import { DetailProps, ResourceInfo } from '@/types/explore-section/application';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import SimilarityRules from '@/components/explore-section/SimilarityRules';
import MorphoWrapper from '@/components/explore-section/MorphoViewerContainer/MorphoWrapper';
import { MorphoViewerOptions } from '@/components/explore-section/MorphoViewerContainer/MorphologyViewer';
import { detailAtom } from '@/state/explore-section/detail-view-atoms';

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

  const [options, setOptions] = useState<MorphoViewerOptions>({
    asPolyline: false,
    focusOn: true,
    somaMode: 'fromOrphanSections',
    showScale: true,
    showOrientation: true,
    showLegend: true,
  });

  if (!detail) {
    return <div>No data available</div>;
  }

  const handleAsPolyline = () => {
    setOptions({
      ...options,
      asPolyline: !options.asPolyline,
    });
  };

  return (
    <div className="flex flex-col w-full mt-2 gap-1 pl-8">
      <div className="flex flex-row">
        <div className="flex-auto w-1/2 pr-2 h-max">
          <h1 className="text-primary-7 text-xl font-thin mx-0 mb-4">Morphology Source</h1>
          <DetailHeaderName detail={detail} url={url} withRevision={false} />
          <div className="grid gap-4 grid-cols-3 break-words mt-2">
            {fields.map(({ className, field }) => (
              <Field key={field as Key} className={className} field={field} data={detail} />
            ))}
            <SimilarityRules resourceId={resourceInfo.id} />
          </div>
        </div>
        <div className="flex-auto h-max border w-1/2 pl-2">
          <MorphoWrapper
            {...{
              resource: detail,
              options,
              onPolylineClick: handleAsPolyline,
              hideTitleOptions: true,
            }}
          />
        </div>
      </div>
      <h1 className="mt-12 text-primary-7 font-bold text-xl">
        We found these morphologies that have a similar shape:
      </h1>
    </div>
  );
}
