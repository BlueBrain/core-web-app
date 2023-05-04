import { PlusOutlined } from '@ant-design/icons';
import Link from '@/components/Link';
import styles from './group-nav.module.scss';

type Props = {
  title: string;
  text: string;
  url: string;
};

export function ExploreNavItem({ title, text, url }: Props) {
  return (
    <Link href={url}>
      <div>
        <h1>{title}</h1>
        <PlusOutlined />
      </div>
      <p>{text}</p>
    </Link>
  );
}

export function ExploreGroupNav() {
  return (
    <div className={styles.containerSub}>
      <div className={styles.ephys}>
        <Link href="/explore/electrophysiology">
          <div>
            <h1>Neuron electrophysiologies</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
      <div className={styles.morph}>
        <Link href="/explore/morphology">
          <div>
            <h1>Neuron morphologies</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
      <div className={styles.bouton}>
        <Link href="/explore/bouton-density">
          <div>
            <h1>Bouton densities</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
      <div className={styles.neuron}>
        <Link href="/explore/neuron-density">
          <div>
            <h1>Neuron densities</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
      <div className={styles.layer}>
        <Link href="/explore/layer-thickness">
          <div>
            <h1>Layer thickness</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
      <div className={styles.pair}>
        <Link href="/explore/synapse-per-connection">
          <div>
            <h1>Synapse per connection</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
    </div>
  );
}
