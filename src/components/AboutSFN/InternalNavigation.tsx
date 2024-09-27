import SingleAnchorLink from './SingleAnchorLink';

export default function InternalNavigation({ activeSection }: { activeSection: string }) {
  return (
    <div className="fixed left-6 top-0 z-[200] hidden h-screen flex-col justify-center gap-y-4 md:flex">
      <SingleAnchorLink
        href="#introduction"
        label="Introduction"
        isVisible={activeSection === 'introduction'}
      />
      <SingleAnchorLink
        href="#features"
        label="Features"
        isVisible={activeSection === 'features'}
      />
      <SingleAnchorLink href="#origin" label="Origin" isVisible={activeSection === 'origin'} />
      <SingleAnchorLink
        href="#downloadBrochure"
        label="Download Brochure"
        isVisible={activeSection === 'downloadBrochure'}
      />
      <SingleAnchorLink
        href="#achievements"
        label="Achievements"
        isVisible={activeSection === 'achievements'}
      />
      <SingleAnchorLink href="#inshort" label="In short" isVisible={activeSection === 'inshort'} />
      <SingleAnchorLink
        href="#simulationneuroscience"
        label="Simulation"
        isVisible={activeSection === 'simulationneuroscience'}
      />
      <SingleAnchorLink
        href="#complementing"
        label="Complementing"
        isVisible={activeSection === 'complementing'}
      />
    </div>
  );
}
