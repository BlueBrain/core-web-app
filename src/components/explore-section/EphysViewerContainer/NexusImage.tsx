import React, { useMemo } from 'react';
import { Skeleton, Spin, Image } from 'antd';
import './styles/nexus-image.scss';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import createNexusImageDataAtom from '@/components/explore-section/EphysViewerContainer/state/NexusImageDataAtom';

export interface NexusImageContainerProps {
  imageUrl: string; // nexus selfUrl, if org ond project will be treated as nexus id
  org: string;
  project: string;
}

export function NexusImage(props: NexusImageContainerProps) {
  const { imageUrl, org, project } = props;
  const loadableDataFetcher = useMemo(
    () => loadable(createNexusImageDataAtom(imageUrl, org, project)),
    [imageUrl, org, project]
  );
  const dataAtom = useAtomValue(loadableDataFetcher);

  if (dataAtom.state === 'loading') {
    return (
      <Spin spinning>
        <Skeleton.Image />
      </Spin>
    );
  }
  if (dataAtom.state === 'hasError') {
    return <div>Image with url {imageUrl} could not be fetched</div>;
  }
  return dataAtom.data ? <Image className="cursor-pointer" src={dataAtom.data} /> : null;
}

export default NexusImage;
