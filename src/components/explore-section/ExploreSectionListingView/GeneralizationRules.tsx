import { useState, useEffect } from 'react';
import { Spin, Checkbox } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import find from 'lodash/find';
import forEach from 'lodash/forEach'
import isObject from 'lodash/isObject'
import isBoolean from 'lodash/isBoolean'
import { RuleOuput } from '@/types/explore-section/kg-inference';
import { rulesResponseAtom } from '@/state/explore-section/list-view-atoms';
import useNotification from '@/hooks/notifications';

type InferenceOptionsState = { [key: string]: boolean };
type CheckboxState = { [rule: string]: InferenceOptionsState };

const extractFalseKeys = (obj: CheckboxState, prefix = ''): string[] => {
  const falseKeys: string[] = [];

  const extract = (currentObj: InferenceOptionsState) => {
    forEach(currentObj, (value, key) => {
      if (isBoolean(value) && !value) {
        falseKeys.push(key);
      } else if (isObject(value) && value !== null) {
        extract(value);
      }
    });
  };

  forEach(obj, (ruleValue) => {
    if (isObject(ruleValue) && ruleValue !== null) {
      extract(ruleValue);
    }
  });

  return falseKeys.map((key) => `${prefix}${key}`);
};

interface GeneralizationOptionsProps {
  rule: RuleOuput;
  onCheckboxChange: (key: string, inferenceOptions: CheckboxState) => void;
}

function GeneralizationOptions({ rule, onCheckboxChange }: GeneralizationOptionsProps) {
  const [checkboxState, setCheckboxState] = useState<CheckboxState>({[rule.id]: {}});
  const inferenceOptions = find(rule?.inputParameters, { name: 'IgnoreModelsParameter' })?.payload
    ?.values;

  // Initialize checkboxState when rule changes (e.g., when data is loaded)
  useEffect(() => {
    if (inferenceOptions) {
      const initialState: CheckboxState = {[rule.id]: {}};
      Object.keys(inferenceOptions).forEach((key: string) => {
        initialState[rule.id][key] = false;
      });
      setCheckboxState(initialState);
      // console.log("USE EFFECT INITIALIZING CHECKBOX STATE", checkboxState, initialState)
    }
  }, [rule, inferenceOptions]);

  if (!rule || !inferenceOptions) return null;

  const handleCheckboxChange = (key: string) => {
    // Preserve the existing nested object for the specific rule.id
    const existingRuleOptions = checkboxState[rule.id] || {};
    
    // Toggle the value of the specific key while preserving other keys
    const newRuleOptions = {
      ...existingRuleOptions,
      [key]: !existingRuleOptions[key],
    };
    
    // Create a new checkbox state with the updated nested object
    const newCheckboxState = {
      ...checkboxState,
      [rule.id]: newRuleOptions,
    };
  
    // Update the state and call the callback
    setCheckboxState(newCheckboxState);
    onCheckboxChange(rule.id, newCheckboxState);
    console.log("HANDLE CHECKBOX CHANGE NEW CHECKBOX STATE", newCheckboxState);
  };
  

  // console.log("CHECKBOX STATE OUTSIDE THE USE EFFECT", checkboxState);

  return (
    <div className='space-y-2 pl-6 pr-12'>
      {Object.keys(inferenceOptions).map((key: string) => (
        <li key={inferenceOptions[key]}>
          <Checkbox
            checked={checkboxState[rule.id][key]}
            onChange={() => handleCheckboxChange(key)}
            className='w-full text-primary-8 font-semibold'
          >
            {key}
          </Checkbox>
          <p className='font-thin pl-12'>
            At elementum eu facilisis sed odio morbi quis commodo. Nascetur ridiculus mus mauris
            vitae ultricies leo integer. Tempus imperdiet nulla malesuada pellentesque.
          </p>
        </li>
      ))}
    </div>
  );
}


const rulesLoadableAtom = loadable(rulesResponseAtom);

function GeneralizationRules ({ resourceId }: {resourceId: string}) {
  const rules = useAtomValue(rulesLoadableAtom);
  const notify = useNotification();

  const [checkboxState, setCheckboxState] = useState<CheckboxState>({});

  if (rules.state === 'hasError') {
    notify.error(rules.error as string);
    return null;
  }

  if (rules.state === 'loading') return <Spin indicator={<LoadingOutlined />} />;

  if (!rules?.data) return <Spin indicator={<LoadingOutlined />} />;


  const handleCheckboxChange = (key: string, inferenceOptions: any) => {
    // Update the local checkbox state
    setCheckboxState((prevState) => ({
      ...prevState,
      [key]: inferenceOptions,
    }));
    // console.log("HANDLE CHECKBOX CHANGE", checkboxState, key, inferenceOptions);
  };

  const handleInferButtonClick = () => {
    
    const selectedIgnoreModels = extractFalseKeys(checkboxState);

    const rulesArray: string[] = Object.keys(checkboxState);
    
    console.log("selectedIgnoreModels", selectedIgnoreModels)
    
    // Construct the request using the updated checkbox state
    const request = {
      rules: rulesArray,
      inputFilter: {
        TargetResourceParameter: resourceId,
        IgnoreModelsParameter: selectedIgnoreModels,
      },
    };
  
    console.log('GENERALIZE OPTIONS, request, rules', request, rulesArray);
  };


  const shapeBased = find(rules.data, { name: 'Shape-based morphology recommendation' });
  const locationBased = find(rules.data, { name: 'Location-based morphology recommendation' });

  return (
    <div className='flex flex-col space-y-4 bg-white pl-12 text-primary-8'>
      <div className='flex space-x-4'>
        <div className='flex-initial w-1/4 flex-col space-y-2'>
          <h1 className='font-semibold text-lg'>{shapeBased?.name}</h1>
          {shapeBased && <GeneralizationOptions rule={shapeBased} onCheckboxChange={handleCheckboxChange}/>}
        </div>
        <div className='flex-initial w-1/4 flex-col space-y-2'>
          <h1 className='font-semibold text-lg'>{locationBased?.name}</h1>
          {locationBased && <GeneralizationOptions rule={locationBased} onCheckboxChange={handleCheckboxChange}/> }
        </div>

        <div className='flex flex-col space-y-2 place-self-center'>
          <label htmlFor='number-of-results' className='font-semibold'>
            <span className='font-thin'>Number of infer results:</span>
            <input type='number' id='number-of-results' className='ml-6 border-gray-500 border' />
          </label>
          <button
            type='submit'
            className='self-end	px-2 py-2 bg-primary-8 text-white font-semibold w-1/2'
            onClick={handleInferButtonClick}
          >
            Infer
          </button>
        </div>
      </div>
    </div>
  );
}

export default GeneralizationRules;
