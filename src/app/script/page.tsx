/* eslint-disable no-await-in-loop */

'use client';

import { useSession } from 'next-auth/react';
import get from 'lodash/get'
import set from 'lodash/set'
import isEqual from 'lodash/isEqual'

import { getPublicBrainModelConfigsQuery } from '@/queries/es';
import {
  cloneMacroConnectomeConfig,
  cloneMicroConnectomeConfig,
  cloneSynapseConfig,
  fetchFileMetadataByUrl,
  fetchJsonFileByUrl,
  fetchResourceById,
  queryES,
  updateJsonFileByUrl,
  updateResource,
} from '@/api/nexus';
import {
  BrainModelConfig,
  BrainModelConfigResource,
  CellCompositionConfig,
  CellCompositionConfigPayload,
  CellCompositionConfigResource,
  CellPositionConfig,
  CellPositionConfigPayload,
  CellPositionConfigResource,
  CompositionOverridesWorkflowConfig,
  EModelAssignmentConfig,
  EModelAssignmentConfigPayload,
  EModelAssignmentConfigResource,
  MacroConnectomeConfig,
  MacroConnectomeConfigPayload,
  MacroConnectomeConfigResource,
  MicroConnectomeConfig,
  MicroConnectomeConfigPayload,
  MicroConnectomeConfigResource,
  MorphologyAssignmentConfig,
  MorphologyAssignmentConfigPayload,
  MorphologyAssignmentConfigResource,
  SynapseConfigPayload,
  SynapseConfigResource,
} from '@/types/nexus';
import { createDistribution } from '@/util/nexus';
import { Session } from 'next-auth';


const ROOT_BRAIN_REGION = 'http://api.brain-map.org/api/v2/data/Structure/997';
const cellCompositionSummaryUrl = 'https://bbp.epfl.ch/nexus/v1/files/bbp/atlasdatasetrelease/https%3A%2F%2Fbbp.epfl.ch%2Fdata%2Fbbp%2Fatlasdatasetrelease%2Fb480420a-a452-4e08-8918-b4f24d1ca7b1'

export default function ScriptPage() {
  const { data: session } = useSession();

  const runScript = async () => {
    if (!session) {
      console.log('No session, aborting...');
      return;
    }

    const query = getPublicBrainModelConfigsQuery();
    const configs = await queryES<BrainModelConfigResource>(query, session);

    // eslint-disable-next-line no-restricted-syntax
    for (const config of configs) {
      // do not modify the Releases
      // if (!config.name.match(/^Release \d\d\.\d\d$/)) continue;

      // if (config.name !== 'Release 23.01') continue;
      // if (config.name !== 'Release 23.02') continue;
      // if (config.name !== 'Release 23.03') continue;
      // if (config.name !== 'Release 23.03 by antonel') continue
      // if (config.name !== 'antonel - new @id mmodel') continue;
      if (config.name !== 'AO_latest_release_circuit') continue

      console.log('Processing config: ', config.name, config._self);

      await checkConsistencyCellComposition(config, session)
      await fixCellComposition(config, session)
      await setPlaceholderForCellPositionConfig(config, session)
      await setPlaceholderForMacroConnectomeConfig(config, session)
      await setFullMorphologyAssignment(config, session)
      await setPlaceholderEModelAssignment(config, session)

      // await fixCellCompositionRev(config, session)

      // await setPlaceholderForSynapseConfig(config, session)
      // await setFullSynapseConfig(config, session)
      // await checkFullSynapseConfig(config, session)

      // await setPlaceholderForMicroConnectome(config, session)
      // await setFullMicroConnectome(config, session)
      // await checkFullMicroConnectomeConfig(config, session)

    }
    console.log('All done');
  };

  return (
    <main className="p-8">
      <button
        className="bg-blue-500 text-white p-2 block mt-8"
        type="button"
        onClick={runScript}
      >
        Run script
      </button>
    </main>
  );
}

