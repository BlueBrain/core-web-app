import { CSSProperties, HTMLProps, useState } from 'react';
import { Empty } from 'antd';
import { CaretDownOutlined, LeftOutlined, LoadingOutlined, RightOutlined } from '@ant-design/icons';
import kebabCase from 'lodash/kebabCase';

import { classNames as csx } from '@/util/utils';

export type TablePagination = {
  currentPage?: number;
  total: number;
  showBelowThreeshold?: boolean;
  perPage?: number;
  onPageChange?: (num: number) => void;
};
export type TableSort = {
  key: string;
  dir?: 'asc' | 'desc';
  sortFn?: any;
  onPageChange: (num: number) => void;
};

export type TableProps<T> = {
  /**
   * name: name of the table, useful to generate a unique key when there is many table in the same page
   */
  name: string;
  /**
   * cellRenderer: used to renderer a cell in a table,
   * priority: per column cellRenderer then this global one
   * a default one is provided if none specified
   */
  cellRenderer?: ({
    row,
    index,
    text,
    transformer,
  }: {
    row: T;
    index: number;
    text: string;
    transformer?: (t: string) => string;
  }) => JSX.Element;

  columns: Array<{
    /**
     * key: the property in the data object to be used in this column
     */
    key: string;
    /**
     * nam: column name
     */
    name: string | React.ReactNode;
    /**
     * description: a tiny description to the column
     * defaul be under the name of the column
     */
    description?: string | React.ReactNode;
    /**
     * see(cellRenderer) global
     */
    cellRenderer?: ({
      row,
      index,
      text,
      transformer,
    }: {
      row: T;
      index: number;
      text: string;
      transformer?: (t: string) => string;
    }) => JSX.Element;
    /**
     * sortable: if the column can be sort
     */
    sortable?: boolean;
    /**
     * sortPosition: the position of the sorter in the column (either left or right)
     */
    sortPosition?: 'left' | 'right';
    /**
     * width: width of the column
     */
    width?: string | number;
    /**
     * sortFn: function to sort the column
     */
    sortFn?: any;
    /**
     * transformer: used to transform the text of a cell
     * eg: get the username from a url or add prefix to the text
     */
    transformer?: (text: string) => string;
  }>;
  /**
   * data: table data
   */
  data: Array<T> & {};
  /**
   * rowKey: if not specified an internal key will be generated
   */
  rowKey?: string;
  /**
   * classNames: for each part of the component
   * note: that the classNames fn used to concat and merge the classnames here
   * will not garantee the applying of the added classes (we need to use something as tw-merge)
   */
  classNames?: {
    colCell?: HTMLProps<HTMLElement>['className'];
    header?: HTMLProps<HTMLElement>['className'];
    table?: HTMLProps<HTMLElement>['className'];
    container?: HTMLProps<HTMLElement>['className'];
  };
  /**
   * shadowed: add shadow to the table
   */
  shadowed?: boolean | string;
  /**
   * stickyHeader: make the header as sticky
   */
  stickyHeader?: boolean | number;
  /**
   * devThrowOnMissing: this will throw an error if an item of data has not at least a key from the columns list
   */
  devThrowOnMissing?: boolean;
  /**
   * style: the container
   */
  style?: CSSProperties;
  /**
   * loading: if using fetch, loading will show a loader until the data is loaded
   */
  loading?: boolean;
  /**
   *
   */
  pagination?: TablePagination;
  onChange?: (input: TablePagination | TableSort) => void;
};

function DefaultCellRenderer({
  data,
  transformer,
}: {
  data: string;
  transformer?: (t: string) => string;
}) {
  return (
    <span
      title={data}
      className="text-sm text-primary-8 whitespace-pre-wrap break-words line-clamp-2"
    >
      {transformer?.(data) ?? data}
    </span>
  );
}

