'use client';

import { useState } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import {
  ExploreNavItem,
  ExploreGroupNav,
} from '@/components/explore-section/ExploreSectionNavItem';
import Link from '@/components/Link';
import { basePath } from '@/config';
import styles from '@/app/explore/explore.module.scss';

export default function Explore() {
  const bgUrl = `url(${basePath}/images/img_3d-interactive-brain_placeholder.jpg) no-repeat`;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className={styles.container}>
      <div className={styles.exploreHeader}>
        <Link href="/explore">
          <h1>Explore</h1>
          <p className="leading-5 text-primary-2">
            Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet
          </p>
          <button type="button">
            <ArrowLeftOutlined />
            Back home
          </button>
        </Link>
      </div>
      <div className={open ? styles.themeBlack : styles.braincells}>
        <ExploreNavItem
          title="Brain & cells annotations"
          text="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
          url="/explore/simulation-campaigns"
        />
      </div>
      <div className={styles.experimental}>
        <div
          onClick={() => setOpen(!open)}
          role="menuitem"
          tabIndex={0}
          onKeyDown={() => setOpen(!open)}
        >
          <h1>Experimental data</h1>
          <p>Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet</p>
          <ArrowRightOutlined />
        </div>
        <div style={{ visibility: open ? 'visible' : 'hidden' }}>
          <ExploreGroupNav />
        </div>
      </div>
      <div className={open ? styles.themeBlack : styles.reconstructions}>
        <ExploreNavItem
          title="Brain models"
          text="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
          url="/explore/simulation-campaigns"
        />
      </div>
      <div className={open ? styles.themeBlack : styles.simulations}>
        <ExploreNavItem
          title="Simulations"
          text="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
          url="/explore/simulation-campaigns"
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
