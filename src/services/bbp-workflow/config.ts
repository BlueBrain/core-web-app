export const PLACEHOLDERS = {
  USERNAME: '{USERNAME}',
  TASK_NAME: '{TASK_NAME}',
  SIMULATION_URL: '{SIMULATION_URL}',
  CIRCUIT_URL: '{CIRCUIT_URL}',
  CONFIG_URL: '{CONFIG_URL}',
  UUID: '{UUID}',
};
export const BBP_WORKFLOW_URL = `https://bbp-workflow-api-${PLACEHOLDERS.USERNAME}.kcp.bbp.epfl.ch`;
export const BBP_WORKFLOW_AUTH_URL = `https://bbp-workflow-api-auth.kcp.bbp.epfl.ch/${PLACEHOLDERS.USERNAME}`;

export const WORKFLOW_CIRCUIT_BUILD_TASK_NAME = 'bbp_workflow.generation.SBOWorkflow/';
export const WORKFLOW_SIMULATION_TASK_NAME = 'bbp_workflow.report.GenerateRunReportSimCampaign/';
export const WORKFLOW_TEST_TASK_NAME = 'bbp_workflow.luigi.CompleteTask/';
export const WORKFLOW_VIDEO_GENERATION_TASK_NAME = 'bbp_workflow.viz.VideoTask/';

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
      kg-proj: mmb-point-neuron-framework-model
      account: proj30

      [GenerateSimulationCampaign]
      name: SBO - Sonata Simulation
      circuit-url: ${PLACEHOLDERS.CIRCUIT_URL}
      seed-as-coord: {"low": 100000, "high": 400000, "size": 1}
      attrs: {"path_prefix": "/gpfs/bbp.cscs.ch/project/%(account)s/scratch/\${USER}/workflow-sims", "blue_config_template": "simulation_config.tmpl", "user_target": "node_sets.json", "duration": 100ms}
      
      [SimulationCampaign]
      nodes: 50
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

export const CIRCUIT_BUILDING_FILES: WorkflowFilesType = [
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

export const VIDEO_GENERATION_FILES: WorkflowFilesType = [
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
