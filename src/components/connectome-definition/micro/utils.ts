import distinctColors from 'distinct-colors';

import { PathwaySideSelection, MicroConnectomeEditEntry } from '@/types/connectome';

/**
 * Create a map containing a color palette of distinct colors per variant name.
 */
export function createVariantColorMap(variantNames: string[]) {
  return distinctColors({
    count: variantNames.length,
    chromaMin: 65,
    chromaMax: 80,
    lightMin: 70,
  })
    .map((chromaColor) => chromaColor.css())
    .reduce<Map<string, string>>((map, color, idx) => map.set(variantNames[idx], color), new Map());
}

export function createEmptyEdit() {
  const emptyEdit: Partial<MicroConnectomeEditEntry> = {
    name: '',
    id: crypto.randomUUID(),
    hemisphereDirection: 'LR',
  };

  return emptyEdit;
}

export function getSelectionLabel(selection: PathwaySideSelection) {
  const mtypeSuffix = selection.mtype ? `.${selection.mtype}` : '';

  return `${selection.brainRegionNotation}${mtypeSuffix}`;
}
