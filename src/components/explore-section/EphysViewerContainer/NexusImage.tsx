import React from 'react';
import { Skeleton, Spin, Image } from 'antd';
import './styles/nexus-image.scss';
import { useAtomValue } from 'jotai';
import { fetchFileByUrl } from '@/api/nexus';
import sessionAtom from '@/state/session';
import { composeUrl } from '@/util/nexus';

export interface NexusImageContainerProps {
  imageUrl: string; // nexus selfUrl, if org ond project will be treated as nexus id
  org?: string;
  project?: string;
}

export function NexusImage(props: NexusImageContainerProps) {
  const { imageUrl, org, project } = props;
  const session = useAtomValue(sessionAtom);
  const [loading, setLoading] = React.useState(true);
  const [imageData, setImageData] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!session) return;
    const url = composeUrl('file', imageUrl, { org, project });
    fetchFileByUrl(url, session)
      .then((res) => res.blob())
      .then((imageResponse) => {
        const data = URL.createObjectURL(imageResponse);
        setImageData(data);
        return () => URL.revokeObjectURL(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [imageUrl, org, project, session]);
  return (
    <>
      {loading && (
        <Spin spinning={loading}>
          <Skeleton.Image />
        </Spin>
      )}
      {imageData && <Image className="cursor-pointer" src={imageData} />}
    </>
  );
}

export default NexusImage;
