import { useEffect, useState } from 'react';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import circuitAtom from '@/state/circuit';
import { classNames } from '@/util/utils';
import { createSimulationCampaignUIConfig } from '@/services/bbp-workflow/simulationHelper';
import paramsDummyData from '@/components/experiment-designer/experiment-designer-dummy.json';
import { ExpDesignerConfig } from '@/types/experiment-designer';

const expDesBaseUrl = '/experiment-designer/experiment-setup';

const loadableCircuitAtom = loadable(circuitAtom);

type Props = {
  brainModelConfigId: string | null;
  campaignName: string;
  campaignDescription: string;
};

export default function ConfirmBtn({
  brainModelConfigId,
  campaignName,
  campaignDescription,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const circuitInfoLodable = useAtomValue(loadableCircuitAtom);
  const router = useRouter();
  const { data: session } = useSession();

  const circuitInfo = circuitInfoLodable.state === 'hasData' ? circuitInfoLodable.data : null;

  useEffect(() => {
    setLoading(circuitInfoLodable.state === 'loading');
  }, [circuitInfoLodable.state]);

  useEffect(() => {
    if (!circuitInfo) {
      notification.error({
        message: 'Circuit was not built',
      });
      setAllowed(false);
      return;
    }

    setAllowed(true);
  }, [circuitInfo]);

  const createSimCamUiConfig = async () => {
    if (!circuitInfo || !session || !brainModelConfigId) return;

    setLoading(true);
    const simCampUiConfigResource = await createSimulationCampaignUIConfig(
      campaignName,
      campaignDescription,
      circuitInfo,
      structuredClone(paramsDummyData as ExpDesignerConfig),
      session
    ).catch((e) => {
      const msg = `Error creating simulation entity: ${e.message}`;
      notification.error({
        message: msg,
      });
      throw new Error(msg);
    });
    const brainModelCfgPart = `brainModelConfigId=${brainModelConfigId.split('/').pop()}`;
    const simUICfgPart = `simulationCampaignUIConfigId=${simCampUiConfigResource['@id']
      .split('/')
      .pop()}`;
    router.push(`${expDesBaseUrl}?${brainModelCfgPart}&${simUICfgPart}`);
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={createSimCamUiConfig}
      className={classNames(
        allowed ? 'bg-secondary-2 ' : 'bg-slate-400 cursor-not-allowed',
        'flex text-white h-12 px-8 fixed bottom-4 right-4 items-center'
      )}
    >
      {loading ? 'Loading...' : 'Confirm'}
    </button>
  );
}