async function fixCellComposition(config: BrainModelConfig, session: Session) {
  const subConfigId = config.configs.cellCompositionConfig['@id']
  const resource = await fetchResourceById<CellCompositionConfigResource>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  const payload = await fetchJsonFileByUrl<CellCompositionConfigPayload>(fileUrl, session)
  let modified = false;

  modified = fixCellCompositionVersion(payload);
  modified = fixCellCompositionBase(payload)

  const supportedVersion = 1
  if (resource.configVersion !== supportedVersion) {
    console.log('Fixing configVersion');
    modified = true
  }

  if (!modified) return
  const fileMeta = await updateJsonFileByUrl(fileUrl, payload, 'cell-composition-config.json', session)
  const updatedResource: CellCompositionConfig = {
    ...resource,
    distribution: createDistribution(fileMeta),
    generatorName: 'cell_composition',
    configVersion: supportedVersion,
  }
  const updated = await updateResource(updatedResource, resource._rev, session)
  console.log('> Done', updated['@id']);
}

function fixCellCompositionVersion(compositionPayload: CellCompositionConfigPayload) {
  const path = [ROOT_BRAIN_REGION, 'variantDefinition', 'version']
  const properValue = 'v1';
  const value = get(compositionPayload, path)
  if (value === properValue) return false;

  console.log('Fixing composition variant definition version...');
  set(compositionPayload, path, properValue)
  return true;
}

function fixCellCompositionBase(compositionPayload: CellCompositionConfigPayload) {
  const path = [ROOT_BRAIN_REGION, 'inputs', '0', 'id']
  const properValue = 'https://bbp.epfl.ch/neurosciencegraph/data/cellcompositions/54818e46-cf8c-4bd6-9b68-34dffbc8a68c';
  const value = get(compositionPayload, path)
  if (value === properValue) return false;

  console.log('Fixing composition input base url...');
  set(compositionPayload, path, properValue)
  return true;
}

async function setPlaceholderForCellPositionConfig(config: BrainModelConfig, session: Session) {
  const subConfigId = config.configs.cellPositionConfig['@id']
  const resource = await fetchResourceById<CellPositionConfigResource>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  let payload = await fetchJsonFileByUrl<CellPositionConfigPayload>(fileUrl, session)
  const expectedPayload = {"http://api.brain-map.org/api/v2/data/Structure/997":{"variantDefinition":{"algorithm":"neurons_cell_position","version":"v1"},"inputs":[],"configuration":{"place_cells":{"soma_placement":"basic","density_factor":1,"sort_by":["region","mtype"],"seed":0,"mini_frequencies":false}}}};
  const path = [ROOT_BRAIN_REGION, 'variantDefinition', 'algorithm']
  const hasCorrectStructure = get(payload, path)

  let modified = false;

  if (!hasCorrectStructure) {
    console.log('Setting placeholder config for synapse config');
    payload = expectedPayload as any;
    modified = true
  }

  if (resource.generatorName !== 'cell_position') {
    console.log('Fixing generatorName');
    modified = true
  }

  const supportedVersion = 0
  if (resource.configVersion !== supportedVersion) {
    console.log('Fixing configVersion');
    modified = true
  }

  if (!modified) return;

  const fileMeta = await updateJsonFileByUrl(fileUrl, payload, 'cell-position-config.json', session)
  const updatedResource: CellPositionConfig = {
    ...resource,
    distribution: createDistribution(fileMeta),
    generatorName: 'cell_position',
    configVersion: supportedVersion
  }
  const updated = await updateResource(updatedResource, resource._rev, session)
  console.log('> Done', updated['@id']);
}

async function setPlaceholderForMacroConnectomeConfig(config: BrainModelConfig, session: Session) {
  const subConfigId = config.configs.macroConnectomeConfig['@id']
  const resource = await fetchResourceById<MacroConnectomeConfigResource>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  let payload = await fetchJsonFileByUrl<MacroConnectomeConfigPayload>(fileUrl, session)
  const expectedPayload = {"bases":{"connection_strength":{"id":"https://bbp.epfl.ch/neurosciencegraph/data/7c8badeb-2fc6-48bc-b9be-a0cf8ec347bb","type":["Entity","Dataset","WholeBrainConnectomeStrength"],"rev":1}},"overrides":{"connection_strength":{"id":"https://bbp.epfl.ch/neurosciencegraph/data/wholebrainconnectomestrengths/df01cdfb-257b-4964-987b-0d4cfd1ddbdb","type":["Entity","Dataset","WholeBrainConnectomeStrength"],"rev":1}}};
  const path = ['bases', 'connection_strength', 'id']
  const hasCorrectStructure = get(payload, path)

  let modified = false;

  if (!hasCorrectStructure) {
    console.log('Setting placeholder config for macroConnectome config');
    payload = expectedPayload as any;
    modified = true
  }

  if (resource.generatorName !== 'connectome') {
    console.log('Fixing generatorName');
    modified = true
  }

  const supportedVersion = 0
  if (resource.configVersion !== supportedVersion) {
    console.log('Fixing configVersion');
    modified = true
  }

  if (!modified) return;

  const fileMeta = await updateJsonFileByUrl(fileUrl, payload, 'macroconnectome-config.json', session)
  const updatedResource: MacroConnectomeConfig = {
    ...resource,
    distribution: createDistribution(fileMeta),
    generatorName: 'connectome',
    configVersion: supportedVersion
  }
  const updated = await updateResource(updatedResource, resource._rev, session)
  console.log('> Done', updated['@id']);
}

