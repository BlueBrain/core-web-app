import isEqual from 'lodash/isEqual';
import { extent, bin } from 'd3';
import { expose } from 'comlink';
import { Session } from 'next-auth';
import { tableFromIPC, Table } from '@apache-arrow/es5-cjs';

import { IdRev, MicroConnectomeConfigPayload, MicroConnectomeEntryBase } from '@/types/nexus';
import { fetchFileByUrl, fetchResourceById } from '@/api/nexus';
import { OriginalComposition } from '@/types/composition/original';
import { BrainRegion } from '@/types/ontologies';
import { HemisphereDirection } from '@/types/connectome';

type SrcDstBrainRegionKey = string;
type SrcDstMtypeKey = string;
type BrainRegionNotation = string;
type Mtype = string;

// Consists of hemisphereDirection, variantName and paramName.
type ParamIndexAvailabilityKey = string;

type BrainRegionLevelMap<T> = Map<SrcDstBrainRegionKey, Map<SrcDstMtypeKey, T>>;

type DataIndex<T> = {
  [hemisphereDirection in HemisphereDirection]?: BrainRegionLevelMap<T>;
};

type BrainRegionMtypeMap = Map<BrainRegionNotation, Mtype[]>;
type BrainRegionMtypeNumMap = Map<BrainRegionNotation, number>;

type State = {
  config?: MicroConnectomeConfigPayload;
  initPromise?: Promise<void>;
  brainRegionIndex?: {
    brainRegions: BrainRegion[];
    brainRegionNotationByIdMap: { [brainRegionId: number]: string };
  };
  compositionIndex?: {
    brainRegionMtypeMap: BrainRegionMtypeMap;
    brainRegionMtypeNumMap: BrainRegionMtypeNumMap;
  };
  tables?: {
    variant: {
      initial: Table;
      overrides: Table;
    };
    params: {
      initial: {
        [variantName: string]: Table;
      };
      overrides: {
        [variantName: string]: Table;
      };
    };
  };
  variantIndex: DataIndex<number>;
  paramIndex: {
    [variantName: string]: DataIndex<number[]>;
  };
  paramIndexAvailability: Map<ParamIndexAvailabilityKey, boolean>;
};

const gzRe = /^.*\.gz$/;

const state: State = {
  paramIndex: {},
  variantIndex: {},
  paramIndexAvailability: new Map(),
};

function decompress(readableStream: ReadableStream): ReadableStream {
  const ds = new DecompressionStream('gzip');

  return readableStream.pipeThrough(ds);
}

function buildBrainRegionIndex(brainRegions: BrainRegion[]) {
  const brainRegionNotationByIdMap = brainRegions.reduce(
    (map, brainRegion) => ({
      ...map,
      [brainRegion.id]: brainRegion.notation,
    }),
    {}
  );

  state.brainRegionIndex = {
    brainRegions,
    brainRegionNotationByIdMap,
  };
}

function buildCompositionIndex(cellComposition: OriginalComposition) {
  if (!state.brainRegionIndex) {
    throw new Error('Brain region index is missing');
  }

  const { brainRegionNotationByIdMap } = state.brainRegionIndex;

  const brainRegionMtypeMap = Object.keys(cellComposition.hasPart).reduce(
    (map, brainRegionFullId) => {
      const id = parseInt(brainRegionFullId.split('/').reverse()[0], 10);

      const brainRegionNotation = brainRegionNotationByIdMap[id];

      const mtypes = Object.values(cellComposition.hasPart[brainRegionFullId].hasPart)
        .map((mtypeEntry) => mtypeEntry.label)
        .sort();

      return map.set(brainRegionNotation, mtypes);
    },
    new Map()
  );

  const brainRegionMtypeNumMap = Array.from(brainRegionMtypeMap.entries()).reduce(
    (map, [notation, mtypes]) => map.set(notation, mtypes.length),
    new Map()
  );

  state.compositionIndex = {
    brainRegionMtypeMap,
    brainRegionMtypeNumMap,
  };
}

