import { EModel, NeuronMorphology } from '@/types/e-model';
import { MEModel } from '@/types/me-model';

// get m-type
export function getMtypeFromMEModel(model: MEModel | undefined) {
  return (
    model?.annotation?.find(({ '@type': type }) => type.includes('MTypeAnnotation'))?.hasBody
      .label ?? model?.mType
  );
}

export function getMtypeFromMModel(model: NeuronMorphology | undefined) {
  return (
    model?.annotation?.find(({ '@type': type }) => type.includes('MTypeAnnotation'))?.hasBody
      .label ?? model?.mType
  );
}

export function getMtype(meModel: MEModel | undefined, mModel: NeuronMorphology | undefined) {
  return getMtypeFromMEModel(meModel) ?? getMtypeFromMModel(mModel);
}

// get e-type
export function getEtypeFromMEModel(model: MEModel | undefined) {
  return (
    model?.annotation?.find(({ '@type': type }) => type.includes('ETypeAnnotation'))?.hasBody
      .label ?? model?.eType
  );
}

export function getEtypeFromEModel(model: EModel | undefined) {
  return (
    model?.annotation?.find(({ '@type': type }) => type.includes('ETypeAnnotation'))?.hasBody
      .label ?? model?.mType
  );
}

export function getEtype(meModel: MEModel | undefined, eModel: EModel | undefined) {
  return getEtypeFromMEModel(meModel) ?? getEtypeFromEModel(eModel);
}
