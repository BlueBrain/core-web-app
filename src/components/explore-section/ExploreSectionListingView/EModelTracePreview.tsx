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

    if (imagesArray.length === 0) {
      setSrc(null);
      setLoading(false);
      return;
    }

    const thumbnailImgObj =
      imagesArray.find((i) => i.about?.endsWith('thumbnail')) ?? imagesArray[0];

    const id = thumbnailImgObj['@id'];
    const [org, project] = id.split('/').slice(-3, -1);
    const url = composeUrl('file', id, { org, project });

    fetchFile(url);
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
