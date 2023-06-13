import template from 'lodash/template';
import { Session } from 'next-auth';

import {
  SimulationPlaceholders,
  workflowMetaConfigs,
  customRangeDelimeter,
} from '@/services/bbp-workflow/config';
import {
  ExpDesignerConfig,
  ExpDesignerParam,
  ExpDesignerGroupParameter,
  ExpDesignerNumberParameter,
  ExpDesignerTargetParameter,
  ExpDesignerRadioBtnParameter,
  ExpDesignerPositionParameter,
  ExpDesignerDropdownParameter,
} from '@/types/experiment-designer';
import { createWorkflowConfigResource, createJsonFile, createResource } from '@/api/nexus';
import {
  calculateRangeOutput,
  replaceCustomBbpWorkflowPlaceholders,
} from '@/components/experiment-designer/utils';
import {
  DetailedCircuit,
  SimulationCampaignUIConfig,
  SimulationCampaignUIConfigResource,
} from '@/types/nexus';
import { createDistribution, createId } from '@/util/nexus';

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
      const urlWithRev = `${newResource._self}?rev=${newResource._rev}`;
      variablesToReplaceCopy[placeholder] = urlWithRev;
    }
  );

  await Promise.all(clonedCfgsPromises);
  return variablesToReplaceCopy;
}

function getParamById<T>(group: ExpDesignerGroupParameter, id: string) {
  const result = group.value.find((param) => param.id === id);
  return <T>result;
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

  const recordings = (expDesignerConfig.recording as ExpDesignerGroupParameter[]).reduce(
    (acc: Record<string, any>, recordingItem) => {
      const target = getParamById<ExpDesignerTargetParameter>(recordingItem, 'recordingTarget');
      const duration = getParamById<ExpDesignerNumberParameter>(recordingItem, 'duration');
      const dt = getParamById<ExpDesignerNumberParameter>(recordingItem, 'dt');
      const startTime = getParamById<ExpDesignerNumberParameter>(recordingItem, 'startTime');
      const variableType = getParamById<ExpDesignerDropdownParameter>(
        recordingItem,
        'variableType'
      );
      const sections = getParamById<ExpDesignerDropdownParameter>(recordingItem, 'sections');
      const reportType = getParamById<ExpDesignerDropdownParameter>(recordingItem, 'reportType');

      acc[recordingItem.name] = {
        cells: target.value,
        variable_name: variableType.value,
        sections: sections.value,
        type: reportType.value,
        dt: dt.value,
        start_time: startTime.value,
        end_time: duration.value,
      };
      return acc;
    },
    {}
  );
  variablesToReplaceCopy[SimulationPlaceholders.REPORTS] = JSON.stringify(recordings);

  // ----------------------------------------
  // --------------- Stimuli ----------------
  // ----------------------------------------

  const areStringList = ['targetInput', 'stimType', 'stimModule'];
  const stimuli = (expDesignerConfig.stimuli as ExpDesignerGroupParameter[]).reduce(
    (acc: Record<string, any>, stimulusItem) => {
      const stimItem: Record<string, any> = {};
      [
        ['node_set', 'targetInput'],
        ['duration', 'duration'],
        ['amp_start', 'ampStart'],
        ['delay', 'delay'],
        ['input_type', 'stimType'],
        ['module', 'stimModule'],
      ].forEach(([key, param]) => {
        const isString = areStringList.includes(param);
        const { result, coordDict } = getValueOrPlaceholder(stimulusItem.value, param, isString);
        stimItem[key] = result;
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

  const uiConfig: SimulationCampaignUIConfig = {
    '@id': createId('simulationcampaignuiconfig'),
    '@context': 'https://bbp.neuroshapes.org',
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