async function setPlaceholderForSynapseConfig(config: BrainModelConfig, session: Session) {
  const subConfigId = config.configs.synapseConfig['@id']
  const resource = await fetchResourceById<SynapseConfigResource>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  let payload = await fetchJsonFileByUrl<SynapseConfigPayload>(fileUrl, session)
  const expectedPayload = { configuration: {} };
  let modified = false;

  if (!isEqual(payload, expectedPayload)) {
    console.log('Setting empty config for placeholder in synapse config');
    payload = expectedPayload as any;
    modified = true
  }

  if (resource.generatorName !== 'connectome_filtering') {
    console.log('Fixing generatorName');
    modified = true
  }

  const supportedVersion = 0
  if (resource.configVersion !== supportedVersion) {
    console.log('Fixing configVersion');
    modified = true
  }

  if (!modified) return;
  const fileMeta = await updateJsonFileByUrl(fileUrl, payload, 'synapse-config.json', session)
  const updatedResource: SynapseConfigResource = {
    ...resource,
    distribution: createDistribution(fileMeta),
    generatorName: 'connectome_filtering',
    configVersion: supportedVersion
  }
  const updated = await updateResource(updatedResource, resource._rev, session)
  console.log('> Done', updated['@id']);
}

async function setPlaceholderForMicroConnectome(config: BrainModelConfig, session: Session) {
  const subConfigId = config.configs.microConnectomeConfig['@id']
  const resource = await fetchResourceById<MicroConnectomeConfigResource>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  let payload = await fetchJsonFileByUrl<MicroConnectomeConfigPayload>(fileUrl, session)
  const expectedPayload = {"unitCode":{"scale":"unit","exponent":"unit","mean_synapses_per_connection":"unit","sdev_synapses_per_connection":"unit","mean_conductance_velocity":"unit","sdev_conductance_velocity":"unit"},"hasPart":{"1":{"label":"left","hasPart":{"1":{"label":"left","hasPart":{"http://api.brain-map.org/api/v2/data/Structure/614454292":{"hasPart":{"http://api.brain-map.org/api/v2/data/Structure/614454293":{"hasPart":{"http://uri.interlex.org/base/ilx_0383208":{"label":"L2_TPC:A","hasPart":{"http://uri.interlex.org/base/ilx_0383208":{"label":"L2_TPC:A","variantDefinition":{"algorithm":"distance","version":"v1"},"configuration":[{"name":"scale","value":0.11},{"name":"exponent","value":0.007},{"name":"mean_synapses_per_connection","value":100},{"name":"sdev_synapses_per_connection","value":1},{"name":"mean_conductance_velocity","value":0.3},{"name":"sdev_conductance_velocity","value":0.01}]}}}}}}}}}}}}}
  const path = ['unitCode', 'scale']
  const hasCorrectStructure = get(payload, path)

  let modified = false;

  if (!hasCorrectStructure) {
    console.log('Rollback to supported payload for MicroConnectome');
    payload = expectedPayload as any;
    modified = true
  }

  if (resource.generatorName !== 'connectome') {
    console.log('Fixing generatorName');
    modified = true
  }

  const supportedVersion = 0
  if (resource.configVersion !== supportedVersion) {
    console.log('Fixing configVersion');
    modified = true
  }

  if (!modified) return;
  const fileMeta = await updateJsonFileByUrl(fileUrl, payload, 'microconnectome-config.json', session)
  const updatedResource: MicroConnectomeConfig = {
    ...resource,
    distribution: createDistribution(fileMeta),
    generatorName: 'connectome',
    configVersion: supportedVersion
  }
  const updated = await updateResource(updatedResource, resource._rev, session)
  console.log('> Done', updated['@id']);
}

