import { CSSProperties, MouseEvent, ReactNode } from 'react';
import { Table, TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import { VerticalAlignMiddleOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import usePathname from '@/hooks/pathname';
import { detailUrlBuilder } from '@/util/common';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { ExploreDownloadButton } from '@/components/explore-section/ExploreSectionListingView/DownloadButton';
import WithRowSelection, {
  RenderButtonProps,
} from '@/components/explore-section/ExploreSectionListingView/WithRowSelection';
import { ExploreESHit } from '@/types/explore-section/es';
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
  const modifiedStyle = {
    ...style,
    fontWeight: '500',
    color: '#434343',
    verticalAlign: 'baseline',
  };

  return handleResizing ? (
    <th {...props} /* eslint-disable-line react/jsx-props-no-spreading */ style={modifiedStyle}>
      <div className="flex">
        <button
          className={classNames('flex items-top', styles.alignmentHack)}
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
    padding: '4px 6pX',
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
}: TableProps<any> & { hasError?: boolean; experimentTypeName: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const setBackToListPath = useSetAtom(backToListPathAtom);

  if (hasError) {
    return <div>Something went wrong</div>;
  }

  const onCellRouteHandler = {
    onCell: (record: ExploreESHit) => ({
      onClick: (e: MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        setBackToListPath(pathname);
        router.push(detailUrlBuilder(record, experimentTypeName));
      },
    }),
  };

  return (
    <Table
      aria-label="listing-view-table"
      className={styles.table}
      columns={
        columns &&
        columns.map((col, i) => ({
          ...col,
          ...(i !== 0 && onCellRouteHandler),
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

export default function ExploreSectionTable({
  columns,
  dataSource,
  enableDownload,
  experimentTypeName,
  hasError,
  loading,
  renderButton,
}: TableProps<any> & {
  enableDownload?: boolean;
  experimentTypeName: string;
  hasError?: boolean;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
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
