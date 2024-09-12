import SingleAnchorLink from './SingleAnchorLink';

export default function InternalNavigation() {
  return (
    <div className="fixed left-6 top-0 z-[200] flex h-screen flex-col justify-center gap-y-4">
      <SingleAnchorLink href="#introduction" label="Introduction" />
      <SingleAnchorLink href="#features" label="Features" />
      <SingleAnchorLink href="#origin" label="Origin" />
      <SingleAnchorLink href="#in-short" label="In short" />
      <SingleAnchorLink href="#simulation" label="Simulation" />
      <SingleAnchorLink href="#complementing" label="Complementing" />
    </div>
  );
}
