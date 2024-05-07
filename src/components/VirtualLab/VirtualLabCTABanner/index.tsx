import { basePath } from '@/config';
import styles from './virtual-lab-cta-banner.module.css';

export default function VirtualLabCTABanner() {
  return (
    <div className="relative mt-10 flex rounded-xl bg-gradient-to-r from-[#345D36] to-[#6DC371] p-8">
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${basePath}/images/virtual-lab/obp_hippocampus_original.png)`,
        }}
      />
      <div className="flex flex-col gap-2">
        <h4 className="text-2xl font-bold">Create your first project</h4>
        <p>
          In order to start exploring brain regions, building models and simulate neuron, create a
          project
        </p>
      </div>
    </div>
  );
}
