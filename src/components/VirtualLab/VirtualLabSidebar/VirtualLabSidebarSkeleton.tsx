import VerticalLinks from '@/components/VerticalLinks';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';

export function VirtualLabSidebarSkeleton({ titleGap = false }: { titleGap?: boolean }) {
  const linkItems = [
    { key: LinkItemKey.Lab, content: 'Virtual lab overview', href: 'overview' },
    {
      key: LinkItemKey.Projects,
      content: (
        <div className="flex justify-between">
          <span>Projects</span>
        </div>
      ),
      href: 'projects',
    },
    {
      key: LinkItemKey.Team,
      content: (
        <div className="flex justify-between">
          <span>Team</span>
        </div>
      ),
      href: 'team',
    },
    { key: LinkItemKey.Admin, content: 'Admin', href: 'admin' },
  ];
  return (
    <div className="mr-5 flex w-full flex-col gap-5">
      {titleGap && (
        <div
          className="text-5xl font-bold uppercase text-primary-5"
          style={{ minHeight: '84px' }}
        />
      )}

      <VerticalLinks links={linkItems} />
    </div>
  );
}
