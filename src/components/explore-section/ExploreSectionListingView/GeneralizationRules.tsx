import React from 'react';
import { Spin, Checkbox } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import find from 'lodash/find';
import { RuleOutput } from '@/types/explore-section/kg-inference';
import { rulesResponseAtom } from '@/state/explore-section/list-view-atoms';
import useNotification from '@/hooks/notifications';

const rulesLoadableAtom = loadable(rulesResponseAtom);

function GeneraliztionOptions({ rule }: { rule: RuleOutput | undefined }) {
  if (!rule) return null;

  const inferenceOptions = find(rule.inputParameters, { name: 'IgnoreModelsParameter' })?.payload
    ?.values;

  return (
    <div className="space-y-2 pl-6 pr-12">
      {inferenceOptions &&
        Object.keys(inferenceOptions).map((key: string) => (
          <li key={inferenceOptions[key]}>
            <Checkbox key={inferenceOptions[key]} className="w-full text-primary-8 font-semibold">
              {key}
            </Checkbox>
            <p className="font-thin pl-12">
              At elementum eu facilisis sed odio morbi quis commodo. Nascetur ridiculus mus mauris
              vitae ultricies leo integer. Tempus imperdiet nulla malesuada pellentesque.
            </p>
          </li>
        ))}
    </div>
  );
}

function GeneralizationRules() {
  const rules = useAtomValue(rulesLoadableAtom);
  const notify = useNotification();

  if (rules.state === 'hasError') {
    notify.error(rules.error as string);
    return null;
  }

  if (rules.state === 'loading') return <Spin indicator={<LoadingOutlined />} />;

  if (!rules?.data) return <Spin indicator={<LoadingOutlined />} />;

  const shapeBased = find(rules.data, { name: 'Shape-based morphology recommendation' });
  const locationBased = find(rules.data, { name: 'Location-based morphology recommendation' });

  return (
    <div className="flex flex-col space-y-4 bg-white pl-12 text-primary-8">
      <div className="flex space-x-4">
        <div className="flex-initial w-1/4 flex-col space-y-2">
          <h1 className="font-semibold text-lg">{shapeBased?.name}</h1>
          <GeneraliztionOptions rule={shapeBased} />
        </div>
        <div className="flex-initial w-1/4 flex-col space-y-2">
          <h1 className="font-semibold text-lg">{locationBased?.name}</h1>
          <GeneraliztionOptions rule={locationBased} />
        </div>

        <div className="flex flex-col space-y-2 place-self-center">
          <label htmlFor="number-of-results" className="font-semibold">
            <span className="font-thin">Number of infer results:</span>
            <input type="number" id="number-of-results" className="ml-6 border-gray-500 border" />
          </label>
          <button
            type="submit"
            className="self-end	px-2 py-2 bg-primary-8 text-white font-semibold w-1/2"
          >
            Infer
          </button>
        </div>
      </div>
    </div>
  );
}

export default GeneralizationRules;
