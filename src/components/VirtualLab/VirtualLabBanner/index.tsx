import { ReactNode } from 'react';
import { EditOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { basePath } from '@/config';
import { generateLabUrl } from '@/util/virtual-lab/urls';
import styles from './virtual-lab-banner.module.css';

type Props = {
  id: string;
  name: string;
  description: string;
  bottomElements: ReactNode;
  supertitle?: string | null;
  withEditButton?: boolean;
};

export default function VirtualLabBanner({
  name,
  description,
  id,
  bottomElements,
  supertitle = 'Virtual Lab Name',
  withEditButton = false,
}: Props) {
  const labUrl = generateLabUrl(id);

  return (
    <div className="relative min-h-[250px] bg-primary-8 hover:brightness-110">
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${basePath}/images/virtual-lab/obp_hippocampus_original.png)`,
        }}
      />
      <Link
        className="absolute left-0 top-0 flex h-full w-full flex-col p-8"
        href={`${labUrl}/overview`}
      >
        <div className="flex grow flex-row justify-between">
          <div className="flex max-w-[70%] flex-col gap-2">
            <div className="text-primary-2">{supertitle}</div>
            <span className="text-5xl font-bold">{name}</span>
            <div>{description}</div>
          </div>
          {withEditButton && <EditOutlined />}
        </div>
        <div className="mt-auto">{bottomElements}</div>
      </Link>
    </div>
  );
}
