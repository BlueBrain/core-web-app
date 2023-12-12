import { CSSProperties, MouseEvent, ReactNode } from 'react';
import { Table, TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import { VerticalAlignMiddleOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import { ColumnGroupType, ColumnType } from 'antd/es/table';

import usePathname from '@/hooks/pathname';
import { detailUrlBuilder } from '@/util/common';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { ExploreDownloadButton } from '@/components/explore-section/ExploreSectionListingView/DownloadButton';
import WithRowSelection, {
  RenderButtonProps,
} from '@/components/explore-section/ExploreSectionListingView/WithRowSelection';
import type { ExploreESHit } from '@/types/explore-section/es';
import { classNames } from '@/util/utils';
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
    verticalAlign: 'middle',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    padding: '16px 16px 16px 8px',
  };

  return handleResizing ? (
    <th
      {...props} /* eslint-disable-line react/jsx-props-no-spreading */
      style={modifiedStyle}
      className="before:!bg-neutral-4"
    >
      <div className="flex w-full">
        <button
          className={classNames(
            'inline-flex w-full',
            '[&>.ant-table-column-sorters]:inline-flex [&>.ant-table-column-sorters]:gap-2 [&>.ant-table-column-sorters]:flex-none'
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
    <th {...props} /* eslint-disable-line react/jsx-props-no-spreading */ style={modifiedStyle}>
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
  experimentTypeName,
}: TableProps<ExploreESHit> & { hasError?: boolean; experimentTypeName: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const setBackToListPath = useSetAtom(backToListPathAtom);

  if (hasError) {
    return <div>Something went wrong</div>;
  }

  const onCellRouteHandler = (col: ColumnGroupType<ExploreESHit> | ColumnType<ExploreESHit>) => {
    return {
      onCell: (record: ExploreESHit) =>
        col.key !== 'preview'
          ? {
              onClick: (e: MouseEvent<HTMLInputElement>) => {
                e.preventDefault();
                setBackToListPath(pathname);
                router.push(detailUrlBuilder(record, experimentTypeName));
              },
            }
          : {},
    };
  };

  return (
    <Table
      aria-label="listing-view-table"
      className={styles.table}
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
    />
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
  experimentTypeName,
  hasError,
  loading,
  renderButton,
}: TableProps<ExploreESHit> & {
  enableDownload?: boolean;
  experimentTypeName: string;
  hasError?: boolean;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  return enableDownload ? (
    <WithRowSelection
      renderButton={renderButton ?? defaultRenderButton}
      experimentTypeName={experimentTypeName}
    >
      {(rowSelection) => (
        <BaseTable
          columns={columns}
          dataSource={dataSource}
          hasError={hasError}
          loading={loading}
          rowKey={(row) => row._source._self}
          rowSelection={rowSelection}
          experimentTypeName={experimentTypeName}
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
      experimentTypeName={experimentTypeName}
    />
  );
}
