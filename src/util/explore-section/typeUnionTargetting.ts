import { NeuronMorphologyFeatureAnnotation } from '@/types/explore-section/es-experiment';
import { ExploreResource } from '@/types/explore-section/es';

export function isNeuronMorphologyFeatureAnnotation(
  obj: ExploreResource
): obj is NeuronMorphologyFeatureAnnotation {
  return 'neuronMorphology' && 'compartment' in obj;
}
