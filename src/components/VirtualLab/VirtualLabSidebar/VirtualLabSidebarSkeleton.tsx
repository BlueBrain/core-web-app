import { SwapOutlined } from '@ant-design/icons';
import Link from 'next/link';
import VerticalLinks from '@/components/VerticalLinks';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';

export function VirtualLabSidebarSkeleton({ titleGap = false }: { titleGap?: boolean }) {
  const linkItems = [
    { key: LinkItemKey.Lab, content: 'Overview', href: 'overview' },
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

      <Link
        href="/virtual-lab"
        className="flex items-center justify-between border border-primary-7 p-3 text-primary-3"
      >
        <span>Switch virtual lab</span> <SwapOutlined />
      </Link>
      <VerticalLinks links={linkItems} />
    </div>
  );
}
