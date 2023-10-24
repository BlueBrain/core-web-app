'use client';

import { ReactNode, Suspense, useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import * as Popover from '@radix-ui/react-popover';
import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';
import BrainConfigPanel from '@/components/BrainConfigPanel';
import useBrainModelConfigState from '@/hooks/brain-model-config';
import TopTabs from '@/components/TopTabs';
import useAuth from '@/hooks/auth';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import ConnectomeEditorSidebar from '@/components/ConnectomeEditorSidebar';
import { extraPanelContainerAtom, toolBarAtom } from '@/state/build-section/layout';
import ContextualLiterature from '@/components/build-section/ContextualLiterature/Content';
import SimulationBtn, { PlaceholderLoadingButton } from '@/components/TopTabs/SimulationBtn';
import BuildModelBtn from '@/components/BuildModelBtn';
import styles from './build-section-main.module.css';

type BuildSectionLayoutProps = {
  children: ReactNode;
};

export default function BuildSectionLayout({ children }: BuildSectionLayoutProps) {
  useBrainModelConfigState();
  useAuth(true);
  const extraPanelRef = useRef(null);
  const setExtraPanelContainer = useSetAtom(extraPanelContainerAtom);
  const path = usePathname();
  const isConnectomeEditor = !!path?.includes('connectome-definition');
  const isSynapseEditor = !!path?.includes('connectome-model-assignment');

  useEffect(() => {
    setExtraPanelContainer(extraPanelRef.current);
  }, [setExtraPanelContainer]);

  const toolBar = useRef<HTMLDivElement>(useAtomValue(toolBarAtom));
  const setToolbar = useSetAtom(toolBarAtom);

  useEffect(() => {
    setToolbar(toolBar?.current);
  }, [setToolbar]);

  return (
    <div className={styles.container}>
      <div className={styles.brainConfigSelectorContainer}>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <BrainConfigPanel baseHref="/build/cell-composition/interactive" />
        </ErrorBoundary>
      </div>

      <div className={styles.brainSelectorContainer}>
        {!isConnectomeEditor && !isSynapseEditor && (
          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <DefaultLoadingSuspense>
              <BrainRegionsSidebar />
            </DefaultLoadingSuspense>
          </ErrorBoundary>
        )}
        {isConnectomeEditor && (
          <Suspense fallback={<div className="bg-black h-screen w-[40px]" />}>
            <ConnectomeEditorSidebar />
          </Suspense>
        )}
      </div>

      <div className={styles.extraPanelContainer} ref={extraPanelRef} />

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className={styles.contentContainer}>
          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <TopTabs />
          </ErrorBoundary>
          <div className="grow">{children}</div>
          <div className="flex items-center justify-between pb-4 pt-0 px-4 w-full z-10">
            <div ref={toolBar} />
            <Popover.Root>
              <Popover.Trigger className="bg-secondary-2 ml-auto text-white px-8 py-4">
                Build & Simulate
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="text-white z-[100] flex flex-col">
                  <BuildModelBtn className="w-[250px]" />
                  <Suspense fallback={<PlaceholderLoadingButton />}>
                    <SimulationBtn />
                  </Suspense>
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <ContextualLiterature />
      </ErrorBoundary>
    </div>
  );
}
