import { VerticalAlignMiddleOutlined } from '@ant-design/icons';
import { ConfigProvider, Table, TableProps } from 'antd';
import { ColumnGroupType, ColumnType, TableRef } from 'antd/es/table';
import { RowSelectionType } from 'antd/es/table/interface';
import { useSetAtom } from 'jotai';
import { CSSProperties, MouseEvent, ReactNode, useCallback, useRef, useState } from 'react';

import LoadMoreButton from './LoadMoreButton';
import { ExploreDownloadButton } from '@/components/explore-section/ExploreSectionListingView/DownloadButton';
import WithRowSelection, {
  RenderButtonProps,
} from '@/components/explore-section/ExploreSectionListingView/WithRowSelection';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { DataType } from '@/constants/explore-section/list-views';
import usePathname from '@/hooks/pathname';
import useResizeObserver from '@/hooks/useResizeObserver';
import useScrollComplete from '@/hooks/useScrollComplete';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import type { ExploreESHit } from '@/types/explore-section/es';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { classNames } from '@/util/utils';

import { BookmarkScope } from '@/state/virtual-lab/bookmark';
import styles from '@/app/explore/explore.module.scss';

export type OnCellClick = (
  basePath: string,
  record: ExploreESHit<ExploreSectionResource>,
  type: DataType
) => void;

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
            '[&>.ant-table-column-sorters]:inline-flex [&>.ant-table-column-sorters]:flex-none [&>.ant-table-column-sorters]:!items-start [&>.ant-table-column-sorters]:gap-2'
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
  onCellClick,
}: TableProps<ExploreESHit<ExploreSectionResource>> & {
  hasError?: boolean;
  dataType: DataType;
  showLoadMore: (value?: boolean) => void;
  onCellClick?: (
    basePath: string,
    record: ExploreESHit<ExploreSectionResource>,
    type: DataType
  ) => void;
}) {
  const pathname = usePathname();
  const setBackToListPath = useSetAtom(backToListPathAtom);
  const [containerDimension, setContainerDimension] = useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });
  const tableRef = useRef<TableRef>(null);
  const tableElement: HTMLElement | null | undefined =
    tableRef.current?.nativeElement.querySelector('.ant-table-body');
  const parentElement =
    typeof document !== 'undefined'
      ? document.getElementById('interactive-data-layout') ||
        document.getElementById('explore-table-container-for-observable') ||
        document.getElementById('bookmark-list-container')
      : undefined;
  const headerHeight =
    (tableElement?.getBoundingClientRect()?.y ?? 0) -
    (parentElement?.getBoundingClientRect()?.y ?? 0);

  const onResize = useCallback((target: HTMLElement) => {
    setContainerDimension(target.getBoundingClientRect());
  }, []);

  // added new id explore-table-container-for-observable because we are using this component
  // outside of the explore and we want to resize the table acording to the screen size as well
  useResizeObserver({
    element: parentElement,
    callback: onResize,
  });

  useScrollComplete({
    element: tableElement,
    callback: showLoadMore,
  });

  const onCellRouteHandler = (
    col:
      | ColumnGroupType<ExploreESHit<ExploreSectionResource>>
      | ColumnType<ExploreESHit<ExploreSectionResource>>
  ) => {
    return {
      onCell: (record: ExploreESHit<ExploreSectionResource>) =>
        col.key !== Field.Preview
          ? {
              onClick: (e: MouseEvent<HTMLInputElement>) => {
                e.preventDefault();
                setBackToListPath(pathname);
                onCellClick?.(pathname, record, dataType);
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
        className={classNames(styles.table, '[&_.ant-table-sticky-holder]:shadow-md')}
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
          y: containerDimension.height - (headerHeight + 100), // 100 is to make space for load more button,
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
  renderButton = defaultRenderButton,
  onCellClick,
  selectionType,
  bookmarkScope,
}: TableProps<ExploreESHit<ExploreSectionResource>> & {
  enableDownload?: boolean;
  dataType: DataType;
  hasError?: boolean;
  renderButton?: (props: RenderButtonProps) => ReactNode;
  brainRegionSource: ExploreDataBrainRegionSource;
  onCellClick?: OnCellClick;
  selectionType?: RowSelectionType;
  bookmarkScope?: BookmarkScope;
}) {
  const [displayLoadMoreBtn, setDisplayLoadMoreBtn] = useState(false);
  const toggleDisplayMore = (value?: boolean) =>
    setDisplayLoadMoreBtn((state) => {
      return value ?? !state;
    });

  if (enableDownload) {
    return (
      <WithRowSelection dataType={dataType} selectionType={selectionType}>
        {(rowSelection, selectedRows, clearSelectedRows) => (
          <>
            <BaseTable
              columns={columns}
              dataSource={dataSource}
              hasError={hasError}
              loading={loading}
              rowKey={(row) => row._source._self}
              rowSelection={rowSelection}
              dataType={dataType}
              showLoadMore={toggleDisplayMore}
              onCellClick={onCellClick}
            />
            <div className="flex grow items-center justify-between">
              <div className="grow" />
              <div className="flex grow items-center">
                {displayLoadMoreBtn && (
                  <LoadMoreButton
                    dataType={dataType}
                    brainRegionSource={brainRegionSource}
                    bookmarkScope={bookmarkScope}
                    hide={toggleDisplayMore}
                  />
                )}
              </div>
              <div className="grow">
                {!!selectedRows.length && renderButton({ selectedRows, clearSelectedRows })}
              </div>
            </div>
          </>
        )}
      </WithRowSelection>
    );
  }

  return (
    <>
      <BaseTable
        columns={columns}
        dataSource={dataSource}
        hasError={hasError}
        loading={loading}
        rowKey={(row) => row._source._self}
        dataType={dataType}
        showLoadMore={toggleDisplayMore}
        onCellClick={onCellClick}
      />
      {displayLoadMoreBtn && (
        <LoadMoreButton
          dataType={dataType}
          brainRegionSource={brainRegionSource}
          bookmarkScope={bookmarkScope}
          hide={toggleDisplayMore}
        />
      )}
    </>
  );
}
