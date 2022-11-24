import dynamic from 'next/dynamic';
import { STATUS } from '@/components/ExecutionStatus/config';
import { classNames } from '@/util/utils';

type Props = {
  name: string;
  status: string;
};

export default function Item({ name, status }: Props) {
  let statusColor = null;
  let StatusIconComponent = null;
  switch (status) {
    case STATUS.BUILT:
      statusColor = 'text-secondary-1';
      StatusIconComponent = dynamic(() => import('@/components/icons/BuildValidated'), {
        ssr: false,
      });
      break;

    case STATUS.CONFIGURED:
      statusColor = 'text-neutral-4';
      StatusIconComponent = dynamic(() => import('@/components/icons/BuildConfigured'), {
        ssr: false,
      });
      break;

    case STATUS.MODIFIED:
      statusColor = 'text-orange-500';
      StatusIconComponent = dynamic(() => import('@/components/icons/BuildModified'), {
        ssr: false,
      });
      break;

    case STATUS.NEED_ACTION:
      statusColor = 'text-red-500';
      StatusIconComponent = dynamic(() => import('@/components/icons/BuildAlert'), { ssr: false });
      break;

    default:
      statusColor = 'text-neutral-4';
      StatusIconComponent = dynamic(() => import('@/components/icons/BuildConfigured'), {
        ssr: false,
      });
      break;
  }

  return (
    <>
      <div className="h-2.5 w-2.5 bg-neutral-400 rounded-3xl mb-3" />
      <div className="text-lg text-primary-7">{name}</div>
      <div className={classNames(statusColor, 'flex items-center gap-1')}>
        <StatusIconComponent />
        <span>{status}</span>
      </div>
    </>
  );
}