async function setFullMicroConnectome(config: BrainModelConfig, session: Session) {
  const subConfigId = config.configs.microConnectomeConfig['@id']
  const resource = await fetchResourceById<MicroConnectomeConfigResource>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  let payload = await fetchJsonFileByUrl<MicroConnectomeConfigPayload>(fileUrl, session)

  const fullFileUrl = 'https://bbp.epfl.ch/nexus/v1/files/bbp/mmb-point-neuron-framework-model/https%3A%2F%2Fbbp.epfl.ch%2Fdata%2Fbbp%2Fmmb-point-neuron-framework-model%2Ffc7e2e50-b09b-4dee-8001-1e6a4d410bfc'
  let fullPayload = await fetchJsonFileByUrl<MicroConnectomeConfigPayload>(fullFileUrl, session)

  let modified = false;

  if (!('variants' in payload)) {
    console.log('Setting full payload for MicroConnectome');
    payload = fullPayload as any;
    modified = true
  }

  if (resource.generatorName !== 'connectome') {
    console.log('Fixing generatorName');
    modified = true
  }

  const supportedVersion = 1
  if (resource.configVersion !== supportedVersion) {
    console.log('Fixing configVersion');
    modified = true
  }

  if (!modified) return;
  const fileMeta = await updateJsonFileByUrl(fileUrl, payload, 'microconnectome-config.json', session)
  const updatedResource: MicroConnectomeConfig = {
    ...resource,
    distribution: createDistribution(fileMeta),
    generatorName: 'connectome',
    configVersion: supportedVersion
  }
  const updated = await updateResource(updatedResource, resource._rev, session)
  console.log('> Done', updated['@id']);
}

async function checkFullMicroConnectomeConfig(config: BrainModelConfig, session: Session) {
  const subConfigId = config.configs.microConnectomeConfig['@id']
  const resource = await fetchResourceById<MicroConnectomeConfig>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  let payload = await fetchJsonFileByUrl<MicroConnectomeConfigPayload>(fileUrl, session)
  if ('variants' in payload) {
    console.log('payload :>> ', payload);
  }
}

async function setFullMorphologyAssignment(config: BrainModelConfig, session: Session) {
  const subConfigId = config.configs.morphologyAssignmentConfig['@id']
  const resource = await fetchResourceById<MorphologyAssignmentConfigResource>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  let payload = await fetchJsonFileByUrl<MorphologyAssignmentConfigPayload>(fileUrl, session)
  const expectedPayload = {
    "variantDefinition": {
      "topological_synthesis": {
        "algorithm": "topological_synthesis",
        "version": "v1-dev"
      },
      "placeholder_assignment": {
        "algorithm": "placeholder_assignment",
        "version": "v1-dev"
      }
    },
    "defaults": {
      "topological_synthesis": {
        "@id": "https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/960c075e-fb79-4a4d-afe3-081fbc41b082",
        "@type": [
          "CanonicalMorphologyModelConfig",
          "Entity"
        ],
        "_rev": 1
      },
      "placeholder_assignment": {
        "@id": "https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/dd6d729a-7770-49bf-abd9-643f469e4362",
        "@type": [
          "PlaceholderMorphologyConfig",
          "Entity"
        ],
        "_rev": 3
      }
    },
    "configuration": {
      "topological_synthesis": {}
    }
  }

  let modified = false;

  let path = ['variantDefinition', 'topological_synthesis', 'version']
  let expectedValue = get(expectedPayload, path)
  let checkOk = get(payload, path) === expectedValue
  if (!checkOk) {
    console.log('Setting new version payload for MorphologyAssignment');
    path = ['variantDefinition']
    set(payload, path, get(expectedPayload, path))
    modified = true
  }

  path = ['defaults', 'topological_synthesis', '@id']
  expectedValue = get(expectedPayload, path)
  checkOk = get(payload, path) === expectedValue
  if (!checkOk) {
    console.log('Setting new @id on defaults payload for MorphologyAssignment');
    path = ['defaults']
    set(payload, path, get(expectedPayload, path))
    modified = true
  }

  path = ['configuration', 'topological_synthesis']
  const overrides = get(payload, path)
  if (!isEqual(overrides, {})) {
    for (const brainRegionKey in overrides) {
      for (const mTypeKey in overrides[brainRegionKey]) {
        const idPath = [...path, brainRegionKey, mTypeKey]
        const info = get(payload, idPath)
        if ('id' in info) {
          console.log('Setting new @id on overrides for MorphologyAssignment');
          const id = info.id
          delete info['id']
          set(payload, idPath, {
            ...info,
            '@id': id
          })
          modified = true
        }
      }
      
    }
  }

  if (resource.generatorName !== 'mmodel') {
    console.log('Fixing generatorName');
    modified = true
  }

  const supportedVersion = 1
  if (resource.configVersion !== supportedVersion) {
    console.log('Fixing configVersion');
    modified = true
  }

  if (!modified) return;
  console.log('payload :>> ', payload);
  return;
  const fileMeta = await updateJsonFileByUrl(fileUrl, payload, 'morphology-assignment-config.json', session)
  const updatedResource: MorphologyAssignmentConfig = {
    ...resource,
    distribution: createDistribution(fileMeta),
    generatorName: 'mmodel',
    configVersion: supportedVersion,
  }
  const updated = await updateResource(updatedResource, resource._rev, session)
  console.log('> Done', updated['@id']);
}

