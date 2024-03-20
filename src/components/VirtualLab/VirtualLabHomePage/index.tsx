'use client';

import { CalendarOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';

import DiscoverObpItem from './DiscoverObpItem';
import VirtualLabStatistic from '../VirtualLabStatistic';
import { mockVirtualLab } from './mockProject';
import BudgetPanel from './BudgetPanel';
import { MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';
import Image from 'next/image';

export default function VirtualLabHomePage() {
  const iconStyle = { color: '#69C0FF' };
  const virtualLab = mockVirtualLab;
  return (
    <div>
      {/* header */}
      <div className="mt-10 flex flex-col gap-4 bg-primary-8 p-8">
        <div className="flex flex-row justify-between">
          <div className="max-w-[50%]">
            <div className="text-primary-2">Virtual Lab name</div>
            <h2 className="text-4xl font-bold">{virtualLab.title}</h2>
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
        <div className="relative top-[-60px] w-96">
          <Image
            src="/images/obp_whole_brain.webp"
            width={1158}
            height={794}
            alt="Circular"
            className="relative left-1/2 z-50 h-32 w-32 -translate-x-1/2 translate-y-1/2 transform rounded-full"
          />
          <div className="rounded-md bg-white p-5 pt-20">
            <div className="flex flex-col gap-3">
              <div className="uppercase text-neutral-4">Explore</div>
              <div className="text-2xl font-bold text-primary-8">How do I explore?</div>
              <div className="text-primary-8">
                <ul>
                  <li>Vivamus sagittis lacus vel augue faucibus dolor auctor.</li>
                  <li>Curabitur blandit tempus porttitor.</li>
                  <li>Donec sed odio dui.</li>
                  <li>
                    Vestibulum id ligula porta felis euismod semper. Morbi leo risus, porta ac
                    consectetur ac, vestibulum at eros.
                  </li>
                </ul>
              </div>
              <button type="button" className="border p-3 text-primary-8" onClick={() => {}}>
                Discover Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
