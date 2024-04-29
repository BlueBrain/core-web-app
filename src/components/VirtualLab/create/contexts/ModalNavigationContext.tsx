import { createContext, useContext } from 'react';

interface ModalNavigationContextProps {
  onNext: () => void;
  onCancel: () => void;
}

const ModalNavigationContext = createContext<ModalNavigationContextProps>({
  onNext: () => {},
  onCancel: () => {},
});

export const useModalNavigation = () => useContext(ModalNavigationContext);

export default ModalNavigationContext;
