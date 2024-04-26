import { usePathname } from 'next/navigation';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { LoadingOutlined, SwapOutlined } from '@ant-design/icons';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';
import {
  virtualLabProjectDetailsAtomFamily,
  virtualLabProjectUsersAtomFamily,
} from '@/state/virtual-lab/projects';

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
      return projectUsers.data?.length;
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
          <span className="font-normal text-primary-3">{renderUserAmount()} members</span>
        </div>
      ),
      href: 'team',
    },
    { key: LinkItemKey.Explore, content: 'Explore', href: 'explore' },
    { key: LinkItemKey.Build, content: 'Build', href: 'build' },
    { key: LinkItemKey.Simulate, content: 'Simulate', href: 'simulate' },
  ];
  return (
    <div className="m-8 flex flex-col gap-5">
      <h1 className="leading-12 text-5xl font-bold uppercase text-primary-5">
        {renderProjectTitle()}
      </h1>
      <a
        href={`${basePath}/virtual-lab/lab/${virtualLabId}/projects`}
        className="flex items-center justify-between border border-primary-7 p-3 text-primary-3"
      >
        <span>Switch project</span> <SwapOutlined />
      </a>

      <VerticalLinks links={linkItems} currentPage={currentPage} />
    </div>
  );
}
