import template from 'lodash/template';
import { Session } from 'next-auth';

import {
  SimulationPlaceholders,
  AnalysisPlaceholders,
  WorkflowMetaConfigPlaceholders,
  customRangeDelimeter,
  CustomAnalysisPlaceholders,
} from '@/services/bbp-workflow/config';
import {
  ExpDesignerConfig,
  ExpDesignerParam,
  ExpDesignerGroupParameter,
  ExpDesignerRadioBtnParameter,
  ExpDesignerPositionParameter,
  ExpDesignerTargetDropdownGroupParameter,
  ExpDesignerRecordingParameter,
  ExpDesignerCustomAnalysisDropdown,
} from '@/types/experiment-designer';
import { createWorkflowConfigResource, createJsonFile, createResource } from '@/api/nexus';
import {
  calculateRangeOutput,
  replaceCustomBbpWorkflowPlaceholders,
} from '@/components/experiment-designer/utils';
import {
  DetailedCircuit,
  EntityCreation,
  SimulationCampaignUIConfig,
  SimulationCampaignUIConfigResource,
} from '@/types/nexus';
import { composeUrl, createDistribution } from '@/util/nexus';
import { nexus } from '@/config';
import { CustomAnalysisType } from '@/app/explore/(content)/simulation-campaigns/shared';

function getNotFoundMsg(variable: any, name?: string): string {
  const variableName = Object.keys({ variable })[0];
  return `${variableName} ${name || ''} not in experiment designer config`;
}

function createNonStringPlaceholder(value: string | boolean) {
  return `${customRangeDelimeter}$${value}`;
}

function getValueOrPlaceholder(
  section: ExpDesignerParam[],
  variableName: string,
  isString: boolean = false
): { result: string | number; coordDict: Record<string, any> } {
  /*
    This function will return an object where result is either a number
    or string if the value is single value or a placeholder like $duration
    in this case the coordDict than later the workflow will use to
    replace the values on the $duration variable. 
  */

  const parameter = section.find((param) => param.id === variableName);
  if (!parameter) {
    throw new Error(getNotFoundMsg(parameter, variableName));
  }

  let finalValue;
  const coords: Record<string, any> = {};

  switch (parameter.type) {
    case 'number':
      if (isString) throw new Error(`Parameter ${parameter.name} marked as string but is number`);

      finalValue = parameter.value;
      break;

    case 'range': {
      const { start, end, stepper } = parameter.value;
      const values: number[] = calculateRangeOutput(start, end, stepper);
      coords[`${variableName}`] = values; // eslint-disable-line no-param-reassign
      finalValue = createNonStringPlaceholder(variableName);
      break;
    }

    case 'targetDropdown':
      finalValue = isString ? `${parameter.value}` : parameter.value;
      break;

    case 'targetDropdownGroup': {
      const selectionList = parameter.value.map(
        (target: string) => `${customRangeDelimeter}${target}`
      );
      coords[`${variableName}`] = selectionList; // eslint-disable-line no-param-reassign
      finalValue = createNonStringPlaceholder(variableName);
      break;
    }

    case 'dropdown':
      finalValue = isString ? `${parameter.value}` : parameter.value;
      break;

    default:
      throw new Error(`${variableName} has unknown type [${parameter.type}]`);
  }

  return {
    result: finalValue,
    coordDict: coords,
  };
}

export async function createWorkflowMetaConfigs(
  workflowMetaConfigs: WorkflowMetaConfigPlaceholders,
  variablesToReplace: Record<string, any>,
  session: Session
) {
  /*
    This function will create new files based on replaced content and
    later associate it with the meta config respective.
  */
  const variablesToReplaceCopy: Record<string, any> = { ...variablesToReplace };
  const clonedCfgsPromises = Object.entries(workflowMetaConfigs).map(
    async ([, { fileName, templateFile, placeholder }]) => {
      let replacedContent = template(templateFile)(variablesToReplaceCopy);
      replacedContent = replaceCustomBbpWorkflowPlaceholders(replacedContent);
      const newResource = await createWorkflowConfigResource(fileName, replacedContent, session);
      const urlWithRev = composeUrl('resource', newResource['@id'], { rev: newResource._rev });
      variablesToReplaceCopy[placeholder] = urlWithRev.replaceAll('%', '%%');
    }
  );

  await Promise.all(clonedCfgsPromises);
  return variablesToReplaceCopy;
}

function getSectionTargetsById(section: ExpDesignerParam[], id: string) {
  const targetObj = section.find((param) => param.id === id);
  if (!targetObj) return [];

  return (targetObj as ExpDesignerTargetDropdownGroupParameter).value;
}

