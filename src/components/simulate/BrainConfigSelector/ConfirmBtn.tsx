import { useEffect, useState } from 'react';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { notification } from 'antd';

import circuitAtom from '@/state/circuit';
import { classNames } from '@/util/utils';
import Link from '@/components/Link';

const expDesBaseUrl = '/experiment-designer/experiment-setup';

const loadableCircuitAtom = loadable(circuitAtom);

type Props = {
  brainModelConfigId: string | null;
};

export default function ConfirmBtn({ brainModelConfigId }: Props) {
  const [expDesUrl, setExpDesUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const circuitInfoLodable = useAtomValue(loadableCircuitAtom);

  const circuitInfo = circuitInfoLodable.state === 'hasData' ? circuitInfoLodable.data : null;

  useEffect(() => {
    setLoading(circuitInfoLodable.state === 'loading');
  }, [circuitInfoLodable.state]);

  useEffect(() => {
    if (!brainModelConfigId) return;

    if (!circuitInfo) {
      notification.error({
        message: 'Circuit was not built',
      });
      setAllowed(false);
      return;
    }

    const id = brainModelConfigId.split('/').pop();
    setExpDesUrl(`${expDesBaseUrl}?brainModelConfigId=${id}`);

    setAllowed(true);
  }, [brainModelConfigId, circuitInfo]);

  return (
    <Link
      href={expDesUrl}
      className={classNames(
        allowed ? 'bg-secondary-2 ' : 'bg-slate-400 cursor-not-allowed',
        'flex text-white h-12 px-8 fixed bottom-4 right-4 items-center'
      )}
    >
      {loading ? 'Loading...' : 'Confirm'}
    </Link>
  );
}
