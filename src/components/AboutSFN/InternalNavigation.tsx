import { useState } from 'react';
import SingleAnchorLink from './SingleAnchorLink';

export default function InternalNavigation({
  activeSection,
  show,
}: {
  activeSection: string;
  show: boolean;
}) {
  const [siblingHover, setSiblingHover] = useState<string | null>(null);

  if (!show) return null;
  return (
    <div className="fixed left-6 top-0 z-[200] hidden h-screen flex-col justify-center gap-y-4 md:flex">
      <SingleAnchorLink
        href="#introduction"
        label="Introduction"
        isVisible={activeSection === 'introduction'}
        onSiblingHover={setSiblingHover}
        siblingHover={siblingHover}
      />
      <SingleAnchorLink
        href="#features"
        label="Features"
        isVisible={activeSection === 'features'}
        onSiblingHover={setSiblingHover}
        siblingHover={siblingHover}
      />
      <SingleAnchorLink
        href="#origin"
        label="Origin"
        isVisible={activeSection === 'origin'}
        onSiblingHover={setSiblingHover}
        siblingHover={siblingHover}
      />
      <SingleAnchorLink
        href="#downloadBrochure"
        label="Download Brochure"
        isVisible={activeSection === 'downloadBrochure'}
        onSiblingHover={setSiblingHover}
        siblingHover={siblingHover}
      />
      <SingleAnchorLink
        href="#achievements"
        label="Achievements"
        isVisible={activeSection === 'achievements'}
        onSiblingHover={setSiblingHover}
        siblingHover={siblingHover}
      />
      <SingleAnchorLink
        href="#inshort"
        label="In short"
        isVisible={activeSection === 'inshort'}
        onSiblingHover={setSiblingHover}
        siblingHover={siblingHover}
      />
      <SingleAnchorLink
        href="#simulationneuroscience"
        label="Simulation"
        isVisible={activeSection === 'simulationneuroscience'}
        onSiblingHover={setSiblingHover}
        siblingHover={siblingHover}
      />
      <SingleAnchorLink
        href="#complementing"
        label="Complementing"
        isVisible={activeSection === 'complementing'}
        onSiblingHover={setSiblingHover}
        siblingHover={siblingHover}
      />
    </div>
  );
}
