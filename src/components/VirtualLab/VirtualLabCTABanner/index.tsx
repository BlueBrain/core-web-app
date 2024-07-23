import { basePath } from '@/config';
import styles from './virtual-lab-cta-banner.module.css';

type Props = {
  title: string;
  subtitle: string;
  onClick?: () => void;
};

export default function VirtualLabCTABanner({ title, subtitle, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative mt-10 flex w-full rounded-xl bg-gradient-to-r from-[#345D36] to-[#6DC371] p-8"
    >
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${basePath}/images/virtual-lab/obp_hippocampus_original.png)`,
        }}
      />
      <div className="z-[2] flex flex-col gap-2 text-left">
        <h4 className="text-2xl font-bold">{title}</h4>
        <p>{subtitle}</p>
      </div>
    </button>
  );
}
