'use client';

import ObservatoryNavItem from '@/components/ObservatoryNavItem';
import styles from './observatory.module.scss';

export default function Observatory() {
  return (
    <div className={styles.container}>
      <div className={styles.braincells}>
        <ObservatoryNavItem
          title="Brain & cells annotations"
          text="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
          url="/simulation-campaigns"
        />
      </div>
      <div className={styles.experimental}>
        <ObservatoryNavItem
          title="Experimental Data"
          text="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
          url="/simulation-campaigns"
        />
      </div>
      <div className={styles.reconstructions}>
        <ObservatoryNavItem
          title="Digital reconstructions"
          text="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
          url="/simulation-campaigns"
        />
      </div>
      <div className={styles.simulations}>
        <ObservatoryNavItem
          title="Simulations"
          text="Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet"
          url="/simulation-campaigns"
        />
      </div>
      <div className={styles.content} />
      <div className={`${styles.info} text-sm`} style={{ paddingBottom: 12 }}>
        <h1 className="text-lg">Title</h1>
        <div>
          Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet. Posuere
          ac ut consequat semper. Curabitur vitae nunc sed velit dignissim sodales ut eu sem.
          Curabitur vitae nunc sed velit dignissim sodales. Commodo odio aenean sed adipiscing diam
          donec adipiscing. Lacus sed turpis tincidunt id aliquet risus feugiat. Vitae tortor
          condimentum lacinia quis vel eros donec ac odio. Pretium fusce id velit ut tortor pretium
          viverra suspendisse.
        </div>
        <button type="button" className="text-xs">
          Start Exploring
        </button>
      </div>
    </div>
  );
}
