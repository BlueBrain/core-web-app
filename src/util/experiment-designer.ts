import {
  StimulusType,
  StimulusModule,
  ExpDesignerStimulusParameter,
  ExpDesignerStimulusValueParameterType,
  StimulusTypeDropdown,
  StimulusModuleDropdown,
  StimulusModuleDropdownOptionType,
} from '@/types/experiment-designer';
import {
  stimulusParamsToKeep,
  conditionalStimulusParams,
  stimulusModuleParams,
} from '@/constants/experiment-designer';

const getKeptParams = (stimulusParams: ExpDesignerStimulusValueParameterType[]) =>
  stimulusParams.filter((stimParam) => stimulusParamsToKeep.includes(stimParam.id));

const getDefaultConditionalParams = (stimulusParams: ExpDesignerStimulusValueParameterType[]) => {
  // get value of stimulus type
  const stimTypeParam = stimulusParams.find((param) => param.id === 'input_type');
  if (!stimTypeParam) throw new Error('Stimulation type not found in config');
  const stimTypeSelectedValue = (stimTypeParam as StimulusTypeDropdown).value as StimulusType;

  // get value of stimulus module
  const stimModuleParam = stimulusParams.find((param) => param.id === 'module');
  if (!stimModuleParam) throw new Error('Stimulation module not found in config');
  const stimModuleSelectedValue = (stimModuleParam as StimulusModuleDropdown)
    .value as StimulusModule;

  // get default conditions values based on selection
  const defaultConditionalParams =
    conditionalStimulusParams?.[stimTypeSelectedValue]?.[stimModuleSelectedValue];
  if (!defaultConditionalParams) throw new Error('Conditional params were not present');

  // if the param is in the current config, use that otherwise use default
  return defaultConditionalParams.map((defaultConditionalParam) => {
    const presentInConfigParam = stimulusParams.find(
      (param) => param.id === defaultConditionalParam.id
    );
    return presentInConfigParam || defaultConditionalParam;
  });
};

/*
  This function will get a list of stimulus and based on stimulus type and module it will
  add the conditional params needed for that selection
*/
export const processStimulationConditionalParams = (stimuli: ExpDesignerStimulusParameter[]) => {
  stimuli.forEach((stimulus) => {
    // safe assignment as we are cloning before
    /* eslint-disable-next-line */
    stimulus.value = [
      ...getKeptParams(stimulus.value),
      ...getDefaultConditionalParams(stimulus.value),
    ];
  });
  return stimuli;
};

const getModuleNamesByStimType = (stimTypeName: StimulusType): StimulusModule[] => {
  const supportedModules = conditionalStimulusParams?.[stimTypeName];
  if (!supportedModules) return [];
  return Object.keys(supportedModules) as StimulusModule[];
};

function findInStimulus<T>(stimulus: ExpDesignerStimulusParameter, subSectionName: string): T {
  const foundParam = stimulus.value.find((param) => param.id === subSectionName);
  if (!foundParam) throw new Error(`No stimulus ${subSectionName} selected`);
  return foundParam as T;
}

export const processStimuliAllowedModules = (stimuli: ExpDesignerStimulusParameter[]) =>
  stimuli.map((stimulus) => {
    // changes the stimulus  module dropdown options based on stimulus type selected
    const stimTypeParam = findInStimulus<StimulusTypeDropdown>(stimulus, 'input_type');
    const typeSelected = stimTypeParam.value as StimulusType;
    const allowedModuleNames = getModuleNamesByStimType(typeSelected);

    const stimModuleParam = findInStimulus<StimulusModuleDropdown>(stimulus, 'module');

    const moduleOptionsAreCorrect = stimModuleParam.options.every(
      (option: StimulusModuleDropdownOptionType) => allowedModuleNames.includes(option.value)
    );
    // do not overwrite the module dropdown
    if (moduleOptionsAreCorrect) return stimulus;

    const stimuliModuleList = stimulusModuleParams.options as StimulusModuleDropdownOptionType[];
    stimModuleParam.options = stimuliModuleList.filter((option) =>
      allowedModuleNames.includes(option.value)
    );
    stimModuleParam.value = stimModuleParam.options[0].value;
    return stimulus;
  });
