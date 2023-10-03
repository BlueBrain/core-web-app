import { ReactNode, useMemo, useState } from 'react';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { unwrap, useAtomCallback } from 'jotai/utils';
import { inferredResourcesAtom, expandedRowKeysAtom } from '@/state/explore-section/generalization';
import { dataAtom } from '@/state/explore-section/list-view-atoms';
import { ExploreESHit } from '@/types/explore-section/es';
import { InferredResource } from '@/types/explore-section/kg-inference';
import { classNames } from '@/util/utils';
import GeneralizationRules from '@/components/explore-section/ExploreSectionListingView/GeneralizationRules';

export default function WithGeneralization ({
  children,
  experimentTypeName,
}: {
  children: (props: {
    data?: ExploreESHit[];
    expandable: (resourceId: string) => any;
    resourceId: string;
    tabNavigation: ReactNode;
  }) => ReactNode;
  experimentTypeName: string;
}) {
  const inferredResources = useAtomValue(inferredResourcesAtom(experimentTypeName));

  const [activeTab, setActiveTab] = useState<string>(experimentTypeName);

  const getExpandable = useAtomCallback((_get, set, resourceId) => {
    const expandedRowRender = (resource: ExploreESHit) => (
      <GeneralizationRules
        resourceId={resource._source['@id']}
        experimentTypeName={experimentTypeName}
        name={resource._source.name}
      />
    );
    const expandIcon = ({
      expanded,
      onExpand,
      record,
    }: {
      expanded: boolean;
      onExpand: (record: ExploreESHit, e: MouseEvent) => void;
      record: ExploreESHit;
    }) =>
      expanded ? (
        <MinusSquareOutlined onClick={e => onExpand(record, e)} className='text-primary-9 cursor-pointer' />
      ) : (
        <PlusSquareOutlined onClick={e => onExpand(record, e)} className='text-primary-9 cursor-pointer' />
      );

    return {
      expandedRowRender,
      expandIconPosition: 'right',
      expandIcon,
      onExpandedRowsChange: (expandedRows: string[]) => {
        set(expandedRowKeysAtom(resourceId), expandedRows);
      },
    };
  });

  const useTab = ({ id, name: label }: InferredResource) => ({
    key: id,
    label,
    type: label !== 'Original' ? 'resource' : 'source',
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
        expandable: (resourceId: string) => getExpandable(resourceId),
        resourceId: activeTab,
        tabNavigation: tabs.length > 1 && (
          <ul className='flex gap-2.5'>
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  className={classNames(
                    'rounded w-fit px-4 py-1',
                    activeTab === tab.key
                      ? 'bg-primary-7 text-white'
                      : 'hover:bg-blue-100 cursor-pointer border-solid border text-primary-8'
                  )}
                  onClick={() => setActiveTab(tab.key)}
                  type='button'
                >
                  {tab.type === 'resource' ? (
                    <div className='flex gap-1'>
                      <span className={activeTab === tab.key ? 'text-neutral-2' : 'text-neutral-4'}>
                        Inferred from
                      </span>
                      <span className='font-bold'>{tab.label}</span>
                    </div>
                  ) : (
                    tab.label
                  )}
                </button>
              </li>
            ))}
          </ul>
        ),
      })}
    </div>
  );
}