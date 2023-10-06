import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { BLUE_NAAS_DEPLOYMENT_URL } from './constants';
import { useEModelUUID, useEnsureModelPackage } from './hooks';
import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';

const baseBannerStyle = 'flex h-full items-center justify-center text-4xl';

export default function EModelInteractiveView() {
  const selectedEModel = useAtomValue(selectedEModelAtom);

  const eModelUUID = useEModelUUID();
  const ensureModelPackage = useEnsureModelPackage();

  const [blueNaasModelId, setBlueNaasModelId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!eModelUUID || selectedEModel?.isOptimizationConfig) return;

    const init = async () => {
      setBlueNaasModelId(null);
      setLoading(true);

      await ensureModelPackage();

      setBlueNaasModelId(eModelUUID);
    };

    init();
  }, [eModelUUID, ensureModelPackage, selectedEModel?.isOptimizationConfig]);

  if (!blueNaasModelId) {
    const msg = loading ? 'Loading...' : 'Select a leaf region and an already built E-Model';

    return <div className={baseBannerStyle}>{msg}</div>;
  }

  return (
    <iframe
      className="h-full w-full"
      title="BlueNaaS"
      src={`${BLUE_NAAS_DEPLOYMENT_URL}/#/model/${blueNaasModelId}`}
    />
  );
}
