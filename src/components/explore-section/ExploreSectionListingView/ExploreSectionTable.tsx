import { CSSProperties, MouseEvent, ReactNode, useRef, useState } from 'react';
import { ConfigProvider, Table, TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import { VerticalAlignMiddleOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import { ColumnGroupType, ColumnType, TableRef } from 'antd/es/table';

import LoadMoreButton from './LoadMoreButton';
import usePathname from '@/hooks/pathname';
import { detailUrlBuilder } from '@/util/common';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { ExploreDownloadButton } from '@/components/explore-section/ExploreSectionListingView/DownloadButton';
import WithRowSelection, {
  RenderButtonProps,
} from '@/components/explore-section/ExploreSectionListingView/WithRowSelection';
import type { ExploreESHit } from '@/types/explore-section/es';
import { classNames } from '@/util/utils';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { DataType } from '@/constants/explore-section/list-views';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import useResizeObserver from '@/hooks/useResizeObserver';
import useScrollComplete from '@/hooks/useScrollComplete';

import styles from '@/app/explore/explore.module.scss';

function CustomTH({
  children,
  style,
  onClick,
  handleResizing,
  ...props
}: {
  children: ReactNode;
  style: CSSProperties;
  onClick: () => void;
  handleResizing: () => void;
}) {
  const modifiedStyle: CSSProperties = {
    ...style,
    fontWeight: '500',
    color: '#434343',
    verticalAlign: 'baseline',
    boxSizing: 'border-box',
    backgroundColor: 'white',
  };

  return handleResizing ? (
    <th
      {...props} /* eslint-disable-line react/jsx-props-no-spreading */
      style={{ ...modifiedStyle, padding: '16px 16px 16px 0px' }}
      className="before:!content-none"
      data-testid="column-header"
    >
      <div className="flex w-full">
        <button
          className={classNames(
            'inline-flex w-full flex-col items-start',
            '[&>.ant-table-column-sorters]:inline-flex [&>.ant-table-column-sorters]:!items-start [&>.ant-table-column-sorters]:gap-2 [&>.ant-table-column-sorters]:flex-none'
          )}
          onClick={onClick}
          type="button"
        >
          {children}
        </button>
        <VerticalAlignMiddleOutlined className={styles.dragIcons} onMouseDown={handleResizing} />
      </div>
    </th>
  ) : (
    <th
      {...props} /* eslint-disable-line react/jsx-props-no-spreading */
      data-testid="column-header"
      style={modifiedStyle}
    >
      {children}
    </th>
  );
}

function CustomCell({ children, style, ...props }: { children: ReactNode; style: CSSProperties }) {
  const modifiedStyle = {
    ...style,
    padding: '14px 6pX',
  };

  return (
    <td {...props} /* eslint-disable-line react/jsx-props-no-spreading */ style={modifiedStyle}>
      {children}
    </td>
  );
}

export function BaseTable({
  columns,
  dataSource,
  hasError,
  loading,
  rowSelection,
  dataType,
  showLoadMore,
}: TableProps<ExploreESHit> & {
  hasError?: boolean;
  dataType: DataType;
  showLoadMore: (value?: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const setBackToListPath = useSetAtom(backToListPathAtom);
  const [containerDimension, setContainerDimension] = useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });
  const tableRef = useRef<TableRef>(null);

  useResizeObserver({
    element: document.getElementById('interactive-data-layout'),
    callback: (target) => setContainerDimension(target.getBoundingClientRect()),
  });

  useScrollComplete({
    element: tableRef.current?.nativeElement.querySelector('.ant-table-body'),
    callback: showLoadMore,
  });

  const onCellRouteHandler = (col: ColumnGroupType<ExploreESHit> | ColumnType<ExploreESHit>) => {
    return {
      onCell: (record: ExploreESHit) =>
        col.key !== Field.Preview
          ? {
              onClick: (e: MouseEvent<HTMLInputElement>) => {
                e.preventDefault();
                setBackToListPath(pathname);
                router.push(detailUrlBuilder(record, dataType));
              },
            }
          : {},
    };
  };

  if (hasError) return <div>Something went wrong</div>;
  if (!columns?.length) return null;
  return (
    <ConfigProvider theme={{ hashed: false }}>
      <Table
        ref={tableRef}
        sticky={{ offsetHeader: 50 }}
        aria-label="listing-view-table"
        className={classNames(
          styles.table,
          '[&_.ant-table-sticky-holder]:shadow-md [&_.ant-table-body]:!no-scrollbar'
        )}
        columns={
          columns &&
          columns.map((col) => ({
            ...col,
            ...onCellRouteHandler(col),
          }))
        }
        components={{
          header: {
            cell: CustomTH,
          },
          body: {
            cell: CustomCell,
          },
        }}
        dataSource={dataSource}
        loading={loading}
        pagination={false}
        rowClassName={styles.tableRow}
        rowKey={(row) => row._source._self}
        rowSelection={rowSelection}
        scroll={{
          x: 'fit-content',
          y: containerDimension.height - 310, // 310: header + load-more button height
        }}
      />
    </ConfigProvider>
  );
}

const defaultRenderButton = ({ selectedRows, clearSelectedRows }: RenderButtonProps) => (
  <ExploreDownloadButton
    selectedRows={selectedRows}
    clearSelectedRows={clearSelectedRows}
    data-testid="listing-view-download-button"
  >
    <span>{`Download ${selectedRows.length === 1 ? 'Resource' : 'Resources'} (${
      selectedRows.length
    })`}</span>
  </ExploreDownloadButton>
);

export default function ExploreSectionTable({
  columns,
  dataSource,
  enableDownload,
  dataType,
  brainRegionSource,
  hasError,
  loading,
  renderButton,
}: TableProps<ExploreESHit> & {
  enableDownload?: boolean;
  dataType: DataType;
  hasError?: boolean;
  renderButton?: (props: RenderButtonProps) => ReactNode;
  brainRegionSource: ExploreDataBrainRegionSource;
}) {
  const [displayLoadMoreBtn, setDisplayLoadMoreBtn] = useState(false);
  const toggleDisplayMore = (value?: boolean) => setDisplayLoadMoreBtn((state) => value ?? !state);
  return (
    <>
      {enableDownload ? (
        <WithRowSelection renderButton={renderButton ?? defaultRenderButton} dataType={dataType}>
          {(rowSelection) => (
            <BaseTable
              columns={columns}
              dataSource={dataSource}
              hasError={hasError}
              loading={loading}
              rowKey={(row) => row._source._self}
              rowSelection={rowSelection}
              dataType={dataType}
              showLoadMore={toggleDisplayMore}
            />
          )}
        </WithRowSelection>
      ) : (
        <BaseTable
          columns={columns}
          dataSource={dataSource}
          hasError={hasError}
          loading={loading}
          rowKey={(row) => row._source._self}
          dataType={dataType}
          showLoadMore={toggleDisplayMore}
        />
      )}
      {displayLoadMoreBtn && (
        <LoadMoreButton
          dataType={dataType}
          brainRegionSource={brainRegionSource}
          hide={toggleDisplayMore}
        />
      )}
    </>
  );
}
