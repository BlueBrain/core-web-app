export const PLACEHOLDERS = {
  USERNAME: '{USERNAME}',
  TASK_NAME: '{TASK_NAME}',
  SIMULATION_URL: '{SIMULATION_URL}',
  CIRCUIT_URL: '{CIRCUIT_URL}',
  CONFIG_URL: '{CONFIG_URL}',
  UUID: '{UUID}',
  VARIANT_TASK_ACTIVITY: '{VARIANT_TASK_ACTIVITY}',
};
export const BBP_WORKFLOW_URL = `https://bbp-workflow-api-${PLACEHOLDERS.USERNAME}.kcp.bbp.epfl.ch`;
export const BBP_WORKFLOW_AUTH_URL = `https://bbp-workflow-api-auth.kcp.bbp.epfl.ch/${PLACEHOLDERS.USERNAME}`;

export const WORKFLOW_CIRCUIT_BUILD_TASK_NAME = 'bbp_workflow.generation.SBOWorkflow/';
export const WORKFLOW_SIMULATION_TASK_NAME = 'bbp_workflow.sbo.viz.task.RunAllSimCampaignMeta/';
export const WORKFLOW_TEST_TASK_NAME = 'bbp_workflow.luigi.CompleteTask/';
export const WORKFLOW_VIDEO_GENERATION_TASK_NAME =
  'bbp_workflow.sbo.viz.task.VideoSimCampaignMeta/';

export const BBP_WORKFLOW_TASK_PATH = `${BBP_WORKFLOW_URL}/launch/${PLACEHOLDERS.TASK_NAME}`;

export const workflowMetaConfigs = {
  GenSimCampaignMeta: {
    templateUrl:
      'https://staging.nise.bbp.epfl.ch/nexus/v1/resources/bbp_test/studio_data3/_/4142eca7-6544-4078-bbc4-0eb5d3ca9b29?rev=4',
    placeholder: '{GenSimCampaignMeta}',
  },
  RunSimCampaignMeta: {
    templateUrl:
      'https://bbp.epfl.ch/nexus/v1/resources/bbp/mmb-point-neuron-framework-model/_/12a16092-231b-4566-9847-00a1cc4ee7c6?rev=3',
    placeholder: '{RunSimCampaignMeta}',
  },
  ReportSimCampaignMeta: {
    templateUrl:
      'https://bbp.epfl.ch/nexus/v1/resources/bbp/mmb-point-neuron-framework-model/_/030469ed-07fa-427c-8df1-66437fac6930?rev=1',
    placeholder: '{ReportSimCampaignMeta}',
  },
  VideoSimCampaignMeta: {
    templateUrl:
      'https://staging.nise.bbp.epfl.ch/nexus/v1/resources/bbp_test/studio_data3/_/e87eafbe-1e5c-46ac-9ac1-82eefc1ba02c?rev=2',
    placeholder: '{VideoSimCampaignMeta}',
  },
};

export type WorkflowFile = {
  NAME: string;
  TYPE: string;
  CONTENT: string;
};

export const SIMULATION_FILES: WorkflowFile[] = [
  {
    NAME: 'simulation.cfg',
    TYPE: 'file',
    CONTENT: `
      [DEFAULT]
      kg-proj: mmb-point-neuron-framework-model

      [FindDetailedCircuitMeta]
      config-url: ${PLACEHOLDERS.VARIANT_TASK_ACTIVITY}

      [GenSimCampaignMeta]
      config-url: ${workflowMetaConfigs.GenSimCampaignMeta.placeholder}

      [RunSimCampaignMeta]
      config-url: ${workflowMetaConfigs.RunSimCampaignMeta.placeholder}

      [ReportSimCampaignMeta]
      config-url: ${workflowMetaConfigs.ReportSimCampaignMeta.placeholder}

      [VideoSimCampaignMeta]
      config-url: ${workflowMetaConfigs.VideoSimCampaignMeta.placeholder}
    `,
  },
  {
    NAME: 'simulation_config.tmpl',
    TYPE: 'file',
    CONTENT: `
      {
        "version": 1,
        "manifest": {"\\$OUTPUT_DIR": "./reporting"},
        "network": "$circuit_config",
        "node_sets_file": "node_sets.json",
        "node_set": "Mosaic",
        "target_simulator": "CORENEURON",
        "run": {
          "dt": 0.025,
          "forward_skip": 5000,
          "random_seed": 0,
          "tstop": $duration
        },
        "output": {
          "output_dir": "\\$OUTPUT_DIR",
          "spikes_file": "out.h5",
          "spikes_sort_order": "by_time"
        },
        "reports": {
          "soma": {
            "cells": "Mosaic",
            "variable_name": "v",
            "sections": "soma",
            "type": "compartment",
            "dt": 0.1,
            "compartments": "center",
            "start_time": 0,
            "end_time": $duration
          }
        },
        "inputs": {
          "holding_current": {
            "module": "linear",
            "input_type": "current_clamp",
            "node_set": "Mosaic",
            "amp_start": -0.03515624999999999,
            "delay": 0.0,
            "duration": $duration
          },
          "threshold_current": {
            "module": "linear",
            "input_type": "current_clamp",
            "node_set": "Mosaic",
            "amp_start": 0.35312774458632922,
            "delay": 10.0,
            "duration": $duration
          }
        }
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
    CONTENT: `
      {
        "Mosaic": {
          "population": "root__neurons"
        },
        "Mosaic_0": {
          "population": "root__neurons",
          "node_id": [
            0
          ]
        },
        "selection": {
          "population": "root__neurons",
          "node_id": [
            0, 123, 456, 789, 1234, 5678
          ]
        }
      }
    `,
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
