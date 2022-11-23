import { StepProps, Steps } from 'antd';

import StepItem from '@/components/ExecutionStatus/StepItem';
import { statusStructure } from '@/components/ExecutionStatus/config';

export default function ExecutionStatus() {
  const items: StepProps[] = statusStructure.map((group) => ({
    title: <h3 className="text-blue-7">{group.groupName}</h3>,
    description: (
      <div className="flex justify-between w-full mt-5 mb-8">
        {group.items.map((step) => (
          <div className="w-1/3" key={group.groupName + step.stepName}>
            <StepItem name={step.stepName} status={step.status} />
          </div>
        ))}
      </div>
    ),
  }));

  return <Steps progressDot current={1} direction="vertical" items={items} />;
}
