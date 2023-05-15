import { Button } from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  HomeOutlined,
  MinusOutlined,
  ArrowRightOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import Link from '@/components/Link';
import { SideLinkList } from '@/types/explore-section';
import styles from '@/components/explore-section/Sidebar/sidebar.module.scss';

export function DetailsPageSideBackLink({ links }: SideLinkList) {
  return (
    <div>
      {links &&
        links.map((link) => (
          <div
            key={link.url}
            className="bg-primary-8 text-light w-10 h-full flex items-start justify-center"
          >
            <Link
              href={link.url}
              className="whitespace-pre text-sm rotate-180 mt-7"
              style={{ writingMode: 'vertical-rl' }}
            >
              {link.title}
            </Link>
          </div>
        ))}
    </div>
  );
}
export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [openExp, setOpenExp] = useState<boolean>(false);
  return (
    <div className={expanded ? styles.expanded : styles.side}>
      <div>
        <Link href="/explore">Explore</Link>
        <Button
          type="text"
          onClick={() => setExpanded((isExapanded) => !isExapanded)}
          style={{ color: 'white' }}
          icon={expanded ? <MinusOutlined /> : <PlusOutlined />}
        />
      </div>

      {expanded && (
        <ul className={styles.obsNav}>
          <li>
            <Link href="/explore/simulation-campaigns">
              <h1>Brain & cells annotations</h1>
              <ArrowRightOutlined />
              <p>
                Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet.
              </p>
            </Link>
          </li>
          <li>
            <span
              onClick={() => setOpenExp(!openExp)}
              role="menuitem"
              tabIndex={0}
              onKeyDown={() => setOpenExp(!openExp)}
            >
              <h1>Experimental Data</h1>
              {openExp ? <DownOutlined /> : <PlusOutlined />}
              <p>
                Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet.
              </p>
            </span>
            <ul style={{ display: openExp ? 'block' : 'none' }}>
              <li>
                <Link href="/explore/electrophysiology">
                  Neuron electrophysiology <ArrowRightOutlined />
                </Link>
              </li>
              <li>
                <Link href="/explore/morphology">
                  Neuron morphology <ArrowRightOutlined />
                </Link>
              </li>
              <li>
                <Link href="/explore/bouton-density">
                  Bouton density <ArrowRightOutlined />
                </Link>
              </li>
              <li>
                <Link href="/explore/neuron-density">
                  Neuron density <ArrowRightOutlined />
                </Link>
              </li>
              <li>
                <Link href="/explore/layer-thickness">
                  Layer thickness <ArrowRightOutlined />
                </Link>
              </li>
              <li>
                <Link href="/explore/synapse-per-connection">
                  Synapse per connection <ArrowRightOutlined />
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="/simulation-campaigns">
              <h1>Brain models</h1>
              <ArrowRightOutlined />
              <p>
                Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet.
              </p>
            </Link>
          </li>
          <li>
            <Link href="/simulation-campaigns">
              <h1>Simulations</h1>
              <ArrowRightOutlined />
              <p>
                Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet.
              </p>
            </Link>
          </li>
        </ul>
      )}
      <ul className={styles.fixedNav}>
        <li>
          <Link href="/">
            <h2>Home</h2>
            <HomeOutlined />
          </Link>
        </li>
        <li>
          <Link href="/">
            <h2>User</h2>
            <UserOutlined />
          </Link>
        </li>
        <li className={styles.hiddenWhenCollapse}>
          <Link href="/build/load-brain-config">
            <h2>Brain lab</h2>
            <ArrowRightOutlined />
          </Link>
        </li>
        <li className={styles.hiddenWhenCollapse}>
          <Link href="/simulate">
            <h2>Brain simulation</h2>
            <ArrowRightOutlined />
          </Link>
        </li>
      </ul>
    </div>
  );
}
