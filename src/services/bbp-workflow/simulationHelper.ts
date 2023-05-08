import template from 'lodash/template';
import range from 'lodash/range';
import { Session } from 'next-auth';

import { SimulationPlaceholders, workflowMetaConfigs } from '@/services/bbp-workflow/config';
import {
  ExpDesignerConfig,
  ExpDesignerParam,
  ExpDesignerGroupParameter,
  ExpDesignerNumberParameter,
  ExpDesignerTargetParameter,
} from '@/types/experiment-designer';
import { createWorkflowConfigResource } from '@/api/nexus';

function getNotFoundMsg(variable: any, name?: string): string {
  const variableName = Object.keys({ variable })[0];
  return `${variableName} ${name || ''} not in experiment designer config`;
}

export const customRangeDelimeter = '@@';

function getValueOrPlaceholder(
  section: ExpDesignerParam[],
  variableName: string
): { result: string; coordDict: Record<string, any> } {
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
      finalValue = parameter.value;
      break;

    case 'range': {
      const { start, end, step } = parameter.value;
      coords[`${variableName}`] = range(start, end, step); // eslint-disable-line no-param-reassign
      finalValue = `${customRangeDelimeter}$${variableName}`;
      break;
    }

    case 'targetDropdown':
      finalValue = `${customRangeDelimeter}${parameter.value}`;
      break;

    case 'targetDropdownGroup': {
      const selectionList = parameter.value.map(
        (target: string) => `${customRangeDelimeter}${target}`
      );
      coords[`${variableName}`] = selectionList; // eslint-disable-line no-param-reassign
      finalValue = `${customRangeDelimeter}$${variableName}`;
      break;
    }

    default:
      throw new Error(`${variableName} has unknown type`);
  }

  return {
    result: JSON.stringify(finalValue),
    coordDict: coords,
  };
}

export async function cloneWorkflowMetaConfigs(
  variablesToReplace: Record<string, any>,
  templateReplaceRegexp: RegExp,
  session: Session
) {
  /*
    This function will take the meta configs and clone them.
    Later will create new files based on template and
    associate them with the meta config respective.
  */
  const variablesToReplaceCopy: Record<string, any> = { ...variablesToReplace };
  const clonedCfgsPromises = Object.entries(workflowMetaConfigs).map(
    async ([, { templateResourceUrl, templateFile, placeholder }]) => {
      let replacedContent = template(templateFile)(variablesToReplaceCopy);
      replacedContent = replacedContent.replace(templateReplaceRegexp, '$1');
      const newResource = await createWorkflowConfigResource(
        templateResourceUrl,
        replacedContent,
        session
      );
      const urlWithRev = `${newResource._self}?rev=${newResource._rev}`;
      variablesToReplaceCopy[placeholder] = urlWithRev;
    }
  );

  await Promise.all(clonedCfgsPromises);
  return variablesToReplaceCopy;
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
  if (!Object.keys(coords).length) {
    throw new Error('No range param was set. Please select at least one range.');
  }

  const recordings = (expDesignerConfig.recording as ExpDesignerGroupParameter[]).reduce(
    (acc: Record<string, any>, recordingItem) => {
      const target = recordingItem.value.find(
        (param) => param.id === 'recordingTarget'
      ) as ExpDesignerTargetParameter;
      const duration = recordingItem.value.find(
        (param) => param.id === 'duration'
      ) as ExpDesignerNumberParameter;

      // TODO: add sections and dt
      acc[recordingItem.name] = {
        cells: target.value,
        variable_name: 'v',
        sections: 'soma',
        type: 'compartment',
        dt: 0.1,
        start_time: 0,
        end_time: duration.value,
      };
      return acc;
    },
    {}
  );
  variablesToReplaceCopy[SimulationPlaceholders.REPORTS] = JSON.stringify(recordings);

  const stimuli = (expDesignerConfig.stimuli as ExpDesignerGroupParameter[]).reduce(
    (acc: Record<string, any>, stimulusItem) => {
      const target = stimulusItem.value.find(
        (param) => param.id === 'targetInput'
      ) as ExpDesignerTargetParameter;
      const duration = stimulusItem.value.find(
        (param) => param.id === 'duration'
      ) as ExpDesignerNumberParameter;

      // TODO: add module and amp_start on UI
      acc[stimulusItem.name] = {
        module: 'linear',
        input_type: 'current_clamp',
        node_set: target.value,
        amp_start: -0.03515624999999999,
        delay: 0.0,
        duration: duration.value,
      };
      return acc;
    },
    {}
  );
  variablesToReplaceCopy[SimulationPlaceholders.INPUTS] = JSON.stringify(stimuli);

  variablesToReplaceCopy[SimulationPlaceholders.NODE_SETS] = JSON.stringify({});

  variablesToReplaceCopy[SimulationPlaceholders.GEN_SIM_CAMPAIGN_COORDS] = JSON.stringify(coords);

  return variablesToReplaceCopy;
}