async function setPlaceholderEModelAssignment(config: BrainModelConfig, session: Session) {
  const subConfigId = config.configs.eModelAssignmentConfig['@id']
  const resource = await fetchResourceById<EModelAssignmentConfigResource>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  let payload = await fetchJsonFileByUrl<EModelAssignmentConfigPayload>(fileUrl, session)
  const expectedPayload = {"http://api.brain-map.org/api/v2/data/Structure/997":{"variantDefinition":{"algorithm":"emodel_assignment","version":"v1"},"inputs":[{"name":"etype_emodels","type":"Dataset","id":"https://bbp.epfl.ch/neurosciencegraph/data/000ccb05-8518-47ff-b726-87ff3975e2da"}],"configuration":{}}}
  let modified = false;

  if (!isEqual(payload, expectedPayload)) {
    console.log('Setting supported payload for EModelAssignment');
    payload = expectedPayload as any;
    modified = true
  }

  if (resource.generatorName !== 'placeholder') {
    console.log('Fixing generatorName');
    modified = true
  }

  const supportedVersion = 0
  if (resource.configVersion !== supportedVersion) {
    console.log('Fixing configVersion');
    modified = true
  }

  if (!modified) return;
  const fileMeta = await updateJsonFileByUrl(fileUrl, payload, 'emodel-assignment-config.json', session)
  const updatedResource: EModelAssignmentConfig = {
    ...resource,
    distribution: createDistribution(fileMeta),
    generatorName: 'placeholder',
    configVersion: supportedVersion,
  }
  const updated = await updateResource(updatedResource, resource._rev, session)
  console.log('> Done', updated['@id']);
}

