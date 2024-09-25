import { usePathname } from 'next/navigation';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { useMemo } from 'react';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';
import {
  virtualLabProjectPapersCountAtomFamily,
  virtualLabProjectUsersAtomFamily,
} from '@/state/virtual-lab/projects';
import { bookmarksForProjectAtomFamily } from '@/state/virtual-lab/bookmark';
import { getBookmarksCount } from '@/services/virtual-lab/bookmark';
import { useLoadableValue } from '@/hooks/hooks';

type Props = {
  virtualLabId: string;
  projectId: string;
};

export default function VirtualLabProjectSidebar({ virtualLabId, projectId }: Props) {
  const url = usePathname().split('/');
  const currentPage = url[url.length - 1] !== 'new' ? url[url.length - 1] : url[url.length - 2];

  const projectUsers = useLoadableValue(
    virtualLabProjectUsersAtomFamily({ virtualLabId, projectId })
  );
  const bookmarks = useLoadableValue(bookmarksForProjectAtomFamily({ virtualLabId, projectId }));
  const projectPapers = useLoadableValue(
    virtualLabProjectPapersCountAtomFamily({ virtualLabId, projectId })
  );

  const renderUserAmount = () => {
    if (projectUsers.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (projectUsers.state === 'hasData') {
      const count = projectUsers.data?.length;
      return `${count} member${count && count > 1 ? 's' : ''}`;
    }
    return null;
  };

  // Use this function once Project Papers is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderPapersAmount = () => {
    if (projectPapers.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (projectPapers.state === 'hasData') {
      const count = projectPapers.data;
      return `${count} paper${count && count > 1 ? 's' : ''}`;
    }
    return null;
  };

  const bookmarksCount = useMemo(() => {
    if (bookmarks.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (bookmarks.state === 'hasData') {
      return getBookmarksCount(bookmarks.data);
    }
    return null;
  }, [bookmarks]);

  const linkItems: LinkItem[] = [
    { key: LinkItemKey.Home, content: 'Project Home', href: 'home' },
    {
      key: LinkItemKey.Library,
      content: (
        <div className="flex justify-between">
          <span>Project Library</span>
          <span className="font-normal text-primary-3">{bookmarksCount}</span>
        </div>
      ),
      href: 'library',
    },
    {
      key: LinkItemKey.Team,
      content: (
        <div className="flex justify-between">
          <span>Project Team</span>
          <span className="font-normal text-primary-3">{renderUserAmount()}</span>
        </div>
      ),
      href: 'team',
    },
    {
      key: LinkItemKey.Activity,
      content: 'Activity',
      href: 'activity',
    },
    { key: LinkItemKey.Explore, content: 'Explore', href: 'explore/interactive' },
    { key: LinkItemKey.Build, content: 'Build', href: 'build' },
    { key: LinkItemKey.Simulate, content: 'Simulate', href: 'simulate' },
    {
      key: LinkItemKey.Papers,
      disabled: true,
      content: (
        <div className="flex justify-between">
          <span className="opacity-50">Project papers</span>
          <span className="font-normal text-primary-3">Coming soon</span>
        </div>
      ),
      href: 'papers',
    },
  ];
  return (
    <div className="my-8 mr-6 flex w-full flex-col gap-5">
      <VerticalLinks
        {...{
          virtualLabId,
          projectId,
          currentPage,
          links: linkItems,
        }}
      />
    </div>
  );
}
