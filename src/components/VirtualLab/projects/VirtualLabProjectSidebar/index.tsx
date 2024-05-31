import { usePathname } from 'next/navigation';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { LoadingOutlined, SwapOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';
import {
  virtualLabProjectDetailsAtomFamily,
  virtualLabProjectPapersCountAtomFamily,
  virtualLabProjectUsersAtomFamily,
} from '@/state/virtual-lab/projects';
import { generateLabUrl } from '@/util/virtual-lab/urls';

type Props = {
  virtualLabId: string;
  projectId: string;
};

export default function VirtualLabProjectSidebar({ virtualLabId, projectId }: Props) {
  const projectDetails = useAtomValue(
    loadable(virtualLabProjectDetailsAtomFamily({ virtualLabId, projectId }))
  );
  const projectUsers = useAtomValue(
    loadable(virtualLabProjectUsersAtomFamily({ virtualLabId, projectId }))
  );

  const projectPapers = useAtomValue(
    loadable(virtualLabProjectPapersCountAtomFamily({ virtualLabId, projectId }))
  );

  const renderProjectTitle = () => {
    if (projectDetails.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (projectDetails.state === 'hasData') {
      return projectDetails.data?.name;
    }
    return null;
  };

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

  const currentPage = usePathname().split('/').pop();

  const linkItems: LinkItem[] = [
    { key: LinkItemKey.Home, content: 'Project Home', href: 'home' },
    {
      key: LinkItemKey.Library,
      content: (
        <div className="flex justify-between">
          <span>Project Library</span>
          <span className="font-normal text-primary-3">3,826</span>
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
    {
      key: LinkItemKey.Papers,
      content: (
        <div className="flex justify-between">
          <span>Project papers</span>
          <span className="font-normal text-primary-3">{renderPapersAmount()}</span>
        </div>
      ),
      href: 'papers',
    },
    { key: LinkItemKey.Explore, content: 'Explore', href: 'explore' },
    { key: LinkItemKey.Build, content: 'Build', href: 'build' },
    { key: LinkItemKey.Simulate, content: 'Simulate', href: 'simulate' },
  ];
  return (
    <div className="my-8 mr-6 flex w-full flex-col gap-5">
      <h1 className="leading-12 text-4xl font-bold uppercase text-primary-5">
        {renderProjectTitle()}
      </h1>
      <Link
        href={`${generateLabUrl(virtualLabId)}/projects`}
        className="flex items-center justify-between border border-primary-7 p-3 text-primary-3"
      >
        <span>Switch project</span> <SwapOutlined />
      </Link>

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
