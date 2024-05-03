import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { STEPS } from '@/components/VirtualLab/create/constants';

interface ModalStateContextProps {
  isModalVisible: boolean;
  currentStep: string;
  showModal: () => void;
  handleOk: () => void;
  handleNext: () => void;
  handleCancel: () => void;
}

const ModalStateContext = createContext<ModalStateContextProps>({
  isModalVisible: false,
  currentStep: 'information',
  showModal: () => {},
  handleOk: () => {},
  handleNext: () => {},
  handleCancel: () => {},
});

export const useModalState = () => {
  const context = useContext(ModalStateContext);

  if (!context) {
    throw new Error('useModalState must be used within a ModalStateProvider');
  }

  return context;
};

export function ModalStateProvider({ children }: PropsWithChildren) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEPS[0]);

  const showModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleOk = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleNext = useCallback(() => {
    const currentStepIndex = STEPS.indexOf(currentStep);
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1]);
    }
  }, [currentStep]);

  const handleCancel = useCallback(() => {
    setCurrentStep(STEPS[0]);
    setIsModalVisible(false);
  }, []);

  const value = useMemo(
    () => ({ isModalVisible, currentStep, showModal, handleOk, handleNext, handleCancel }),
    [isModalVisible, currentStep, showModal, handleOk, handleNext, handleCancel]
  );

  return <ModalStateContext.Provider value={value}>{children}</ModalStateContext.Provider>;
}
