import { Children } from 'react';
import { Spin, Checkbox } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import {
  resourceBasedRulesAtom,
  inferredResourceIdsAtom,
} from '@/state/explore-section/generalization';
import { ResourceBasedInference } from '@/types/explore-section/kg-inference';

interface GeneralizationOptionsProps {
  resourceId: string;
  ruleWithBool: ResourceBasedInference;
  onCheckboxChange: (inferenceRule: ResourceBasedInference) => void;
}

function GeneralizationOptions({
  resourceId,
  ruleWithBool,
  onCheckboxChange,
}: GeneralizationOptionsProps) {
  if (!ruleWithBool) return <Spin className="h-6 w-6" indicator={<LoadingOutlined />} />;

  const handleCheckboxChange = () => {
    onCheckboxChange({
      ...ruleWithBool,
      value: !ruleWithBool.value,
    });
  };

  return (
    <div className="flex-initial w-1/4 flex-col space-y-2">
      <div className="space-y-2 pl-6 pr-12">
        <li key={`${resourceId}${ruleWithBool.name}`}>
          <Checkbox
            checked={ruleWithBool.value}
            onChange={handleCheckboxChange}
            className="w-full text-primary-8 font-semibold"
          >
            {ruleWithBool.name}
          </Checkbox>
          <p className="font-thin pl-12">
            At elementum eu facilisis sed odio morbi quis commodo. Nascetur ridiculus mus mauris
            vitae ultricies leo integer. Tempus imperdiet nulla malesuada pellentesque.
          </p>
        </li>
      </div>
    </div>
  );
}

function GeneralizationRules({
  resourceId,
  experimentTypeName,
}: {
  resourceId: string;
  experimentTypeName: string;
}) {
  const [resourceBasedRules, setResourceBasedRules] = useAtom(resourceBasedRulesAtom(resourceId));
  const [inferredResourceIds, setinferredResourceIds] = useAtom(
    inferredResourceIdsAtom(experimentTypeName)
  );

  if (!resourceBasedRules) return <Spin className="h-6 w-6" indicator={<LoadingOutlined />} />;

  const handleCheckboxChange = (ruleWithBool: ResourceBasedInference) => {
    const indexToUpdate = resourceBasedRules.findIndex(
      (item: ResourceBasedInference) => item.name === ruleWithBool.name
    );

    if (indexToUpdate !== -1) {
      const newResourceBasedRulesArray = [...resourceBasedRules];

      newResourceBasedRulesArray[indexToUpdate] = ruleWithBool;

      setResourceBasedRules(newResourceBasedRulesArray);
    }
  };

  const handleInferButtonClick = () => {
    setinferredResourceIds([...inferredResourceIds, ...[resourceId]]);
  };

  return (
    <div className="flex flex-col space-y-4 bg-white pl-12 text-primary-8">
      <h1 className="font-semibold text-lg">Inference options</h1>
      <div className="flex space-x-4">
        {Children.toArray(
          resourceBasedRules.map((rule: ResourceBasedInference) => (
            <GeneralizationOptions
              resourceId={resourceId}
              ruleWithBool={rule}
              onCheckboxChange={handleCheckboxChange}
            />
          ))
        )}

        <div className="flex flex-col space-y-2 place-self-center">
          <label htmlFor="number-of-results" className="font-semibold">
            <span className="font-thin">Number of infer results:</span>
            <input type="number" id="number-of-results" className="ml-6 border-gray-500 border" />
          </label>
          <button
            type="submit"
            className="self-end	px-2 py-2 bg-primary-8 text-white font-semibold w-1/2"
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
