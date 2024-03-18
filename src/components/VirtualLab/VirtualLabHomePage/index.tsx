import { CalendarOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import VirtualLabStatistic from '../VirtualLabStatistic';
import { mockVirtualLab } from './mockProject';
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
      {/* Budget */}
      <div className="mt-[3px] flex flex-col gap-5 bg-primary-8 p-8">
        {/* Title + total */}
        <div className="flex justify-between">
          <h4 className="font-semibold">Budget</h4>
          <div className="text-primary-2">
            Total budget: <span>$1650</span>
          </div>
        </div>
        {/* budget loader */}
        <div className="h-3 overflow-hidden rounded-full bg-primary-3">
          <div className="h-full w-[60%] bg-white" />
        </div>
        {/* Total spent + remaining */}
        <div className="flex justify-between">
          <div className="flex flex-row gap-3">
            <div>Total spent</div>
            <span className="font-bold">$1300</span>
          </div>
          <div className="text-primary-3">
            Remaining: <span>$350</span>
          </div>
        </div>
      </div>
    </div>
  );
}
