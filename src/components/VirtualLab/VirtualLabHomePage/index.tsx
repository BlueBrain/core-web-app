'use client';

import { CalendarOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';

import VirtualLabStatistic from '../VirtualLabStatistic';
import DiscoverObpItem from './DiscoverObpItem';
import BudgetPanel from './BudgetPanel';
import Member from './Member';
import ProjectItem from './ProjectItem';
import { classNames } from '@/util/utils';
import { basePath } from '@/config';
import { MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';
import { mockMembers } from '@/components/VirtualLab/mockData/members';
import { mockProjects } from '@/components/VirtualLab/mockData/projects';
import { mockVirtualLab } from '@/components/VirtualLab/mockData/lab';
import Styles from './home-page.module.css';

export default function VirtualLabHomePage() {
  const iconStyle = { color: '#69C0FF' };
  const virtualLab = mockVirtualLab;
  const projects = mockProjects;

  return (
    <div>
      <div
        className={classNames(
          'relative mt-10 flex flex-col gap-4 bg-primary-8 p-8',
          Styles.bannerImg
        )}
      >
        <div className="flex flex-row justify-between">
          <div className="flex max-w-[50%] flex-col gap-2">
            <div>
              <div className="text-primary-2">Virtual Lab name</div>
              <h2 className="text-5xl font-bold">{virtualLab.title}</h2>
            </div>
            <div>{virtualLab.description}</div>
          </div>
          <div>
            <EditOutlined />
          </div>
        </div>
        <div className="flex gap-5">
          <VirtualLabStatistic
            icon={<Brain style={iconStyle} />}
            title="Builds"
            detail={virtualLab.builds}
          />
          <VirtualLabStatistic
            icon={<StatsEditIcon style={iconStyle} />}
            title="Simulation experiments"
            detail={virtualLab.simulationExperiments}
          />
          <VirtualLabStatistic
            icon={<UserOutlined style={iconStyle} />}
            title="Members"
            detail={virtualLab.members}
          />
          <VirtualLabStatistic
            icon={<MembersGroupIcon style={iconStyle} />}
            title="Admin"
            detail={virtualLab.admin}
          />
          <VirtualLabStatistic
            icon={<CalendarOutlined style={iconStyle} />}
            title="Creation date"
            detail={virtualLab.creationDate}
          />
        </div>
      </div>
      <BudgetPanel
        total={virtualLab.budget.total}
        totalSpent={virtualLab.budget.totalSpent}
        remaining={virtualLab.budget.remaining}
      />
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
          {mockMembers.map((member) => (
            <Member
              key={member.key}
              name={member.name}
              lastActive={member.lastActive}
              memberRole={member.role}
            />
          ))}
        </div>
      </div>
      <div className="mt-10">
        <div className="my-5 text-lg font-bold uppercase">Highlighted Projects</div>
        <div className="flex flex-row gap-5">
          {projects.map((project) => (
            <ProjectItem
              key={project.id}
              title={project.title}
              description={project.description}
              buttonHref=""
            />
          ))}
        </div>
      </div>
    </div>
  );
}