function buildVariantIndex(hemisphereDirection: HemisphereDirection) {
  if (!state.tables) {
    throw new Error('Micro-connectome data is missing');
  }

  if (!state.config) {
    throw new Error('Config is not set');
  }

  // Leaving entry with index 0 for "disabled" pathways.
  const variantIdxByName = Object.keys(state.config?.variants)
    .sort()
    .reduce((map, variantName, idx) => map.set(variantName, idx + 1), new Map());

  const initialTable = state.tables.variant.initial;
  const overridesTable = state.tables.variant.overrides;

  const hemisphereVariantIndex: BrainRegionLevelMap<number> = new Map();

  const applyEntry = (entry: any) => {
    const brainRegionKey = `${entry.source_region}${entry.target_region}`;
    const mtypeKey = `${entry.source_mtype}${entry.target_mtype}`;

    const variantIdx = variantIdxByName.get(entry.variant);

    const mtypeLevelMap = hemisphereVariantIndex.get(brainRegionKey);

    if (!mtypeLevelMap) {
      hemisphereVariantIndex.set(brainRegionKey, new Map().set(mtypeKey, variantIdx));
      return;
    }

    mtypeLevelMap.set(mtypeKey, variantIdx);
  };

  const applyTable = (table: Table) => {
    const { numRows } = table;
    const batch = table.batches[0];
    const sideColIdx = table.schema.fields.findIndex((field) => field.name === 'side');
    const sideVec = batch.getChildAt(sideColIdx);

    if (!sideVec) {
      throw new Error('Can not get Vector for .side property');
    }

    for (let i = 0; i < numRows; i += 1) {
      if (sideVec.get(i) === hemisphereDirection) {
        applyEntry(batch.get(i));
      }
    }
  };

  applyTable(initialTable);
  applyTable(overridesTable);

  state.variantIndex[hemisphereDirection] = hemisphereVariantIndex;
}

function buildParamIndex(
  hemisphereDirection: HemisphereDirection,
  variantName: string,
  paramName: string
) {
  if (!state.tables) {
    throw new Error('Micro-connectome data is missing');
  }

  if (!state.config) {
    throw new Error('Config is not set');
  }

  const paramNames = Object.keys(state.config.variants[variantName].params).sort();
  const paramIdx = paramNames.indexOf(paramName);

  const initialTable = state.tables.params.initial[variantName];
  const overridesTable = state.tables.params.overrides[variantName];

  const hemisphereParamIndex: BrainRegionLevelMap<number[]> =
    state.paramIndex[variantName]?.[hemisphereDirection] ?? new Map();

  const applyEntry = (entry: any) => {
    const paramValue = entry[paramName];

    const brainRegionKey = `${entry.source_region}${entry.target_region}`;
    const mtypeKey = `${entry.source_mtype}${entry.target_mtype}`;

    const mtypeLevelMap = hemisphereParamIndex.get(brainRegionKey);

    if (!mtypeLevelMap) {
      const newParamArray = [];
      newParamArray[paramIdx] = paramValue;

      hemisphereParamIndex.set(brainRegionKey, new Map().set(mtypeKey, newParamArray));

      return;
    }

    const paramArray = mtypeLevelMap.get(mtypeKey);

    if (paramArray) {
      paramArray[paramIdx] = paramValue;
    } else {
      const newParamArray = [];
      newParamArray[paramIdx] = paramValue;
      mtypeLevelMap.set(mtypeKey, newParamArray);
    }
  };

  const applyTable = (allVariantParamsTable: Table) => {
    // Construct a new table containing only a relevant parameter to prevent performance impact
    // caused by the execution of getters for unused params.
    const fieldNames = allVariantParamsTable.schema.fields
      .map((field) => field.name)
      .filter((fieldName) => !paramNames.includes(fieldName) || fieldName === paramName);

    const table = allVariantParamsTable.select(fieldNames);

    const { numRows } = table;
    const batch = table.batches[0];
    const sideColIdx = table.schema.fields.findIndex((field) => field.name === 'side');
    const sideVec = batch.getChildAt(sideColIdx);

    if (!sideVec) {
      throw new Error('Can not get Vector for .side property');
    }

    for (let i = 0; i < numRows; i += 1) {
      if (sideVec.get(i) === hemisphereDirection) {
        applyEntry(batch.get(i));
      }
    }
  };

  applyTable(initialTable);
  applyTable(overridesTable);

  state.paramIndex[variantName] = {
    ...state.paramIndex[variantName],
    [hemisphereDirection]: hemisphereParamIndex,
  };

  state.paramIndexAvailability.set(`${hemisphereDirection}.${variantName}.${paramName}`, true);
}

