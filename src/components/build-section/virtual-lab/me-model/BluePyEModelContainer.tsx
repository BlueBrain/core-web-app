import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';

import BluePyEModelCls from '@/services/virtual-lab/build/me-model/bluepy-emodel';
import { selectedMEModelIdAtom } from '@/state/virtual-lab/build/me-model';
import { useSessionAtomValue } from '@/hooks/hooks';

export default function BluePyEModelContainer() {
  const bluePyEModelInstance = useRef<BluePyEModelCls | null>(null);
  const selectedMEModelId = useAtomValue(selectedMEModelIdAtom);
  const session = useSessionAtomValue();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bluePyEModelInstance.current || !selectedMEModelId || !session?.accessToken) return;

    const onInit = () => {
      bluePyEModelInstance.current?.runAnalysis();
      setIsLoading(false);
    };

    bluePyEModelInstance.current = new BluePyEModelCls(selectedMEModelId, session.accessToken, {
      onInit,
    });

    // eslint-disable-next-line consistent-return
    return () => {
      if (!bluePyEModelInstance.current) return;

      bluePyEModelInstance.current.destroy();
      bluePyEModelInstance.current = null;
    };
  }, [selectedMEModelId, session]);

  return (
    <div className="my-5 text-center text-2xl font-bold">
      {isLoading ? (
        <div className="text-red-400">⚠️ Please keep this open ⚠️</div>
      ) : (
        <div className="text-green-400">Analysis launched!</div>
      )}
    </div>
  );
}
