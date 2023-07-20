import distinctColors from 'distinct-colors';

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
    .reduce((map, color, idx) => map.set(variantNames[idx], color), new Map());
}
