'use client';

import { Spin } from 'antd';
import { usePathname } from 'next/navigation';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { LoadingOutlined } from '@ant-design/icons';

import VirtualLabsSelect from './VirtualLabsSelect';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';

type Props = {
  virtualLabId: string;
};

export default function VirtualLabSidebar({ virtualLabId }: Props) {
  const currentPage = usePathname().split('/').pop();
  const virtualLab = useAtomValue(loadable(virtualLabDetailAtomFamily(virtualLabId)));
  const projects = useAtomValue(loadable(virtualLabProjectsAtomFamily(virtualLabId)));

  /**
   * Renders the title of the virtual lab based on the request status
   * @returns
   */
  const renderVirtualLabTitle = () => {
    if (virtualLab.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (virtualLab.state === 'hasData') {
      return (
        <div className="text-5xl font-bold uppercase text-primary-5">{virtualLab.data.name}</div>
      );
    }
    return null;
  };

  /**
   * Renders the amount of projects in the virtual lab based on the request status
   * @returns
   */
  const renderProjectsAmount = () => {
    if (projects.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (projects.state === 'hasData') {
      return projects.data.results.length;
    }
    return null;
  };

  /**
   * Returns the amount of virtual lab members
   */
  const renderUsersAmount = () => {
    if (virtualLab.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (virtualLab.state === 'hasData') {
      return virtualLab.data.users.length;
    }
    return null;
  };

  const linkItems: LinkItem[] = [
    { key: 'lab', content: 'The Virtual Lab', href: 'lab' },
    {
      key: 'projects',
      content: (
        <div className="flex justify-between">
          <span>Projects</span>
          <span className="font-normal text-primary-3">{renderProjectsAmount()}</span>
        </div>
      ),
      href: 'projects',
    },
    {
      key: 'team',
      content: (
        <div className="flex justify-between">
          <span>Team</span>
          <span className="font-normal text-primary-3">{renderUsersAmount()} members</span>
        </div>
      ),
      href: 'team',
    },
    { key: 'admin', content: 'Admin', href: 'admin' },
  ];
  return (
    <div className="mr-12 flex w-full flex-col gap-5">
      {renderVirtualLabTitle()}
      <VirtualLabsSelect />
      <VerticalLinks links={linkItems} currentPage={currentPage} />
    </div>
  );
}
