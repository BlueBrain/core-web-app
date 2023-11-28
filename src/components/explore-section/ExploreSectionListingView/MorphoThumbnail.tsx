import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LoadingOutlined } from '@ant-design/icons';
import { createHeaders } from '@/util/utils';
import { useSessionAtomValue } from '@/hooks/hooks';

export default function MorphoThumbnail({ id }: { id: string }) {
  const session = useSessionAtomValue();

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const { accessToken } = session ?? { accessToken: undefined };

    if (accessToken) {
      setLoading(true);

      fetch(`https://kg-inference-api.kcp.bbp.epfl.ch/generate/morphology-image`, {
        method: 'POST',
        headers: createHeaders(accessToken),
        body: JSON.stringify({ id }),
      })
        .then((response) => response.blob())
        .then((blob) => {
          setThumbnail(URL.createObjectURL(blob));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, session]);

  if (loading) {
    return (
      <div className="flex items-center w-full">
        <LoadingOutlined className="mx-auto" />
      </div>
    );
  }

  return (
    thumbnail && (
      <Image alt={`Preview of morphology: ${id}`} src={thumbnail} width={181} height={111} />
    )
  );
}
