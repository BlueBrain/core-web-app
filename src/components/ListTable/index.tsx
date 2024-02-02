import { CSSProperties, HTMLProps, ReactNode, useState } from 'react';
import { ConfigProvider, Table, TableProps, Tooltip } from 'antd';

import { isNumeric, to64 } from '@/util/common';
import usePathname from '@/hooks/pathname';
import { BrainIcon, InteractiveViewIcon, VirtualLabIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import Link from '@/components/Link';
import useResizeObserver from '@/hooks/useResizeObserver';

import styles from '@/components/ListTable/list-table.module.scss';

type Column = {
  dataIndex: string | string[];
  label: string;
  key: string;
  render?: (text: string, record: any, index: number) => ReactNode;
};

function ColumnContent(text: string) {
  return isNumeric(text) ? (
    text
  ) : (
    <span className="rounded-md bg-neutral-1 px-2 py-2 text-center">{JSON.stringify(text)}</span>
  );
}

function formatColumn({ render, ...rest }: Column) {
  return {
    render: render || ColumnContent,
    ...rest,
  };
}

function CustomTable({ children, style, ...props }: { children: ReactNode; style: CSSProperties }) {
  return (
    <table
      style={{ ...style, borderSpacing: '0 14px' }}
      {...props} /* eslint-disable-line react/jsx-props-no-spreading */
    >
      {children}
    </table>
  );
}

function CustomTH({
  children,
  handleResizing, // Removes unwanted prop from props
  style,
  ...props
}: {
  children: ReactNode;
  handleResizing: () => void;
  style: CSSProperties;
}) {
  return (
    <th
      className="before:!content-none"
      style={{
        ...style,
        background: 'white',
        borderBottomStyle: 'none',
        borderStartStartRadius: '0px',
        borderStartEndRadius: '0px',
        color: '#8C8C8C',
        fontWeight: 400,
        overflowWrap: 'anywhere',
      }}
      {...props} /* eslint-disable-line react/jsx-props-no-spreading */
    >
      {children}
    </th>
  );
}

function CustomTD({
  children,
  className,
  style,
  ...props
}: {
  className: string;
  children: ReactNode;
  style: CSSProperties;
}) {
  return (
    <td
      {...props} /* eslint-disable-line react/jsx-props-no-spreading */
      className={classNames(className, styles.customTD)}
      style={{
        ...style,
        borderColor: '#D9D9D9',
        borderStyle: 'solid none solid none',
        borderWidth: '1px',
      }}
    >
      {children}
    </td>
  );
}

function LinkWrapper({ children, href, title }: HTMLProps<HTMLSpanElement>) {
  return (
    <Tooltip overlayInnerStyle={{ background: '#003A8C', color: 'white' }} title={title}>
      <span className="border border-neutral-4 p-2 text-primary-7 hover:bg-white hover:text-primary-9">
        <Link className="text-primary-7 hover:text-primary-9" href={href ?? ''}>
          {children}
        </Link>
      </span>
    </Tooltip>
  );
}

export function IndexColContent({
  id,
  project,
  text,
}: {
  id: string;
  project: string;
  text: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-5">
      <Link
        className="whitespace-pre-wrap font-bold"
        href={`${pathname}/${to64(`${project}!/!${id}`)}`}
      >
        {text}
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm uppercase text-neutral-4">Open in</span>
        <div className="flex items-center gap-3">
          {[
            {
              children: <InteractiveViewIcon />,
              href: `${pathname}/${to64(`${project}!/!${id}`)}/experiment-interactive`,
              title: 'Interactive View',
            },
            {
              children: <BrainIcon />,
              href: `/build/cell-composition/interactive?brainModelConfigId=${id}`,
              title: 'View brain configuration',
            },
            {
              children: <VirtualLabIcon />,
              href: `/experiment-designer/experiment-setup?simulationCampaignUIConfigId=${id}`,
              title: 'View experiment configuration',
            },
          ].map(
            ({ children, href, title }) =>
              href && (
                <LinkWrapper href={href} key={href} title={title}>
                  {children}
                </LinkWrapper>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export function ValueArray({ value }: { value?: string[] }) {
  return value ? (
    <div className="flex w-fit gap-2 rounded bg-neutral-1 px-2 py-1 font-semibold text-primary-8">
      {value.map((x, i, arr) => (
        <span key={x}>{i < arr.length - 1 ? `${x},` : x}</span>
      ))}
    </div>
  ) : null;
}

export default function ListTable({ columns, dataSource, loading }: TableProps<any>) {
  const [containerDimension, setContainerDimension] = useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });

  useResizeObserver({
    element: document.getElementById('simulation-campaigns-layout'),
    callback: (target) => setContainerDimension(target.getBoundingClientRect()),
  });

  return (
    <ConfigProvider
      theme={{
        hashed: false,
        components: {
          Table: {
            colorBgContainer: '#fff',
            colorBorderSecondary: '#8C8C8C',
            colorText: '#0050B3',
          },
        },
      }}
    >
      <Table
        className="bg-transparant"
        columns={(columns as Column[]).map(formatColumn)}
        components={{
          table: CustomTable,
          header: {
            cell: CustomTH,
          },
          body: {
            cell: CustomTD,
          },
        }}
        dataSource={dataSource}
        loading={loading}
        pagination={false}
        rowClassName="align-top bg-white rounded-md"
        rowKey={(row) => row._source._self}
        tableLayout="fixed"
        scroll={{ y: containerDimension.height - 120 }}
      />
    </ConfigProvider>
  );
}
