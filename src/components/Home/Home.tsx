import SimplePanel from './panel/SimplePanel';
import VideoPanel from './panel/VideoPanel';
import Theme from '@/styles/theme.module.css';
import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <VideoPanel />

      <SimplePanel className={Theme.colorPrimary9} title="Explore" link="/explore">
        Explore a large collection of neuronal models, virtual simulations, and brain cell
        distribution in a 3D and interactive manner.
      </SimplePanel>

      <SimplePanel className={Theme.colorPrimary8} title="Build" link="/build/load-brain-config">
        Build your own brain configurations by customizing the cell compositions, assigning neuronal
        models and configuring the desired connectivity pattern.
      </SimplePanel>

      <SimplePanel className={Theme.colorPrimary7} title="Simulate" link="/simulate">
        Run your own virtual experiments and simulations.
      </SimplePanel>
    </div>
  );
}
