import { MouseEvent, useState, ReactNode, CSSProperties, useEffect } from 'react';
import { Table } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { VerticalAlignMiddleOutlined } from '@ant-design/icons';
import usePathname from '@/hooks/pathname';
import { to64 } from '@/util/common';
import GeneralizationRules from '@/components/explore-section/ExploreSectionListingView/GeneralizationRules';
import DownloadButton from '@/components/explore-section/ExploreSectionListingView/DownloadButton';
import { ESResponseRaw } from '@/types/explore-section/resources';
import { classNames } from '@/util/utils';
import { selectedRowsAtom, experimentDataTypeAtom } from '@/state/explore-section/list-view-atoms';
import styles from '@/app/explore/explore.module.scss';

type ExploreSectionTableProps = {
  data: Loadable<ESResponseRaw[] | undefined>;
  columns: ColumnProps<any>[];
  enableDownload?: boolean;
  selectedRowsButton?: ReactNode;
};

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
    backgroundColor: 'white',
  };

  return (
    <td {...props} /* eslint-disable-line react/jsx-props-no-spreading */ style={modifiedStyle}>
      {children}
    </td>
  );
}

export default function ExploreSectionTable({
  data,
  columns,
  enableDownload,
  selectedRowsButton,
}: ExploreSectionTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  const experimentDataType = useAtomValue(experimentDataTypeAtom);
  const [selectedRows, setSelectedRows] = useAtom(selectedRowsAtom);
  const [fetching, setFetching] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<ESResponseRaw[] | undefined>(
    data.state === 'hasData' ? data.data : undefined
  );

  useEffect(() => {
    if (data.state === 'hasData') {
      setDataSource(data.data);
    }
  }, [data]);

  const clearSelectedRows = () => {
    setFetching(false);
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [experimentDataType as string]: [],
    }));
  };

  const updateSelectedRows = (rows: ESResponseRaw[]) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [experimentDataType as string]: rows,
    }));
  };

  const onCellRouteHandler = {
    onCell: (record: ESResponseRaw) => ({
      onClick: (e: MouseEvent<HTMLInputElement>) => {
        e.preventDefault();

        router.push(`${pathname}/${to64(`${record._source.project.label}!/!${record._id}`)}`);
      },
    }),
  };

  if (data.state === 'hasError' || experimentDataType === undefined) {
    return <div>Something went wrong</div>;
  }

  const expandedRowRender = () => <GeneralizationRules />;
  const activeSelectedRowsButton = selectedRowsButton || (
    <DownloadButton
      setFetching={setFetching}
      selectedRows={selectedRows[experimentDataType]}
      clearSelectedRows={clearSelectedRows}
      fetching={fetching}
    />
  );

  return (
    <>
      <Table
        className={styles.table}
        columns={columns.map((col, i) => ({
          ...col,
          ...(!(enableDownload && i === 0) && onCellRouteHandler),
        }))}
        dataSource={dataSource}
        loading={data.state === 'loading'}
        rowClassName={styles.tableRow}
        rowKey={(row) => row._source._self}
        rowSelection={
          enableDownload
            ? {
                selectedRowKeys: selectedRows[experimentDataType].map(
                  ({ _source }) => _source._self
                ),
                onChange: (_keys, rows) => updateSelectedRows(rows),
                type: 'checkbox',
              }
            : undefined
        }
        pagination={false}
        components={{
          header: {
            cell: CustomTH,
          },
          body: {
            cell: CustomCell,
          },
        }}
        expandable={{ expandedRowRender }}
      />
      {activeSelectedRowsButton}
    </>
  );
}
