import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react';

import PlanForm from './PlanForm';
import { Step, VirtualLabWithOptionalId } from './types';
import { EMPTY_VIRTUAL_LAB } from './constants';
import InformationForm from './InformationForm';

import { classNames } from '@/util/utils';
import { createVirtualLab } from '@/services/virtual-lab/labs';
import useNotification from '@/hooks/notifications';
import { generateLabUrl } from '@/util/virtual-lab/urls';
import { virtualLabsOfUserAtom } from '@/state/virtual-lab/lab';

function ModalHeader({ step }: { step: Step }) {
  return (
    <div className="flex items-center space-x-2 font-light text-primary-8 ">
      <span className={classNames('text-lg text-primary-8', step === 'Information' && 'font-bold')}>
        Information
      </span>
      <span className="text-lg text-neutral-4">•</span>
      <span className={classNames('text-lg text-primary-8', step === 'Plans' && 'font-bold')}>
        Plans
      </span>
    </div>
  );
}

export default function CreateVirtualLabModal({ closeModalFn }: { closeModalFn: () => void }) {
  const [step, setStep] = useState<Step>('Information');
  const [virtualLab, setVirtualLab] = useState<VirtualLabWithOptionalId>(EMPTY_VIRTUAL_LAB);
  const [loading, setLoading] = useState(false);
  const refreshVirtualLabs = useSetAtom(virtualLabsOfUserAtom);
  const notification = useNotification();
  const router = useRouter();
  const session = useSession();

  const onVirtualLabCreate = async () => {
    if (!session.data) {
      return;
    }
    setLoading(true);

    return createVirtualLab({ lab: virtualLab, token: session.data.accessToken })
      .then((response) => {
        notification.success(`${response.data.virtual_lab.name} has been created.`);
        refreshVirtualLabs();

        closeModalFn();
        const labUrl = generateLabUrl(response.data.virtual_lab.id);
        router.push(`${labUrl}/overview`);
      })
      .catch((error) => {
        notification.error(`Virtual Lab creation failed: ${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="m-10">
      <ModalHeader step={step} />
      {step === 'Information' && (
        <InformationForm
          currentVirtualLab={virtualLab}
          setStepFn={setStep}
          closeModalFn={closeModalFn}
          setVirtualLabFn={setVirtualLab}
        />
      )}
      {step === 'Plans' && (
        <PlanForm
          loading={loading}
          currentVirtualLab={virtualLab}
          setVirtualLabFn={setVirtualLab}
          closeModalFn={closeModalFn}
          createVirtualLabFn={onVirtualLabCreate}
        />
      )}
    </div>
  );
}
