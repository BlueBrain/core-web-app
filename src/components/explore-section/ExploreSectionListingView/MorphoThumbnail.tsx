import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skeleton } from 'antd';
import { useInView } from 'react-intersection-observer';

import { createHeaders } from '@/util/utils';
import { useSessionAtomValue } from '@/hooks/hooks';
import { thumbnailGenerationBaseUrl } from '@/config';

export default function MorphoThumbnail({
  className,
  contentUrl,
  dpi,
  height,
  width,
}: {
  className?: string;
  contentUrl: string;
  dpi?: number;
  height: number;
  width: number;
}) {
  const session = useSessionAtomValue();
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const { accessToken } = session ?? { accessToken: undefined };

    if (accessToken && inView) {
      setLoading(true);

      const encodedContentUrl = encodeURIComponent(contentUrl);
      const requestUrl = `${thumbnailGenerationBaseUrl}/generate/morphology-image?content_url=${encodedContentUrl}${
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
  }, [contentUrl, dpi, session, inView]);

  return (
    <div ref={ref} className="flex items-center justify-start" style={{ height, width }}>
      {thumbnail ? (
        <Image
          alt={`Morphology preview: ${contentUrl}`}
          className={className}
          height={height}
          src={thumbnail}
          width={width}
        />
      ) : (
        <Skeleton.Image
          active={loading}
          className="!h-full rounded-none !w-full"
          rootClassName="!h-full !w-full"
        />
      )}
    </div>
  );
}
