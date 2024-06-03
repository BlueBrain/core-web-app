import { Button, ConfigProvider, Modal } from 'antd';
import { useReducer, useState } from 'react';
import { CloseOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';

import MenuTabs from '@/components/MenuTabs';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { classNames } from '@/util/utils';

type SourceData = {
  id: string;
  name: string;
  active: boolean;
};

type SourceDataItemButtonProps = {
  id: string;
  name: string;
  active: boolean;
  onClick: (source: SourceData) => () => void;
};

enum SourceDataGroupTabsEnum {
  'Models' = 'models',
  'Simulations' = 'simulations',
  'Experimental data' = 'experimental-data',
}

type DataTypeActiveTab = `${SourceDataGroupTabsEnum}`;

const SOURCE_GROUP_TAB = Object.keys(SourceDataGroupTabsEnum).map((key) => ({
  id: SourceDataGroupTabsEnum[key as keyof typeof SourceDataGroupTabsEnum],
  label: key,
}));

const Models: Array<SourceData> = [
  { id: 'ion-channel-model', name: 'Ion channel model', active: false },
  { id: 'single-neuron-model', name: 'Single Neuron model', active: true },
  { id: 'paired-neuron-model', name: 'Paired Neuron model', active: false },
  { id: 'synaptome', name: 'Synaptome', active: false },
  { id: 'microcircuit', name: 'Microcircuit', active: false },
  { id: 'neuro-glia-vascular', name: 'Neuro-glia-vascular', active: false },
  { id: 'single-brain-region', name: 'Single brain region', active: false },
  { id: 'brain-system', name: 'Brain system', active: false },
  { id: 'whole-brain', name: 'Whole brain', active: false },
];

const SOURCE_DATA_GROUP_LIST: Array<{
  id: string;
  list: Array<SourceData>;
}> = [
    {
      id: SourceDataGroupTabsEnum['Experimental data'],
      list: Object.keys(EXPERIMENT_DATA_TYPES).map((key) => ({
        id: key,
        name: EXPERIMENT_DATA_TYPES[key].title,
        active: true,
      })),
    },
    {
      id: SourceDataGroupTabsEnum.Models,
      list: Models,
    },
    {
      id: SourceDataGroupTabsEnum.Simulations,
      list: Models,
    },
  ];

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

export default function SourceDataPicker() {
  const [showSourceDataList, toggleShowSourceDataList] = useReducer((val) => !val, false);
  const [activeSourceGroupTab, setSourceGroupTab] = useState('models');
  const [openListingModal, setOpenListingModal] = useState(false);
  const sourceDataGroup = SOURCE_DATA_GROUP_LIST.find(({ id }) => id === activeSourceGroupTab);
  const [sourceData, setSourceData] = useState<SourceData | null>(null);
  const onTabClick = (value: string) => setSourceGroupTab(value as DataTypeActiveTab);

  const onSourceDataItemClick = (value: SourceData) => () => {
    setSourceData(value);
    setOpenListingModal(true);
  };

  const onListingModalClose = () => setOpenListingModal(false);

  return (
    <div className="text-primary-8">
      <div className={classNames('w-full', showSourceDataList && 'animate-fade-in')}>
        {showSourceDataList ? (
          <div className="w-full">
            <div className="flex items-center justify-between gap-5">
              <MenuTabs
                items={SOURCE_GROUP_TAB}
                onTabClick={onTabClick}
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2 pt-5 py-0">
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
              'flex min-w-max items-center justify-between gap-14 rounded-md border border-gray-300 px-3 py-4 text-base text-gray-900 shadow-sm focus:outline-none',
              'hover:bg-gray-100'
            )}
            onClick={toggleShowSourceDataList}
          >
            <span className="pr-7 font-bold text-gray-400">Select from </span>
            <UnorderedListOutlined className="text-primary-8" />
          </button>
        )}
      </div>
      <ConfigProvider theme={{ hashed: false }}>
        <Modal
          destroyOnClose
          open={openListingModal}
          mask={false}
          closable={false}
          footer={null}
          onCancel={onListingModalClose}
          className="top-0 h-full max-h-full !w-full max-w-full pb-0 duration-0"
          wrapClassName="w-screen h-screen"
          classNames={{ content: 'w-full h-full !rounded-none !p-0' }}
          style={{ animationDuration: "0s" }}
        >
          <ModalListing title={sourceData?.name} onClose={onListingModalClose} />
        </Modal>
      </ConfigProvider>
    </div>
  );
}

type ModalListingProps = {
  title?: string;
  onClose: () => void;
};

function ModalListing({ title, onClose }: ModalListingProps) {
  return (
    <div className="relative flex flex-col">
      <div className="flex w-full items-center justify-between bg-primary-9 p-4 py-4 text-white">
        <h1 className="text-xl font-bold">{title}</h1>
        <Button
          htmlType="button"
          type="text"
          icon={<CloseOutlined className="text-white" />}
          onClick={onClose}
        />
      </div>
    </div>
  );
}
