import { Suspense, useState } from 'react';
import { Button } from 'antd';
import { DeleteOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import SourceDataSummary from '../Models/Summary';
import SummaryModalContainer from '../SummaryModalContainer';
import { SourceDataActiveTab, SourceDataGroupTabsEnum, SourceDataItem } from '../data';
import { classNames } from '@/util/utils';
import { MEModelResource } from '@/types/me-model';
import { fetchResourceById } from '@/api/nexus';
import { useSessionAtomValue } from '@/hooks/hooks';

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
  viewingId: string | null;
  onDeleteSourceData: (value: SourceDataItem) => void;
  onSelectResource: () => void;
};

function Row({
  disabled,
  deleting,
  resource,
  viewingId,
  onDeleteSourceData,
  onSelectResource,
}: RowProps) {
  return (
    <div className="grid w-full grid-cols-[2fr_repeat(2,1fr)] gap-3 border-b border-gray-100 px-3 py-3 last:border-none hover:bg-gray-100">
      <div className="line-clamp-1 font-bold text-primary-8" title={resource.name}>
        {resource.name}
      </div>
      <div className="font-normal text-primary-8">{SourceDataGroupTabsEnum[resource.category]}</div>
      <div className="flex items-center justify-end gap-2">
        <Button
          key="view"
          title="View source"
          size="small"
          htmlType="button"
          type="link"
          icon={<EyeOutlined />}
          disabled={!!viewingId}
          loading={viewingId === resource.id}
          onClick={onSelectResource}
        />
        <Button
          key="delete"
          title="Delete source"
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
  const session = useSessionAtomValue();
  const [showRemainingSources, setShowRemainingSources] = useState(false);
  const [model, updateModel] = useState<MEModelResource | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const formattedSourceData = isArray(dataSource) ? dataSource : [dataSource];
  const firstChunk =
    formattedSourceData.length > 2 ? formattedSourceData.slice(0, 2) : formattedSourceData;
  const remainingChunk = formattedSourceData.length > 2 ? formattedSourceData.slice(2) : [];
  const showLoadMoreBtn = formattedSourceData.length > 2 && !showRemainingSources;
  const showCollapseBtn = formattedSourceData.length > 2 && showRemainingSources;

  const onLoadMore = () => setShowRemainingSources(true);
  const onCollapse = () => setShowRemainingSources(false);

  if (!firstChunk.length) {
    return <p className="py-0 text-gray-400">No data source has been selected</p>;
  }

  const onSelectResource = (id: string, category: SourceDataActiveTab) => async () => {
    if (!session) return;
    if (category !== 'models') return;
    try {
      setViewingId(id);
      const response = await fetchResourceById<MEModelResource>(id, session);
      updateModel(response);
    } catch (error) {
      throw new Error('An error occurred while fetching model data. Please try again.');
    } finally {
      setViewingId(null);
    }
  };

  const onClose = () => updateModel(null);

  return (
    <div className="flex w-full flex-col items-center justify-center py-5">
      <div className="grid w-full grid-cols-[2fr_repeat(2,1fr)] gap-3 border-b border-gray-100 p-3">
        <div className="text-gray-400">Name</div>
        <div className="text-gray-400">Type</div>
      </div>
      {firstChunk.map((resource) => (
        <Row
          key={resource.id}
          {...{
            resource,
            viewingId,
            onDeleteSourceData,
            disabled: deleting,
            deleting: sourceToDelete === resource.id && deleting,
            onSelectResource: onSelectResource(resource.id, resource.category),
          }}
        />
      ))}
      <div
        className={classNames(
          'w-full',
          showRemainingSources ? 'animate-fade-in' : 'animate-fade-out'
        )}
      >
        {showRemainingSources &&
          remainingChunk.map((resource) => (
            <Row
              key={resource.id}
              {...{
                resource,
                viewingId,
                onDeleteSourceData,
                disabled: deleting,
                deleting: sourceToDelete === resource.id && deleting,
                onSelectResource: onSelectResource(resource.id, resource.category),
              }}
            />
          ))}
      </div>
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
      {showCollapseBtn && (
        <div className="my-4 text-center">
          <button
            type="button"
            className="rounded-full border border-gray-300 bg-white"
            onClick={onCollapse}
          >
            <div className="px-14 py-2 text-sm font-bold text-primary-8">Close</div>
          </button>
        </div>
      )}

      <Suspense fallback={null}>
        <SummaryModalContainer open={!isEmpty(model)} onClose={onClose}>
          <SourceDataSummary model={model!} onClose={onClose} />
        </SummaryModalContainer>
      </Suspense>
    </div>
  );
}
