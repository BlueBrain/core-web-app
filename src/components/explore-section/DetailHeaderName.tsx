import { Dropdown, MenuProps, Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import range from 'lodash/range';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { loadable } from 'jotai/utils';
import { latestRevisionAtom } from '@/state/explore-section/detail-atoms-constructor';
import { DeltaResource } from '@/types/explore-section';
import Link from '@/components/Link';

const latestRevisionLoadableAtom = loadable(latestRevisionAtom);

export default function DetailHeaderName({
  detail,
  url,
}: {
  detail: DeltaResource;
  url?: string | null;
}) {
  const latestRevision = useAtomValue(latestRevisionLoadableAtom);

  // revisions builder
  const items: MenuProps['items'] = useMemo(() => {
    if (latestRevision.state === 'hasData' && latestRevision.data === 500 && url) {
      return range(latestRevision.data, 0).map((revision: number) => ({
        key: revision,
        label: (
          <Link style={{ color: '#0050B3' }} href={`${url}?rev=${revision}`}>
            Revision {revision} {latestRevision.data === revision ? '(latest)' : ''}
          </Link>
        ),
      }));
    }
    return [];
  }, [latestRevision, url]);

  return (
    <div className="flex flex-col text-primary-7">
      <div className="font-thin text-xs">Name</div>
      <div className="flex items-center gap-5">
        <div className="font-bold text-xl">{detail?.name}</div>
        <Dropdown
          menu={{ items }}
          placement="bottom"
          trigger={['click']}
          disabled={items.length < 2}
        >
          <button
            type="button"
            className="border border-primary-7 flex gap-2 items-center px-4 py-2 w-fit"
          >
            {latestRevision.state === 'loading' && <Spin indicator={<LoadingOutlined />} />}
            {latestRevision.state === 'hasData' && (
              <span>
                Revision {detail._rev} {latestRevision.data === detail._rev ? '(latest)' : ''}
              </span>
            )}
            <DownOutlined />
          </button>
        </Dropdown>
      </div>
    </div>
  );
}
