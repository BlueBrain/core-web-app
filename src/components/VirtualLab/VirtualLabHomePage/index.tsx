import { CalendarOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';

import VirtualLabStatistic from '../VirtualLabStatistic';
import { mockVirtualLab } from './mockProject';
import BudgetPanel from './BudgetPanel';
import { MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';

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
    </div>
  );
}
