'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { Empty, Skeleton } from 'antd';

import { ESeModel } from '@/types/explore-section/es';
import { fetchFileByUrl } from '@/api/nexus';
import { useSessionAtomValue } from '@/hooks/hooks';
import { composeUrl, ensureArray } from '@/util/nexus';

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
      try {
        const res = await fetchFileByUrl(url, session);
        const blob = await res.blob();
        setSrc(URL.createObjectURL(blob));
        setLoading(false);
      } catch (e) {
        setSrc(null);
        setLoading(false);
      }
    };

    const imagesArray = ensureArray(images);
    if (imagesArray.length === 1) {
      const id = imagesArray[0]['@id'];
      const url = composeUrl('file', id);
      fetchFile(url);
    } else if (imagesArray.length > 1) {
      const thumbnailImgObj = imagesArray.find((i) => i.about?.endsWith('thumbnail'));
      if (!thumbnailImgObj) {
        setSrc(null);
        setLoading(false);
        return;
      }
      const id = thumbnailImgObj['@id'];
      const url = composeUrl('file', id);
      fetchFile(url);
    }
  }, [session, images, inView]);

  if (loading) {
    return (
      <Skeleton.Image
        active={loading}
        className="!h-full !w-full rounded-none"
        rootClassName="!h-full !w-full"
      />
    );
  }

  if (!images || !src) {
    return (
      <div ref={ref}>
        <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
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
