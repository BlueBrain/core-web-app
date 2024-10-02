import { atom } from 'jotai';
import esb from 'elastic-builder';

import { MEModelMorphologyType, MEModelSection } from '@/types/virtual-lab/build/me-model';
import { EModel, EModelConfiguration, EModelWorkflow, NeuronMorphology } from '@/types/e-model';
import sessionAtom from '@/state/session';
import { fetchResourceById, fetchResourceByIdUsingResolver } from '@/api/nexus';
import { MEModelResource } from '@/types/me-model';
import { getIdFromSelfUrl, getOrgFromSelfUrl, getProjectFromSelfUrl } from '@/util/nexus';
import authFetch from '@/authFetch';
import { API_SEARCH } from '@/constants/explore-section/queries';
import { Experiment } from '@/types/explore-section/es-experiment';

/**
 * Function to retrieve an es resource and return the source
 *
 * @param query
 * @returns
 */
const retrieveESResourceByID = async (id: string) => {
  const query = esb
    .requestBodySearch()
    .query(esb.boolQuery().must(esb.termQuery('@id', id)))
    .size(1);

  return authFetch(API_SEARCH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
    body: JSON.stringify(query.toJSON()),
  })
    .then(async (response) => {
      return response.json();
    })
    .then<Experiment>((data) => {
      return data.hits?.hits[0]._source;
    });
};

export const meModelSectionAtom = atom<MEModelSection>('morphology');

export const morphologyTypeAtom = atom<MEModelMorphologyType>('reconstructed');

// M-model

export const selectedMModelIdAtom = atom<string | null>(null);

// Retrieving the resource using ES in order to access org/project
export const selectedMModelResourceAtom = atom(async (get) => {
  const mModelId = get(selectedMModelIdAtom);
  if (!mModelId) return;

  return await retrieveESResourceByID(mModelId);
});

export const selectedMModelOrgAtom = atom(async (get) => {
  const resource = await get(selectedMModelResourceAtom);
  if (!resource) return null;
  return getOrgFromSelfUrl(resource._self);
});

export const selectedMModelProjectAtom = atom(async (get) => {
  const resource = await get(selectedMModelResourceAtom);
  if (!resource) return null;
  return getProjectFromSelfUrl(resource._self);
});

export const selectedMModelAtom = atom<Promise<NeuronMorphology | undefined>>(async (get) => {
  const session = get(sessionAtom);
  const org = await get(selectedMModelOrgAtom);
  const project = await get(selectedMModelProjectAtom);
  const mModelId = get(selectedMModelIdAtom);
  if (!session || !mModelId || !org || !project) return;

  return fetchResourceById<NeuronMorphology>(mModelId, session, { org, project });
});

// E-model

export const selectedEModelIdAtom = atom<string | null>(null);

// Retrieving the resource using ES in order to access org/project
export const selectedEModelResourceAtom = atom(async (get) => {
  const eModelId = get(selectedEModelIdAtom);
  if (!eModelId) return;

  return await retrieveESResourceByID(eModelId);
});

const selectedEModelOrgAtom = atom(async (get) => {
  const resource = await get(selectedEModelResourceAtom);
  if (!resource) return;
  return getOrgFromSelfUrl(resource._self);
});

const selectedEModelProjectAtom = atom(async (get) => {
  const resource = await get(selectedEModelResourceAtom);
  if (!resource) return;
  return getProjectFromSelfUrl(resource._self);
});

export const selectedEModelAtom = atom<Promise<EModel | undefined>>(async (get) => {
  const session = get(sessionAtom);
  const org = await get(selectedEModelOrgAtom);
  const project = await get(selectedEModelProjectAtom);
  const eModelId = get(selectedEModelIdAtom);
  if (!session || !eModelId || !org || !project) return;

  return fetchResourceById<EModel>(eModelId, session, { org, project });
});

export const selectedEModelWorkflowAtom = atom<Promise<EModelWorkflow | undefined>>(async (get) => {
  const session = get(sessionAtom);
  const org = await get(selectedEModelOrgAtom);
  const project = await get(selectedEModelProjectAtom);
  const selectedEModel = await get(selectedEModelAtom);

  if (!session || !org || !project || !selectedEModel) return;

  const selectedEModelWorkflowId = selectedEModel?.generation.activity.followedWorkflow['@id'];

  if (!selectedEModelWorkflowId) return;

  const selectedEModelWorkflow = await fetchResourceByIdUsingResolver<EModelWorkflow>(
    selectedEModelWorkflowId,
    session,
    {
      org,
      project,
    }
  );

  return selectedEModelWorkflow;
});

export const selectedEModelConfigurationAtom = atom<Promise<EModelConfiguration | undefined>>(
  async (get) => {
    const session = get(sessionAtom);
    const org = await get(selectedEModelOrgAtom);
    const project = await get(selectedEModelProjectAtom);
    const selectedEModelWorkflow = await get(selectedEModelWorkflowAtom);

    if (!session || !org || !project || !selectedEModelWorkflow) return;

    const selectedEModelConfigurationPart = selectedEModelWorkflow.hasPart.find(
      ({ '@type': type }) => type === 'EModelConfiguration'
    );

    const { '@id': selectedEModelConfigurationId } = selectedEModelConfigurationPart ?? {};

    if (!selectedEModelConfigurationId) return;

    const selectedEModelConfiguration = await fetchResourceByIdUsingResolver<EModelConfiguration>(
      selectedEModelConfigurationId,
      session,
      {
        org,
        project,
      }
    );

    return selectedEModelConfiguration;
  }
);

// ME-model

export const meModelSelfUrlAtom = atom<string | null>(null);

export const selectedMEModelIdAtom = atom<string | null>((get) => {
  const meModelSelfUrl = get(meModelSelfUrlAtom);
  return getIdFromSelfUrl(meModelSelfUrl);
});

export const selectedMEModelOrgAtom = atom<string | null>((get) => {
  const meModelSelfUrl = get(meModelSelfUrlAtom);
  return getOrgFromSelfUrl(meModelSelfUrl);
});

export const selectedMEModelProjectAtom = atom<string | null>((get) => {
  const meModelSelfUrl = get(meModelSelfUrlAtom);
  return getProjectFromSelfUrl(meModelSelfUrl);
});

export const meModelResourceAtom = atom<Promise<MEModelResource | undefined>>(async (get) => {
  const session = get(sessionAtom);
  const meModelId = get(selectedMEModelIdAtom);
  const org = get(selectedMEModelOrgAtom);
  const project = get(selectedMEModelProjectAtom);
  if (!session || !meModelId || !org || !project) return;
  return fetchResourceById<MEModelResource>(meModelId, session, { org, project });
});
