import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Empty, Skeleton } from 'antd';
import { useInView } from 'react-intersection-observer';

import { createHeaders } from '@/util/utils';
import { useSessionAtomValue } from '@/hooks/hooks';
import { thumbnailGenerationBaseUrl } from '@/config';
import { DataType } from '@/constants/explore-section/list-views';

export const dataTypeToEndpoint = {
  [DataType.ExperimentalNeuronMorphology]: 'morphology-image',
  [DataType.ExperimentalElectroPhysiology]: 'trace-image',
};

export default function PreviewThumbnail({
  className,
  contentUrl,
  dpi,
  height,
  type: experimentType,
  width,
}: {
  className?: string;
  contentUrl: string;
  dpi?: number;
  height: number;
  type: keyof typeof dataTypeToEndpoint;
  width: number;
}) {
  const session = useSessionAtomValue();
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  const endpoint = dataTypeToEndpoint[experimentType];

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const { accessToken } = session ?? { accessToken: undefined };

    if (accessToken && inView) {
      setLoading(true);

      const encodedContentUrl = encodeURIComponent(contentUrl);
      const requestUrl = `${thumbnailGenerationBaseUrl}/generate/${endpoint}?content_url=${encodedContentUrl}${
        dpi ? `&dpi=${dpi}` : ''
      }`;

      fetch(requestUrl, {
        method: 'GET',
        headers: createHeaders(accessToken, {
          Accept: 'image/png',
        }),
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
  }, [contentUrl, dpi, endpoint, inView, session]);

  if (thumbnail) {
    return (
      <Image
        alt={`Morphology preview: ${contentUrl}`}
        className={className}
        height={height}
        src={thumbnail}
        width={width}
      />
    );
  }

  return (
    <div ref={ref} className="flex items-center justify-start" style={{ height, width }}>
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
