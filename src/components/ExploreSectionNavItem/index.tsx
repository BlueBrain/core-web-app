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
      <button type="button">Browse</button>
    </Link>
  );
}

export function ExploreGroupNav() {
  return (
    <div className={styles.containerSub}>
      <div className={styles.ephys}>
        <Link href="/observatory/electrophysiology">
          <div>
            <h1>Neuron electrophysiology</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
      <div className={styles.morph}>
        <Link href="/observatory/morphology">
          <div>
            <h1>Neuron morphologies</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
      <div className={styles.bouton}>
        <Link href="/observatory/bouton-density">
          <div>
            <h1>Bouton density</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
      <div className={styles.neuron}>
        <Link href="/observatory/neuron-density">
          <div>
            <h1>Neuron density</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
      <div className={styles.layer}>
        <Link href="/observatory/layer-thickness">
          <div>
            <h1>Layer thickness</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
      <div className={styles.pair}>
        <Link href="/observatory/pair-recording">
          <div>
            <h1>Pair recording</h1>
            <PlusOutlined />
          </div>
        </Link>
      </div>
    </div>
  );
}
