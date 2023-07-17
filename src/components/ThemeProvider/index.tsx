import { ReactElement, ReactNode } from 'react';
import useTheme from '@/hooks/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  useTheme();
  return children as ReactElement;
}
