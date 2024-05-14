'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useInView } from 'react-intersection-observer';
import { ESeModel } from '@/types/explore-section/es';
import { fetchFileByUrl } from '@/api/nexus';
import { useSessionAtomValue } from '@/hooks/hooks';
import { composeUrl } from '@/util/nexus';

export default function EModelTracePreview({
  className,
  images,
  height,
  width,
}: {
  className?: string;
  images: ESeModel['image'];
  height: number;
  width: number;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSessionAtomValue();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!images || !session || !inView) return;

    const fetchFile = async (url: string) => {
      setLoading(true);
      fetchFileByUrl(url, session).then((res) => {
        res.blob().then((blob) => {
          setSrc(URL.createObjectURL(blob));
          setLoading(false);
        });
      });
    };

    if (Array.isArray(images)) {
      if (images.length === 1) {
        const id = images[0]['@id'];
        const url = composeUrl('file', id);
        fetchFile(url);
      } else if (images.length > 1) {
        const thumbnailImgObj = images.find((i) => i.about?.endsWith('thumbnail'));
        if (!thumbnailImgObj) {
          setSrc(null);
          setLoading(false);
          return;
        }
        const id = thumbnailImgObj['@id'];
        const url = composeUrl('file', id);
        fetchFile(url);
      }
    } else {
      const id = images['@id'];
      const url = composeUrl('file', id);
      fetchFile(url);
    }
  }, [session, images, inView]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!images || !src) {
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
