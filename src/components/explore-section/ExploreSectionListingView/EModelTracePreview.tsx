'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useInView } from 'react-intersection-observer';
import { EModel } from '@/types/e-model';
import { fetchFileByUrl } from '@/api/nexus';
import { useSessionAtomValue } from '@/hooks/hooks';
import { composeUrl } from '@/util/nexus';

export default function EModelTracePreview({
  className,
  emodel,
  height,
  width,
}: {
  className?: string;
  emodel: EModel;
  height: number;
  width: number;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSessionAtomValue();
  const { ref, inView } = useInView();

  const { image } = emodel;

  useEffect(() => {
    if (!image || !session || !inView) return;

    const fetchFile = async (url: string) => {
      setLoading(true);
      fetchFileByUrl(url, session).then((res) => {
        res.blob().then((blob) => {
          setSrc(URL.createObjectURL(blob));
          setLoading(false);
        });
      });
    };

    if (image.length === 1) {
      const id = image[0]['@id'];
      const url = composeUrl('file', id);
      fetchFile(url);
    } else if (image.length > 1) {
      const thumbnailImgObj = image.find((i) => i.about?.endsWith('thumbnail'));
      if (!thumbnailImgObj) {
        throw new Error('No thumbnail image found in image array.');
      }
      const id = thumbnailImgObj['@id'];
      const url = composeUrl('file', id);
      fetchFile(url);
    }
  }, [session, image, inView]);

  if (!Array.isArray(image)) {
    throw new Error('Image attribute is not an array.');
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!image || !src) {
    return <div ref={ref}>Not available</div>;
  }

  return (
    <Image
      alt="E-Model trace preview"
      className={className}
      height={height}
      src={src}
      width={width}
    />
  );
}
