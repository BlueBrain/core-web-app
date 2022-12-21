import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Atom, useAtom } from 'jotai';
import { Spin } from 'antd';

import { STATUS, StatusResponse } from '@/state/build-status';
import { classNames } from '@/util/utils';

type Props = {
  name: string;
  statusAtom: Atom<Promise<StatusResponse>>;
};

type StatusProps = {
  statusAtom: Atom<Promise<StatusResponse>>;
};

function StatusComponent({ statusAtom }: StatusProps) {
  let statusColor = null;
  let StatusIconComponent = null;
  const [status] = useAtom(statusAtom);

  switch (status) {
    case STATUS.BUILT:
      statusColor = 'text-secondary-1';
      StatusIconComponent = dynamic(() => import('@/components/icons/BuildValidated'), {
        ssr: false,
      });
      break;

    case STATUS.TO_BUILD:
      statusColor = 'text-orange-500';
      StatusIconComponent = dynamic(() => import('@/components/icons/BuildModified'), {
        ssr: false,
      });
      break;

    default:
      statusColor = 'text-neutral-4';
      StatusIconComponent = dynamic(() => import('@/components/icons/BuildConfigured'), {
        ssr: false,
      });
      break;
  }

  return (
    <div className={classNames(statusColor, 'flex items-center gap-1 h-8')}>
      <StatusIconComponent />
      <div>{status}</div>
    </div>
  );
}

export default function StepItem({ name, statusAtom }: Props) {
  return (
    <>
      <div className="text-lg text-primary-7">{name}</div>

      <Suspense fallback={<Spin size="small" className="h-8" />}>
        <StatusComponent statusAtom={statusAtom} />
      </Suspense>
    </>
  );
}
