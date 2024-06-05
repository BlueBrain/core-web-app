import { ReactNode } from 'react';
import { EditOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { basePath } from '@/config';
import { generateLabUrl } from '@/util/virtual-lab/urls';
import styles from './virtual-lab-banner.module.css';

type Props = {
  id?: string;
  name?: string;
  description?: string;
  bottomElements: ReactNode;
  supertitle?: string | null;
  withLink?: boolean;
  withEditButton?: boolean;
};

export default function VirtualLabBanner({
  name,
  description,
  id,
  bottomElements,
  supertitle = 'Virtual Lab Name',
  withLink = false,
  withEditButton = false,
}: Props) {
  const labUrl = id && generateLabUrl(id);

  return (
    <div className="relative flex min-h-[250px] flex-col justify-between gap-4 bg-primary-8 p-8">
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${basePath}/images/virtual-lab/obp_hippocampus_original.png)`,
        }}
      />
      <div className="z-10 flex flex-row justify-between">
        <div className="flex max-w-[70%] flex-col gap-2">
          <div>
            <div className="text-primary-2">{supertitle}</div>
            {withLink ? (
              <Link className="text-5xl font-bold" href={`${labUrl}/overview`}>
                {name}
              </Link>
            ) : (
              <div className="text-5xl font-bold">{name}</div>
            )}
          </div>
          <div>{description}</div>
        </div>
        {withEditButton && <EditOutlined />}
      </div>
      {bottomElements}
    </div>
  );
}
