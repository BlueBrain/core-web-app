'use client';

import { useState } from 'react';
import DownloadDocument from './Blocs/DownloadDocument';
import Footer from './Blocs/Footer';
import Gallery from './Blocs/Gallery';
import Introduction from './Blocs/Introduction';
import List from './Blocs/List';
import MediaMix from './Blocs/MediaMix';
import RichContent from './Blocs/RichContent';
import Timeline from './Blocs/Timeline';
import InternalNavigation from './InternalNavigation';

import {
  BBP_TIMELINE,
  COMPLEMENTING,
  FEATURES_BLOCK,
  IN_SHORT_LIST,
  ORIGIN_BLOCK,
  SIMULATION_NEUROSCIENCE_BLOCK,
} from '@/constants/about/about-content';
import { classNames } from '@/util/utils';

export default function AboutSFN() {
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [showSteps, setShowSteps] = useState(true);
  return (
    <div
      className={classNames(
        'relative flex h-screen w-screen flex-col overflow-x-hidden pt-[20vh]',
        'md:w-full md:snap-y md:snap-mandatory md:snap-center md:pt-0'
      )}
    >
      <InternalNavigation activeSection={activeSection} show={showSteps} />
      <Introduction id="introduction" setActiveSection={setActiveSection} />
      <MediaMix
        layout="left"
        title={FEATURES_BLOCK.title}
        subtitle={FEATURES_BLOCK.subtitle}
        paragraphs={FEATURES_BLOCK.paragraphs}
        image={FEATURES_BLOCK.image}
        setActiveSection={setActiveSection}
        id="features"
      />
      <MediaMix
        layout="right"
        title={ORIGIN_BLOCK.title}
        subtitle={ORIGIN_BLOCK.subtitle}
        paragraphs={ORIGIN_BLOCK.paragraphs}
        image={ORIGIN_BLOCK.image}
        setActiveSection={setActiveSection}
        id="origin"
      />
      <DownloadDocument id="downloadBrochure" setActiveSection={setActiveSection} />
      <Timeline content={BBP_TIMELINE} id="achievements" setActiveSection={setActiveSection} />
      <List
        title={IN_SHORT_LIST.title}
        subtitle="The Blue Brain Project"
        list={IN_SHORT_LIST.list}
        setActiveSection={setActiveSection}
        id="inshort"
      />
      <Gallery
        title="Simulation neuroscience"
        subtitle="Discover the benefits"
        content={SIMULATION_NEUROSCIENCE_BLOCK}
        setActiveSection={setActiveSection}
        id="simulationneuroscience"
      />
      <RichContent
        title={COMPLEMENTING.title}
        subtitle={COMPLEMENTING.subtitle}
        paragraphs={COMPLEMENTING.paragraphs}
        image={COMPLEMENTING.image}
        setActiveSection={setActiveSection}
        id="complementing"
      />
      <Footer onShowSteps={setShowSteps} />
    </div>
  );
}
