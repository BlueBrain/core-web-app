export const PLACEHOLDERS = {
  USERNAME: '{USERNAME}',
  TASK_NAME: '{TASK_NAME}',
  SIMULATION_URL: '{SIMULATION_URL}',
  CONFIG_URL: '{CONFIG_URL}',
  UUID: '{UUID}',
};
export const BBP_WORKFLOW_URL = `https://bbp-workflow-api-${PLACEHOLDERS.USERNAME}.kcp.bbp.epfl.ch`;
export const BBP_WORKFLOW_AUTH_URL = `https://bbp-workflow-api-auth.kcp.bbp.epfl.ch/${PLACEHOLDERS.USERNAME}`;

export const WORKFLOW_CIRCUIT_BUILD_TASK_NAME = 'bbp_workflow.generation.SBOWorkflow/';
export const WORKFLOW_SIMULATION_TASK_NAME = 'bbp_workflow.sbo.viz.task.RunAllSimCampaignMeta/';
export const WORKFLOW_TEST_TASK_NAME = 'bbp_workflow.luigi.CompleteTask/';
export const WORKFLOW_VIDEO_GENERATION_TASK_NAME =
  'bbp_workflow.sbo.viz.task.VideoSimCampaignMeta/';

export const BBP_WORKFLOW_TASK_PATH = `${BBP_WORKFLOW_URL}/launch/${PLACEHOLDERS.TASK_NAME}`;

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
}

type WorkflowMetaConfigPlaceholders = Record<
  string,
  {
    templateResourceUrl: string;
    templateFile: string;
    placeholder: string;
  }
>;

export const workflowMetaConfigs: WorkflowMetaConfigPlaceholders = {
  GenSimCampaignMeta: {
    templateResourceUrl:
      'https://staging.nise.bbp.epfl.ch/nexus/v1/resources/bbp_test/studio_data3/_/4142eca7-6544-4078-bbc4-0eb5d3ca9b29?rev=4',
    templateFile: `
      [DEFAULT]
      account: proj134

      [GenSimCampaign]
      name: <%= ${SimulationPlaceholders.SIM_CAMPAIGN_NAME} %>
      description: <%= ${SimulationPlaceholders.SIM_CAMPAIGN_DESCRIPTION} %>

      attrs: {"path_prefix": "/gpfs/bbp.cscs.ch/project/%(account)s/scratch/sims",
              "blue_config_template": "simulation_config.tmpl",
              "user_target": "node_sets.json"}

      seed-as-coord: {"low": 100000, "high": 400000, "size": 1}

      coords: <%= ${SimulationPlaceholders.GEN_SIM_CAMPAIGN_COORDS} %>
    `,
    placeholder: 'GenSimCampaignMeta',
  },
  RunSimCampaignMeta: {
    templateResourceUrl:
      'https://bbp.epfl.ch/nexus/v1/resources/bbp/mmb-point-neuron-framework-model/_/12a16092-231b-4566-9847-00a1cc4ee7c6?rev=3',
    templateFile: `
      [DEFAULT]
      account: proj134

      [RunSimCampaign]
      simulation-type: CortexNrdmsPySim
      nodes: 50
    `,
    placeholder: 'RunSimCampaignMeta',
  },
  ReportSimCampaignMeta: {
    templateResourceUrl:
      'https://bbp.epfl.ch/nexus/v1/resources/bbp/mmb-point-neuron-framework-model/_/030469ed-07fa-427c-8df1-66437fac6930?rev=1',
    templateFile: `
      [DEFAULT]
      account: proj134
      
      [ReportSimCampaign]
      exclusive: True
      mem: 0
    `,
    placeholder: 'ReportSimCampaignMeta',
  },
  VideoSimCampaignMeta: {
    templateResourceUrl:
      'https://staging.nise.bbp.epfl.ch/nexus/v1/resources/bbp_test/studio_data3/_/e87eafbe-1e5c-46ac-9ac1-82eefc1ba02c?rev=2',
    templateFile: `
      [DEFAULT]
      account: proj134

      [VideoSimCampaign]
      nodes: 20
      populations: [{
          "name": "root__neurons",
          "report_type": "compartment",
          "report_name": "soma",
          "density": 0.01,
          "radius_multiplier": 10,
          "load_soma": true,
          "load_dendrites": false,
          "load_axon": false }]
      resolution: [1920, 1080]
      camera-type: perspective
      camera-view: front
      background-color: [1, 1, 1, 0]
      fps: 25
      slowing-factor: 100
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

      [FindDetailedCircuitMeta]
      config-url: <%= ${SimulationPlaceholders.VARIANT_TASK_ACTIVITY} %>

      [GenSimCampaignMeta]
      config-url: <%= ${workflowMetaConfigs.GenSimCampaignMeta.placeholder} %>

      [RunSimCampaignMeta]
      config-url: <%= ${workflowMetaConfigs.RunSimCampaignMeta.placeholder} %>

      [ReportSimCampaignMeta]
      config-url: <%= ${workflowMetaConfigs.ReportSimCampaignMeta.placeholder} %>

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
  {
    NAME: 'node_sets.json',
    TYPE: 'file',
    CONTENT: `<%= ${SimulationPlaceholders.NODE_SETS} %>`,
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
      config-url: ${PLACEHOLDERS.CONFIG_URL}
      host: bbpv1.epfl.ch
      account: proj134
      output-dir: /gpfs/bbp.cscs.ch/project/proj134/workflow-outputs/${PLACEHOLDERS.UUID}
    `,
  },
  {
    NAME: 'cfg_name',
    TYPE: 'string',
    CONTENT: 'circuit_building.cfg',
  },
];

export const VIDEO_GENERATION_FILES: WorkflowFile[] = [
  {
    NAME: 'video_generation.cfg',
    TYPE: 'file',
    CONTENT: `
      [DEFAULT]
      kg-base: https://staging.nise.bbp.epfl.ch/nexus/v1
      kg-org: bbp_test
      kg-proj: studio_data3
      account: proj134

      [LookupSimulationCampaign]
      url: ${PLACEHOLDERS.SIMULATION_URL}

      [VideoTask]
      cpus-per-task: 72
      mem: 0
      exclusive: True
      time: 8:00:00
      nodes: 3
      module-archive: unstable
      modules: brayns py-brayns ffmpeg

      populations: [
              {
                  "name": "S1nonbarrel_neurons",
                  "report_type": "compartment",
                  "report_name": "soma_report",
                  "density": 0.01,
                  "radius_multiplier": 10,
                  "load_soma": true,
                  "load_dendrites": false,
                  "load_axon": false
              }
          ]
      resolution: [1920, 1080]
      camera-type: perspective
      camera-view: front
      background-color: [1, 1, 1, 0]
      fps: 1
      slowing-factor: 100
      start_frame: 0
      end_frame: -1
    `,
  },
  {
    NAME: 'cfg_name',
    TYPE: 'string',
    CONTENT: 'video_generation.cfg',
  },
];
