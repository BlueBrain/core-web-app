import {
  complementing,
  featuresBlock,
  inShortList,
  originBlock,
  simulationNeuroscienceBlock,
} from '@/constants/about/about-content';
import Footer from './Blocs/Footer';
import Gallery from './Blocs/Gallery';
import Introduction from './Blocs/Introduction';
import List from './Blocs/List';
import MediaMix from './Blocs/MediaMix';
import RichContent from './Blocs/RichContent';
import InternalNavigation from './InternalNavigation';

export default function AboutSFN() {
  return (
    <div className="relative flex flex-col gap-y-56 px-[10vw]">
      <InternalNavigation />
      <Introduction />
      <MediaMix
        layout="left"
        title={featuresBlock.title}
        subtitle={featuresBlock.subtitle}
        paragraphs={featuresBlock.paragraphs}
        image={featuresBlock.image}
      />
      <MediaMix
        layout="right"
        title={originBlock.title}
        subtitle={originBlock.subtitle}
        paragraphs={originBlock.paragraphs}
        image={originBlock.image}
      />
      <List title={inShortList.title} list={inShortList.list} />
      <Gallery title="Simulation" subtitle="Neuroscience" content={simulationNeuroscienceBlock} />
      <RichContent
        title={complementing.title}
        subtitle={complementing.subtitle}
        paragraphs={complementing.paragraphs}
        image={complementing.image}
      />
      <Footer />
    </div>
  );
}
