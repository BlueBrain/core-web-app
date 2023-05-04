import React, { useState, useEffect } from 'react';
import { Skeleton, Spin, Image } from 'antd';
import { NexusClient } from '@bbp/nexus-sdk';

import { parseUrl } from '@/util/explore-section/nexus-tools';

import './styles/nexus-image.scss';

export interface NexusImageContainerProps {
  imageUrl: string; // nexus selfUrl, if org ond project will be treated as nexus id
  nexus: NexusClient;
  org?: string;
  project?: string;
}

interface NexusImageProps {
  imageData: any;
}

export function NexusImageComponent(props: NexusImageProps) {
  const [data, setData] = useState<string>();
  const { imageData } = props;

  useEffect(() => {
    const imageUrl = URL.createObjectURL(imageData);
    setData(imageUrl);
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageData]);

  return data ? <Image className="cursor-pointer" src={data} /> : null;
}

export function NexusImage(props: NexusImageContainerProps) {
  const { imageUrl, nexus, org, project } = props;

  const [loading, setLoading] = React.useState(true);
  const [image, setImage] = React.useState<string | null>(null);

  const { org: imageOrg, project: imageProject } =
    org && project ? { org, project } : parseUrl(imageUrl);

  React.useEffect(() => {
    // TODO: We can implement a caching layer here based on file revision
    nexus.File.get(imageOrg, imageProject, encodeURIComponent(imageUrl), {
      as: 'blob',
    })
      .then((imageResponse) => setImage(imageResponse as string))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading && (
        <Spin spinning={loading}>
          <Skeleton.Image />
        </Spin>
      )}
      {image && <NexusImageComponent imageData={image} />}
    </>
  );
}

export default NexusImage;