async function fetchDistribution(entity: IdRev, session: Session): Promise<ArrayBuffer> {
  const containerEntity = await fetchResourceById<MicroConnectomeEntryBase>(entity.id, session, {
    rev: entity.rev,
  });

  const fileUrl = containerEntity.distribution.contentUrl;

  const distributionFetch = await fetchFileByUrl(fileUrl, session);

  if (!distributionFetch.ok) {
    throw new Error(`NOK while fetching a file: ${fileUrl}`);
  }

  if (!distributionFetch.body) {
    throw new Error(`Empty body for a file: ${fileUrl}`);
  }

  const dataStream = gzRe.test(containerEntity.distribution.name)
    ? decompress(distributionFetch.body)
    : distributionFetch.body;

  return new Response(dataStream).arrayBuffer();
}

async function fetchData(session: Session) {
  const microConnectomeConfig = state.config;

  if (!microConnectomeConfig) {
    throw new Error('Micro-connectome config is not defined');
  }

  const initialVariantMatrixPromise = fetchDistribution(
    microConnectomeConfig.initial.variants,
    session
  );
  const overridesVariantMatrixPromise = fetchDistribution(
    microConnectomeConfig.overrides.variants,
    session
  );

  const variantNames = Object.keys(microConnectomeConfig.variants).sort();

  const initialParamMatrixPromises = variantNames.map((variantName) =>
    fetchDistribution(microConnectomeConfig.initial[variantName], session)
  );

  const overridesParamMatrixPromises = variantNames.map((variantName) =>
    fetchDistribution(microConnectomeConfig.overrides[variantName], session)
  );

  const initialVariantTable = tableFromIPC(await initialVariantMatrixPromise);
  const overridesVariantTable = tableFromIPC(await overridesVariantMatrixPromise);

  const initialParamABs = await Promise.all(initialParamMatrixPromises);
  const initialParamTableMap: { [variantName: string]: Table } = initialParamABs.reduce(
    (map, matrixAB, idx) => ({ ...map, [variantNames[idx]]: tableFromIPC(matrixAB) }),
    {}
  );

  const overridesParamABs = await Promise.all(overridesParamMatrixPromises);
  const overridesParamTableMap: { [variantName: string]: Table } = overridesParamABs.reduce(
    (map, matrixAB, idx) => ({ ...map, [variantNames[idx]]: tableFromIPC(matrixAB) }),
    {}
  );

  state.tables = {
    variant: {
      initial: initialVariantTable,
      overrides: overridesVariantTable,
    },
    params: {
      initial: initialParamTableMap,
      overrides: overridesParamTableMap,
    },
  };
}

