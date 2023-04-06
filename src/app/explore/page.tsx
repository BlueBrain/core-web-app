'use client';

import { ArrowLeftOutlined } from '@ant-design/icons';
import ExploreNavItem from '@/components/ExploreSectionNavItem';
import Link from '@/components/Link';
import { basePath } from '@/config';
import styles from './explore.module.scss';

export default function ExplorePage() {
  const bgUrl = `url(${basePath}/images/img_3d-interactive-brain_placeholder.jpg) no-repeat`;
  return (
    <div className={styles.container}>
      <div className={styles.exploreHeader}>
        <Link href="/">
          <h1>Explore</h1>
          <button type="button">
            <ArrowLeftOutlined />
            Back home
          </button>
        </Link>
      </div>
      <div className={styles.braincells}>
        <ExploreNavItem
          title="Brain & cells annotations"
          text="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
          url="/simulation-campaigns"
        />
      </div>
      <div className={styles.experimental}>
        <ExploreNavItem
          title="Electrophysiology Data"
          text="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
          url="/explore/electrophysiology"
        />
      </div>
      <div className={styles.reconstructions}>
        <ExploreNavItem
          title="Digital reconstructions"
          text="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
          url="/simulation-campaigns"
        />
      </div>
      <div className={styles.simulations}>
        <ExploreNavItem
          title="Simulations"
          text="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
          url="/simulation-campaigns"
        />
      </div>
      <div className={styles.content} style={{ background: bgUrl, backgroundSize: 'cover' }} />
      <div className={`${styles.info} text-sm`} style={{ paddingBottom: 12 }}>
        <h1 className="text-lg">Title</h1>
        <div>
          Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet. Posuere
          ac ut consequat semper. Curabitur vitae nunc sed velit dignissim sodales ut eu sem.
          Curabitur vitae nunc sed velit dignissim sodales. Commodo odio aenean sed adipiscing diam
          donec adipiscing. Lacus sed turpis tincidunt id aliquet risus feugiat. Vitae tortor
          condimentum lacinia quis vel.
        </div>
        <button type="button" className="text-xs">
          Start Exploring
        </button>
      </div>
    </div>
  );
}
