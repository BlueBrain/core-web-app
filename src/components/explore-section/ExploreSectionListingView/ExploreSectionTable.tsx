import { VerticalAlignMiddleOutlined } from '@ant-design/icons';
import { ConfigProvider, Table, TableProps } from 'antd';
import { TableRef } from 'antd/es/table';
import { RowSelectionType } from 'antd/es/table/interface';
import { CSSProperties, ReactNode, useCallback, useRef, useState } from 'react';

import LoadMoreButton from './LoadMoreButton';
import useRowSelection, { RenderButtonProps } from './useRowSelection';
import { useOnCellRouteHandler, useShowMore, useScrollNav } from './hooks';

import { ExploreDownloadButton } from '@/components/explore-section/ExploreSectionListingView/DownloadButton';
import { DataType } from '@/constants/explore-section/list-views';
import useResizeObserver from '@/hooks/useResizeObserver';
import useScrollComplete from '@/hooks/useScrollComplete';
import { VirtualLabInfo } from '@/types/virtual-lab/common';
import { ExploreDataScope } from '@/types/explore-section/application';
import type { ExploreESHit } from '@/types/explore-section/es';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { classNames } from '@/util/utils';
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

type AdditionalTableProps = {
  dataContext: {
    virtualLabInfo?: VirtualLabInfo;
    dataScope: ExploreDataScope;
    dataType: DataType;
  };
  hasError?: boolean;
  onCellClick?: OnCellClick;
};

export function BaseTable({
  columns,
  dataContext,
  dataSource,
  hasError,
  loading,
  onCellClick,
  rowSelection,
  showLoadMore,
  scrollable = true,
  sticky,
}: TableProps<ExploreESHit<ExploreSectionResource>> &
  AdditionalTableProps & {
    showLoadMore?: (value?: boolean) => void;
    scrollable?: boolean;
  }) {
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

  const onCellRouteHandler = useOnCellRouteHandler({ dataType: dataContext.dataType, onCellClick });

  if (hasError) return <div>Something went wrong</div>;

  if (!columns?.length) return null;
  return (
    <ConfigProvider theme={{ hashed: false }}>
      <Table
        ref={tableRef}
        sticky={sticky}
        aria-label="listing-view-table"
        className={classNames(styles.table, 'grow [&_.ant-table-sticky-holder]:shadow-md')}
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
        scroll={
          scrollable
            ? {
                x: 'fit-content',
                y: containerDimension.height - (headerHeight + 100), // 100 is to make space for load more button,
              }
            : { x: 'fit-content' }
        }
      />
    </ConfigProvider>
  );
}

function DefaultRenderButton({
  children,
  clearSelectedRows,
  selectedRows,
}: RenderButtonProps & {
  children?: (props: RenderButtonProps) => ReactNode;
}) {
  return children ? (
    children({ selectedRows, clearSelectedRows })
  ) : (
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
}

function TableControls({
  clearSelectedRows,
  children,
  renderButton,
  selectedRows,
  visible,
}: {
  clearSelectedRows: RenderButtonProps['clearSelectedRows'];
  children?: ReactNode;
  renderButton?: (props: RenderButtonProps) => ReactNode;
  selectedRows: RenderButtonProps['selectedRows'];
  visible: boolean;
}) {
  const { left, right } = useScrollNav(
    typeof document !== 'undefined'
      ? (document.querySelector('.ant-table-body') as HTMLDivElement)
      : undefined
  );

  if (!visible) return null;

  return (
    <div className="flex h-[100px] shrink-0 items-center justify-between gap-5 px-5">
      {left}
      <div className="flex grow items-center">
        <div className="flex grow justify-center">{children}</div>
        <div className="ml-auto">{right}</div>
      </div>
      {!!selectedRows?.length && clearSelectedRows && (
        <DefaultRenderButton clearSelectedRows={clearSelectedRows} selectedRows={selectedRows}>
          {renderButton}
        </DefaultRenderButton>
      )}
    </div>
  );
}

export default function ExploreSectionTable({
  columns,
  dataContext,
  dataSource,
  hasError,
  loading,
  onCellClick,
  renderButton,
  selectionType,
  onRowsSelected,
  scrollable = true,
  controlsVisible = true,
}: TableProps<ExploreESHit<ExploreSectionResource>> &
  AdditionalTableProps & {
    renderButton?: (props: RenderButtonProps) => ReactNode;
    selectionType?: RowSelectionType;
    scrollable?: boolean;
    controlsVisible?: boolean;
    onRowsSelected?: (rows: ExploreESHit<ExploreSectionResource>[]) => void;
  }) {
  const { rowSelection, selectedRows, clearSelectedRows } = useRowSelection({
    dataType: dataContext.dataType,
    selectionType,
    onRowsSelected,
  });

  const { displayLoadMoreBtn, toggleDisplayMore } = useShowMore();

  return (
    <>
      <BaseTable
        columns={columns}
        dataContext={dataContext}
        dataSource={dataSource}
        hasError={hasError}
        loading={loading}
        onCellClick={onCellClick}
        rowKey={(row) => row._source._self}
        rowSelection={rowSelection}
        showLoadMore={toggleDisplayMore}
        scrollable={scrollable}
      />
      <TableControls
        renderButton={renderButton}
        selectedRows={selectedRows}
        clearSelectedRows={clearSelectedRows}
        visible={controlsVisible}
      >
        {displayLoadMoreBtn && (
          <LoadMoreButton dataContext={dataContext} hide={toggleDisplayMore} />
        )}
      </TableControls>
    </>
  );
}
