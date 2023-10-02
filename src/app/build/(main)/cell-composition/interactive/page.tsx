'use client';

import ThreeDeeView from '@/components/build-section/ThreeDeeView';
import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';

export default function InteractiveView() {
  useLiteratureCleanNavigate();

  return <ThreeDeeView />;
}
