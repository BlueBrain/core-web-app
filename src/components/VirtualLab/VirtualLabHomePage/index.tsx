'use client';

import { useCallback } from 'react';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { CalendarOutlined, EditOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import VirtualLabStatistic from '../VirtualLabStatistic';
import DiscoverObpItem from './DiscoverObpItem';
import BudgetPanel from './BudgetPanel';
import Member from './Member';
import ProjectItem from './ProjectItem';
import WelcomeUserBanner from './WelcomeUserBanner';
import { formatDate } from '@/util/utils';
import { basePath } from '@/config';
import { MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import useNotification from '@/hooks/notifications';
import Styles from './home-page.module.css';

type Props = {
  id: string;
};

export default function VirtualLabHomePage({ id }: Props) {
  const iconStyle = { color: '#69C0FF' };

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
      <div className="relative mt-10 flex flex-col gap-4 bg-primary-8 p-8">
        <div
          className={Styles.bannerImg}
          style={{
            backgroundImage: `url(${basePath}/images/virtual-lab/obp_hippocaqmpus_original.png)`,
          }}
        />
        <div className="flex flex-row justify-between">
          <div className="flex max-w-[50%] flex-col gap-2">
            <div>
              <div className="text-primary-2">Virtual Lab name</div>
              <h2 className="text-5xl font-bold">{virtualLabDetail.data.name}</h2>
            </div>
            <div>{virtualLabDetail.data.description}</div>
          </div>
          <div>
            <EditOutlined />
          </div>
        </div>
        <div className="flex gap-5">
          <VirtualLabStatistic icon={<Brain style={iconStyle} />} title="Builds" detail="N/A" />
          <VirtualLabStatistic
            icon={<StatsEditIcon style={iconStyle} />}
            title="Simulation experiments"
            detail="N/A"
          />
          <VirtualLabStatistic
            icon={<UserOutlined style={iconStyle} />}
            title="Members"
            detail={virtualLabDetail.data.users.length}
          />
          <VirtualLabStatistic
            icon={<MembersGroupIcon style={iconStyle} />}
            title="Admin"
            detail={virtualLabDetail.data.users.find((user) => user.role === 'admin')?.name || '-'}
          />
          <VirtualLabStatistic
            icon={<CalendarOutlined style={iconStyle} />}
            title="Creation date"
            detail={formatDate(virtualLabDetail.data.created_at)}
          />
        </div>
      </div>
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
