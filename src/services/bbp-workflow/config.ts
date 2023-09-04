export const PLACEHOLDERS = {
  USERNAME: '{USERNAME}',
  TASK_NAME: '{TASK_NAME}',
  SIMULATION_URL: '{SIMULATION_URL}',
};
export const BBP_WORKFLOW_URL = `https://bbp-workflow-api-${PLACEHOLDERS.USERNAME}.kcp.bbp.epfl.ch`;
export const BBP_WORKFLOW_AUTH_URL = `https://bbp-workflow-api-auth.kcp.bbp.epfl.ch/${PLACEHOLDERS.USERNAME}`;

export const WORKFLOW_CIRCUIT_BUILD_TASK_NAME = 'bbp_workflow.generation.SBOWorkflow/';
export const WORKFLOW_SIMULATION_TASK_NAME = 'bbp_workflow.sbo.viz.task.RunAllSimCampaignMeta/';
export const WORKFLOW_TEST_TASK_NAME = 'bbp_workflow.luigi.CompleteTask/';

export const BBP_WORKFLOW_TASK_PATH = `${BBP_WORKFLOW_URL}/launch/${PLACEHOLDERS.TASK_NAME}`;

export const customRangeDelimeter = '@@';

export enum BuildingPlaceholders {
  CONFIG_URL = 'CONFIG_URL',
  UUID = 'UUID',
  DATE = 'DATE',
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

type WorkflowMetaConfigPlaceholders = Record<
  string,
  {
    fileName: string;
    templateFile: string;
    placeholder: string;
  }
>;

export const workflowMetaConfigs: WorkflowMetaConfigPlaceholders = {
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
      camera_target: <%= ${SimulationPlaceholders.VIZ_CAMERA_TARGET} %>
      camera_up: <%= ${SimulationPlaceholders.VIZ_CAMERA_UP} %>
      fps: 10
      slowing-factor: 10
      start_frame: 0
      end_frame: -1
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
      config-url: <%= ${workflowMetaConfigs.GenSimCampaignMeta.placeholder} %>

      [RunSimCampaignMeta]
      config-url: <%= ${workflowMetaConfigs.RunSimCampaignMeta.placeholder} %>

      [ReportsSimCampaignMeta]
      config-url: <%= ${workflowMetaConfigs.ReportsSimCampaignMeta.placeholder} %>

      [VideoSimCampaignMeta]
      config-url: <%= ${workflowMetaConfigs.VideoSimCampaignMeta.placeholder} %>
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
      host: bbpv1.epfl.ch
      account: proj134
      output-dir: /gpfs/bbp.cscs.ch/project/proj134/workflow-outputs/<%= ${BuildingPlaceholders.DATE} %>-<%= ${BuildingPlaceholders.UUID} %>
    `,
  },
  {
    NAME: 'cfg_name',
    TYPE: 'string',
    CONTENT: 'circuit_building.cfg',
  },
];
