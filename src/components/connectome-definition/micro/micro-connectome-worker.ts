import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { extent, bin } from 'd3';
import { expose } from 'comlink';
import { Session } from 'next-auth';
import { tableFromIPC, Table } from '@apache-arrow/es5-cjs';

import { IdRev, MicroConnectomeConfigPayload, MicroConnectomeEntryBase } from '@/types/nexus';
import {
  HemisphereDirection,
  MicroConnectomeEditEntry as EditEntry,
  // MicroConnectomeModifyParamsEditEntry as ModifyParamsEditEntry,
  MicroConnectomeSetAlgorithmEditEntry as SetAlgorithmEditEntry,
  PathwaySideSelection as Selection,
  WholeBrainConnectivityMatrix,
} from '@/types/connectome';
import { fetchFileByUrl, fetchResourceById } from '@/api/nexus';
import { OriginalComposition } from '@/types/composition/original';
import { BrainRegion } from '@/types/ontologies';
import { fromSerialisibleEdit, getFlatArrayValueIdx } from '@/util/connectome';
import { PartialBy } from '@/types/common';

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

type InitialisedWorkerState = {
  config: MicroConnectomeConfigPayload;
  edits: EditEntry[];
  initPromise?: Promise<void>;
  brainRegionIndex: {
    brainRegions: BrainRegion[];
    brainRegionNotationByIdMap: Map<string, string>;
    brainRegionByNotationMap: Map<string, BrainRegion>; // TODO Is this used?
    brainRegionByIdMap: Map<string, BrainRegion>;
    brainRegionLeafIdxByNotation: Map<string, number>;
    leafNotationsByNotationMap: Map<string, string[]>;
    nLeafNodes: number;
  };
  macroConnectomeStrengthMatrix: WholeBrainConnectivityMatrix;
  compositionIndex: {
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

type WorkerState = PartialBy<
  InitialisedWorkerState,
  'config' | 'edits' | 'brainRegionIndex' | 'compositionIndex' | 'macroConnectomeStrengthMatrix'
>;

type IndexScope = {
  variantName: string;
  paramName: string;
};

const gzRe = /^.*\.gz$/;

const workerState: WorkerState = {
  paramIndex: {},
  variantIndex: {},
  paramIndexAvailability: new Map(),
};

type LinearTransformValue = {
  multiplier: number;
  offset: number;
};

function isNonZeroTransform({ multiplier, offset }: LinearTransformValue) {
  return multiplier !== 1 || offset !== 0;
}

function hasMacroConnectivity(
  hemisphereDirection: HemisphereDirection,
  srcNotation: string,
  dstNotation: string
) {
  assertInitialised(workerState);

  const { brainRegionLeafIdxByNotation, nLeafNodes } = workerState.brainRegionIndex;
  const macroConnectomeFlatArray = workerState.macroConnectomeStrengthMatrix[hemisphereDirection];

  const srcIdx = brainRegionLeafIdxByNotation.get(srcNotation) as number;
  const dstIdx = brainRegionLeafIdxByNotation.get(dstNotation) as number;

  const flatArrayIdx = getFlatArrayValueIdx(nLeafNodes, srcIdx, dstIdx);
  const macroStrength = macroConnectomeFlatArray[flatArrayIdx];

  return macroStrength !== 0;
}

function getParamIndexKey(
  hemisphereDirection: HemisphereDirection,
  variantName: string,
  paramName: string
): string {
  return `${hemisphereDirection}.${variantName}.${paramName}`;
}

function setParamIndexAvailability(
  hemisphereDirection: HemisphereDirection,
  variantName: string,
  paramName: string,
  available: boolean
) {
  const paramIndexKey = getParamIndexKey(hemisphereDirection, variantName, paramName);
  workerState.paramIndexAvailability.set(paramIndexKey, available);
}

function isParamIndexAvailable(
  hemisphereDirection: HemisphereDirection,
  variantName: string,
  paramName: string
): boolean {
  const paramIndexKey = getParamIndexKey(hemisphereDirection, variantName, paramName);
  return !!workerState.paramIndexAvailability.get(paramIndexKey);
}

function decompress(readableStream: ReadableStream): ReadableStream {
  const ds = new DecompressionStream('gzip');

  return readableStream.pipeThrough(ds);
}

function isEditApplicable(
  type: 'variant' | 'param',
  hemisphereDirection: HemisphereDirection,
  edit: EditEntry
) {
  return (
    edit.hemisphereDirection === hemisphereDirection &&
    (type === 'variant' ? edit.operation === 'setAlgorithm' : true)
  );
}

function isPristine(type: 'variant' | 'param', hemisphereDirection: HemisphereDirection): boolean {
  assertInitialised(workerState);

  if (!workerState.config) {
    throw new Error('Worker not initialised');
  }

  const applicableEditFilterFn = (edit: EditEntry) =>
    isEditApplicable(type, hemisphereDirection, edit);

  const configEdits = workerState.config._ui_data?.editHistory
    ?.map((serialisibleEdit) => fromSerialisibleEdit(serialisibleEdit))
    .filter(applicableEditFilterFn);

  const currentEdits = workerState.edits?.filter(applicableEditFilterFn);

  return isEqual(configEdits, currentEdits);
}

function assertInitialised(state: WorkerState): asserts state is InitialisedWorkerState {
  if (
    !state.config ||
    !state.brainRegionIndex ||
    !state.compositionIndex ||
    !state.macroConnectomeStrengthMatrix
  ) {
    throw new Error('Worker is not initialised');
  }
}

// function variantIndexExists(hemisphereDirection: HemisphereDirection): boolean {
//   return !!workerState.variantIndex[hemisphereDirection];
// }

// function paramIndexExists(
//   hemisphereDirection: HemisphereDirection,
//   variantName: string,
//   paramName: string
// ): boolean {
//   return !workerState.paramIndexAvailability.get(
//     `${hemisphereDirection}.${variantName}.${paramName}`
//   );
// }

function buildBrainRegionIndex(brainRegions: BrainRegion[]) {
  const brainRegionNotationByIdMap: Map<string, string> = new Map();
  const brainRegionByNotationMap: Map<string, BrainRegion> = new Map();
  const brainRegionByIdMap: Map<string, BrainRegion> = new Map();

  brainRegions.forEach((brainRegion) => {
    brainRegionNotationByIdMap.set(brainRegion.id, brainRegion.notation);
    brainRegionByNotationMap.set(brainRegion.notation, brainRegion);
    brainRegionByIdMap.set(brainRegion.id, brainRegion);
  });

  const leafNotationsByNotationMap: Map<string, string[]> = brainRegions.reduce(
    (map, brainRegion) => {
      const { notation } = brainRegion;

      const leafNotations = brainRegion?.leaves
        ?.map((leaf) => brainRegionByIdMap.get(leaf.split('/').at(-1) as string))
        .filter((leaf) => leaf?.representedInAnnotation)
        ?.map((br) => br?.notation as string);

      if (Array.isArray(leafNotations) && leafNotations.length === 0) {
        return map.set(notation, []);
      }

      return map.set(notation, leafNotations ?? [notation]);
    },
    new Map()
  );

  const leafNodes = brainRegions.filter((brainRegion) => !brainRegion.leaves);
  const nLeafNodes = leafNodes.length;

  const brainRegionLeafIdxByNotation: Map<string, number> = leafNodes.reduce(
    (map, brainRegion, idx) => map.set(brainRegion.notation, idx),
    new Map()
  );

  workerState.brainRegionIndex = {
    brainRegions,
    brainRegionNotationByIdMap,
    brainRegionByNotationMap,
    brainRegionByIdMap,
    leafNotationsByNotationMap,
    brainRegionLeafIdxByNotation,
    nLeafNodes,
  };
}

function buildCompositionIndex(cellComposition: OriginalComposition) {
  if (!workerState.brainRegionIndex) {
    throw new Error('Brain region index is missing');
  }

  const { brainRegionNotationByIdMap } = workerState.brainRegionIndex;

  const brainRegionMtypeMap = Object.keys(cellComposition.hasPart).reduce(
    (map, brainRegionFullId) => {
      const id = brainRegionFullId.split('/').at(-1) as string;

      const brainRegionNotation = brainRegionNotationByIdMap.get(id);

      const mtypes = Object.values(cellComposition.hasPart[brainRegionFullId].hasPart)
        .map((mtypeEntry) => mtypeEntry.label)
        .sort();

      return map.set(brainRegionNotation, mtypes);
    },
    new Map()
  );

  // TODO Check if this is used.
  const brainRegionMtypeNumMap = Array.from(brainRegionMtypeMap.entries()).reduce(
    (map, [notation, mtypes]) => map.set(notation, mtypes.length),
    new Map()
  );

  workerState.compositionIndex = {
    brainRegionMtypeMap,
    brainRegionMtypeNumMap,
  };
}

type CreateVariantIndexFnOptions = {
  applyOverrides: boolean;
};

function createVariantIndex(
  hemisphereDirection: HemisphereDirection,
  { applyOverrides }: CreateVariantIndexFnOptions
): BrainRegionLevelMap<number> {
  if (!workerState.tables) {
    throw new Error('Micro-connectome data is missing');
  }

  if (!workerState.config) {
    throw new Error('Config is not set');
  }

  // Leaving entry with index 0 for "disabled" pathways.
  const variantIdxByName = Object.keys(workerState.config?.variants)
    .sort()
    .reduce((map, variantName, idx) => map.set(variantName, idx + 1), new Map());

  const initialTable = workerState.tables.variant.initial;
  const overridesTable = workerState.tables.variant.overrides;

  const hemisphereVariantIndex: BrainRegionLevelMap<number> = new Map();

  const applyEntry = (entry: any) => {
    const brainRegionKey = `${entry.source_region}${entry.target_region}`;

    if (!hasMacroConnectivity(hemisphereDirection, entry.source_region, entry.target_region))
      return;

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

  if (applyOverrides) {
    applyTable(overridesTable);
  }

  return hemisphereVariantIndex;
}

function buildVariantIndex(hemisphereDirection: HemisphereDirection) {
  const pristine = isPristine('variant', hemisphereDirection);

  const applyOverrides = pristine;

  const variantIndex = createVariantIndex(hemisphereDirection, { applyOverrides });
  workerState.variantIndex[hemisphereDirection] = variantIndex;

  if (!pristine) {
    const applicableEdits = workerState.edits?.filter((edit) =>
      isEditApplicable('variant', hemisphereDirection, edit)
    );
    applicableEdits?.forEach((edit) => applyEdit(edit));
  }
}

type CreateParamIndexFnOptions = {
  applyOverrides: boolean;
};

function createParamIndex(
  hemisphereDirection: HemisphereDirection,
  variantName: string,
  paramName: string,
  { applyOverrides }: CreateParamIndexFnOptions
): BrainRegionLevelMap<number[]> {
  if (!workerState.tables) {
    throw new Error('Micro-connectome data is missing');
  }

  if (!workerState.config) {
    throw new Error('Config is not set');
  }

  const paramNames = Object.keys(workerState.config.variants[variantName].params).sort();
  const paramIdx = paramNames.indexOf(paramName);

  const initialTable = workerState.tables.params.initial[variantName];
  const overridesTable = workerState.tables.params.overrides[variantName];

  const hemisphereParamIndex: BrainRegionLevelMap<number[]> =
    workerState.paramIndex[variantName]?.[hemisphereDirection] ?? new Map();

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

  if (applyOverrides) {
    applyTable(overridesTable);
  }

  return hemisphereParamIndex;
}

function buildParamIndex(
  hemisphereDirection: HemisphereDirection,
  variantName: string,
  paramName: string
) {
  const pristine = isPristine('param', hemisphereDirection);

  const applyOverrides = pristine;

  const hemisphereParamIndex = createParamIndex(hemisphereDirection, variantName, paramName, {
    applyOverrides,
  });

  workerState.paramIndex[variantName] = {
    ...workerState.paramIndex[variantName],
    [hemisphereDirection]: hemisphereParamIndex,
  };

  setParamIndexAvailability(hemisphereDirection, variantName, paramName, true);

  if (!pristine) {
    const applicableEdits = workerState.edits?.filter((edit) =>
      isEditApplicable('param', hemisphereDirection, edit)
    );
    applicableEdits?.forEach((edit) => applyEdit(edit, { variantName, paramName }));
  }
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
  const microConnectomeConfig = workerState.config;

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

  workerState.tables = {
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
  brainRegions: BrainRegion[],
  macroConnectomeStrengthMatrix: WholeBrainConnectivityMatrix,
  session: Session
): Promise<void> {
  if (!session) {
    throw new Error('Session should be defined');
  }

  // TODO Use '_ui_data?.editHistory' for comparison as well.
  const configCompareKeys = ['initial', 'overrides', 'variants'];

  if (
    isEqual(
      pick(workerState.config, configCompareKeys),
      pick(microConnectomeConfig, configCompareKeys)
    )
  ) {
    await workerState.initPromise;
    return;
  }

  workerState.config = microConnectomeConfig;

  workerState.edits = microConnectomeConfig._ui_data?.editHistory?.map((serialisibleEdit) =>
    fromSerialisibleEdit(serialisibleEdit)
  );

  workerState.macroConnectomeStrengthMatrix = macroConnectomeStrengthMatrix;

  workerState.initPromise = new Promise((initDone) => {
    Promise.all([
      fetchData(session),
      buildBrainRegionIndex(brainRegions),
      buildCompositionIndex(cellComposition),
    ]).then(() => initDone());
  });

  await workerState.initPromise;
}

export type InitFn = typeof init;

export type AggregatedVariantViewEntry = {
  srcSelection: Selection;
  dstSelection: Selection;
  variantCount: {
    [variantName: string]: number;
  };
};

function createAggregatedVariantView(
  hemisphereDirection: HemisphereDirection,
  srcSelections: Selection[],
  dstSelections: Selection[]
): AggregatedVariantViewEntry[] {
  assertInitialised(workerState);

  if (!workerState.variantIndex[hemisphereDirection]) {
    buildVariantIndex(hemisphereDirection);
  }

  const hemisphereVariantIndex = workerState.variantIndex[hemisphereDirection];
  const { brainRegionMtypeMap } = workerState.compositionIndex;
  const { leafNotationsByNotationMap } = workerState.brainRegionIndex;

  if (!hemisphereVariantIndex) {
    throw new Error('This is totally unexpected');
  }

  const viewData: AggregatedVariantViewEntry[] = [];

  const variantNames = Object.keys(workerState.config.variants).sort();
  const nVariants = variantNames.length;

  srcSelections.forEach((srcSelection) => {
    dstSelections.forEach((dstSelection) => {
      // The element with index 0 represents the number of pathways for which no variant has been assigned.
      // This is what will be rendered under the "disabled" category.
      const variantCountsArr = new Uint32Array(nVariants + 1);

      const srcNotations = leafNotationsByNotationMap.get(srcSelection.brainRegionNotation);
      const dstNotations = leafNotationsByNotationMap.get(dstSelection.brainRegionNotation);

      if (!srcNotations || !dstNotations) {
        const src = srcSelection.brainRegionNotation;
        const dst = dstSelection.brainRegionNotation;
        throw new Error(`Can not get leaf nodes for (${src}, ${dst})`);
      }

      srcNotations.forEach((srcNotation) => {
        dstNotations.forEach((dstNotation) => {
          if (!hasMacroConnectivity(hemisphereDirection, srcNotation, dstNotation)) return;

          const srcDstBrainRegionKey = `${srcNotation}${dstNotation}`;

          const srcMtypes = (
            srcSelection.mtype ? [srcSelection.mtype] : brainRegionMtypeMap.get(srcNotation) ?? []
          ).filter(
            (mtype) => !srcSelection.mtypeFilterSet || srcSelection.mtypeFilterSet.has(mtype)
          );

          const dstMtypes = (
            dstSelection.mtype ? [dstSelection.mtype] : brainRegionMtypeMap.get(dstNotation) ?? []
          ).filter(
            (mtype) => !dstSelection.mtypeFilterSet || dstSelection.mtypeFilterSet.has(mtype)
          );

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
        srcSelection,
        dstSelection,
        variantCount: variantCountsArr.reduce(
          (mapObj, count, idx) => ({ ...mapObj, [variantNames[idx - 1] ?? 'disabled']: count }),
          {}
        ),
      });
    });
  });

  return viewData;
}

export type CreateAggregatedVariantViewFn = typeof createAggregatedVariantView;

export type AggregatedParamViewEntry = {
  srcSelection: Selection;
  dstSelection: Selection;
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
  srcSelections: Selection[],
  dstSelections: Selection[]
): AggregatedParamViewEntry[] {
  assertInitialised(workerState);

  if (!isParamIndexAvailable(hemisphereDirection, variantName, paramName)) {
    buildParamIndex(hemisphereDirection, variantName, paramName);
  }

  const hemisphereParamIndex = workerState.paramIndex[variantName][hemisphereDirection];
  const { brainRegionMtypeMap } = workerState.compositionIndex;
  const { leafNotationsByNotationMap } = workerState.brainRegionIndex;

  if (!hemisphereParamIndex) {
    throw new Error('This is totally unexpected');
  }

  const paramIdx = Object.keys(workerState.config.variants[variantName].params)
    .sort()
    .indexOf(paramName);

  const viewData: AggregatedParamViewEntry[] = [];

  srcSelections.forEach((srcSelection) => {
    dstSelections.forEach((dstSelection) => {
      const paramValues: number[] = [];
      let nPathwaysNotSet: number = 0;

      const srcNotations = leafNotationsByNotationMap.get(srcSelection.brainRegionNotation);
      const dstNotations = leafNotationsByNotationMap.get(dstSelection.brainRegionNotation);

      if (!srcNotations || !dstNotations) {
        const src = srcSelection.brainRegionNotation;
        const dst = dstSelection.brainRegionNotation;
        throw new Error(`Can not get leaf nodes for (${src}, ${dst})`);
      }

      srcNotations.forEach((srcNotation) => {
        dstNotations.forEach((dstNotation) => {
          if (!hasMacroConnectivity(hemisphereDirection, srcNotation, dstNotation)) return;

          const srcDstBrainRegionKey = `${srcNotation}${dstNotation}`;

          const srcMtypes = (
            srcSelection.mtype ? [srcSelection.mtype] : brainRegionMtypeMap.get(srcNotation) ?? []
          ).filter(
            (mtype) => !srcSelection.mtypeFilterSet || srcSelection.mtypeFilterSet.has(mtype)
          );

          const dstMtypes = (
            dstSelection.mtype ? [dstSelection.mtype] : brainRegionMtypeMap.get(dstNotation) ?? []
          ).filter(
            (mtype) => !srcSelection.mtypeFilterSet || srcSelection.mtypeFilterSet.has(mtype)
          );

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
        srcSelection,
        dstSelection,
        nPathwaysNotSet,
        min,
        max,
        bins,
        noData,
      });
    });
  });

  return viewData;
}

export type CreateAggregatedParamViewFn = typeof createAggregatedParamView;

function setVariant(
  hemisphereDirection: HemisphereDirection,
  srcSelection: Selection,
  dstSelection: Selection,
  variantName: string
) {
  assertInitialised(workerState);

  // Applying changes only for existing indexes
  const hemisphereVariantIndex = workerState.variantIndex[hemisphereDirection];
  if (!hemisphereVariantIndex) return;

  const { leafNotationsByNotationMap } = workerState.brainRegionIndex;
  const { brainRegionMtypeMap } = workerState.compositionIndex;

  const variantIdx = Object.keys(workerState.config.variants).sort().indexOf(variantName) + 1;

  const srcNotations = leafNotationsByNotationMap.get(srcSelection.brainRegionNotation);
  const dstNotations = leafNotationsByNotationMap.get(dstSelection.brainRegionNotation);

  srcNotations?.forEach((srcNotation) => {
    dstNotations?.forEach((dstNotation) => {
      if (!hasMacroConnectivity(hemisphereDirection, srcNotation, dstNotation)) return;

      const srcDstBrainRegionKey = `${srcNotation}${dstNotation}`;

      const srcMtypes = (brainRegionMtypeMap.get(srcNotation) ?? []).filter(
        (mtype) => !srcSelection.mtypeFilterSet || srcSelection.mtypeFilterSet.has(mtype)
      );

      const dstMtypes = (brainRegionMtypeMap.get(dstNotation) ?? []).filter(
        (mtype) => !dstSelection.mtypeFilterSet || dstSelection.mtypeFilterSet.has(mtype)
      );

      const srcDstMtypeMapExists = hemisphereVariantIndex.get(srcDstBrainRegionKey);
      const srcDstMtypeMap = hemisphereVariantIndex.get(srcDstBrainRegionKey) ?? new Map();

      if (srcMtypes.length === 0 || dstMtypes.length === 0) return;

      if (!srcDstMtypeMapExists) {
        hemisphereVariantIndex.set(srcDstBrainRegionKey, srcDstMtypeMap);
      }

      srcMtypes.forEach((srcMtype) => {
        dstMtypes.forEach((dstMtype) => {
          const srcDstMtypeKey = `${srcMtype}${dstMtype}`;
          srcDstMtypeMap.set(srcDstMtypeKey, variantIdx);
        });
      });
    });
  });
}

function setParams(
  hemisphereDirection: HemisphereDirection,
  srcSelection: Selection,
  dstSelection: Selection,
  variantName: string,
  params: { [paramName: string]: number },
  scope?: IndexScope
) {
  assertInitialised(workerState);

  if (scope && scope.variantName !== variantName) return;

  const paramIdxByNameMap: Map<string, number> = Object.keys(
    workerState.config.variants[variantName].params
  )
    .sort()
    .reduce((map, paramName, idx) => map.set(paramName, idx), new Map());

  const indexedParamNames = Array.from(workerState.paramIndexAvailability.keys())
    .map((indexedParamKey) => indexedParamKey.split('.'))
    .filter(
      ([indexedHemisphereDirection, indexedVariantName]) =>
        indexedHemisphereDirection === hemisphereDirection && indexedVariantName === variantName
    )
    .map(([, , indexedParamName]) => indexedParamName);

  if (!indexedParamNames.length) return;

  const { leafNotationsByNotationMap } = workerState.brainRegionIndex;
  const { brainRegionMtypeMap } = workerState.compositionIndex;

  const paramNamesToSet = indexedParamNames.filter(
    (paramName) => !scope || scope.paramName === paramName
  );

  const hemisphereParamIndex = workerState.paramIndex[variantName][hemisphereDirection];
  if (!hemisphereParamIndex) {
    throw new Error('HemisphereParamIndex not defined despite marked as such');
  }

  const srcNotations = leafNotationsByNotationMap.get(srcSelection.brainRegionNotation);
  const dstNotations = leafNotationsByNotationMap.get(dstSelection.brainRegionNotation);

  const applyParamArrayChange = (paramArray: number[]) => {
    paramNamesToSet.forEach((paramName) => {
      const paramIdx = paramIdxByNameMap.get(paramName) as number;
      // eslint-disable-next-line no-param-reassign
      paramArray[paramIdx] = params[paramName];
    });
  };

  srcNotations?.forEach((srcNotation) => {
    dstNotations?.forEach((dstNotation) => {
      if (!hasMacroConnectivity(hemisphereDirection, srcNotation, dstNotation)) return;

      const srcDstBrainRegionKey = `${srcNotation}${dstNotation}`;

      const srcMtypes = (brainRegionMtypeMap.get(srcNotation) ?? []).filter(
        (mtype) => !srcSelection.mtypeFilterSet || srcSelection.mtypeFilterSet.has(mtype)
      );

      const dstMtypes = (brainRegionMtypeMap.get(dstNotation) ?? []).filter(
        (mtype) => !dstSelection.mtypeFilterSet || dstSelection.mtypeFilterSet.has(mtype)
      );

      const mtypeLevelMapExists = hemisphereParamIndex.get(srcDstBrainRegionKey);
      const mtypeLevelMap = hemisphereParamIndex.get(srcDstBrainRegionKey) ?? new Map();

      if (!mtypeLevelMapExists) {
        hemisphereParamIndex.set(srcDstBrainRegionKey, mtypeLevelMap);
      }

      srcMtypes.forEach((srcMtype) => {
        dstMtypes.forEach((dstMtype) => {
          const mtypeKey = `${srcMtype}${dstMtype}`;

          const paramArray = mtypeLevelMap.get(mtypeKey);

          if (paramArray) {
            applyParamArrayChange(paramArray);
          } else {
            const newParamArray: number[] = [];
            applyParamArrayChange(newParamArray);
            mtypeLevelMap.set(mtypeKey, newParamArray);
          }
        });
      });
    });
  });
}

function removeParamIndex(
  hemisphereDirection: HemisphereDirection,
  variantName: string,
  paramName: string
) {
  setParamIndexAvailability(hemisphereDirection, variantName, paramName, false);
  delete workerState.paramIndex[variantName][hemisphereDirection];
}

function removeAffectedIndex(edit: EditEntry) {
  assertInitialised(workerState);

  if (edit.operation === 'setAlgorithm') {
    delete workerState.variantIndex[edit.hemisphereDirection];
    const indexedParamNames = Array.from(workerState.paramIndexAvailability.keys())
      .map((paramIndexKey) => paramIndexKey.split('.'))
      .filter(
        ([hemisphereDirection, variantName]) =>
          hemisphereDirection === edit.hemisphereDirection && variantName === edit.variantName
      )
      .map(([, , paramName]) => paramName);

    indexedParamNames.forEach((paramName) =>
      removeParamIndex(edit.hemisphereDirection, edit.variantName, paramName)
    );
  } else if (edit.operation === 'modifyParams') {
    Object.entries(edit.params).forEach(([paramName, linearTransformValue]) => {
      if (!isNonZeroTransform(linearTransformValue)) return;

      removeParamIndex(edit.hemisphereDirection, edit.variantName, paramName);
    });
  }
}

function applySetAlgorithmEdit(edit: SetAlgorithmEditEntry, scope?: IndexScope) {
  setVariant(edit.hemisphereDirection, edit.srcSelection, edit.dstSelection, edit.variantName);

  setParams(
    edit.hemisphereDirection,
    edit.srcSelection,
    edit.dstSelection,
    edit.variantName,
    edit.params,
    scope
  );
}

// function applyModifyParamsEdit(edit: ModifyParamsEditEntry, scope?: IndexScope) {
//   // TODO implementation.
// }

/**
 * Apply an edit to existing partial indexed views.
 */
function applyEdit(edit: EditEntry, scope?: IndexScope) {
  switch (edit.operation) {
    case 'setAlgorithm':
      applySetAlgorithmEdit(edit, scope);
      break;
    case 'modifyParams':
      // applyModifyParamsEdit(edit, scope);
      break;
    default:
      break;
  }
}

function addEdit(edit: EditEntry) {
  assertInitialised(workerState);

  workerState.edits.push(edit);

  applyEdit(edit);
}

export type AddEditFn = typeof addEdit;

function removeEdit(editToRemove: EditEntry) {
  assertInitialised(workerState);

  removeAffectedIndex(editToRemove);

  workerState.edits = workerState.edits.filter((edit) => edit.id !== editToRemove.id);
}

export type RemoveEditFn = typeof removeEdit;

function updateEdit(updatedEdit: EditEntry) {
  assertInitialised(workerState);

  const previousEdit = workerState.edits.find((edit) => updatedEdit.id === edit.id);
  if (!previousEdit) {
    throw new Error(`Edit with id ${updatedEdit.id} can not be found`);
  }

  // Remove indexes by both: previous and updated edits.
  removeAffectedIndex(previousEdit);
  removeAffectedIndex(updatedEdit);

  // Replace previousEdit with updatedEdit.
  workerState.edits = workerState.edits?.map((edit) =>
    edit.id === updatedEdit.id ? updatedEdit : edit
  );
}

export type UpdateEditFn = typeof updateEdit;

// TODO Investigate using a flat index

expose({
  init,
  createAggregatedVariantView,
  createAggregatedParamView,
  addEdit,
  removeEdit,
  updateEdit,
});
