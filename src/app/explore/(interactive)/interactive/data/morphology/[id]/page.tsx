'use client';

import { Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import createMorphologyDataAtom from '@/components/explore-section/MorphoViewerContainer/state/MorphologyDataAtom';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import { DetailType } from '@/constants/explore-section/fields-config/types';
import MorphoViewerContainer from '@/components/explore-section/MorphoViewerContainer';
import WithGeneralization from '@/components/explore-section/WithGeneralization';
import { NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';
import { NEURON_MORPHOLOGY_FIELDS } from '@/constants/explore-section/detail-fields';
import GeneralizationControls from '@/components/explore-section/WithGeneralization/GeneralizationControls';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { MorphoViewer } from '@/components/MorphoViewer';

// dynamic importation due to hydration issue in morphology 3d component
const Detail = dynamic(() => import('@/components/explore-section/Detail'), { ssr: false });

export default function MorphologyDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <WithGeneralization experimentTypeName={NEURON_MORPHOLOGY}>
        {({ render: renderSimilar }) => (
          <Detail fields={NEURON_MORPHOLOGY_FIELDS}>
            {(detail: DetailType) => (
              <>
                <MorphoViewerLoader resource={detail} />
                <MorphoViewerContainer resource={detail} />
                <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
                  <GeneralizationControls experimentTypeName={NEURON_MORPHOLOGY} />
                </ErrorBoundary>
                <div className="min-h-[1500px]">{renderSimilar}</div>
              </>
            )}
          </Detail>
        )}
      </WithGeneralization>
    </Suspense>
  );
}

function MorphoViewerLoader({ resource }: { resource: DetailType }) {
  const morphologyDataAtom = useMemo(
    () => loadable(createMorphologyDataAtom(resource)),
    [resource]
  );

  const morphologyData = useAtomValue(morphologyDataAtom);

  const { state } = morphologyData;
  switch (state) {
    case 'hasData':
      return morphologyData.data ? (
        <MorphoViewer className="min-h-[75%]" swc={morphologyData.data} />
      ) : (
        <div>No data...</div>
      );
    case 'loading':
      return <div>Loading...</div>;
    case 'hasError':
      return <div>{JSON.stringify(morphologyData.error)}</div>;
    default:
      throw Error(`Unknown state for morphologyData: "${state}"!`);
  }
}