export function convertExpDesConfigToSimVariables(
  extraVariablesToReplace: Record<string, any>
): Record<string, any> {
  if (!extraVariablesToReplace.expDesignerConfig) {
    throw new Error(getNotFoundMsg(extraVariablesToReplace.expDesignerConfig));
  }
  let coords: Record<string, any[]> = {};

  const variablesToReplaceCopy: Record<string, any> = { ...extraVariablesToReplace };

  const expDesignerConfig = variablesToReplaceCopy.expDesignerConfig as ExpDesignerConfig;

  // --------------------------------------
  // --------------- Setup ----------------
  // --------------------------------------

  const { setup } = expDesignerConfig;
  const simulatedNeurons = setup.find((param) => param.id === 'simulatedNeurons');
  if (!simulatedNeurons) {
    throw new Error(getNotFoundMsg(simulatedNeurons));
  }

  // Create a custom target in case to select multiple targets
  const targetUsed: string[] = [];
  let simulatedTargets: string[];
  if (simulatedNeurons.type === 'targetDropdown') {
    simulatedTargets = [simulatedNeurons.value];
  } else if (simulatedNeurons.type === 'targetDropdownGroup') {
    simulatedTargets = [...simulatedNeurons.value];
  } else {
    throw new Error('SimulatedNeurons has unknown type');
  }
  targetUsed.push(...simulatedTargets);

  [
    ['simulatedNeurons', SimulationPlaceholders.SIMULATED_TARGET],
    ['timeStep', SimulationPlaceholders.TIME_STEP],
    ['forwardSkip', SimulationPlaceholders.FORWARD_SKIP],
    ['seed', SimulationPlaceholders.SEED],
    ['duration', SimulationPlaceholders.DURATION],
    ['calciumConcentration', SimulationPlaceholders.CALCIUM_CONCENTRATION],
  ].forEach(([param, placeholder]) => {
    const { result, coordDict } = getValueOrPlaceholder(setup, param);
    variablesToReplaceCopy[placeholder] = result;
    coords = { ...coords, ...coordDict };
  });

  // ------------------------------------------
  // --------------- Recording ----------------
  // ------------------------------------------

  const recordings = (expDesignerConfig.recording as ExpDesignerRecordingParameter[]).reduce(
    (acc: Record<string, any>, recordingItem) => {
      const recordItem: Record<string, any> = {};
      recordingItem.value.forEach((param) => {
        recordItem[param.id] = param.value;
      });
      acc[recordingItem.name] = recordItem;
      return acc;
    },
    {}
  );
  variablesToReplaceCopy[SimulationPlaceholders.REPORTS] = JSON.stringify(recordings);

  // ----------------------------------------
  // --------------- Stimuli ----------------
  // ----------------------------------------

  const areStringList = ['node_set', 'input_type', 'module'];
  const stimuli = (expDesignerConfig.stimuli as ExpDesignerGroupParameter[]).reduce(
    (acc: Record<string, any>, stimulusItem) => {
      const stimItem: Record<string, any> = {};
      stimulusItem.value.forEach((param) => {
        const isString = areStringList.includes(param.id);
        const { result, coordDict } = getValueOrPlaceholder(stimulusItem.value, param.id, isString);
        stimItem[param.id] = result;
        coords = { ...coords, ...coordDict };
      });
      acc[stimulusItem.name] = stimItem;
      return acc;
    },
    {}
  );

  if (!Object.keys(coords).length) {
    throw new Error('No range param was set. Please select at least one range.');
  }

  variablesToReplaceCopy[SimulationPlaceholders.INPUTS] = JSON.stringify(stimuli);

  variablesToReplaceCopy[SimulationPlaceholders.GEN_SIM_CAMPAIGN_COORDS] = JSON.stringify(coords);

  // ----------------------------------------
  // --------------- Imaging ----------------
  // ----------------------------------------

  const { imaging } = expDesignerConfig;
  const neuronDisplay = imaging.find(
    (param) => param.id === 'neuronDisplay'
  ) as ExpDesignerRadioBtnParameter;
  variablesToReplaceCopy[SimulationPlaceholders.VIZ_DISPLAY_SOMA] =
    neuronDisplay.value === 'As point';
  variablesToReplaceCopy[SimulationPlaceholders.VIZ_DISPLAY_DENDRITES] =
    neuronDisplay.value === 'Dendrites';
  variablesToReplaceCopy[SimulationPlaceholders.VIZ_DISPLAY_AXON] =
    neuronDisplay.value === 'Axon + Dendrites';

  const cameraPosition = imaging.find(
    (param) => param.id === 'cameraPos'
  ) as ExpDesignerPositionParameter;
  variablesToReplaceCopy[SimulationPlaceholders.VIZ_CAMERA_POSITION] = JSON.stringify(
    cameraPosition.value
  );

  const cameraTarget = imaging.find(
    (param) => param.id === 'cameraTarget'
  ) as ExpDesignerPositionParameter;
  variablesToReplaceCopy[SimulationPlaceholders.VIZ_CAMERA_TARGET] = JSON.stringify(
    cameraTarget.value
  );

  const cameraUp = imaging.find((param) => param.id === 'cameraUp') as ExpDesignerPositionParameter;
  variablesToReplaceCopy[SimulationPlaceholders.VIZ_CAMERA_UP] = JSON.stringify(cameraUp.value);

  const cameraHeight = imaging.find(
    (param) => param.id === 'cameraHeight'
  ) as ExpDesignerPositionParameter;
  variablesToReplaceCopy[SimulationPlaceholders.VIZ_CAMERA_HEIGHT] = JSON.stringify(
    cameraHeight.value
  );

  const reportType = imaging.find(
    (param) => param.id === 'neuronActivity'
  ) as ExpDesignerRadioBtnParameter;
  const isSpikes = reportType.value === 'Spikes';
  variablesToReplaceCopy[SimulationPlaceholders.VIZ_REPORT_TYPE] = JSON.stringify(
    isSpikes ? 'spikes' : 'compartment'
  );

  const recordingKeys = Object.keys(recordings);
  if (!isSpikes && !recordingKeys.length) {
    throw new Error('No recording was added. Please add at least one for Voltage report');
  }

  variablesToReplaceCopy[SimulationPlaceholders.VIZ_REPORT_NAME] = JSON.stringify(
    recordingKeys?.length ? recordingKeys[0] : ''
  );

  // ----------------------------------------
  // --------------- Analysis ---------------
  // ----------------------------------------

  const { analysis } = expDesignerConfig;
  const rasterTargets = getSectionTargetsById(analysis, 'raster');
  const psthTargets = getSectionTargetsById(analysis, 'psth');
  const voltageTargets = getSectionTargetsById(analysis, 'voltage');

  variablesToReplaceCopy[AnalysisPlaceholders.RASTER_TARGETS] = JSON.stringify(rasterTargets);
  variablesToReplaceCopy[AnalysisPlaceholders.PSTH_TARGETS] = JSON.stringify(psthTargets);
  variablesToReplaceCopy[AnalysisPlaceholders.VOLTAGE_TARGETS] = JSON.stringify(voltageTargets);

  // ----------------------------------------
  // ------------ CustomAnalysis ------------
  // ----------------------------------------

  const customAnalysis = analysis.find((a) => a.id === 'customAnalysis') as
    | ExpDesignerCustomAnalysisDropdown
    | undefined;
  // TODO: support multiple custom analysis
  const customAnalysisDataStringified = customAnalysis?.value || '{}';
  const customAnalysisData = JSON.parse(customAnalysisDataStringified) as CustomAnalysisType;
  variablesToReplaceCopy[CustomAnalysisPlaceholders.ID] = customAnalysisData?.['@id'];
  variablesToReplaceCopy[CustomAnalysisPlaceholders.REPO_ID] =
    customAnalysisData?.codeRepository?.['@id'];
  variablesToReplaceCopy[CustomAnalysisPlaceholders.BRANCH] = customAnalysisData?.branch;
  variablesToReplaceCopy[CustomAnalysisPlaceholders.SUBDIRECTORY] =
    customAnalysisData?.subdirectory;

  return variablesToReplaceCopy;
}

export async function createSimulationCampaignUIConfig(
  name: string,
  description: string,
  detailedCircuit: DetailedCircuit,
  payload: ExpDesignerConfig,
  session: Session
) {
  const { email: userEmail, name: fullName, username } = session.user;
  if (!userEmail || !fullName) {
    throw new Error('User information not provided');
  }

  const configFile = await createJsonFile(payload, 'sim-campaign-ui-config.json', session);

  const uiConfig: EntityCreation<SimulationCampaignUIConfig> = {
    '@context': nexus.defaultContext,
    '@type': ['Entity', 'SimulationCampaignUIConfig'],
    name,
    description,
    used: {
      '@type': 'DetailedCircuit',
      '@id': detailedCircuit['@id'],
    },
    distribution: createDistribution(configFile),
    contribution: [
      {
        '@type': 'Contribution',
        agent: {
          '@id': '',
          '@type': 'Person',
          email: userEmail,
          name: fullName,
          preferred_username: username,
        },
      },
    ],
  };

  return createResource<SimulationCampaignUIConfigResource>(uiConfig, session);
}