async function init(
  microConnectomeConfig: MicroConnectomeConfigPayload,
  cellComposition: OriginalComposition,
  brainRegionLeavesUnsortedArray: BrainRegion[],
  session: Session
): Promise<void> {
  if (!session) {
    throw new Error('Session should be defined');
  }

  if (isEqual(state.config, microConnectomeConfig)) {
    await state.initPromise;
    return;
  }

  state.config = microConnectomeConfig;

  state.initPromise = new Promise((initDone) => {
    fetchData(session)
      .then(() => buildBrainRegionIndex(brainRegionLeavesUnsortedArray))
      .then(() => buildCompositionIndex(cellComposition))
      .then(initDone);
  });

  await state.initPromise;
}

export type AggregatedVariantViewEntry = {
  srcLabel: string;
  dstLabel: string;
  variantCount: {
    [variantName: string]: number;
  };
};

export type InitFn = typeof init;

function createAggregatedVariantView(
  hemisphereDirection: HemisphereDirection,
  srcMap: Map<BrainRegionNotation, BrainRegionNotation[]>,
  dstMap: Map<BrainRegionNotation, BrainRegionNotation[]>
): [string[], string[], AggregatedVariantViewEntry[]] {
  if (!state.config) {
    throw new Error('Config is not set');
  }

  if (!state.compositionIndex) {
    throw new Error('Missing composition index');
  }

  if (!state.variantIndex[hemisphereDirection]) {
    buildVariantIndex(hemisphereDirection);
  }

  const hemisphereVariantIndex = state.variantIndex[hemisphereDirection];
  const { brainRegionMtypeMap } = state.compositionIndex;

  if (!hemisphereVariantIndex) {
    throw new Error('This is totally unexpected');
  }

  const viewData: AggregatedVariantViewEntry[] = [];

  const variantNames = Object.keys(state.config.variants).sort();
  const nVariants = variantNames.length;

  srcMap.forEach((sources, srcLabel) => {
    dstMap.forEach((destinations, dstLabel) => {
      // The element with index 0 represents the number of pathways for which no variant has been assigned.
      // This is what will be rendered under the "disabled" category.
      const variantCountsArr = new Uint32Array(nVariants + 1);

      sources.forEach((src) => {
        destinations.forEach((dst) => {
          const [srcNotation, selectedSrcMtype] = src.split('.');
          const [dstNotation, selectedDstMtype] = dst.split('.');

          const srcDstBrainRegionKey = `${srcNotation}${dstNotation}`;

          const srcMtypes = selectedSrcMtype
            ? [selectedSrcMtype]
            : brainRegionMtypeMap.get(srcNotation) ?? [];
          const dstMtypes = selectedDstMtype
            ? [selectedDstMtype]
            : brainRegionMtypeMap.get(dstNotation) ?? [];

          const srcDstMtypeMap = hemisphereVariantIndex.get(srcDstBrainRegionKey);

          if (!srcDstMtypeMap) {
            const nPathwaysNotSet = srcMtypes.length * dstMtypes.length;
            variantCountsArr[0] += nPathwaysNotSet;
            return;
          }

          srcMtypes.forEach((srcMtype) => {
            dstMtypes.forEach((dstMtype) => {
              const srcDstMtypeKey = `${srcMtype}${dstMtype}`;
              const variantIdx = srcDstMtypeMap.get(srcDstMtypeKey) ?? 0;
              variantCountsArr[variantIdx] += 1;
            });
          });
        });
      });

      viewData.push({
        srcLabel,
        dstLabel,
        variantCount: variantCountsArr.reduce(
          (mapObj, count, idx) => ({ ...mapObj, [variantNames[idx - 1] ?? 'disabled']: count }),
          {}
        ),
      });
    });
  });

  return [Array.from(srcMap.keys()), Array.from(dstMap.keys()), viewData];
}

export type CreateAggregatedVariantViewFn = typeof createAggregatedVariantView;

export type AggregatedParamViewEntry = {
  srcLabel: string;
  dstLabel: string;
  min: number;
  max: number;
  bins: { x0: number; x1: number; count: number }[];
  nPathwaysNotSet: number;
  noData: boolean;
};

