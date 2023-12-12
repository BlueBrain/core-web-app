'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import { DetailType } from '@/constants/explore-section/fields-config/types';
import MorphoViewerContainer from '@/components/explore-section/MorphoViewerContainer';
import WithGeneralization from '@/components/explore-section/WithGeneralization';
import { NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';
import { NEURON_MORPHOLOGY_FIELDS } from '@/constants/explore-section/detail-fields';
import GeneralizationControls from '@/components/explore-section/WithGeneralization/GeneralizationControls';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

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
                <MorphoViewerContainer resource={detail} />
                <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
                  <GeneralizationControls experimentTypeName={NEURON_MORPHOLOGY} />
                </ErrorBoundary>
                <div className="min-h-[2100px]">{renderSimilar}</div>
              </>
            )}
          </Detail>
        )}
      </WithGeneralization>
    </Suspense>
  );
}
