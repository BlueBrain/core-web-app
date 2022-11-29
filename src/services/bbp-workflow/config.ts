export const PLACEHOLDERS = {
  USERNAME: '{USERNAME}',
  TASK_NAME: '{TASK_NAME}',
};
export const BBP_WORKFLOW_URL = `https://bbp-workflow-api-${PLACEHOLDERS.USERNAME}.kcp.bbp.epfl.ch`;
export const BBP_WORKFLOW_AUTH_URL = `https://bbp-workflow-api-auth.kcp.bbp.epfl.ch/${PLACEHOLDERS.USERNAME}`;

export const WORKFLOW_CIRCUIT_BUILD_TASK_NAME = 'bbp_workflow.cwl_workflow.CWLWorkflow/';
export const WORKFLOW_SIMULATION_TASK_NAME = 'bbp_workflow.report.GenerateRunReportSimCampaign/';
export const WORKFLOW_TEST_TASK_NAME = 'bbp_workflow.luigi.CompleteTask/';

export const BBP_WORKFLOW_TASK_PATH = `${BBP_WORKFLOW_URL}/launch/${PLACEHOLDERS.TASK_NAME}`;
export const BBP_WORKFLOW_PING_TASK = `${BBP_WORKFLOW_URL}/launch/a/`;

export type WorkflowFilesType = {
  NAME: string;
  TYPE: string;
  CONTENT: string;
}[];

export const SIMULATION_FILES: WorkflowFilesType = [
  {
    NAME: 'simulation.cfg',
    TYPE: 'file',
    CONTENT: `
      [DEFAULT]
      kg-base: https://staging.nise.bbp.epfl.ch/nexus/v1
      kg-org: bbp_test
      kg-proj: studio_data3

      account: proj30

      module-archive: unstable

      [GenerateSimulationCampaign]
      name: SBO - Sonata Simulation
      circuit-url: https://staging.nise.bbp.epfl.ch/nexus/v1/resources/bbp_test/studio_data3/_/273977ed-c10b-4e31-8761-0d18bc995849
      seed-as-coord: {"low": 100000, "high": 400000, "size": 1}
      attrs: {"path_prefix": "/gpfs/bbp.cscs.ch/home/\${USER}/sims", "blue_config_template": "simulation_config.tmpl", "user_target": "node_sets.json", "duration": 100ms}
      [SimulationCampaign]
      simulation-type: CortexNrdmsPySim
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
        "node_set": "test_small",
        "run": {
          "dt": 0.025,
          "forward_skip": 5000,
          "random_seed": 0,
          "tstop": $duration
        },
        "output": {
          "output_dir": "\\$OUTPUT_DIR",
          "spikes_file": "spikes.h5"
        },
        "reports": {
          "soma_report": {
            "cells": "test_small",
            "variable_name": "v",
            "sections": "soma",
            "type": "compartment",
            "dt": 0.1,
            "start_time": 0,
            "end_time": $duration
          }
        },
        "inputs": {
          "HoldRt": {
            "module": "noise",
            "mean_percent": 0,
            "variance": 0.001,
            "delay": 0,
            "duration": $duration,
            "input_type": "current_clamp",
            "node_set": "test_small"
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
        "test_small": {
          "node_id": [
            7,
            10,
            11,
            23,
            31,
            38,
            41,
            42,
            56,
            62,
            71,
            73,
            81,
            91,
            110],
          "population": "S1nonbarrel_neurons"
        }
      }
    `,
  },
];

export const CIRCUIT_BUILDING_FILES: WorkflowFilesType = [
  {
    NAME: 'circuit_building.cfg',
    TYPE: 'file',
    CONTENT: `
      [DEFAULT]
      workers: 1

      [CWLWorkflow]
      recipe-file: /gpfs/bbp.cscs.ch/project/proj134/demos/20221117/recipe-v2-whole-brain.yml
      host: bbpv1.epfl.ch
      kg-base: https://bbp.epfl.ch/nexus/v1
      kg-org: bbp
      kg-proj: mmb-point-neuron-framework-model
      account: proj134
      output-dir: /gpfs/bbp.cscs.ch/project/proj134/demos/20221117/out/TXDQLF
    `,
  },
  {
    NAME: 'cfg_name',
    TYPE: 'string',
    CONTENT: 'circuit_building.cfg',
  },
];
