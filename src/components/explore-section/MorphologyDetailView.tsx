'use client';

import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import createMorphologyDataAtom from '@/state/morpho-viewer';
import { ReconstructedNeuronMorphology } from '@/types/explore-section/delta-experiment';
import WithGeneralization from '@/components/explore-section/WithGeneralization';
import { DataType } from '@/constants/explore-section/list-views';
import { NEURON_MORPHOLOGY_FIELDS } from '@/constants/explore-section/detail-views-fields';
import GeneralizationControls from '@/components/explore-section/WithGeneralization/GeneralizationControls';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { MorphoViewer } from '@/components/MorphoViewer';
import Morphometrics from '@/components/explore-section/Morphometrics';
import Detail from '@/components/explore-section/Detail';

export default function MorphologyDetailView() {
  return (
    <WithGeneralization dataType={DataType.ExperimentalNeuronMorphology}>
      {({ render: renderSimilar }) => (
        <Detail<ReconstructedNeuronMorphology> fields={NEURON_MORPHOLOGY_FIELDS}>
          {(detail) => (
            <>
              <Morphometrics dataType={DataType.ExperimentalNeuronMorphology} resource={detail} />
              <MorphoViewerLoader resource={detail} />
              <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
                <GeneralizationControls dataType={DataType.ExperimentalNeuronMorphology} />
              </ErrorBoundary>
              <div className="min-h-[1500px]">{renderSimilar}</div>
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
