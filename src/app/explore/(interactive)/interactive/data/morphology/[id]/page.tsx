'use client';

import { Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import createMorphologyDataAtom from '@/components/explore-section/MorphoViewerContainer/state/MorphologyDataAtom';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import { DetailType } from '@/constants/explore-section/fields-config/types';
import WithGeneralization from '@/components/explore-section/WithGeneralization';
import { NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';
import GeneralizationControls from '@/components/explore-section/WithGeneralization/GeneralizationControls';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { MorphoViewer } from '@/components/MorphoViewer';
import { DetailProps } from '@/types/explore-section/application';
import { Field } from '@/constants/explore-section/fields-config/enums';

// dynamic importation due to hydration issue in morphology 3d component
const Detail = dynamic(() => import('@/components/explore-section/Detail'), { ssr: false });

const NEURON_MORPHOLOGY_FIELDS = [
  {
    field: Field.Description,
    className: 'col-span-3 row-span-2',
  },
  {
    field: Field.MType,
  },
  {
    field: Field.SubjectSpecies,
  },
  {
    field: Field.BrainRegion,
  },
  {
    field: Field.Contributors,
  },
  {
    field: Field.CreatedAt,
  },
  {
    field: Field.Licence,
  },
] as DetailProps[];

export default function MorphologyDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <WithGeneralization experimentTypeName={NEURON_MORPHOLOGY}>
        {({ render: renderSimilar }) => (
          <Detail fields={NEURON_MORPHOLOGY_FIELDS}>
            {(detail: DetailType) => (
              <>
                <MorphoViewerLoader resource={detail} />
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
