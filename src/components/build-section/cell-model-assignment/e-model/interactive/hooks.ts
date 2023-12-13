import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import JSZip from 'jszip';

import { BLUE_NAAS_DEPLOYMENT_URL } from './constants';
import {
  eModelAtom,
  eModelConfigurationAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import sessionAtom from '@/state/session';
import { fetchFileByUrl, fetchResourceById, queryES } from '@/api/nexus';
import {
  EModelScriptResource,
  NeuronMorphology,
  SubCellularModelScriptResource,
} from '@/types/e-model';

type EModelConfigUsesRef = SubCellularModelScriptResource | NeuronMorphology;

export function useCreateEmodelPackageFile() {
  const session = useAtomValue(sessionAtom);
  const eModel = useAtomValue(eModelAtom);
  const eModelConfiguration = useAtomValue(eModelConfigurationAtom);

  return useCallback(async () => {
    if (!session || !eModel || !eModelConfiguration) {
      throw new Error('Some deps are not defined');
    }

    // Fetching all files.

    const modelResources = await Promise.all(
      eModelConfiguration.uses.map((ref) =>
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
          'name.keyword': `${eModelConfiguration?.etype} EModel`,
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

      if (eModelConfiguration?.uses[idx]['@type'] === 'NeuronMorphology') {
        packageMorphFolder.file(filename, modelFiles[idx]);
      } else {
        packageMechsFolder.file(filename, modelFiles[idx]);
      }
    });

    const emodelPackageBlob = await packageRoot.generateAsync({ type: 'blob' });
    const emodelPackageFile = new File([emodelPackageBlob], 'model-archive.zip');

    return emodelPackageFile;
  }, [eModel, eModelConfiguration, session]);
}

export function useEModelUUID() {
  const eModel = useAtomValue(eModelAtom);

  return eModel?.['@id'].split('/').at(-1) as string;
}

export function useEnsureModelPackage() {
  const eModelUUID = useEModelUUID();
  const createEmodelPackageFile = useCreateEmodelPackageFile();

  return useCallback(async () => {
    const packageExistsRes = await fetch(`${BLUE_NAAS_DEPLOYMENT_URL}/models/${eModelUUID}`, {
      method: 'HEAD',
    });

    switch (packageExistsRes.status) {
      case 204:
        return;
      case 404:
        break;
      default:
        throw new Error('Unexpected reply from BlueNaaS');
    }

    const emodelPackageFile = await createEmodelPackageFile();

    const formData = new FormData();
    formData.append('file', emodelPackageFile);

    const packageUploadRes = await fetch(`${BLUE_NAAS_DEPLOYMENT_URL}/models/${eModelUUID}`, {
      body: formData,
      method: 'POST',
    });

    if (!packageUploadRes.ok) {
      throw new Error('Failed to upload e-model package to BlueNaaS');
    }
  }, [createEmodelPackageFile, eModelUUID]);
}
