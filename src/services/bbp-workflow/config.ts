export const PLACEHOLDERS = {
  USERNAME: '{USERNAME}',
  TASK_NAME: '{TASK_NAME}',
  ENDPOINT_PREFIX: '{ENDPOINT_PREFIX}',
};
export const BBP_WORKFLOW_URL = `https://bbp-workflow-api-${PLACEHOLDERS.USERNAME}.kcp.bbp.epfl.ch`;
export const BBP_WORKFLOW_AUTH_URL = `https://bbp-workflow-api-auth.kcp.bbp.epfl.ch/${PLACEHOLDERS.USERNAME}`;

export const WORKFLOW_CIRCUIT_BUILD_TASK_NAME = 'bbp_workflow.generation.SBOWorkflow/';
export const WORKFLOW_SIMULATION_TASK_NAME = 'bbp_workflow.sbo.viz.task.RunAllSimCampaignMeta/';
export const WORKFLOW_TEST_TASK_NAME = 'bbp_workflow.luigi.CompleteTask/';
export const WORKFLOW_EMODEL_BUILD_TASK_NAME =
  'bbp_workflow.sbo.emodel.task.LaunchEModelOptimisationMeta/';

export const ENDPOINT_PREFIX_MAP: Record<string, string> = {
  [WORKFLOW_EMODEL_BUILD_TASK_NAME]: 'launch-bb5',
};

export const BBP_WORKFLOW_TASK_PATH = `${BBP_WORKFLOW_URL}/${PLACEHOLDERS.ENDPOINT_PREFIX}/${PLACEHOLDERS.TASK_NAME}`;

export const customRangeDelimeter = '@@';

export enum BuildingPlaceholders {
  CONFIG_URL = 'CONFIG_URL',
  UUID = 'UUID',
  DATE = 'DATE',
  TARGET_CONFIG_NAME = 'TARGET_CONFIG_NAME',
}

export enum SimulationPlaceholders {
  VARIANT_TASK_ACTIVITY = 'VARIANT_TASK_ACTIVITY',
  NODE_SETS = 'NODE_SETS',
  SIMULATED_TARGET = 'SIMULATED_TARGET',
  TIME_STEP = 'TIME_STEP',
  FORWARD_SKIP = 'FORWARD_SKIP',
  SEED = 'SEED',
  DURATION = 'DURATION',
  CALCIUM_CONCENTRATION = 'CALCIUM_CONCENTRATION',
  REPORTS = 'REPORTS',
  INPUTS = 'INPUTS',
  GEN_SIM_CAMPAIGN_COORDS = 'GEN_SIM_CAMPAIGN_COORDS',
  SIM_CAMPAIGN_NAME = 'SIM_CAMPAIGN_NAME',
  SIM_CAMPAIGN_DESCRIPTION = 'SIM_CAMPAIGN_DESCRIPTION',
  VIZ_DISPLAY_SOMA = 'VIZ_DISPLAY_SOMA',
  VIZ_DISPLAY_DENDRITES = 'VIZ_DISPLAY_DENDRITES',
  VIZ_DISPLAY_AXON = 'VIZ_DISPLAY_AXON',
  VIZ_CAMERA_POSITION = 'VIZ_CAMERA_POSITION',
  VIZ_CAMERA_TARGET = 'VIZ_CAMERA_TARGET',
  VIZ_CAMERA_UP = 'VIZ_CAMERA_UP',
  VIZ_CAMERA_HEIGHT = 'VIZ_CAMERA_HEIGHT',
  VIZ_REPORT_TYPE = 'VIZ_REPORT_TYPE',
  VIZ_REPORT_NAME = 'VIZ_REPORT_NAME',
}

export enum AnalysisPlaceholders {
  RASTER_TARGETS = 'RASTER_TARGETS',
  PSTH_TARGETS = 'PSTH_TARGETS',
  VOLTAGE_TARGETS = 'VOLTAGE_TARGETS',
}

export enum EModelBuildingPlaceholders {
  E_MODEL_NAME = 'E_MODEL_NAME',
  E_TYPE = 'E_TYPE',
  BRAIN_REGION = 'BRAIN_REGION',
  UUID = 'UUID',
  OPTIMIZATION_CONFIG_ID = 'OPTIMIZATION_CONFIG_ID',
}

export type WorkflowMetaConfigPlaceholders = Record<
  string,
  {
    fileName: string;
    templateFile: string;
    placeholder: string;
  }
>;

