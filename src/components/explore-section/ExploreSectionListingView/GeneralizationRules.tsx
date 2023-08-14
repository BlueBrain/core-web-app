import { Spin, Checkbox } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import forEach from 'lodash/forEach';
import isObject from 'lodash/isObject';
import isBoolean from 'lodash/isBoolean';
import { resourceBasedRulesAtom } from '@/state/explore-section/list-view-atoms';
import { RELEVANT_RULES } from '@/constants/explore-section/kg-inference';
import {RuleWithOptionsProps,InferenceOptionsState} from '@/types/explore-section/kg-inference';

const extractFalseKeys = (obj: RuleWithOptionsProps, prefix = ''): string[] => {
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
  ruleId: string;
  resourceId: string;
  ruleWithOptions: InferenceOptionsState;
  onCheckboxChange: (inferenceRule: RuleWithOptionsProps) => void;
}

function GeneralizationOptions ({
  ruleId,
  resourceId,
  ruleWithOptions,
  onCheckboxChange,
}: GeneralizationOptionsProps) {

  if (!ruleWithOptions) return null;

  const handleCheckboxChange = (inferenceName: string) => {
    onCheckboxChange({
      [ruleId]: {
        ...ruleWithOptions,
        [inferenceName]: !ruleWithOptions[inferenceName]
      },
    })
  }

  return (
    <div className='flex-initial w-1/4 flex-col space-y-2'>
      <h1 className='font-semibold text-lg'>{RELEVANT_RULES[ruleId]}</h1>
      <div className='space-y-2 pl-6 pr-12'>
        {Object.keys(ruleWithOptions).map((inferenceName: string) => (
          <li key={`${resourceId}${inferenceName}`}>
            <Checkbox
              checked={ruleWithOptions[inferenceName]}
              onChange={() => handleCheckboxChange(inferenceName)}
              className='w-full text-primary-8 font-semibold'
            >
              {inferenceName}
            </Checkbox>
            <p className='font-thin pl-12'>
              At elementum eu facilisis sed odio morbi quis commodo. Nascetur ridiculus mus mauris
              vitae ultricies leo integer. Tempus imperdiet nulla malesuada pellentesque.
            </p>
          </li>
        ))}
      </div>
    </div>
  );
}


function GeneralizationRules ({ resourceId }: { resourceId: string }) {
  const [resourceBasedRules, setResourceBasedRules] = useAtom(resourceBasedRulesAtom);


  if (!resourceBasedRules)
    return <Spin indicator={<LoadingOutlined />} />;

  const handleCheckboxChange = (ruleWithOptionsAndIdKey: RuleWithOptionsProps) => {        
    setResourceBasedRules((prev: RuleWithOptionsProps) => ({...prev, ...ruleWithOptionsAndIdKey}));
  };

  const handleInferButtonClick = () => {
    const selectedIgnoreModels = extractFalseKeys(resourceBasedRules);

    const rulesArray: string[] = Object.keys(resourceBasedRules);

    // Construct the request using the updated checkbox state
    const request = {
      rules: rulesArray,
      inputFilter: {
        TargetResourceParameter: resourceId,
        IgnoreModelsParameter: selectedIgnoreModels,
      },
    };

    console.log(request);
  };

  return (
    <div className='flex flex-col space-y-4 bg-white pl-12 text-primary-8'>
      <div className='flex space-x-4'>
        {Object.keys(resourceBasedRules).map((ruleId: string) => (
            <GeneralizationOptions
              key={ruleId}
              ruleId={ruleId}
              resourceId={resourceId}
              ruleWithOptions={resourceBasedRules[ruleId]}
              onCheckboxChange={handleCheckboxChange}
            />
          ))}

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
