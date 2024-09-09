import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';

import BluePyEModelCls from '@/services/virtual-lab/build/me-model/bluepy-emodel';
import { selectedMEModelIdAtom } from '@/state/virtual-lab/build/me-model';
import { useSessionAtomValue } from '@/hooks/hooks';
import CentralLoadingWheel from '@/components/CentralLoadingWheel';
import { VirtualLabInfo } from '@/types/virtual-lab/common';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

function ElapsedTime() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <>
      <div className="text-primary-8">
        <div>Time elapsed:</div>
        <div>{formatTime(elapsedSeconds)}</div>
      </div>
    </>
  );
}

export default function BluePyEModelContainer({
  virtualLabInfo,
  onClose,
}: {
  virtualLabInfo: VirtualLabInfo;
  onClose: () => void;
}) {
  const bluePyEModelInstance = useRef<BluePyEModelCls | null>(null);
  const meModelId = useAtomValue(selectedMEModelIdAtom);
  const session = useSessionAtomValue();
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (bluePyEModelInstance.current || !meModelId || !session?.accessToken) return;
    const onInit = () => {
      bluePyEModelInstance.current?.runAnalysis();
      setIsInitializing(false);
    };
    bluePyEModelInstance.current = new BluePyEModelCls(meModelId, session.accessToken, {
      onInit,
    });

    return () => {
      if (!bluePyEModelInstance.current) return;
      bluePyEModelInstance.current.destroy();
      bluePyEModelInstance.current = null;
    };
  }, [meModelId, router, session, virtualLabInfo.projectId, virtualLabInfo.virtualLabId]);

  const centralMessage = isInitializing ? (
    <CentralLoadingWheel
      text={
        <>
          <div>Please don’t close the window</div>
          <span className="text-sm font-light">Validation is launching</span>
        </>
      }
      noResults
      style={{ display: 'table', width: '100%', height: '200px' }}
    />
  ) : (
    <CentralLoadingWheel
      text={<ElapsedTime />}
      style={{ display: 'table', width: '100%', height: '200px' }}
    />
  );

  const buttons = isInitializing ? (
    <button type="button" onClick={onClose} className="text-neutral-7">
      Cancel Validation
    </button>
  ) : (
    <div className="mt-10 flex flex-row gap-3">
      <button type="button" className="text-neutral-7" onClick={onClose}>
        Cancel validation
      </button>
      <a
        className="border border-primary-8 px-4 py-2 text-primary-8"
        href={`${generateVlProjectUrl(virtualLabInfo.virtualLabId, virtualLabInfo.projectId)}/activity`}
      >
        View activity
      </a>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-y-3">
      <h2 className="items-start gap-x-2 text-4xl font-bold text-primary-8">
        {isInitializing ? 'Initiating validation' : 'Running validation'}
      </h2>
      <p className="text-primary-8">
        Once the validation process finishes, you can view the results in your project&apos;s
        Activity section.
      </p>
      {centralMessage}
      {buttons}
    </div>
  );
}
