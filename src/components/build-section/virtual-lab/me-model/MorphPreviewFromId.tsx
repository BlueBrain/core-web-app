'use client';

import { useEffect, useState } from 'react';
import { Empty, Skeleton } from 'antd';

import { fetchResourceByIdUsingResolver } from '@/api/nexus';
import CardVisualization from '@/components/explore-section/CardView/CardVisualization';
import { useSessionAtomValue } from '@/hooks/hooks';
import { NeuronMorphology } from '@/types/e-model';
import { DataType } from '@/constants/explore-section/list-views';

type Props = {
  id: string;
  height?: number;
  width?: number;
};

export default function MorphPreviewFromId({ id, height, width }: Props) {
  const session = useSessionAtomValue();
  const [loading, setLoading] = useState<boolean>(false);
  const [morph, setMorph] = useState<NeuronMorphology | null>(null);

  useEffect(() => {
    if (!session || !id) return;

    setLoading(true);
    fetchResourceByIdUsingResolver<NeuronMorphology>(id, session).then((r) => {
      setMorph(r);
      setLoading(false);
    });
  }, [session, id]);

  if (!morph)
    return (
      <div className="flex items-center justify-center" style={{ height, width }}>
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
  return (
    <CardVisualization
      dataType={DataType.ExperimentalNeuronMorphology}
      resource={morph}
      height={height}
      width={width}
    />
  );
}
