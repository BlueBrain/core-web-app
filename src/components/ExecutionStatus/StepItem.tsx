import dynamic from 'next/dynamic';
import { Atom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import { STATUS } from '@/state/build-status';
import { classNames } from '@/util/utils';

type StatusProps = {
  wasBuilt: boolean;
};

function StatusComponent({ wasBuilt }: StatusProps) {
  let statusColor: string = '';
  let StatusIconComponent = null;
  let status = null;

  if (wasBuilt) {
    statusColor = 'text-secondary-1';
    StatusIconComponent = dynamic(() => import('@/components/icons/BuildValidated'), {
      ssr: false,
    });
    status = STATUS.BUILT;
  } else {
    statusColor = 'text-orange-500';
    StatusIconComponent = dynamic(() => import('@/components/icons/BuildModified'), {
      ssr: false,
    });
    status = STATUS.TO_BUILD;
  }

  return (
    <div className={classNames(statusColor, 'flex h-8 items-center gap-1')}>
      <StatusIconComponent />
      <div>{status}</div>
    </div>
  );
}

type Props = {
  name: string;
  statusAtom: Atom<Promise<any>>;
};

export default function StepItem({ name, statusAtom }: Props) {
  const atomLoadable = useAtomValue(loadable(statusAtom));
  const wasBuilt = atomLoadable.state === 'hasData' && !!atomLoadable.data;

  return (
    <>
      <div className="text-lg text-primary-7">{name}</div>
      <StatusComponent wasBuilt={wasBuilt} />
    </>
  );
}
