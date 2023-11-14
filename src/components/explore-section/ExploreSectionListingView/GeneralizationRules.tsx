import { Children, useMemo } from 'react';
import { Spin, Checkbox, InputNumber } from 'antd';
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import { useAtom, useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import {
  rulesAtom,
  inferredResourcesAtom,
  limitQueryParameterAtom,
  selectedRulesAtom,
} from '@/state/explore-section/generalization';
import { ResourceBasedGeneralization } from '@/types/explore-section/kg-inference';
import { Project } from '@/types/explore-section/es-common';
import useNotification from '@/hooks/notifications';
import { parseOrgProjectToResourceInfo } from '@/util/explore-section/detail-view';

interface GeneralizationOptionsProps {
  resourceId: string;
  ruleWithChecked: ResourceBasedGeneralization;
  onCheckboxChange: (inferenceRule: ResourceBasedGeneralization) => void;
}

function GeneralizationOptions({
  resourceId,
  ruleWithChecked,
  onCheckboxChange,
}: GeneralizationOptionsProps) {
  if (!ruleWithChecked) return <Spin className="h-6 w-6" indicator={<LoadingOutlined />} />;

  const handleCheckboxChange = () => {
    onCheckboxChange({
      ...ruleWithChecked,
      checked: !ruleWithChecked.checked,
    });
  };

  return (
    <div className="flex-initial w-1/4 flex-col space-y-2">
      <div className="space-y-2 pl-6 pr-12">
        <li key={`${resourceId}${ruleWithChecked.name}`}>
          <Checkbox
            checked={ruleWithChecked.checked}
            onChange={handleCheckboxChange}
            className="w-full text-primary-8 font-semibold"
          >
            {ruleWithChecked.name}
          </Checkbox>
          <p className="font-thin pl-12">{ruleWithChecked.description}</p>
        </li>
      </div>
    </div>
  );
}

function GeneralizationRules({
  resourceId,
  resourceOrgProject,
  experimentTypeName,
  name,
}: {
  resourceId: string;
  resourceOrgProject: Project;
  experimentTypeName: string;
  name: string;
}) {
  const resourceInfo = parseOrgProjectToResourceInfo(resourceId, resourceOrgProject);

  const resourceBasedRules = useAtomValue(
    useMemo(() => unwrap(rulesAtom(resourceId)), [resourceId])
  );
  const [selectedRules, setSelectedRules] = useAtom(selectedRulesAtom(resourceId));
  const [inferredResources, setinferredResources] = useAtom(
    inferredResourcesAtom(experimentTypeName)
  );

  const [limitQueryParameter, setLimitQueryParameter] = useAtom(
    limitQueryParameterAtom(resourceId)
  );

  const { success } = useNotification();

  if (!resourceBasedRules)
    return (
      <Spin
        size="large"
        className="flex justify-center items-center"
        indicator={<LoadingOutlined />}
      />
    );

  const handleCheckboxChange = (ruleWithChecked: ResourceBasedGeneralization) => {
    const existingIndex = selectedRules.findIndex((ruleName) => ruleName === ruleWithChecked.name);

    if (existingIndex !== -1) {
      setSelectedRules([
        ...selectedRules.slice(0, existingIndex),
        ruleWithChecked.name,
        ...selectedRules.slice(existingIndex + 1),
      ]);
    }
  };

  const handleInferButtonClick = () => {
    // if not found, the resource is added
    if (!inferredResources.find((item) => item.id === resourceId)) {
      success('Resources were inferred. Change the tab to explore the inferred resources');
      setinferredResources([...inferredResources, ...[{ id: resourceId, name, resourceInfo }]]);
    }
  };

  if (resourceBasedRules.length === 0) {
    return (
      <div className="flex gap-3 text-warning">
        <WarningOutlined />
        <div>No inferred resource available</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-4 bg-white pl-12 text-primary-8">
      <h1 className="font-semibold text-lg">Inference options</h1>
      <div className="flex space-x-4">
        {Children.toArray(
          resourceBasedRules.map((rule) => (
            <GeneralizationOptions
              resourceId={resourceId}
              ruleWithChecked={rule}
              onCheckboxChange={handleCheckboxChange}
            />
          ))
        )}
        <div className="flex flex-col space-y-2 place-self-center">
          <InputNumber
            value={limitQueryParameter}
            onChange={(value) => setLimitQueryParameter(value as number)}
            className="px-3 py-2 border border-primary-8"
          />
          <button
            type="submit"
            className="self-end	px-3 py-2 bg-primary-8 text-white font-semibold"
            onClick={handleInferButtonClick}
          >
            Find new morphologies
          </button>
        </div>
      </div>
    </div>
  );
}

export default GeneralizationRules;
