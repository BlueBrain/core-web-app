'use client';

import { basePath } from '@/config';
import BrainConfigLoaderView from '@/components/BrainConfigLoaderView';
import useSessionState from '@/hooks/session';

export default function LoadBrainConfigView() {
  useSessionState();

  return (
    <BrainConfigLoaderView baseHref={`${basePath}/brain-factory/cell-composition/interactive`} />
  );
}
