import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { Modal } from 'antd';

import PlanForm from './PlanForm';
import { Step, VirtualLabWithOptionalId } from './types';
import { EMPTY_VIRTUAL_LAB } from './constants';
import InformationForm from './InformationForm';
import MembersForm from './MembersForm';

import { classNames } from '@/util/utils';
import { createVirtualLab } from '@/services/virtual-lab/labs';
import useNotification from '@/hooks/notifications';
import { generateLabUrl } from '@/util/virtual-lab/urls';
import { virtualLabsOfUserAtom } from '@/state/virtual-lab/lab';
import { useAtom } from '@/state/state';

function ModalHeader({ step, setStep }: { step: Step; setStep: (step: Step) => void }) {
  return (
    <div className="flex items-center space-x-2 font-light text-primary-8 ">
      <button
        type="button"
        onClick={() => setStep('Information')}
        className={classNames('text-lg text-primary-8', step === 'Information' && 'font-bold')}
      >
        Information
      </button>

      {/* TODO: Add it back after Sfn */}
      {/* <span className="text-lg text-neutral-4">•</span>
      <span className={classNames('text-lg text-primary-8', step === 'Plans' && 'font-bold')}>
        Plans
      </span> */}
      <span className="text-lg text-neutral-4">•</span>
      <span className={classNames('text-lg text-primary-8', step === 'Members' && 'font-bold')}>
        Member
      </span>
    </div>
  );
}

export default function CreateVirtualLabModal() {
  const [isModalVisible, setIsModalVisible] = useAtom<boolean>('new-vlab-modal-open');
  const [step, setStep] = useState<Step>('Information');
  const [virtualLab, setVirtualLab] = useState<VirtualLabWithOptionalId>(EMPTY_VIRTUAL_LAB);
  const [loading, setLoading] = useState(false);
  const refreshVirtualLabs = useSetAtom(virtualLabsOfUserAtom);
  const notification = useNotification();
  const router = useRouter();

  const closeModalFn = useCallback(() => setIsModalVisible(false), [setIsModalVisible]);

  const onVirtualLabCreate = async () => {
    setLoading(true);

    return createVirtualLab({ lab: virtualLab })
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
    <Modal title={null} open={!!isModalVisible} width={800} footer={null}>
      <div className="m-10">
        <ModalHeader step={step} setStep={setStep} />
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
            currentVirtualLab={virtualLab}
            setVirtualLabFn={setVirtualLab}
            closeModalFn={closeModalFn}
            setStepFn={setStep}
          />
        )}
        {step === 'Members' && (
          <MembersForm
            loading={loading}
            currentVirtualLab={virtualLab}
            setVirtualLabFn={setVirtualLab}
            closeModalFn={closeModalFn}
            createVirtualLabFn={onVirtualLabCreate}
          />
        )}
      </div>
    </Modal>
  );
}
