import Image from 'next/image';
import Link from 'next/link';
import kebabCase from 'lodash/kebabCase';
import { ArrowRightOutlined, PlayCircleFilled } from '@ant-design/icons';

import { basePath } from '@/config';

type TutorialProps = {
  title: string;
  url: string;
};

const VIDEO_TUTORIALS: Array<TutorialProps> = [
  {
    title: 'Explore Advanced Techniques for Analyzing and Extracting Insights from Neural Data',
    url: '/about/docs/tutorial/explore-advanced-techniques-for-analyzing-and-extracting-insights-from-neural-data',
  },
  {
    title: 'Master Tools for Seamless Data Sharing and Collaborative Simulation',
    url: '/about/docs/tutorial/master-tools-for-seamless-data-sharing-and-collaborative-simulation',
  },
];

const MORE_TUTORIALS: Array<TutorialProps> = [
  {
    title: 'Understanding Neuroimaging Methods',
    url: '/about/docs/tutorial/understanding-neuroimaging-methods',
  },
  {
    title: 'Navigating Neural Circuits with 3D Visualization',
    url: '/about/docs/tutorial/navigating-neural-circuits-with-3-d-visualization',
  },
  {
    title: 'Comprehensive Framework for Circuit Modeling',
    url: '/about/docs/tutorial/comprehensive-framework-for-circuit-modeling',
  },
  {
    title: 'Optimizing Synapse Models for Realistic Simulations',
    url: '/about/docs/tutorial/optimizing-synapse-models-for-realistic-simulations',
  },
];

function ReadMore({ title, url }: TutorialProps) {
  return (
    <Link
      href={url}
      className="inline-flex items-center justify-between gap-2 -mx-2 p-2 w-full border-b border-neutral-1 hover:bg-primary-8 hover:bg-opacity-10"
    >
      <div className="inline-flex gap-2 items-center text-sm text-primary-8">
        <span>Read more</span>
        <span className="font-bold">{title}</span>
      </div>
      <ArrowRightOutlined className="text-primary-8 w-4 h-3" />
    </Link>
  );
}

function Video({ title, url }: TutorialProps) {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <Image
          alt="tutorial sample 1"
          width={981}
          height={617}
          className="w-auto h-auto"
          src={`${basePath}/images/img_3d-interactive-brain_placeholder.jpg`}
        />
        <PlayCircleFilled className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 text-error text-5xl cursor-pointer" />
      </div>
      <Link href={url} title={title} className="mt-2">
        <span className="text-sm uppercase text-neutral-3">TUTORIAL</span>
        <h3 className="font-bold text-xl text-primary-8">{title}</h3>
      </Link>
    </div>
  );
}

export default function Tutorial() {
  return (
    <>
      <div className="py-5 grid grid-flow-col gap-x-12 bg-white">
        {VIDEO_TUTORIALS.map(({ url, title }) => (
          <Video key={kebabCase(url)} {...{ title, url }} />
        ))}
      </div>
      <div className="py-5 grid grid-cols-2 gap-x-12 gapx-2 px-2 bg-white">
        {MORE_TUTORIALS.map(({ url, title }) => (
          <ReadMore key={kebabCase(url)} {...{ title, url }} />
        ))}
      </div>
    </>
  );
}
