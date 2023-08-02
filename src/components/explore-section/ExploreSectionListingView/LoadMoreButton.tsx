import { HTMLProps } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { queryResponseAtom, pageSizeAtom } from '@/state/explore-section/list-view-atoms';
import { classNames } from '@/util/utils';

const antIcon = <LoadingOutlined style={{ float: 'left', fontSize: 24 }} spin />;

const dataLoadable = loadable(queryResponseAtom);

function Btn({ children, className, disabled, onClick }: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className={classNames('font-semibold mt-2 mx-auto px-14 py-4 rounded-3xl', className)}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function LoadMoreButton() {
  const data = useAtomValue(dataLoadable);
  const [pageSize, setPageSize] = useAtom(pageSizeAtom);

  switch (data.state) {
    case 'loading': {
      return (
        <Btn className="bg-primary-8 cursor-progress text-white" disabled>
          <Spin indicator={antIcon} />
        </Btn>
      );
    }

    case 'hasData': {
      const { hits, total } = data?.data ?? { hits: [], total: { value: 0 } };

      return hits?.length < total?.value ? (
        <Btn className="bg-primary-8 text-white" onClick={() => setPageSize(pageSize + 30)}>
          Load 30 more results...
        </Btn>
      ) : (
        <Btn className="bg-neutral-2 cursor-not-allowed text-primary-9" disabled>
          All resources are loaded
        </Btn>
      );
    }

    default: {
      return null;
    }
  }
}
