import { Button } from 'antd';
import { useReducer, useState } from 'react';
import { CloseOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import reject from 'lodash/reject';
import uniqBy from 'lodash/uniqBy';

import ResourcesListingModal from '../ResourcesModalListing';
import {
  SOURCE_DATA_GROUP_LIST,
  SOURCE_GROUP_TAB,
  SourceDataActiveTab,
  SourceDataCategory,
  SourceDataItem,
} from '../data';
import SourceDataListing from './Listing';
import { RenderButtonProps } from '@/components/explore-section/ExploreSectionListingView/useRowSelection';
import MenuTabs from '@/components/MenuTabs';
import { classNames } from '@/util/utils';

type SourceDataItemButtonProps = SourceDataCategory & {
  onClick: (source: SourceDataCategory) => () => void;
};

function SourceDataItemButton({ id, name, onClick, active = true }: SourceDataItemButtonProps) {
  return (
    <button
      id={id}
      type="button"
      className={classNames(
        'flex min-w-max items-center justify-between gap-3 rounded-md border border-gray-300 px-3 py-4',
        active ? 'font-bold text-primary-8' : 'text-gray-400',
        'hover:bg-gray-100'
      )}
      onClick={onClick({ id, name, active })}
      disabled={!active}
    >
      <span>{name}</span>
      <SearchOutlined />
    </button>
  );
}

export default function SourceDataPicker({
  sourcesData,
  updateSourcesData,
}: {
  sourcesData: Array<SourceDataItem>;
  updateSourcesData: React.Dispatch<React.SetStateAction<SourceDataItem[]>>;
}) {
  const [showSourceDataList, toggleShowSourceDataList] = useReducer((val) => !val, false);
  const [activeSourceGroupTab, setSourceGroupTab] = useState<SourceDataActiveTab>('models');
  const [openListingModal, setOpenListingModal] = useState(false);
  const [sourcesDataCategory, setSourceDataCategory] = useState<SourceDataCategory | null>(null);

  const sourceDataGroup = SOURCE_DATA_GROUP_LIST.find(({ id }) => id === activeSourceGroupTab);

  const onTabClick = (value: SourceDataActiveTab) => setSourceGroupTab(value);

  const onSourceDataItemClick = (value: SourceDataCategory) => () => {
    setSourceDataCategory(value);
    setOpenListingModal(true);
  };

  const onListingModalClose = () => setOpenListingModal(false);

  const onRowClick = (props: RenderButtonProps, category: SourceDataActiveTab) => {
    const rows = props.selectedRows;
    updateSourcesData((prev) =>
      uniqBy(
        [
          ...prev,
          ...rows.map((value) => ({
            category,
            id: value._source['@id'],
            name: value._source.name,
            type: value._source['@type'],
          })),
        ],
        'id'
      )
    );
    onListingModalClose();
    toggleShowSourceDataList();
  };

  const onDeleteSourceData = (resource: SourceDataItem) => {
    updateSourcesData((prev) => reject(prev, { id: resource.id }));
  };

  return (
    <div className="text-primary-8">
      <div className={classNames('w-full', showSourceDataList && 'animate-fade-in')}>
        {Boolean(sourcesData.length) && (
          <SourceDataListing
            {...{
              onDeleteSourceData,
              dataSource: sourcesData,
            }}
          />
        )}
        {showSourceDataList ? (
          <div className="w-full">
            <div className="flex items-center justify-between gap-5">
              <MenuTabs
                items={SOURCE_GROUP_TAB}
                onTabClick={(category) => onTabClick(category as SourceDataActiveTab)}
                activeKey={activeSourceGroupTab}
                classNames={{
                  tabItemClassName: 'text-gray-400',
                  activeClassName: 'text-primary-8',
                }}
              />
              <Button
                icon={<CloseOutlined />}
                type="text"
                htmlType="button"
                onClick={toggleShowSourceDataList}
              />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2 py-0 pt-5">
              {sourceDataGroup?.list.map(({ active, id, name }) => (
                <SourceDataItemButton
                  key={id}
                  {...{
                    id,
                    name,
                    active,
                    onClick: onSourceDataItemClick,
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={classNames(
              'flex min-w-max items-center justify-between gap-14 rounded-md border border-gray-300 px-3 py-4 text-base text-gray-900 shadow-sm',
              'hover:bg-gray-100 focus:outline-none'
            )}
            onClick={toggleShowSourceDataList}
          >
            <span className="pr-16 font-bold text-primary-8">Add data</span>
            <PlusOutlined className="text-primary-8" />
          </button>
        )}
      </div>
      <ResourcesListingModal
        open={openListingModal}
        onClose={onListingModalClose}
        sourceDataCategory={sourcesDataCategory}
        name={activeSourceGroupTab}
        onRowClick={onRowClick}
      />
    </div>
  );
}
