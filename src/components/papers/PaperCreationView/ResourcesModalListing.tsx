import { CloseOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Modal } from 'antd';

import { SourceDataActiveTab, SourceDataCategory } from './data';
import { DataType } from '@/constants/explore-section/list-views';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { Btn } from '@/components/Btn';
import { RenderButtonProps } from '@/components/explore-section/ExploreSectionListingView/useRowSelection';

type HeaderProps = {
  title?: string;
  onClose: () => void;
};

type ModalProps = {
  open: boolean;
  sourceDataCategory: SourceDataCategory | null;
  name: SourceDataActiveTab;
  onClose: () => void;
  onRowClick: (props: RenderButtonProps, category: SourceDataActiveTab) => void;
};

function Header({ title, onClose }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-col">
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

type BodyProps = {
  type: DataType;
  category: SourceDataActiveTab;
  onRowClick: (props: RenderButtonProps, category: SourceDataActiveTab) => void;
};

function Body({ type, category, onRowClick }: BodyProps) {
  return (
    <div className="h-full" id="explore-table-container-for-observable">
      <ExploreSectionListingView
        dataType={type as DataType}
        brainRegionSource="root"
        selectionType="checkbox"
        renderButton={(props) => (
          <Btn
            className="fit-content fixed bottom-4 right-4 ml-auto w-fit bg-primary-8"
            onClick={() => onRowClick(props, category)}
          >
            {props.selectedRows.length ? `(${props.selectedRows.length})` : ''} Use in paper
          </Btn>
        )}
      />
    </div>
  );
}

export default function ResourcesListingModal({
  open,
  sourceDataCategory,
  name,
  onClose,
  onRowClick,
}: ModalProps) {
  return (
    <ConfigProvider theme={{ hashed: false }}>
      <Modal
        key={crypto.randomUUID()}
        destroyOnClose
        open={open}
        mask={false}
        closable={false}
        footer={null}
        onCancel={onClose}
        className="top-0 h-full !w-full max-w-full pb-0 duration-0"
        wrapClassName="w-screen h-screen overflow-hidden"
        classNames={{
          content: 'w-full h-full !rounded-none !p-0 overflow-hidden',
          body: 'h-[calc(100vh-40px)] w-full',
        }}
        style={{ animationDuration: '0s' }}
      >
        <Header title={sourceDataCategory?.name} onClose={onClose} />
        <Body category={name} type={sourceDataCategory?.id as DataType} onRowClick={onRowClick} />
      </Modal>
    </ConfigProvider>
  );
}
