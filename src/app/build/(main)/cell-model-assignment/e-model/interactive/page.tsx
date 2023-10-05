'use client';

import InteractiveView from '@/components/build-section/cell-model-assignment/e-model/interactive/View';
import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';

export default function InteractivePage() {
  useLiteratureCleanNavigate();

  return <InteractiveView />;
}