async function fixCellCompositionRev(config: BrainModelConfig, session: Session) {
  const cellCompositionId = config.configs.cellCompositionConfig['@id']
  const compositionResource = await fetchResourceById<CellCompositionConfigResource>(cellCompositionId, session)
  const compositionFileUrl = compositionResource.distribution.contentUrl
  const exampleBrainRegion = 'http://api.brain-map.org/api/v2/data/Structure/23'
  const compositionPayload = await fetchJsonFileByUrl<CellCompositionConfigPayload>(compositionFileUrl, session)

  const updateComposition = async (payload: unknown) => {  
    const fileMeta = await updateJsonFileByUrl(compositionFileUrl, payload, 'cell-composition-config.json', session)
    
    const updatedResource: CellCompositionConfig = {
      ...compositionResource,
      distribution: createDistribution(fileMeta),
    }
    return updateResource(updatedResource, compositionResource._rev, session)
  }

  const removeRevisionsInComposition = (composition: CompositionOverridesWorkflowConfig, original: any) => {
    const revKey = '_rev'

    Object.entries(composition).forEach(([brainRegionKey, brainRegionValue]) => {
      Object.entries(brainRegionValue.hasPart).forEach(([mTypeKey, mTypeValue]) => {
        const sanitizedMTypeKey = mTypeKey.replace(/\?rev=.+/, '')
        const rev = get(original, [brainRegionKey, 'hasPart', sanitizedMTypeKey, revKey])
        if (!rev) debugger;
        mTypeValue[revKey] = rev;

        Object.entries(mTypeValue.hasPart).forEach(([eTypeKey, eTypeValue]) => {
          const sanitizedETypeKey = eTypeKey.replace(/\?rev=.+/, '')
          const rev = get(original, [brainRegionKey, 'hasPart', sanitizedMTypeKey, 'hasPart', sanitizedETypeKey, revKey])
          if (!rev) debugger;
          eTypeValue[revKey] = rev;
          set(mTypeValue.hasPart, [sanitizedETypeKey], eTypeValue)
          delete mTypeValue.hasPart?.[eTypeKey]
        })

        set(brainRegionValue.hasPart, [sanitizedMTypeKey], mTypeValue)
        delete brainRegionValue?.hasPart?.[mTypeKey]
      })
    })
  }

  checkConsistencyCellComposition(config, session)

  const path = [ROOT_BRAIN_REGION, 'configuration', 'overrides', exampleBrainRegion, 'hasPart', 'https://bbp.epfl.ch/ontologies/core/bmo/GenericExcitatoryNeuronMType', '_rev']
  if (get(compositionPayload, path)) return;
  
  console.log('Removing rev in cell composition...');
  const cellCompositionSummaryPayload: any = await fetchJsonFileByUrl(cellCompositionSummaryUrl, session)

  const overrides = compositionPayload[ROOT_BRAIN_REGION].configuration.overrides;
  removeRevisionsInComposition(overrides, cellCompositionSummaryPayload.hasPart)
  return;
  const updated = await updateComposition(compositionPayload)
  console.log('> Done', updated['@id']);
}

async function checkConsistencyCellComposition(config: BrainModelConfig, session: Session) {
  const cellCompositionId = config.configs.cellCompositionConfig['@id']
  const compositionResource = await fetchResourceById<CellCompositionConfigResource>(cellCompositionId, session)
  const compositionFileUrl = compositionResource.distribution.contentUrl
  const exampleBrainRegion = 'http://api.brain-map.org/api/v2/data/Structure/23'
  const compositionPayload = await fetchJsonFileByUrl<CellCompositionConfigPayload>(compositionFileUrl, session)

  const checkLabelAndAbout = (path: string[], original: any, currentValue: any) => {
    let value = get(original, [...path, 'label'])
    let expectedValue = currentValue['label']
    if (value !== expectedValue) console.log('Label is different', value, expectedValue);

    value = get(original, [...path, 'about'])
    expectedValue = currentValue['about']
    if (value !== expectedValue) console.log('About is different');
  }

  const checkConsistency = (composition: CompositionOverridesWorkflowConfig, original: any) => {
    Object.entries(composition).forEach(([brainRegionKey, brainRegionValue]) => {
      checkLabelAndAbout([brainRegionKey], original, brainRegionValue)
      
      Object.entries(brainRegionValue.hasPart).forEach(([mTypeKey, mTypeValue]) => {
        checkLabelAndAbout([brainRegionKey, 'hasPart', mTypeKey], original, mTypeValue)

        Object.entries(mTypeValue.hasPart).forEach(([eTypeKey, eTypeValue]) => {
          checkLabelAndAbout([brainRegionKey, 'hasPart', mTypeKey, 'hasPart', eTypeKey], original, eTypeValue)
        })
      })
    })
  }
  
  console.log('Comparing summary to overrides cell composition...');
  const cellCompositionSummaryPayload: any = await fetchJsonFileByUrl(cellCompositionSummaryUrl, session)

  const overrides = compositionPayload[ROOT_BRAIN_REGION].configuration.overrides;
  checkConsistency(overrides, cellCompositionSummaryPayload.hasPart)
  
  console.log('> Done');
}