function DefaultSorter({ fn }: { fn?: (direction: 'asc' | 'desc') => void }) {
  const [state, setState] = useState<'asc' | 'desc'>('desc');

  const sort = (direction: 'asc' | 'desc') => () => {
    fn?.(direction);
    setState((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <CaretDownOutlined
      onClick={sort(state === 'asc' ? 'desc' : 'asc')}
      className={csx(
        'transform transition-transform duration-200',
        state === 'asc' ? 'rotate-0' : 'rotate-180'
      )}
    />
  );
}

export function paginateArray<T>(array: T[], itemsPerPage: number, pageNumber: number) {
  const startIndex = pageNumber * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex);
}

const range = (start: number, end: number, step: number = 1) => {
  if (!Number.isInteger(start)) {
    throw new TypeError('start should be an integer');
  }
  if (!Number.isInteger(end)) {
    throw new TypeError('end should be an integer');
  }
  if (!Number.isInteger(step)) {
    throw new TypeError('step should be an integer');
  }

  if (end < start) {
    throw new RangeError('end should be greater than start');
  }
  if (step < 1) {
    throw new RangeError('step should be a positive integer');
  }

  return Array.from({ length: (end - start) / step + 1 }, (_, i) => start + i * step);
};

const generatePagination = (
  curPage: number,
  totalPages: number,
  pagesAtEnd: number = 2,
  pagesAroundCurrent: number = 2,
  dots = '•••'
) => {
  const numItemsInSequence = 1 + pagesAroundCurrent * 2 + pagesAtEnd * 2 + 2;
  const reworkedCurPage = Math.min(curPage, totalPages);

  let pages = [];

  if (totalPages <= numItemsInSequence) {
    pages = range(1, totalPages);
  } else {
    const start = pagesAtEnd > 0 ? 1 : reworkedCurPage;
    const sequence = {
      leftEdge: [] as any,
      rightEdge: [] as any,
      dotsLeft: [] as any,
      centerPart: [] as any,
      dotsRight: [] as any,
    };

    if (reworkedCurPage < numItemsInSequence / 2) {
      sequence.leftEdge = range(1, Math.ceil(numItemsInSequence / 2) + pagesAroundCurrent);
      sequence.centerPart = [dots];
      if (pagesAtEnd > 0) sequence.rightEdge = range(totalPages - (pagesAtEnd - 1), totalPages);
    } else if (reworkedCurPage > totalPages - numItemsInSequence / 2) {
      if (pagesAtEnd > 0) sequence.leftEdge = range(start, pagesAtEnd);
      sequence.centerPart = [dots];
      sequence.rightEdge = range(
        Math.min(
          totalPages - Math.floor(numItemsInSequence / 2) - pagesAroundCurrent,
          reworkedCurPage - pagesAroundCurrent
        ),
        totalPages
      );
    } else {
      sequence.centerPart = range(
        reworkedCurPage - pagesAroundCurrent,
        reworkedCurPage + pagesAroundCurrent
      );
      if (pagesAtEnd > 0) sequence.leftEdge = range(start, pagesAtEnd);
      if (pagesAtEnd > 0) sequence.rightEdge = range(totalPages - (pagesAtEnd - 1), totalPages);
      sequence.dotsLeft = sequence.centerPart[0] === pagesAtEnd + 2 ? [pagesAtEnd + 1] : [dots];
      sequence.dotsRight = [dots];
    }
    pages = Object.values(sequence)
      .filter((v) => v !== null)
      .flat();
  }

  return pages;
};

function PaginationPoint({
  value,
  icon,
  onSelect,
  title,
  isCurrent = false,
  isDisabled = false,
}: {
  value: number | string;
  icon?: JSX.Element;
  onSelect: () => void;
  title?: string;
  isCurrent?: boolean;
  isDisabled?: boolean;
}) {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect?.();
  };

  if (typeof value !== 'number') {
    return (
      <li
        className={csx(
          'flex items-center justify-center px-4 h-10 leading-tight cursor-auto select-none'
        )}
      >
        <span>{value}</span>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={csx(
          'flex items-center justify-center px-4 h-10 leading-tight border border-gray-300',
          'hover:text-white hover:bg-primary-4 cursor-pointer select-none',
          isCurrent && 'bg-primary-8 text-white',
          isDisabled && 'cursor-not-allowed pointer-events-none'
        )}
        title={title ?? `Go to page ${value}`}
        disabled={isDisabled}
      >
        {icon ?? value}
      </button>
    </li>
  );
}

function Pagination({
  name,
  total,
  showBelowThreeshold = false,
  perPage = 10,
  onChange,
  currentPage,
  setCurrentPage,
}: {
  name: string;
  total: number;
  showBelowThreeshold?: boolean;
  perPage?: number;
  onChange?: (input: TablePagination) => void;
  currentPage: number;
  setCurrentPage: (num: number) => void;
}) {
  const numPages = Math.ceil(total / perPage);
  const pages = generatePagination(currentPage, numPages, 2, 2, '•••');
  const onNavItemClick = (id: number) => () => {
    onChange?.({ currentPage: id - 1, total, onPageChange: setCurrentPage });
  };

  if (!showBelowThreeshold && total < perPage) {
    return null;
  }

  return (
    <ul className="flex items-center -space-x-px h-10 text-base">
      <PaginationPoint
        onSelect={onNavItemClick(currentPage - 1)}
        value={currentPage - 1}
        title="Go to Previous Page"
        icon={<LeftOutlined />}
        isDisabled={currentPage === 1}
      />
      {pages.map((item, index) => (
        <PaginationPoint
          key={`${name}-pagination-${item}-${index.toString()}`}
          value={item}
          isCurrent={item === currentPage}
          onSelect={onNavItemClick(item)}
        />
      ))}
      <PaginationPoint
        onSelect={onNavItemClick(currentPage + 1)}
        value={currentPage + 1}
        title="Go to Next Page"
        icon={<RightOutlined />}
        isDisabled={currentPage === numPages}
      />
    </ul>
  );
}

export default function Table<T extends { [key: string]: any }>({
  name: tableName,
  cellRenderer,
  columns,
  data,
  classNames,
  rowKey,
  shadowed,
  devThrowOnMissing,
  stickyHeader,
  style,
  loading,
  pagination,
  onChange,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  if (loading) {
    return (
      <div className="w-full py-3 flex items-center justify-center">
        <LoadingOutlined className="text-primary-8 w-4 h-4" />
      </div>
    );
  }

  return (
    <div
      className={csx(
        'relative overflow-x-auto overflow-y-auto sm:rounded-lg',
        // eslint-disable-next-line no-nested-ternary
        shadowed ? (typeof shadowed === 'string' ? shadowed : 'shadow-md') : undefined,
        classNames && classNames.container,
        !data.length && 'h-56'
      )}
      style={style}
    >
      <table
        className={csx(
          'w-full table-fixed h-full text-sm text-left text-gray-500',
          classNames && classNames.table
        )}
      >
        <thead className={csx('text-xs w-full text-gray-700 bg-gray-50 ', classNames?.header)}>
          <tr>
            {columns.map(
              ({ key, name, description, sortable, sortFn, sortPosition, width: w }, ind) => {
                // eslint-disable-next-line no-nested-ternary
                const width = w ? (typeof w === 'number' ? `${w}px` : w) : null;
                // this can be handled by providing e default sort fn
                if (sortable) {
                  if (!sortFn) {
                    throw new Error(
                      `Column ${key} is sortable but no relative function is defined`
                    );
                  }
                  if (typeof sortFn !== 'function') {
                    throw new Error(`Column ${key} is sortable but sortFn is not a function`);
                  }
                }
                const sticky =
                  (typeof stickyHeader === 'boolean' && stickyHeader) ||
                  typeof stickyHeader === 'number';
                return (
                  <th
                    scope="col"
                    key={kebabCase(`${tableName}-column-${ind}`)}
                    className={csx(
                      'px-6 py-4 bg-gray-50',
                      sticky && 'sticky',
                      typeof stickyHeader === 'boolean' && 'top-0'
                    )}
                    style={{
                      ...(width ? { width } : {}),
                      ...(typeof stickyHeader === 'number' ? { top: stickyHeader } : {}),
                    }}
                  >
                    <div
                      className={csx(
                        'inline-flex flex-row gap-1 w-full',
                        classNames?.colCell,
                        sortPosition === 'left' ? 'justify-start gap-3' : 'justify-between'
                      )}
                    >
                      <div className="flex flex-col items-start justify-between gap-1">
                        {typeof name === 'string' ? (
                          <span className="text-sm font-bold select-none text-neutral-4">
                            {name}
                          </span>
                        ) : (
                          name
                        )}
                        {description && typeof description === 'string' ? (
                          <span className="text-xs font-light normal-case italic">
                            {description}
                          </span>
                        ) : (
                          description
                        )}
                      </div>
                      {sortable && sortFn ? (
                        <DefaultSorter
                          fn={(dir: 'asc' | 'desc') =>
                            onChange?.({ sortFn, dir, key, onPageChange: setCurrentPage })
                          }
                        />
                      ) : null}
                    </div>
                  </th>
                );
              }
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const reactRowkey =
              rowKey && rowKey in row
                ? row[rowKey as keyof T]
                : kebabCase(`${tableName}-row${index}`);
            return (
              <tr key={reactRowkey} className="bg-white border-b hover:bg-primary-0">
                {columns.map(
                  ({ key, cellRenderer: columnCellRenderer, transformer }, columIndex) => {
                    let Comp = (
                      <DefaultCellRenderer data={row[key] ?? ''} transformer={transformer} />
                    );
                    if (
                      !(key in row) &&
                      devThrowOnMissing &&
                      process.env.NODE_ENV === 'development'
                    ) {
                      throw new Error(`${key} is missing in row number ${index}`);
                    }
                    const rowData = key in row ? row[key] : '';
                    const reactColumnKey = `${tableName}-row${index}-${key}-col${columIndex}`;
                    if (columnCellRenderer)
                      Comp = columnCellRenderer({ index, row, text: rowData, transformer });
                    if (cellRenderer)
                      Comp = cellRenderer({ index, row, text: rowData, transformer });

                    return columIndex === 0 ? (
                      <th
                        scope="row"
                        key={reactColumnKey}
                        className="px-6 py-4 font-medium text-gray-900 whitespace-pre-wrap"
                      >
                        {Comp}
                      </th>
                    ) : (
                      <td
                        key={reactColumnKey}
                        className={csx('px-6 py-4 whitespace-pre-wrap relative')}
                      >
                        {Comp}
                      </td>
                    );
                  }
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pagination && !loading && data.length && (
        <div className="py-4 flex items-end justify-end">
          <Pagination
            {...{
              onChange,
              currentPage,
              setCurrentPage,
              name: tableName,
              total: pagination.total,
              perPage: pagination.perPage,
              showBelowThreeshold: pagination.showBelowThreeshold,
            }}
          />
        </div>
      )}
      {!data.length && (
        <div className="absolute inset-0 top-9 mx-auto inline-flex items-center justify-center py-4">
          <Empty description="" className="w-20 h-20" />
        </div>
      )}
    </div>
  );
}
