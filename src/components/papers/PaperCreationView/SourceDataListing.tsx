import { useState } from 'react';
import { Button } from 'antd';
import { DeleteOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';

import { SourceDataItem } from './data';

type Props = {
  deleting?: boolean;
  sourceToDelete?: string | null;
  dataSource: Array<SourceDataItem>;
  onDeleteSourceData: (value: SourceDataItem) => void;
};

type RowProps = {
  disabled?: boolean;
  deleting?: boolean;
  resource: SourceDataItem;
  onDeleteSourceData: (value: SourceDataItem) => void;
};

function Row({ disabled, deleting, resource, onDeleteSourceData }: RowProps) {
  return (
    <div className="grid w-full grid-cols-3 gap-3 border-b border-gray-100 px-3 py-3 last:border-none hover:bg-gray-100">
      <div className="font-bold text-primary-8">{resource.name}</div>
      <div className="font-normal text-primary-8">{resource.category}</div>
      <div className="flex items-center justify-end gap-2">
        <Button key="view" size="small" htmlType="button" type="link" icon={<EyeOutlined />} />
        <Button
          key="delete"
          size="small"
          htmlType="button"
          type="link"
          disabled={deleting || disabled}
          icon={deleting ? <LoadingOutlined spin /> : <DeleteOutlined />}
          onClick={() => onDeleteSourceData(resource)}
        />
      </div>
    </div>
  );
}

export default function SourceDataListing({
  deleting,
  sourceToDelete,
  dataSource,
  onDeleteSourceData,
}: Props) {
  const [showRemainingSources, setShowRemainingSources] = useState(false);
  const formattedSourceData = isArray(dataSource) ? dataSource : [dataSource];
  const firstChunk =
    formattedSourceData.length > 2 ? formattedSourceData.slice(0, 2) : formattedSourceData;
  const remainingChunk = formattedSourceData.length > 2 ? formattedSourceData.slice(2) : [];
  const showLoadMoreBtn = formattedSourceData.length > 2 && !showRemainingSources;

  const onLoadMore = () => setShowRemainingSources(true);

  if (!firstChunk.length) {
    return <p className="py-0 text-gray-400">No data source has been selected</p>;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center py-5">
      <div className="grid w-full grid-cols-3 gap-3 border-b border-gray-100 p-3">
        <div className="text-gray-400">Name</div>
        <div className="text-gray-400">Type</div>
      </div>
      {firstChunk.map((resource) => (
        <Row
          key={resource.id}
          {...{
            resource,
            onDeleteSourceData,
            disabled: deleting,
            deleting: sourceToDelete === resource.id && deleting,
          }}
        />
      ))}
      {showRemainingSources &&
        remainingChunk.map((resource) => (
          <Row
            key={resource.id}
            {...{
              resource,
              onDeleteSourceData,
              disabled: deleting,
              deleting: sourceToDelete === resource.id && deleting,
            }}
          />
        ))}
      {showLoadMoreBtn && (
        <div className="my-4 text-center">
          <button
            type="button"
            className="rounded-full border border-gray-300 bg-white"
            onClick={onLoadMore}
          >
            <div className="px-4 py-2 text-sm font-bold text-primary-8">
              Load more{' '}
              <span className="ml-4 font-light text-gray-400">({remainingChunk.length})</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
