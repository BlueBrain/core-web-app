import { useState, useEffect, useRef, ReactNode } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Modal } from 'antd';
import { useSetAtom } from 'jotai';
import { STEPS } from '../create/constants';
import { projectTopMenuRefAtom } from '@/state/virtual-lab/lab';
import {
  VirtualLabCreateInformation,
  VirtualLabCreatePlan,
  VirtualLabCreateMembers,
} from '@/components/VirtualLab/create';

type Props = {
  extraItems?: ReactNode[];
};

export default function VirtualLabTopMenu({ extraItems }: Props) {
  const { data: session } = useSession();
  const localRef = useRef(null);
  const setProjectTopMenuRef = useSetAtom(projectTopMenuRefAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEPS[0]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleNext = () => {
    const currentStepIndex = STEPS.indexOf(currentStep);
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1]);
    }
  };

  useEffect(() => {
    setProjectTopMenuRef(localRef);
  }, [localRef, setProjectTopMenuRef]);

  return (
    <>
      <div className="flex h-14 w-full justify-between">
        <div className="flex gap-4" ref={localRef} />
        <div className="flex w-fit items-center justify-end border border-primary-7">
          <Button
            className="h-full w-52 border-none py-4 font-bold text-white"
            type="link"
            onClick={showModal}
          >
            Create Virtual Lab
          </Button>
          <Link className="w-52 border-x border-primary-7 p-4 font-bold" href="/getting-started">
            Getting Started
          </Link>
          <Link className="w-52 border-r border-primary-7 p-4 font-bold" href="/about">
            About
          </Link>
          <div className="flex w-52 flex-row justify-between border-r border-primary-7 p-4 font-bold">
            <span className="font-bold">{session?.user.name}</span>
            <UserOutlined className="mr-2 text-primary-4" />
          </div>
          {extraItems}
        </div>
      </div>
      <Modal
        title={null}
        open={isModalVisible}
        width={800}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {currentStep === 'information' && <VirtualLabCreateInformation onNext={handleNext} />}
        {currentStep === 'plan' && <VirtualLabCreatePlan onNext={handleNext} />}
        {currentStep === 'members' && <VirtualLabCreateMembers onNext={handleNext} />}
      </Modal>
    </>
  );
}
