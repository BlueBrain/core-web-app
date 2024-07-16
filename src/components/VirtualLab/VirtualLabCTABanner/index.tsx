'use client';

import Link from 'next/link';
import { basePath } from '@/config';
import { useAtom } from '@/state/state';
import styles from './virtual-lab-cta-banner.module.css';

type Props = {
  id?: string;
  title: string;
  subtitle: string;
};

export default function VirtualLabCTABanner({ title, subtitle, id }: Props) {
  const [, setNewProjectModalOpenAtom] = useAtom<boolean>('new-project-modal-open');

  return (
    <Link
      onClick={() => {
        if (id) setNewProjectModalOpenAtom(true);
      }}
      href={id ? `/virtual-lab/lab/${id}/projects` : '#'}
      className="relative mt-10 flex rounded-xl bg-gradient-to-r from-[#345D36] to-[#6DC371] p-8"
    >
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${basePath}/images/virtual-lab/obp_hippocampus_original.png)`,
        }}
      />
      <div className="z-[2] flex flex-col gap-2">
        <h4 className="text-2xl font-bold">{title}</h4>
        <p>{subtitle}</p>
      </div>
    </Link>
  );
}
