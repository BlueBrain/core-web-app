import { Button } from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  HomeOutlined,
  MinusOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import Link from '@/components/Link';
import { SideLinkList } from '@/types/observatory';
import styles from '@/components/observatory/sidebar.module.scss';

export default function Sidebar({ links }: SideLinkList) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className={expanded ? styles.expanded : styles.side}>
        <div>
          <Button
            type="text"
            onClick={() => setExpanded((isExapanded) => !isExapanded)}
            style={{ color: 'white' }}
            icon={expanded ? <MinusOutlined /> : <PlusOutlined />}
          />
          <Link href="/observatory">Brain Observatory</Link>
        </div>

        {expanded && (
          <ul className={styles.obsNav}>
            <li>
              <Link href="/simulation-campaigns">
                <h1>Brain & Cells Annotations</h1>
                <ArrowRightOutlined />
                <p>
                  Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet.
                </p>
              </Link>
            </li>
            <li>
              <Link href="/electrophysiology">
                <h1>Experimental Data</h1>
                <ArrowRightOutlined />
                <p>
                  Sed turpis tincidunt id aliquet risus. Duis tristique sollicitudin nibh sit amet.
                </p>
              </Link>
            </li>
            <li>
              <Link href="/simulation-campaigns">
                <h1>Digital Reconstructions</h1>
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
              <h2>Profile</h2>
              <UserOutlined />
            </Link>
          </li>
          <li>
            <Link href="/">
              <h2>Home</h2>
              <HomeOutlined />
            </Link>
          </li>
          <li className={styles.hiddenWhenCollapse}>
            <Link href="/lab/load-brain-config">
              <h2>Brain Factory</h2>
              <ArrowRightOutlined />
            </Link>
          </li>
          <li className={styles.hiddenWhenCollapse}>
            <Link href="/simulation">
              <h2>Brain Simulation</h2>
              <ArrowRightOutlined />
            </Link>
          </li>
        </ul>
      </div>
      {links &&
        links.map((link) => (
          <div key={link.url} className="bg-primary-8 text-light w-10 h-full">
            <Link
              href={link.url}
              className="block text-sm"
              style={{ transform: 'translate(-37%, 100px) rotate(-90deg)', width: 'max-content' }}
            >
              {link.title}
            </Link>
          </div>
        ))}
    </>
  );
}
