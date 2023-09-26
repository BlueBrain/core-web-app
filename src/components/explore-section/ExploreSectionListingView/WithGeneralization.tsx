import { ReactNode, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { inferredResourcesAtom } from '@/state/explore-section/generalization';
import { dataAtom } from '@/state/explore-section/list-view-atoms';
import { ExploreESHit } from '@/types/explore-section/es';
import { InferredResource } from '@/types/explore-section/kg-inference';
import { classNames } from '@/util/utils';
import GeneralizationRules from '@/components/explore-section/ExploreSectionListingView/GeneralizationRules';

export default function WithGeneralization({
  children,
  experimentTypeName,
}: {
  children: (props: {
    data?: ExploreESHit[];
    expandable: {};
    resourceId: string;
    tabNavigation: ReactNode;
  }) => ReactNode;
  experimentTypeName: string;
}) {
  const inferredResources = useAtomValue(inferredResourcesAtom(experimentTypeName));

  const [activeTab, setActiveTab] = useState<string>(experimentTypeName);

  const expandedRowRender = (resource: ExploreESHit) => (
    <GeneralizationRules
      resourceId={resource._source['@id']}
      experimentTypeName={experimentTypeName}
      name={resource._source.name}
    />
  );

  const useTab = ({ id, name: label }: InferredResource) => ({
    key: id,
    label,
  });

  const tabs = [{ id: experimentTypeName, name: 'Original' }, ...inferredResources].map(useTab);

  return (
    <div className={classNames('w-full', activeTab === null ? 'hidden' : '')}>
      {children({
        data: useAtomValue(
          useMemo(
            () =>
              unwrap(
                dataAtom({
                  experimentTypeName,
                  resourceId: tabs.find(({ key }) => key === activeTab)?.key,
                })
              ),
            [activeTab, experimentTypeName, tabs]
          )
        ),
        expandable: {
          expandedRowRender,
        },
        resourceId: activeTab,
        tabNavigation: tabs.length > 1 && (
          <ul className="flex gap-2.5">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  className={classNames(
                    'rounded-full w-fit px-4 py-1',
                    activeTab === tab.key
                      ? 'bg-primary-7 text-white'
                      : 'hover:bg-blue-100 cursor-pointer'
                  )}
                  onClick={() => setActiveTab(tab.key)}
                  type="button"
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        ),
      })}
    </div>
  );
}
