'use client';

import { Spin } from 'antd';
import { usePathname } from 'next/navigation';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { LoadingOutlined } from '@ant-design/icons';

import VirtualLabsSelect from './VirtualLabsSelect';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';

type Props = {
  virtualLabId: string;
};

export default function VirtualLabSidebar({ virtualLabId }: Props) {
  const currentPage = usePathname().split('/').pop();
  const virtualLab = useAtomValue(loadable(virtualLabDetailAtomFamily(virtualLabId)));

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

  const linkItems: LinkItem[] = [
    { key: 'lab', content: 'The Virtual Lab', href: 'lab' },
    {
      key: 'projects',
      content: (
        <div className="flex justify-between">
          <span>Projects</span>
          <span className="font-normal text-primary-3">9</span>
        </div>
      ),
      href: 'projects',
    },
    {
      key: 'team',
      content: (
        <div className="flex justify-between">
          <span>Team</span>
          <span className="font-normal text-primary-3">23 members</span>
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