export const simulationMetaConfigs: WorkflowMetaConfigPlaceholders = {
  GenSimCampaignMeta: {
    fileName: 'GenSimCampaignMeta.cfg',
    templateFile: `
      [GenSimCampaign]
      name: <%= ${SimulationPlaceholders.SIM_CAMPAIGN_NAME} %>
      description: <%= ${SimulationPlaceholders.SIM_CAMPAIGN_DESCRIPTION} %>

      attrs: {"path_prefix": "/gpfs/bbp.cscs.ch/project/%(account)s/scratch/sims",
              "blue_config_template": "simulation_config.tmpl"}

      coords: <%= ${SimulationPlaceholders.GEN_SIM_CAMPAIGN_COORDS} %>
    `,
    placeholder: 'GenSimCampaignMeta',
  },
  RunSimCampaignMeta: {
    fileName: 'RunSimCampaignMeta.cfg',
    templateFile: `
      [RunSimCampaign]
      simulation-type: CortexNrdmsPySim
      nodes: 5
      time: 8:00:00
    `,
    placeholder: 'RunSimCampaignMeta',
  },
  ReportsSimCampaignMeta: {
    fileName: 'ReportsSimCampaignMeta.cfg',
    templateFile: `
      [ReportsSimCampaign]
      reports: {"spikes": {"raster": {"node_sets": <%= ${AnalysisPlaceholders.RASTER_TARGETS} %>, "time": "2:00:00"},
                           "firing_rate_histogram": {"node_sets": <%= ${AnalysisPlaceholders.PSTH_TARGETS} %>, "time": "2:00:00"}},
                <%= ${SimulationPlaceholders.VIZ_REPORT_NAME} %>: {"trace": {"node_sets": <%= ${AnalysisPlaceholders.VOLTAGE_TARGETS} %>, "time": "2:00:00"}}}
    `,
    placeholder: 'ReportsSimCampaignMeta',
  },
  VideoSimCampaignMeta: {
    fileName: 'VideoSimCampaignMeta.cfg',
    templateFile: `
      [VideoSimCampaign]
      nodes: 20
      populations: [{
          "name": "root__neurons",
          "report_type": <%= ${SimulationPlaceholders.VIZ_REPORT_TYPE} %>,
          "report_name": <%= ${SimulationPlaceholders.VIZ_REPORT_NAME} %>,
          "density": 0.01,
          "radius_multiplier": 10,
          "load_soma": <%= ${SimulationPlaceholders.VIZ_DISPLAY_SOMA} %>,
          "load_dendrites": <%= ${SimulationPlaceholders.VIZ_DISPLAY_DENDRITES} %>,
          "load_axon": <%= ${SimulationPlaceholders.VIZ_DISPLAY_AXON} %> }]
      resolution: [1920, 1080]
      camera-type: perspective
      camera-view: front
      background-color: [1, 1, 1, 0]
      camera-position: <%= ${SimulationPlaceholders.VIZ_CAMERA_POSITION} %>
      camera-target: <%= ${SimulationPlaceholders.VIZ_CAMERA_TARGET} %>
      camera-up: <%= ${SimulationPlaceholders.VIZ_CAMERA_UP} %>
      camera-height: <%= ${SimulationPlaceholders.VIZ_CAMERA_HEIGHT} %>
      fps: 10
      slowing-factor: 10
      start-frame: 0
      end-frame: -1
    `,
    placeholder: 'VideoSimCampaignMeta',
  },
};

export type WorkflowFile = {
  NAME: string;
  TYPE: string;
  CONTENT: string;
};

// Modified based on https://bbpteam.epfl.ch/project/issues/browse/BBPP134-288
export const SIMULATION_FILES: WorkflowFile[] = [
  {
    NAME: 'simulation.cfg',
    TYPE: 'file',
    CONTENT: `
      [DEFAULT]
      kg-proj: mmb-point-neuron-framework-model
      account: proj134

      [FindDetailedCircuitMeta]
      config-url: <%= ${SimulationPlaceholders.VARIANT_TASK_ACTIVITY} %>

      [GenSimCampaignMeta]
      config-url: <%= ${simulationMetaConfigs.GenSimCampaignMeta.placeholder} %>

      [RunSimCampaignMeta]
      config-url: <%= ${simulationMetaConfigs.RunSimCampaignMeta.placeholder} %>

      [ReportsSimCampaignMeta]
      config-url: <%= ${simulationMetaConfigs.ReportsSimCampaignMeta.placeholder} %>

      [VideoSimCampaignMeta]
      config-url: <%= ${simulationMetaConfigs.VideoSimCampaignMeta.placeholder} %>
    `,
  },
  {
    NAME: 'simulation_config.tmpl',
    TYPE: 'file',
    CONTENT: `
      {
        "version": 1,
        "network": "$circuit_config",
        "node_set": "<%= ${SimulationPlaceholders.SIMULATED_TARGET} %>",
        "target_simulator": "CORENEURON",
        "run": {
          "dt": <%= ${SimulationPlaceholders.TIME_STEP} %>,
          "forward_skip": <%= ${SimulationPlaceholders.FORWARD_SKIP} %>,
          "random_seed": <%= ${SimulationPlaceholders.SEED} %>,
          "tstop": <%= ${SimulationPlaceholders.DURATION} %>
        },
        "conditions": {
          "extracellular_calcium": <%= ${SimulationPlaceholders.CALCIUM_CONCENTRATION} %>
        },
        "output": {
          "output_dir": "reporting",
          "spikes_file": "spikes.h5"
        },
        "reports": <%= ${SimulationPlaceholders.REPORTS} %>,
        "inputs": <%= ${SimulationPlaceholders.INPUTS} %>
      }
    `,
  },
  {
    NAME: 'cfg_name',
    TYPE: 'string',
    CONTENT: 'simulation.cfg',
  },
];