async function setFullSynapseConfig(config: BrainModelConfig, session: Session) {
  const subConfigId = config.configs.synapseConfig['@id']
  const resource = await fetchResourceById<SynapseConfigResource>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  let payload = await fetchJsonFileByUrl<SynapseConfigPayload>(fileUrl, session)
  const hasCorrectStructure = ('defaults' in payload) && ('configuration' in payload)

  const fullFileUrl = 'https://bbp.epfl.ch/nexus/v1/files/bbp/mmb-point-neuron-framework-model/https:%2F%2Fbbp.epfl.ch%2Fdata%2Fbbp%2Fmmb-point-neuron-framework-model%2F50e43aa2-d26f-4948-b19d-f0e576b64b81'
  let fullPayload = await fetchJsonFileByUrl<SynapseConfigPayload>(fullFileUrl, session)
  let modified = false;

  if (!hasCorrectStructure) {
    console.log('Setting full config in synapse config');
    payload = fullPayload as any;
    modified = true
  }

  if (resource.generatorName !== 'connectome_filtering') {
    console.log('Fixing generatorName');
    modified = true
  }

  const supportedVersion = 1
  if (resource.configVersion !== supportedVersion) {
    console.log('Fixing configVersion');
    modified = true
  }

  if (!modified) return;
  const fileMeta = await updateJsonFileByUrl(fileUrl, payload, 'synapse-config.json', session)
  const updatedResource: SynapseConfigResource = {
    ...resource,
    distribution: createDistribution(fileMeta),
    generatorName: 'connectome_filtering',
    configVersion: supportedVersion
  }
  const updated = await updateResource(updatedResource, resource._rev, session)
  console.log('> Done', updated['@id']);
}

async function checkFullSynapseConfig(config: BrainModelConfig, session: Session) {
  const subConfigId = config.configs.synapseConfig['@id']
  const resource = await fetchResourceById<SynapseConfigResource>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  let payload = await fetchJsonFileByUrl<SynapseConfigPayload>(fileUrl, session)
  if ('defaults' in payload) {
    console.log('payload :>> ', payload);
  }
}

async function resetOverridesMorphologyAssignment(session: Session) {
  const subConfigId = 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/037e53cc-7a72-4765-8174-caebf7fa2707'
  const resource = await fetchResourceById<MorphologyAssignmentConfigResource>(subConfigId, session)
  const fileUrl = resource.distribution.contentUrl
  let payload = await fetchJsonFileByUrl<MorphologyAssignmentConfigPayload>(fileUrl, session)
  // const expectedPayload = {"variantDefinition":{"topological_synthesis":{"algorithm":"topological_synthesis","version":"v1"},"placeholder_assignment":{"algorithm":"placeholder_assignment","version":"v1"}},"defaults":{"topological_synthesis":{"id":"https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/5ec117b5-8ffa-4f3b-95ca-1dc8ad1b0c4d", "type":["CanonicalMorphologyModelConfig","Entity"]},"placeholder_assignment":{"id":"https://bbp.epfl.ch/neurosciencegraph/data/06b340d4-ac99-4459-bab4-013ef7199c36","type":["PlaceholderMorphologyConfig","Entity"]}},"configuration":{"topological_synthesis":{}}};
  // const path = ['variantDefinition', 'topological_synthesis', 'algorithm']
  // const hasCorrectStructure = get(payload, path)
  let modified = false;

  if (Object.keys(payload.configuration.topological_synthesis)) {
    console.log('Cleaning up overrides...');
    set(payload, ['configuration', 'topological_synthesis'], {})
    modified = true;
  }

  if (!modified) return;
  const fileMeta = await updateJsonFileByUrl(fileUrl, payload, 'morphology-assignment-config.json', session)
  const updatedResource: MorphologyAssignmentConfig = {
    ...resource,
    distribution: createDistribution(fileMeta),
  }
  const updated = await updateResource(updatedResource, resource._rev, session)
  console.log('> Done', updated['@id']);
}

async function hasRevInMType(config: BrainModelConfig, session: Session) {
  const cellCompositionId = config.configs.cellCompositionConfig['@id']
  const compositionResource = await fetchResourceById<CellCompositionConfigResource>(cellCompositionId, session)
  const compositionFileUrl = compositionResource.distribution.contentUrl
  const exampleBrainRegion = 'http://api.brain-map.org/api/v2/data/Structure/23'
  const compositionPayload = await fetchJsonFileByUrl<CellCompositionConfigPayload>(compositionFileUrl, session)

  const mTypes = Object.keys(compositionPayload[ROOT_BRAIN_REGION].configuration.overrides[exampleBrainRegion].hasPart)
  return mTypes[0].includes('?rev')
}
