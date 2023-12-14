import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skeleton } from 'antd';
import { useInView } from 'react-intersection-observer';

import { createHeaders } from '@/util/utils';
import { useSessionAtomValue } from '@/hooks/hooks';
import { kgInferenceBaseUrl } from '@/config';

export default function MorphoThumbnail({ contentUrl }: { contentUrl: string }) {
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
      const requestUrl = `${kgInferenceBaseUrl}/generate/morphology-image?content_url=${encodedContentUrl}`;

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
  }, [contentUrl, session, inView]);

  return (
    <div ref={ref} className="h-auto flex items-center justify-start">
      {thumbnail ? (
        <Image
          alt={`Morphology preview: ${contentUrl}`}
          className="max-h-[116px] border border-neutral-2"
          src={thumbnail}
          width={184}
          height={116}
        />
      ) : (
        <Skeleton.Image active={loading} className="!w-[184px] !h-[116px] rounded-none" />
      )}
    </div>
  );
}