export const CIRCUIT_BUILDING_FILES: WorkflowFile[] = [
  {
    NAME: 'circuit_building.cfg',
    TYPE: 'file',
    CONTENT: `
      [DEFAULT]
      workers: 1
      kg-base: https://bbp.epfl.ch/nexus/v1
      kg-org: bbp
      kg-proj: mmb-point-neuron-framework-model

      [SBOWorkflow]
      config-url: <%= ${BuildingPlaceholders.CONFIG_URL} %>
      target: <%= ${BuildingPlaceholders.TARGET_CONFIG_NAME} %>
      host: bbpv1.epfl.ch
      account: proj134
      output-dir: /gpfs/bbp.cscs.ch/project/proj134/scratch/workflow-outputs/<%= ${BuildingPlaceholders.DATE} %>-<%= ${BuildingPlaceholders.UUID} %>
    `,
  },
  {
    NAME: 'cfg_name',
    TYPE: 'string',
    CONTENT: 'circuit_building.cfg',
  },
];

export const eModelMetaConfigs: WorkflowMetaConfigPlaceholders = {
  eModelMeta: {
    fileName: 'EModelMeta.cfg',
    templateFile: `
      [ExtractEFeatures]
      enable-internet=True
      modules=

      [Optimise]
      enable-internet=True
      modules=
      nodes=1
      time=30:00
      continue_unfinished_optimisation=True

      [Validation]
      enable-internet=True
      modules=

      [core]
      log_level=INFO

      [parallel]
      backend=ipyparallel

      [EmodelAPIConfig]
      api=nexus
      forge_path=/gpfs/bbp.cscs.ch/project/proj134/workflows/environments/venv-emodel-optimization/data/forge1.yml
      forge_ontology_path=/gpfs/bbp.cscs.ch/project/proj134/workflows/environments/venv-emodel-optimization/data/nsg1.yml

      nexus_project=mmb-point-neuron-framework-model
      nexus_organisation=bbp
      nexus_endpoint=https://bbp.epfl.ch/nexus/v1

      [LaunchEModelOptimisation]
      emodel=<%= ${EModelBuildingPlaceholders.E_MODEL_NAME} %>
      etype=<%= ${EModelBuildingPlaceholders.E_TYPE} %>
      species=mouse
      brain_region=<%= ${EModelBuildingPlaceholders.BRAIN_REGION} %>
      iteration_tag=<%= ${EModelBuildingPlaceholders.UUID} %>
      config_nexus=<%= ${EModelBuildingPlaceholders.OPTIMIZATION_CONFIG_ID} %>
    `,
    placeholder: 'GenSimCampaignMeta',
  },
};

export const EMODEL_BUILDING_FILES: WorkflowFile[] = [
  {
    NAME: 'emodel.cfg',
    TYPE: 'file',
    CONTENT: `
      [DEFAULT]
      modules=
      workers=1
      kg-base: https://bbp.epfl.ch/nexus/v1
      kg-org: bbp
      kg-proj=mmb-point-neuron-framework-model
      account=proj134
      enable-internet=True
      time=4:00:00
      virtual-env=/gpfs/bbp.cscs.ch/project/proj134/workflows/environments/venv-emodel-optimization/
      chdir=/gpfs/bbp.cscs.ch/project/proj134/scratch/workflow-outputs
      
      [LaunchEModelOptimisationMeta]
      config-url: <%= ${eModelMetaConfigs.eModelMeta.placeholder} %>
    `,
  },
  {
    NAME: 'cfg_name',
    TYPE: 'string',
    CONTENT: 'emodel.cfg',
  },
];
