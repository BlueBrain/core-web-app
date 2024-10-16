import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Empty, Skeleton } from 'antd';
import { useInView } from 'react-intersection-observer';

import { thumbnailGenerationBaseUrl } from '@/config';
import { DataType } from '@/constants/explore-section/list-views';
import buildQueryString from '@/util/query-params-builder';
import authFetch from '@/authFetch';

export const dataTypeToEndpoint = {
  [DataType.ExperimentalNeuronMorphology]: 'morphology-image',
  [DataType.ExperimentalElectroPhysiology]: 'trace-image',
  [DataType.SingleNeuronSimulation]: 'simulation-plot',
  [DataType.SingleNeuronSynaptomeSimulation]: 'simulation-plot',
};

export default function PreviewThumbnail({
  className,
  contentUrl,
  dpi,
  height,
  type: experimentType,
  width,
  target,
  alt = 'img preview',
}: {
  className?: string;
  contentUrl: string;
  dpi?: number;
  height: number;
  type: keyof typeof dataTypeToEndpoint;
  width: number;
  target?: 'simulation' | 'stimulus';
  alt?: string;
}) {
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  const endpoint = dataTypeToEndpoint[experimentType];

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (inView) {
      setLoading(true);

      const encodedContentUrl = encodeURIComponent(contentUrl);
      const queryParams = buildQueryString({
        dpi,
        target,
      });

      const requestUrl = `${thumbnailGenerationBaseUrl}/generate/${endpoint}?content_url=${encodedContentUrl}&${queryParams}`;

      authFetch(requestUrl, {
        method: 'GET',
        headers: { Accept: 'image/png' },
      })
        .then((response) => response.blob())
        .then((blob) => {
          if (blob.type === 'image/png') {
            setThumbnail(URL.createObjectURL(blob));
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [contentUrl, dpi, target, endpoint, inView]);

  if (thumbnail) {
    return <Image alt={alt} className={className} height={height} src={thumbnail} width={width} />;
  }

  return (
    <div ref={ref} className="flex items-center justify-center" style={{ height, width }}>
      {loading ? (
        <Skeleton.Image
          active={loading}
          className="!h-full !w-full rounded-none"
          rootClassName="!h-full !w-full"
        />
      ) : (
        <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}
