'use client';

import Link from 'next/link';
import { useReducer } from 'react';
import { useParams } from 'next/navigation';

import { classNames } from '@/util/utils';

type MenuSubSection = {
  id: string;
  title: string;
  url: string;
};

type MenuSection = {
  id: string;
  title: string;
  children: Array<MenuSubSection>;
};

const NAVIGATION_SECTIONS: Array<MenuSection> = [
  {
    id: 'explore',
    title: 'Explore',
    children: [
      { id: 'brain-mapping', title: 'Brain Mapping', url: '/about/docs/explore/brain-mapping' },
      {
        id: 'neuroimaging',
        title: 'Neuroimaging Techniques',
        url: '/about/docs/explore/neuroimaging-techniques',
      },
      {
        id: 'circuit-navigation',
        title: 'Circuit Navigation',
        url: '/about/docs/explore/circuit-navigation',
      },
      {
        id: 'data-visualization',
        title: 'Data Visualization',
        url: '/about/docs/explore/data-visualization',
      },
      {
        id: 'spatial-analysis',
        title: 'Spatial Analysis',
        url: '/about/docs/explore/spatial-analysis',
      },
      {
        id: 'connectivity-maps',
        title: 'Connectivity Maps',
        url: '/about/docs/explore/connectivity-maps',
      },
    ],
  },
  {
    id: 'build',
    title: 'Build',
    children: [
      {
        id: 'circuit-modeling-framework',
        title: 'Circuit Modeling Framework',
        url: '/about/docs/build/euron-simulation',
      },
      {
        id: 'synapse-modeling',
        title: 'Synapse Modeling',
        url: '/about/docs/build/synapse-modeling',
      },
      {
        id: 'electrophysiological-simulations',
        title: 'Electrophysiological Simulations',
        url: '/about/docs/build/electrophysiological-simulations',
      },
      {
        id: 'behavioral-integration',
        title: 'Behavioral Integration',
        url: '/about/docs/build/behavioral-integration',
      },
      {
        id: 'machine-learning-integration',
        title: 'Machine Learning Integration',
        url: '/about/docs/build/machine-learning-integration',
      },
    ],
  },
  {
    id: 'simulation',
    title: 'Simulation',
    children: [
      {
        id: 'real-time-monitoring-and-feedback',
        title: 'Real-Time Monitoring and Feedback',
        url: '/about/docs/simulation/real-time-monitoring-and-feedback',
      },
      {
        id: 'optogenetics-and-chemogenetics-integration',
        title: 'Optogenetics and Chemogenetics Integration',
        url: '/about/docs/simulation/optogenetics-and-chemogenetics-integration',
      },
      {
        id: 'collaboration-and-data-sharing',
        title: 'Collaboration and Data Sharing',
        url: '/about/docs/simulation/collaboration-and-data-sharing',
      },
      {
        id: 'performance-optimization-and-scalability',
        title: 'Performance Optimization and Scalability',
        url: '/about/docs/simulation/performance-optimization-and-scalability',
      },
    ],
  },
  {
    id: 'experiment-design',
    title: 'Experiment Design',
    children: [
      {
        id: 'multi-scale-modeling',
        title: 'Multi-Scale Modeling',
        url: '/about/docs/experiment-design/multi-scale-modeling',
      },
      {
        id: 'virtual-reality-integration',
        title: 'Virtual Reality Integration',
        url: '/about/docs/experiment-design/virtual-reality-integration',
      },
      {
        id: 'dynamic-connectivity-analysis',
        title: 'Dynamic Connectivity Analysis',
        url: '/about/docs/experiment-design/dynamic-connectivity-analysis',
      },
    ],
  },
  {
    id: 'literature-search',
    title: 'Literature Search',
    children: [
      {
        id: 'brain-research-papers',
        title: 'Brain Research Papers',
        url: '/about/docs/literature-search/brain-research-papers',
      },
      {
        id: 'neuroscience-journals',
        title: 'Neuroscience Journals',
        url: '/about/docs/literature-search/neuroscience-journals',
      },
      {
        id: 'experimental-methods',
        title: 'Experimental Methods',
        url: '/about/docs/literature-search/experimental-methods',
      },
      {
        id: 'ethics-in-neuroscience',
        title: 'Ethics in Neuroscience',
        url: '/about/docs/literature-search/ethics-in-neuroscience',
      },
      {
        id: 'data-privacy-guidelines',
        title: 'Data Privacy Guidelines',
        url: '/about/docs/literature-search/data-privacy-guidelines',
      },
      {
        id: 'security-best-practices',
        title: 'Security Best Practices',
        url: '/about/docs/literature-search/security-best-practices',
      },
    ],
  },
];

const NAVIGATION_SECTIONS_KEYS = NAVIGATION_SECTIONS.map(({ id }) => id);

export default function NavigationSideMenu() {
  const params = useParams<{ 'docs-category': string; 'docs-id': string }>();
  const [currentMenu, toggleCurrentMenu] = useReducer(
    (_: string, value: string) => value,
    params?.['docs-category'] ?? NAVIGATION_SECTIONS_KEYS[0]
  );

  const onMenuParentClick = (id: string) => () => toggleCurrentMenu(id);

  return (
    <ul className="relative  max-h-[calc(100vh-220px)] overflow-y-auto primary-scrollbar pr-2">
      {NAVIGATION_SECTIONS.map(({ id: parentId, title: parentTitle, children }) => {
        const isCurrentMenu = currentMenu === parentId;
        return (
          <li key={parentId} className="mb-5 ms-6">
            <button
              type="button"
              onClick={onMenuParentClick(parentId)}
              className="py-2 first:pt-0 font-bold text-lg text-white line-clamp-1 hover:text-primary-4"
            >
              {parentTitle}
            </button>
            <div className={classNames('mb-4 relative h-full', isCurrentMenu ? 'flex' : 'hidden')}>
              <span className="h-full absolute border-s border-primary-2 border-dashed flex items-center justify-center w-6 left-3" />
              <ul className="ml-5">
                {children.map(({ title, id, url }) => {
                  const isCurrentSubMenu = params?.['docs-id'] === id;
                  return (
                    <li
                      className={classNames(
                        'py-1 px-2 rounded-sm hover:bg-black hover:bg-opacity-20 cursor-pointer',
                        isCurrentSubMenu && 'bg-primary-8 bg-opacity-10'
                      )}
                      key={id}
                    >
                      <Link
                        title={title}
                        href={url}
                        className="text-base text-white font-normal line-clamp-1 hover:text-primary-4"
                      >
                        {title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
