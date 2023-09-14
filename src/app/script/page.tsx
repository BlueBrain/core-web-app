/* eslint-disable no-await-in-loop */

'use client';

import { useSession } from 'next-auth/react';

import { getPublicBrainModelConfigsQuery } from '@/queries/es';
import {
  cloneMacroConnectomeConfig,
  cloneMicroConnectomeConfig,
  cloneSynapseConfig,
  fetchFileMetadataByUrl,
  fetchJsonFileByUrl,
  fetchResourceById,
  fetchResourceSourceById,
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
  EModelAssignmentConfig,
  EModelAssignmentConfigPayload,
  EModelAssignmentConfigResource,
  MicroConnectomeConfig,
  MicroConnectomeConfigPayload,
  MicroConnectomeConfigResource,
  MorphologyAssignmentConfig,
  MorphologyAssignmentConfigPayload,
  MorphologyAssignmentConfigResource,
} from '@/types/nexus';
import { createGeneratorConfig } from '@/util/nexus';


const ROOT_BRAIN_REGION = 'http://api.brain-map.org/api/v2/data/Structure/997';

export default function ScriptPage() {
  const { data: session } = useSession();

  const runScript = async () => {
    if (!session) {
      console.log('No session, aborting...');
      return;
    }

    const compositionFileOfReleaseUrl = 'https://bbp.epfl.ch/nexus/v1/files/bbp/mmb-point-neuron-framework-model/https%3A%2F%2Fbbp.epfl.ch%2Fdata%2Fbbp%2Fmmb-point-neuron-framework-model%2F64a95173-f092-4756-aa94-3c644451c307'
    const configNoRevId = 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/254830cf-40bb-417a-bd65-bc562e2d4ae7'

    const configResource = await fetchResourceById<BrainModelConfigResource>(configNoRevId, session)
    const cellCompositionId = configResource.configs.cellCompositionConfig['@id']
    const compositionResource = await fetchResourceById<CellCompositionConfigResource>(cellCompositionId, session)
    const compositionFileNoRevUrl = compositionResource.distribution.contentUrl
    const exampleBrainRegion = 'http://api.brain-map.org/api/v2/data/Structure/23'
    const compositionOfReleasePayload = await fetchJsonFileByUrl<CellCompositionConfigPayload>(compositionFileOfReleaseUrl, session)

    const resetComposition = async () => {
      const fileMeta = await updateJsonFileByUrl(compositionFileNoRevUrl, compositionOfReleasePayload, 'cell-composition-config.json', session)
      
      const updatedResource: CellCompositionConfig = {
        ...compositionResource,
        distribution: createDistribution(fileMeta),
      }
      const updated = await updateResource(updatedResource, compositionResource._rev, session)
      console.log('updated :>> ', updated);
    }

    const updateComposition = async (payload: unknown) => {  
      const fileMeta = await updateJsonFileByUrl(compositionFileNoRevUrl, payload, 'cell-composition-config.json', session)
      
      const updatedResource: CellCompositionConfig = {
        ...compositionResource,
        distribution: createDistribution(fileMeta),
      }
      const updated = await updateResource(updatedResource, compositionResource._rev, session)
      console.log('updated :>> ', updated);
    }

    function removeRevisionsInComposition(composition: CompositionOverridesWorkflowConfig, original: any) {
      console.log('[removeRevisionsInComposition]...');
      // composition = { [exampleBrainRegion]: composition[exampleBrainRegion] }
      const revKey = '_rev'

      Object.entries(composition).forEach(([brainRegionKey, brainRegionValue]) => {
        Object.entries(brainRegionValue.hasPart).forEach(([mTypeKey, mTypeValue]) => {
          const sanitizedMTypeKey = mTypeKey.replace(/\?rev=.+/, '')
          const rev = get(original, [brainRegionKey, 'hasPart', sanitizedMTypeKey, revKey])
          if (!rev) debugger;
          mTypeValue[revKey] = rev;
          // console.log(mTypeKey, rev);

          Object.entries(mTypeValue.hasPart).forEach(([eTypeKey, eTypeValue]) => {
            const sanitizedETypeKey = eTypeKey.replace(/\?rev=.+/, '')
            const rev = get(original, [brainRegionKey, 'hasPart', sanitizedMTypeKey, 'hasPart', sanitizedETypeKey, revKey])
            if (!rev) debugger;
            eTypeValue[revKey] = rev;
            // console.log(eTypeKey, rev);
            set(mTypeValue.hasPart, [sanitizedETypeKey], eTypeValue)
            delete mTypeValue.hasPart?.[eTypeKey]
          })

          set(brainRegionValue.hasPart, [sanitizedMTypeKey], mTypeValue)
          delete brainRegionValue?.hasPart?.[mTypeKey]
        })
      })
      // console.log(composition);
    }

    const cellCompositionSummaryUrl = 'https://bbp.epfl.ch/nexus/v1/files/bbp/atlasdatasetrelease/https%3A%2F%2Fbbp.epfl.ch%2Fdata%2Fbbp%2Fatlasdatasetrelease%2Fb480420a-a452-4e08-8918-b4f24d1ca7b1'
    const cellCompositionSummaryPayload: any = await fetchJsonFileByUrl(cellCompositionSummaryUrl, session)

    // const compositionFileNoRevPayload: CellCompositionConfigPayload = await fetchJsonFileByUrl(compositionFileNoRevUrl, session)

    const overrides = compositionOfReleasePayload[ROOT_BRAIN_REGION].configuration.overrides;
    removeRevisionsInComposition(overrides, cellCompositionSummaryPayload.hasPart)
    console.log(compositionOfReleasePayload);
    await updateComposition(compositionOfReleasePayload)
    // console.log(overrides[exampleBrainRegion]);
    return;

    const query = getPublicBrainModelConfigsQuery();
    const configs = await queryES<BrainModelConfigResource>(query, session);

    // eslint-disable-next-line no-restricted-syntax
    for (const config of configs) {
      // do not modify the Releases
      if (config.name.match(/^Release \d\d\.\d\d$/)) continue;

      // if (config.name === 'JDC-TEST2-Release 23.01 - new format - clone') {
      //   continue;
      // }

      console.log('Processing config: ', config.name, config._self);

      const configSource = await fetchResourceById<BrainModelConfig>(config['@id'], session);

      // const cellCompositionConfigSource = await fetchResourceSourceById<CellCompositionConfig>(config.configs.cellCompositionConfig['@id'], session);
      // const cellCompositionConfig = await fetchResourceById<CellCompositionConfigResource>(config.configs.cellCompositionConfig['@id'], session);
      // const cellCompositionConfigPayload = await fetchJsonFileByUrl<CellCompositionConfigPayload>(cellCompositionConfigSource.distribution.contentUrl, session);
      // const cellCompositionConfigPayloadMeta = await fetchFileMetadataByUrl(cellCompositionConfigSource.distribution.contentUrl, session);

      // if (cellCompositionConfigPayload[ROOT_BRAIN_REGION].variantDefinition.version !== 'v1') {
      //   console.log('Cell composition: updating variant definition version to v1');
      //   cellCompositionConfigPayload[ROOT_BRAIN_REGION].variantDefinition.version = 'v1';

      //   const updatedCellCompositionConfigPayload = await updateJsonFileByUrl(
      //     cellCompositionConfigSource.distribution.contentUrl.includes('rev=')
      //     ? cellCompositionConfigSource.distribution.contentUrl
      //     : `${cellCompositionConfigSource.distribution.contentUrl}?rev=${cellCompositionConfigPayloadMeta._rev}`,
      //     cellCompositionConfigPayload,
      //     'cell-composition-config.json',
      //     session
      //   );

      //   cellCompositionConfigSource.distribution = createGeneratorConfig({
      //     kgType: 'CellCompositionConfig',
      //     payloadMetadata: updatedCellCompositionConfigPayload,
      //   }).distribution;

      //   if (!cellCompositionConfigSource['@id']) {
      //     console.log('No Id in the source, adding one');
      //     cellCompositionConfigSource['@id'] = cellCompositionConfig['@id'];
      //   }

      //   await updateResource(cellCompositionConfigSource, cellCompositionConfig._rev, session);
      // }


      // const cellPositionConfigSource = await fetchResourceSourceById<CellPositionConfig>(config.configs.cellPositionConfig['@id'], session);
      // const cellPositionConfig = await fetchResourceById<CellPositionConfigResource>(config.configs.cellPositionConfig['@id'], session);
      // const cellPositionConfigPayload = await fetchJsonFileByUrl<CellPositionConfigPayload>(cellPositionConfigSource.distribution.contentUrl, session);
      // const cellPositionConfigPayloadMeta = await fetchFileMetadataByUrl(cellPositionConfigSource.distribution.contentUrl, session);

      // if (cellPositionConfigPayload[ROOT_BRAIN_REGION].variantDefinition.version !== 'v1') {
      //   console.log('Cell position: updating variant definition version to v1');
      //   cellPositionConfigPayload[ROOT_BRAIN_REGION].variantDefinition.version = 'v1';

      //   const updatedCellPositionConfigPayload = await updateJsonFileByUrl(
      //     cellPositionConfigSource.distribution.contentUrl.includes('rev=')
      //       ? cellPositionConfigSource.distribution.contentUrl
      //       : `${cellPositionConfigSource.distribution.contentUrl}?rev=${cellPositionConfigPayloadMeta._rev}`,
      //     cellPositionConfigPayload,
      //     'cell-position-config.json',
      //     session
      //   );

      //   cellPositionConfigSource.distribution = createGeneratorConfig({
      //     kgType: 'CellPositionConfig',
      //     payloadMetadata: updatedCellPositionConfigPayload,
      //   }).distribution;

      //   if (!cellPositionConfigSource['@id']) {
      //     console.log('No Id in the source, adding one');
      //     cellPositionConfigSource['@id'] = cellPositionConfig['@id'];
      //   }

      //   await updateResource(cellPositionConfigSource, cellPositionConfig._rev, session);
      // }



      // const eModelAssignmentConfigSource = await fetchResourceSourceById<EModelAssignmentConfig>(config.configs.eModelAssignmentConfig['@id'], session);
      // const eModelAssignmentConfig = await fetchResourceById<EModelAssignmentConfigResource>(config.configs.eModelAssignmentConfig['@id'], session);
      // const eModelAssignmentConfigPayload = await fetchJsonFileByUrl<EModelAssignmentConfigPayload>(eModelAssignmentConfigSource.distribution.contentUrl, session);
      // const eModelAssignmentConfigPayloadMeta = await fetchFileMetadataByUrl(eModelAssignmentConfigSource.distribution.contentUrl, session);

      // if (eModelAssignmentConfigPayload[ROOT_BRAIN_REGION].variantDefinition.version !== 'v1') {
      //   console.log('eModel assignment: updating variant definition version to v1');
      //   eModelAssignmentConfigPayload[ROOT_BRAIN_REGION].variantDefinition.version = 'v1';

      //   const updatedEModelAssignmentConfigPayload = await updateJsonFileByUrl(
      //     eModelAssignmentConfigSource.distribution.contentUrl.includes('rev=')
      //       ? eModelAssignmentConfigSource.distribution.contentUrl
      //       : `${eModelAssignmentConfigSource.distribution.contentUrl}?rev=${eModelAssignmentConfigPayloadMeta._rev}`,
      //     eModelAssignmentConfigPayload,
      //     'emodel-assignment-config.json',
      //     session
      //   );

      //   eModelAssignmentConfigSource.distribution = createGeneratorConfig({
      //     kgType: 'EModelAssignmentConfig',
      //     payloadMetadata: updatedEModelAssignmentConfigPayload,
      //   }).distribution;

      //   if (!eModelAssignmentConfigSource['@id']) {
      //     console.log('No Id in the source, adding one');
      //     eModelAssignmentConfigSource['@id'] = eModelAssignmentConfig['@id'];
      //   }

      //   await updateResource(eModelAssignmentConfigSource, eModelAssignmentConfig._rev, session);
      // }



      // const morphologyAssignmentConfigSource = await fetchResourceSourceById<MorphologyAssignmentConfig>(config.configs.morphologyAssignmentConfig['@id'], session);
      // const morphologyAssignmentConfig = await fetchResourceById<MorphologyAssignmentConfigResource>(config.configs.morphologyAssignmentConfig['@id'], session);
      // const morphologyAssignmentConfigPayload = await fetchJsonFileByUrl<MorphologyAssignmentConfigPayload>(morphologyAssignmentConfigSource.distribution.contentUrl, session);
      // const morphologyAssignmentConfigPayloadMeta = await fetchFileMetadataByUrl(morphologyAssignmentConfigSource.distribution.contentUrl, session);

      // if (morphologyAssignmentConfigPayload[ROOT_BRAIN_REGION].variantDefinition.version !== 'v1') {
      //   console.log('Morphology assignment: updating variant definition version to v1');
      //   morphologyAssignmentConfigPayload[ROOT_BRAIN_REGION].variantDefinition.version = 'v1';

      //   const updatedMorphologyAssignmentConfigPayload = await updateJsonFileByUrl(
      //     morphologyAssignmentConfigSource.distribution.contentUrl.includes('rev=')
      //       ? morphologyAssignmentConfigSource.distribution.contentUrl
      //       : `${morphologyAssignmentConfigSource.distribution.contentUrl}?rev=${morphologyAssignmentConfigPayloadMeta._rev}`,
      //     morphologyAssignmentConfigPayload,
      //     'morphology-assignment-config.json',
      //     session
      //   );

      //   morphologyAssignmentConfigSource.distribution = createGeneratorConfig({
      //     kgType: 'MorphologyAssignmentConfig',
      //     payloadMetadata: updatedMorphologyAssignmentConfigPayload,
      //   }).distribution;

      //   if (!morphologyAssignmentConfigSource['@id']) {
      //     console.log('No Id in the source, adding one');
      //     morphologyAssignmentConfigSource['@id'] = morphologyAssignmentConfig['@id'];
      //   }

      //   await updateResource(morphologyAssignmentConfigSource, morphologyAssignmentConfig._rev, session);
      // }

      // let isRootConfigModified = false;


      // const defaultMicroConnectomeConfigId = 'https://bbp.epfl.ch/neurosciencegraph/data/microconnectomeconfigs/b4980534-1324-45a1-8170-6c3bcdc4882e';

      // if (!configSource.configs.microConnectomeConfig) {
      //   console.log('Micro-connectome: adding cloned config');
      //   const clonedMicroConnectomeConfigMeta = await cloneMicroConnectomeConfig(defaultMicroConnectomeConfigId, session);
      //   configSource.configs.microConnectomeConfig = {
      //     '@id': clonedMicroConnectomeConfigMeta['@id'],
      //     '@type': ['MicroConnectomeConfig', 'Entity'],
      //   };
      //   isRootConfigModified = true;
      // } else {
      //   const microConnectomeConfigSource = await fetchResourceSourceById<MicroConnectomeConfig>(config.configs.microConnectomeConfig['@id'], session);
      //   const microConnectomeConfig = await fetchResourceById<MicroConnectomeConfigResource>(config.configs.microConnectomeConfig['@id'], session);
      //   const microConnectomeConfigPayload = await fetchJsonFileByUrl<MicroConnectomeConfigPayload>(microConnectomeConfigSource.distribution.contentUrl, session);
      //   const microConnectomeConfigPayloadMeta = await fetchFileMetadataByUrl(microConnectomeConfigSource.distribution.contentUrl, session);

      //   let isMicroConnectomeConfigPayloadModified = false;

      //   Object.keys(microConnectomeConfigPayload.hasPart).forEach((srcHemisphere) => {
      //     Object.keys(microConnectomeConfigPayload.hasPart[srcHemisphere].hasPart).forEach(dstHemisphere => {
      //       Object.keys(microConnectomeConfigPayload.hasPart[srcHemisphere].hasPart[dstHemisphere].hasPart).forEach(srcBrainRegionId => {
      //         Object.keys(microConnectomeConfigPayload.hasPart[srcHemisphere].hasPart[dstHemisphere].hasPart[srcBrainRegionId].hasPart).forEach(dstBrainRegionId => {
      //           Object.keys(microConnectomeConfigPayload.hasPart[srcHemisphere].hasPart[dstHemisphere].hasPart[srcBrainRegionId].hasPart[dstBrainRegionId].hasPart).forEach(srcMtype => {
      //             Object.keys(microConnectomeConfigPayload.hasPart[srcHemisphere].hasPart[dstHemisphere].hasPart[srcBrainRegionId].hasPart[dstBrainRegionId].hasPart[srcMtype].hasPart).forEach(dstMtype => {
      //               const variantVersion = microConnectomeConfigPayload.hasPart[srcHemisphere].hasPart[dstHemisphere].hasPart[srcBrainRegionId].hasPart[dstBrainRegionId].hasPart[srcMtype].hasPart[dstMtype].variantDefinition.version;
      //               if (variantVersion !== 'v1') {
      //                 isMicroConnectomeConfigPayloadModified = true;
      //                 microConnectomeConfigPayload.hasPart[srcHemisphere].hasPart[dstHemisphere].hasPart[srcBrainRegionId].hasPart[dstBrainRegionId].hasPart[srcMtype].hasPart[dstMtype].variantDefinition.version = 'v1';
      //               }
      //             });
      //           });
      //         });
      //       });
      //     });
      //   });

      //   if (isMicroConnectomeConfigPayloadModified) {
      //     console.log('Micro-connectome: updating variant definition version to v1');

      //     const updatedMicroConnectomeConfigPayload = await updateJsonFileByUrl(
      //       microConnectomeConfigSource.distribution.contentUrl.includes('rev=')
      //         ? microConnectomeConfigSource.distribution.contentUrl
      //         : `${microConnectomeConfigSource.distribution.contentUrl}?rev=${microConnectomeConfigPayloadMeta._rev}`,
      //       microConnectomeConfigPayload,
      //       'micro-connectome-config.json',
      //       session
      //     );

      //     microConnectomeConfigSource.distribution = createGeneratorConfig({
      //       kgType: 'MicroConnectomeConfig',
      //       payloadMetadata: updatedMicroConnectomeConfigPayload,
      //     }).distribution;

      //     if (!microConnectomeConfigSource['@id']) {
      //       console.log('No Id in the source, adding one');
      //       microConnectomeConfigSource['@id'] = microConnectomeConfig['@id'];
      //     }

      //     await updateResource(microConnectomeConfigSource, microConnectomeConfig._rev, session);
      //   }
      // }


      // ensure macro-connectome config
      // const macroConnectomeConfigId = 'https://bbp.epfl.ch/neurosciencegraph/data/6aef1bea-e66f-4b9f-b3ac-70fcce4e3636';
      // if (!configSource.configs.macroConnectomeConfig) {
        // console.log('Macro-connectome: adding cloned config');
        // const clonedMacroConnectomeConfigMeta = await cloneMacroConnectomeConfig(macroConnectomeConfigId, session);
        // configSource.configs.macroConnectomeConfig = {
        //   '@id': clonedMacroConnectomeConfigMeta['@id'],
        //   '@type': ['MacroConnectomeConfig', 'Entity'],
        // };
        // isRootConfigModified = true;
      // } else {
      //   console.warn('MacroConnectomeConfig present in: ', configSource.name);
      // }

      // ensure synapse editor config
      // const synapseConfigId = 'https://bbp.epfl.ch/neurosciencegraph/data/32cf59fe-d6fb-41f4-8b6b-71821addc67f';
      // if (!configSource.configs.synapseConfig) {
      //   console.log('Synapse editor: adding cloned config');
      //   const clonedSynapseConfigMeta = await cloneSynapseConfig(synapseConfigId, session);
      //   configSource.configs.synapseConfig = {
      //     '@id': clonedSynapseConfigMeta['@id'],
      //     '@type': ['SynapseConfig', 'Entity'],
      //   };
      //   isRootConfigModified = true;
      // }

      // if (isRootConfigModified) {
      //   console.log('Updating root level config');
      //   await updateResource(configSource, config._rev, session);
      // }


      // console.log('Update config successful\n\n');
    }
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
