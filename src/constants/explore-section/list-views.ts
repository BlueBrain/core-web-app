import { neuroShapesBaseUrl, ontologyBaseUrl } from '@/config';

export enum DataType {
  ExperimentalBoutonDensity = `ExperimentsBoutonDensity`,
  ExperimentalNeuronDensity = `ExperimentalNeuronDensity`,
  ExperimentalElectroPhysiology = `ExperimentalElectroPhysiology`,
  ExperimentalSynapsePerConnection = `ExperimentalSynapsePerConnection`,
  ExperimentalNeuronMorphology = `ExperimentalNeuronMorphology`,
  SimulationCampaigns = `SimulationCampaign`,
  CircuitEModel = 'CircuitEModel',
  CircuitMEModel = 'CircuitMEModel',
  SingleNeuronSimulation = 'SingleNeuronSimulation',
  SingleNeuronSynaptome = 'SingleNeuronSynaptome',
  SingleNeuronSynaptomeSimulation = 'SingleNeuronSynaptomeSimulation',
}

export const DataTypeToNexusType = {
  [DataType.ExperimentalBoutonDensity]: `${ontologyBaseUrl}/ExperimentalBoutonDensity`,
  [DataType.ExperimentalNeuronDensity]: `${ontologyBaseUrl}/ExperimentalNeuronDensity`,
  [DataType.ExperimentalElectroPhysiology]: `${ontologyBaseUrl}/ExperimentalTrace`,
  [DataType.ExperimentalSynapsePerConnection]: `${ontologyBaseUrl}/ExperimentalSynapsesPerConnection`,
  [DataType.SimulationCampaigns]: `${neuroShapesBaseUrl}/SimulationCampaign`,
  [DataType.ExperimentalNeuronMorphology]: `${neuroShapesBaseUrl}/ReconstructedNeuronMorphology`,
  [DataType.CircuitEModel]: `${neuroShapesBaseUrl}/EModel`,
  [DataType.CircuitMEModel]: `${neuroShapesBaseUrl}/MEModel`,
  [DataType.SingleNeuronSimulation]: `${ontologyBaseUrl}/SingleNeuronSimulation`,
  [DataType.SingleNeuronSynaptome]: `${ontologyBaseUrl}/SingleNeuronSynaptome`,
  [DataType.SingleNeuronSynaptomeSimulation]: `${ontologyBaseUrl}/SingleNeuronSynaptomeSimulation`,
};

export const DEFAULT_CHECKLIST_RENDER_LENGTH = 8;
export const PAGE_SIZE = 30;
export const PAGE_NUMBER = 1;
