import { Dropdown, MenuProps } from 'antd';
import range from 'lodash/range';
import { useMemo } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { DeltaResource } from '@/types/explore-section';
import Link from '@/components/Link';

export default function DetailHeaderName({
  detail,
  url,
  latestRevision,
}: {
  detail: DeltaResource;
  url?: string | null;
  latestRevision: number | null;
}) {
  // revisions builder
  const items: MenuProps['items'] = useMemo(() => {
    if (latestRevision) {
      return range(latestRevision, 0).map((revision: number) => ({
        key: revision,
        label: (
          <Link style={{ color: '#0050B3' }} href={`${url}?rev=${revision}`}>
            Revision {revision} {latestRevision === revision ? '(latest)' : ''}
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
        <Dropdown menu={{ items }} placement="bottom" trigger={['click']}>
          <button
            type="button"
            className="border border-primary-7 flex gap-2 items-center px-4 py-2 w-fit"
          >
            <span>
              Revision {detail._rev} {latestRevision === detail._rev ? '(latest)' : ''}
            </span>
            <DownOutlined />
          </button>
        </Dropdown>
      </div>
    </div>
  );
}
