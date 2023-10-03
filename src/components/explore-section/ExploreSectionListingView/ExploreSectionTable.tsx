import { CSSProperties, MouseEvent, ReactNode } from 'react';
import { Table, TableProps } from 'antd';
import { useRouter } from 'next/navigation';
import { VerticalAlignMiddleOutlined } from '@ant-design/icons';
import { useSetAtom, useAtomValue } from 'jotai';
import usePathname from '@/hooks/pathname';
import { to64 } from '@/util/common';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { ExploreDownloadButton } from '@/components/explore-section/ExploreSectionListingView/DownloadButton';
import WithRowSelection, {
  RenderButtonProps,
} from '@/components/explore-section/ExploreSectionListingView/WithRowSelection';
import { expandedRowKeysAtom } from '@/state/explore-section/generalization';
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
    color: 'inherit',
    background: 'inherit',
    rowHoverBg: 'red',
  };
  return (
    <td {...props} /* eslint-disable-line react/jsx-props-no-spreading */ style={modifiedStyle}>
      {children}
    </td>
  );
}

// function CustomRow({ children, style, ...props }: { children: ReactNode; style: CSSProperties }) {
//   const modifiedStyle = {
//     ...style,
//     rowHoverBg: 'red',
//     borderColor: 'red'
//   };
//   return (
//     <tr {...props} /* eslint-disable-line react/jsx-props-no-spreading */ style={modifiedStyle}>
//       {children}
//     </tr>
//   );
// }

export function BaseTable({
  columns,
  dataSource,
  expandable,
  hasError,
  loading,
  rowSelection,
  rowClassName,
}: TableProps<any> & { hasError?: boolean }) {
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
        router.push(`${pathname}/${to64(`${record._source.project.label}!/!${record._id}`)}`);
      },
    }),
  };

  return (
    <Table
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
      expandable={expandable}
      loading={loading}
      pagination={false}
      rowClassName={rowClassName || styles.tableRow}
      rowKey={(row) => row._source._self}
      rowSelection={rowSelection}
    />
  );
}

export default function ExploreSectionTable({
  columns,
  dataSource,
  enableDownload,
  expandable,
  experimentTypeName,
  hasError,
  loading,
  renderButton,
  resourceId,
}: TableProps<any> & {
  enableDownload?: boolean;
  experimentTypeName: string;
  hasError?: boolean;
  renderButton?: (props: RenderButtonProps) => ReactNode;
  resourceId?: string;
}) {
  const defaultRenderButton = ({ selectedRows, clearSelectedRows }: RenderButtonProps) => (
    <ExploreDownloadButton selectedRows={selectedRows} clearSelectedRows={clearSelectedRows}>
      <span>{`Download ${selectedRows.length === 1 ? 'Resource' : 'Resources'} (${
        selectedRows.length
      })`}</span>
    </ExploreDownloadButton>
  );

  const expandedRowKeys = useAtomValue(expandedRowKeysAtom(resourceId));

  return enableDownload ? (
    <WithRowSelection
      renderButton={renderButton ?? defaultRenderButton}
      experimentTypeName={experimentTypeName}
    >
      {(rowSelection) => (
        <BaseTable
          columns={columns}
          dataSource={dataSource}
          expandable={{ ...expandable, expandedRowKeys }}
          rowClassName={(record) =>
            expandedRowKeys.includes(record._source._self) ? 'text-white bg-primary-7' : 'bg-white text-primary-7'
          }
          hasError={hasError}
          loading={loading}
          rowKey={(row) => row._source._self}
          rowSelection={rowSelection}
        />
      )}
    </WithRowSelection>
  ) : (
    <BaseTable
      columns={columns}
      dataSource={dataSource}
      expandable={expandable}
      hasError={hasError}
      loading={loading}
      rowKey={(row) => row._source._self}
    />
  );
}
