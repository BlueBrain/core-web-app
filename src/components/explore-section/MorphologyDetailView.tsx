'use client';

import { useMemo, ReactNode, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

// We disable enhanced somas until they are fixed on the backend.
// import { useSwcContentUrl } from '@/util/content-url';

import createMorphologyDataAtom from '@/state/morpho-viewer';
import { ReconstructedNeuronMorphology } from '@/types/explore-section/delta-experiment';
import WithGeneralization, {
  notFound,
  genarilizationError,
} from '@/components/explore-section/WithGeneralization';
import { DataType } from '@/constants/explore-section/list-views';
import { NEURON_MORPHOLOGY_FIELDS } from '@/constants/explore-section/detail-views-fields';
import GeneralizationControls from '@/components/explore-section/WithGeneralization/GeneralizationControls';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { MorphoViewer } from '@/components/MorphoViewer';
import Morphometrics from '@/components/explore-section/Morphometrics';
import Detail from '@/components/explore-section/Detail';

function GeneralizationContainer({ children }: { children: ReactNode }) {
  if (children !== notFound && children !== genarilizationError) {
    return <div className="min-h-[1000px]">{children}</div>;
  }
  return <div className="min-h-auto">{children}</div>;
}

export default function MorphologyDetailView() {
  return (
    <WithGeneralization dataType={DataType.ExperimentalNeuronMorphology}>
      {({ render: renderSimilar }) => (
        <Detail<ReconstructedNeuronMorphology> fields={NEURON_MORPHOLOGY_FIELDS}>
          {(detail) => (
            <>
              <Morphometrics dataType={DataType.ExperimentalNeuronMorphology} resource={detail} />
              <MorphoViewerLoaderMemo resource={detail} />
              <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
                <GeneralizationControls dataType={DataType.ExperimentalNeuronMorphology} />
              </ErrorBoundary>
              <GeneralizationContainer>{renderSimilar}</GeneralizationContainer>
            </>
          )}
        </Detail>
      )}
    </WithGeneralization>
  );
}

function MorphoViewerLoader({ resource }: { resource: ReconstructedNeuronMorphology }) {
  const morphologyDataAtom = useMemo(
    () => loadable(createMorphologyDataAtom(resource)),
    [resource]
  );
  // We disable enhanced somas until they are fixed on the backend.
  // const swcContentUrl = useSwcContentUrl(resource.distribution);
  const morphologyData = useAtomValue(morphologyDataAtom);

  const { state } = morphologyData;
  switch (state) {
    case 'hasData':
      return morphologyData.data ? (
        <MorphoViewer
          className="min-h-[75%]"
          swc={morphologyData.data}
          // We disable enhanced somas until they are fixed on the backend.
          // contentUrl={swcContentUrl}
        />
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

const MorphoViewerLoaderMemo = memo(MorphoViewerLoader);
