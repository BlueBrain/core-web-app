import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import JSZip from 'jszip';
import { Session } from 'next-auth';

import {
  eModelAtom,
  eModelConfigurationAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import sessionAtom from '@/state/session';
import { fetchFileByUrl, fetchResourceById, queryES } from '@/api/nexus';
import {
  EModelConfiguration,
  EModelScriptResource,
  NeuronMorphology,
  SubCellularModelScriptResource,
} from '@/types/e-model';

type EModelConfigUsesRef = SubCellularModelScriptResource;

async function getMorphologyDistribution(
  eModelConfiguration: EModelConfiguration,
  session: Session
) {
  const morphology = eModelConfiguration.uses.find(
    (items) => items['@type'] === 'NeuronMorphology'
  );
  if (!morphology) throw new Error('NeuronMorphology not found');

  const resource = await fetchResourceById<NeuronMorphology>(morphology['@id'], session);
  if (!Array.isArray(resource.distribution))
    throw new Error('NeuronMorphology distribution is not an array');

  const swc = resource.distribution.find((d) => d.encodingFormat === 'application/swc');
  if (!swc) throw new Error('SWC format not found in NeuronMorphology distribution');

  const content = await fetchFileByUrl(swc.contentUrl, session).then((res) => res.text());

  return { morphName: swc.name, morphContent: content };
}

export function useCreateEmodelPackageFile() {
  const session = useAtomValue(sessionAtom);
  const eModel = useAtomValue(eModelAtom);
  const eModelConfiguration = useAtomValue(eModelConfigurationAtom);

  return useCallback(async () => {
    if (!session || !eModel || !eModelConfiguration) {
      throw new Error('Some deps are not defined');
    }

    // fetch only SubCellularModelScripts. Morphologies will be fetched later
    const subCellularModelScripts = eModelConfiguration.uses.filter(
      (items) => items['@type'] !== 'NeuronMorphology'
    );

    const modelResources = await Promise.all(
      subCellularModelScripts.map((ref) =>
        fetchResourceById<EModelConfigUsesRef>(ref['@id'], session)
      )
    );

    const modelFiles = await Promise.all(
      modelResources.map((modelResource) =>
        fetchFileByUrl(modelResource.distribution.contentUrl, session).then((res) => res.text())
      )
    );

    // TODO Utilize HOC files linked with the emodel
    // when the newly produced emodels will contain such a link.
    // (After the recent update to the optimization pipeline gets integrated into the workflow).
    const hocFileESQuery = {
      query: {
        term: {
          'name.keyword': `${eModelConfiguration?.eType} EModel`,
        },
      },
    };

    const hocFile = await queryES<EModelScriptResource>(hocFileESQuery, session)
      .then((eModelScripts) => eModelScripts[0] as EModelScriptResource)
      .then((eModelScript) => fetchFileByUrl(eModelScript.distribution.contentUrl, session))
      .then((res) => res.text());

    // Assembling model package archive

    const packageRoot = new JSZip();

    const packageMechsFolder = packageRoot.folder('mechanisms');
    const packageMorphFolder = packageRoot.folder('morphology');

    if (!packageMechsFolder || !packageMorphFolder) {
      throw new Error('Can not create an E-Model package');
    }

    packageRoot.file('cell.hoc', hocFile);

    modelResources.forEach((modelFileEntity, idx) => {
      const filename = modelFileEntity.distribution.name;
      packageMechsFolder.file(filename, modelFiles[idx]);
    });

    const { morphName, morphContent } = await getMorphologyDistribution(
      eModelConfiguration,
      session
    );
    packageMorphFolder.file(morphName, morphContent);

    const emodelPackageBlob = await packageRoot.generateAsync({ type: 'blob' });
    const emodelPackageFile = new File([emodelPackageBlob], 'model-archive.zip');

    return emodelPackageFile;
  }, [eModel, eModelConfiguration, session]);
}

export function useEModelUUID() {
  const eModel = useAtomValue(eModelAtom);

  return eModel?.['@id'].split('/').at(-1) as string;
}
