import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';

type Props = {
  current: string;
  basePath: string;
};

export default function VirtualLabProjectSidebar({ current, basePath }: Props) {
  const linkItems: LinkItem[] = [
    { key: 'project', content: 'Project Home', href: basePath },
    { key: 'library', content: 'Project Library', href: `${basePath}/library` },
    { key: 'team', content: 'Project Team', href: `${basePath}/team` },
    { key: 'explore', content: 'Explore', href: `${basePath}/explore` },
    { key: 'build', content: 'Build', href: `${basePath}/build` },
    { key: 'simulate', content: 'Simulate', href: `${basePath}/simulate` },
  ];
  return (
    <div className="mt-10">
      <h1 className="leading-12 mb-5 text-5xl font-bold uppercase">
        Thalamus <br />
        Exploration <br />
        Project 1
      </h1>

      <VerticalLinks links={linkItems} current={current} />
    </div>
  );
}
