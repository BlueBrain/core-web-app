'use client';

import BrainConfigLoaderView from '@/components/BrainConfigLoaderView';
import useSessionState from '@/hooks/session';

export default function LoadBrainConfigView() {
  useSessionState();

  return <BrainConfigLoaderView baseHref="/build/cell-composition/interactive" />;
}
