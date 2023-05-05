import { Button, Dropdown, MenuProps } from 'antd';
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
    <>
      <div className="text-xs font-thin text-primary-7">Name</div>
      <div className="flex gap-5 items-center">
        <div className="font-bold text-xl text-primary-7">{detail?.name}</div>
        <Dropdown menu={{ items }} placement="bottom" trigger={['click']}>
          <Button
            className="flex gap-2 items-center text-primary-7 border px-4 py-2 rounded-none border-solid border-primary-7"
            type="ghost"
          >
            <span className="text-primary-7">
              Revision {detail._rev} {latestRevision === detail._rev ? '(latest)' : ''}
            </span>
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </>
  );
}
