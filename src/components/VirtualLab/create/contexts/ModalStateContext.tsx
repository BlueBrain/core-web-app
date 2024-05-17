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
  stepTouched: boolean;
  showModal: () => void;
  handleOk: () => void;
  handleNext: () => void;
  handleCancel: () => void;
  setStepTouched: (touched: boolean) => void;
}

const ModalStateContext = createContext<ModalStateContextProps>({
  isModalVisible: false,
  currentStep: 'information',
  stepTouched: false,
  showModal: () => {},
  handleOk: () => {},
  handleNext: () => {},
  handleCancel: () => {},
  setStepTouched: () => {},
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
  const [stepTouched, setStepTouched] = useState(false);

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
      setStepTouched(false);
    }
  }, [currentStep]);

  const handleCancel = useCallback(() => {
    setCurrentStep(STEPS[0]);
    setIsModalVisible(false);
  }, []);

  const value = useMemo(
    () => ({
      isModalVisible,
      currentStep,
      stepTouched,
      showModal,
      handleOk,
      handleNext,
      handleCancel,
      setStepTouched,
    }),
    [
      isModalVisible,
      currentStep,
      stepTouched,
      showModal,
      handleOk,
      handleNext,
      handleCancel,
      setStepTouched,
    ]
  );

  return <ModalStateContext.Provider value={value}>{children}</ModalStateContext.Provider>;
}