export function createAggregatedParamView(
  hemisphereDirection: HemisphereDirection,
  variantName: string,
  paramName: string,
  srcMap: Map<BrainRegionNotation, BrainRegionNotation[]>,
  dstMap: Map<BrainRegionNotation, BrainRegionNotation[]>
): [string[], string[], AggregatedParamViewEntry[]] {
  if (!state.config) {
    throw new Error('Config is not set');
  }

  if (!state.compositionIndex) {
    throw new Error('Missing composition index');
  }

  if (!state.paramIndexAvailability.get(`${hemisphereDirection}.${variantName}.${paramName}`)) {
    buildParamIndex(hemisphereDirection, variantName, paramName);
  }

  const hemisphereParamIndex = state.paramIndex[variantName][hemisphereDirection];
  const { brainRegionMtypeMap } = state.compositionIndex;

  if (!hemisphereParamIndex) {
    throw new Error('This is totally unexpected');
  }

  const paramIdx = Object.keys(state.config.variants[variantName].params).sort().indexOf(paramName);

  const viewData: AggregatedParamViewEntry[] = [];

  srcMap.forEach((sources, srcLabel) => {
    dstMap.forEach((destinations, dstLabel) => {
      const paramValues: number[] = [];
      let nPathwaysNotSet: number = 0;

      sources.forEach((src) => {
        destinations.forEach((dst) => {
          const [srcNotation, selectedSrcMtype] = src.split('.');
          const [dstNotation, selectedDstMtype] = dst.split('.');

          const srcDstBrainRegionKey = `${srcNotation}${dstNotation}`;

          const srcMtypes = selectedSrcMtype
            ? [selectedSrcMtype]
            : brainRegionMtypeMap.get(srcNotation) ?? [];
          const dstMtypes = selectedDstMtype
            ? [selectedDstMtype]
            : brainRegionMtypeMap.get(dstNotation) ?? [];

          const srcDstMtypeMap = hemisphereParamIndex.get(srcDstBrainRegionKey);

          if (!srcDstMtypeMap) {
            nPathwaysNotSet += srcMtypes.length * dstMtypes.length;
            return;
          }

          srcMtypes.forEach((srcMtype) => {
            dstMtypes.forEach((dstMtype) => {
              const srcDstMtypeKey = `${srcMtype}${dstMtype}`;
              const paramValue = srcDstMtypeMap.get(srcDstMtypeKey)?.[paramIdx];

              if (paramValue !== undefined) {
                // TODO remove randomisation
                // paramValues.push(paramValue as number); // TODO fix the type/type-check.
                if (Math.random() < 0.05) {
                  paramValues.push(Math.random());
                  return;
                }

                paramValues.push((paramValue as number) * (1.2 + Math.random() / 2.5));
              } else {
                nPathwaysNotSet += 1;
              }
            });
          });
        });
      });

      const [paramValMin, paramValMax] = extent(paramValues);
      const min = paramValMin === paramValMax ? 0 : paramValMin ?? 0;
      const max = paramValMax ?? 1;

      const nBins = 10;
      const thresholdArr = new Array(nBins).fill(1).map((_, idx) => (max / nBins) * idx);

      const bins = bin()
        .domain([min, max])
        .thresholds(thresholdArr)(paramValues)
        .map((binEntry) => ({
          x0: binEntry.x0 as number,
          x1: binEntry.x1 as number,
          count: binEntry.length,
        }));

      const noData = bins.reduce((nVals, binEntry) => nVals + binEntry.count, 0) === 0;

      viewData.push({
        srcLabel,
        dstLabel,
        nPathwaysNotSet,
        min,
        max,
        bins,
        noData,
      });
    });
  });

  return [Array.from(srcMap.keys()), Array.from(dstMap.keys()), viewData];
}

export type CreateAggregatedParamViewFn = typeof createAggregatedParamView;

expose({
  init,
  createAggregatedVariantView,
  createAggregatedParamView,
});
