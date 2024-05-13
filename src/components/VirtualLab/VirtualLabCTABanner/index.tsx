import { basePath } from '@/config';
import styles from './virtual-lab-cta-banner.module.css';

type Props = {
  title: string;
  subtitle: string;
};

export default function VirtualLabCTABanner({ title, subtitle }: Props) {
  return (
    <div className="relative mt-10 flex rounded-xl bg-gradient-to-r from-[#345D36] to-[#6DC371] p-8">
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${basePath}/images/virtual-lab/obp_hippocampus_original.png)`,
        }}
      />
      <div className="flex flex-col gap-2">
        <h4 className="text-2xl font-bold">{title}</h4>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
