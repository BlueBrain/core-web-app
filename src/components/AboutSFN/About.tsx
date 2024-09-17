import Footer from './Blocs/Footer';
import Gallery from './Blocs/Gallery';
import Introduction from './Blocs/Introduction';
import List from './Blocs/List';
import MediaMix from './Blocs/MediaMix';
import RichContent from './Blocs/RichContent';
import InternalNavigation from './InternalNavigation';

import {
  COMPLEMENTING,
  FEATURES_BLOCK,
  IN_SHORT_LIST,
  ORIGIN_BLOCK,
  SIMULATION_NEUROSCIENCE_BLOCK,
} from '@/constants/about/about-content';

export default function AboutSFN() {
  return (
    <div className="relative flex flex-col gap-y-56 px-[10vw]">
      <InternalNavigation />
      <Introduction id="introduction" />
      <MediaMix
        layout="left"
        title={FEATURES_BLOCK.title}
        subtitle={FEATURES_BLOCK.subtitle}
        paragraphs={FEATURES_BLOCK.paragraphs}
        image={FEATURES_BLOCK.image}
        id="Features"
      />
      <MediaMix
        layout="right"
        title={ORIGIN_BLOCK.title}
        subtitle={ORIGIN_BLOCK.subtitle}
        paragraphs={ORIGIN_BLOCK.paragraphs}
        image={ORIGIN_BLOCK.image}
        id="Origin"
      />
      <List title={IN_SHORT_LIST.title} list={IN_SHORT_LIST.list} id="inshort" />
      <Gallery
        title="Simulation neuroscience"
        subtitle="Discover the benefits"
        content={SIMULATION_NEUROSCIENCE_BLOCK}
        id="simulationneuroscience"
      />
      <RichContent
        title={COMPLEMENTING.title}
        subtitle={COMPLEMENTING.subtitle}
        paragraphs={COMPLEMENTING.paragraphs}
        image={COMPLEMENTING.image}
        id="complementing"
      />
      <Footer />
    </div>
  );
}
