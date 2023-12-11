import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skeleton } from 'antd';

import { createHeaders } from '@/util/utils';
import { useSessionAtomValue } from '@/hooks/hooks';
import { BASE_URL } from '@/constants/explore-section/kg-inference';

export default function MorphoThumbnail({
  contentUrl,
  priorityLoad = false,
}: {
  contentUrl: string;
  priorityLoad: boolean;
}) {
  const session = useSessionAtomValue();

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const { accessToken } = session ?? { accessToken: undefined };

    if (accessToken) {
      setLoading(true);

      const encodedContentUrl = encodeURIComponent(contentUrl);
      const requestUrl = `${BASE_URL}/generate/morphology-image?content_url=${encodedContentUrl}`;

      const load = () => {
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
      };

      if (priorityLoad) {
        load();
      } else {
        setTimeout(load, 1500);
      }
    }
  }, [contentUrl, session, priorityLoad]);

  return thumbnail ? (
    <Image
      alt={`Morphology preview: ${contentUrl}`}
      className="mx-auto max-h-[116px]"
      src={thumbnail}
      width={184}
      height={116}
    />
  ) : (
    <Skeleton.Image active={loading} className="!w-[184px] !h-[116px]" />
  );
}
