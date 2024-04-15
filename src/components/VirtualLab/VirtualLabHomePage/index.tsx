'use client';

import { useCallback } from 'react';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import VirtualLabBanner from '../VirtualLabBanner';
import DiscoverObpItem from './DiscoverObpItem';
import BudgetPanel from './BudgetPanel';
import Member from './Member';
import ProjectItem from './ProjectItem';
import WelcomeUserBanner from './WelcomeUserBanner';
import { basePath } from '@/config';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import useNotification from '@/hooks/notifications';

type Props = {
  id: string;
};

export default function VirtualLabHomePage({ id }: Props) {
  const virtualLabDetail = useAtomValue(loadable(virtualLabDetailAtomFamily(id)));
  const virtualLabProjects = useAtomValue(loadable(virtualLabProjectsAtomFamily(id)));
  const notification = useNotification();

  const renderProjects = useCallback(() => {
    if (virtualLabProjects.state === 'loading') {
      return <Spin size="large" indicator={<LoadingOutlined />} />;
    }
    if (virtualLabProjects.state === 'hasData') {
      return virtualLabProjects.data.results.map((project) => (
        <ProjectItem
          key={project.id}
          title={project.name}
          description={project.description}
          buttonHref=""
        />
      ));
    }
    notification.error('Something went wrong when fetching project items');
    return null;
  }, [notification, virtualLabProjects]);

  if (virtualLabDetail.state === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }
  if (virtualLabDetail.state === 'hasError') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border p-8">
          {(virtualLabDetail.error as Error).message === 'Status: 404' ? (
            <>Virtual Lab not found</>
          ) : (
            <>Something went wrong when fetching virtual lab</>
          )}
        </div>
      </div>
    );
  }
  return (
    <div>
      <WelcomeUserBanner title={virtualLabDetail.data.name} />
      <VirtualLabBanner
        id={virtualLabDetail.data.id}
        name={virtualLabDetail.data.name}
        description={virtualLabDetail.data.description}
        users={virtualLabDetail.data.users}
        createdAt={virtualLabDetail.data.created_at}
        withEditButton
      />
      <BudgetPanel total={virtualLabDetail.data?.budget || 0} totalSpent={300} remaining={350} />
      <div className="mt-10 flex flex-col gap-5">
        <div className="font-bold uppercase">Discover OBP</div>
        <div className="flex flex-row gap-3">
          <DiscoverObpItem
            imagePath={`${basePath}/images/virtual-lab/obp_full_brain_blue.png`}
            title="Explore"
            subtitle="How do I explore?"
            body={
              <ul className="list-inside list-disc">
                <li>Vivamus sagittis lacus vel augue faucibus dolor auctor.</li>
                <li>Curabitur blandit tempus porttitor.</li>
                <li>Donec sed odio dui.</li>
                <li>
                  Vestibulum id ligula porta felis euismod semper. Morbi leo risus, porta ac
                  consectetur ac, vestibulum at eros.
                </li>
              </ul>
            }
            buttonText="Discover Explore"
            buttonHref="/"
          />
          <DiscoverObpItem
            imagePath={`${basePath}/images/virtual-lab/obp_vl_build.png`}
            title="Build"
            subtitle="How can I build models?"
            body={
              <ul className="list-inside list-disc">
                <li>Vivamus sagittis lacus vel augue faucibus dolor auctor.</li>
                <li>Curabitur blandit tempus porttitor.</li>
                <li>Donec sed odio dui.</li>
                <li>
                  Vestibulum id ligula porta felis euismod semper. Morbi leo risus, porta ac
                  consectetur ac, vestibulum at eros.
                </li>
              </ul>
            }
            buttonText="Discover Models"
            buttonHref="/"
          />
          <DiscoverObpItem
            imagePath={`${basePath}/images/virtual-lab/obp_vl_simulate.png`}
            title="Simulate"
            subtitle="How can I launch simulations?"
            body={
              <ul className="list-inside list-disc">
                <li>Vivamus sagittis lacus vel augue faucibus dolor auctor.</li>
                <li>Curabitur blandit tempus porttitor.</li>
                <li>Donec sed odio dui.</li>
                <li>
                  Vestibulum id ligula porta felis euismod semper. Morbi leo risus, porta ac
                  consectetur ac, vestibulum at eros.
                </li>
              </ul>
            }
            buttonText="Discover Simulations"
            buttonHref="/"
          />
        </div>
      </div>
      <div>
        <div className="my-5 text-lg font-bold uppercase">Members</div>
        <div className="flex-no-wrap flex overflow-x-auto overflow-y-hidden">
          {virtualLabDetail.data.users.map((user) => (
            <Member
              key={user.id}
              name={user.name}
              lastActive="N/A"
              memberRole={user.role}
              firstName={user.first_name}
              lastName={user.last_name}
            />
          ))}
        </div>
      </div>
      <div className="mt-10">
        <div className="my-5 text-lg font-bold uppercase">Highlighted Projects</div>
        <div className="flex flex-row gap-5">{renderProjects()}</div>
      </div>
    </div>
  );
}
