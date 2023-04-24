import { Button, Dropdown, MenuProps } from 'antd';
import range from 'lodash/range';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { DeltaResource } from '@/types/explore-section';

export default function DetailHeaderName({
  detail,
  url,
  latestRevision,
}: {
  detail: DeltaResource;
  url?: string | null;
  latestRevision: number | null;
}) {
  const router = useRouter();
  // revisions builder
  const items: MenuProps['items'] = useMemo(() => {
    if (latestRevision) {
      return range(latestRevision, 0).map((revision: number) => ({
        key: revision,
        label: (
          <a style={{ color: '#0050B3' }} rel="noopener noreferrer" href={`${url}?rev=${revision}`}>
            Revision {revision} {latestRevision === revision ? '(latest)' : ''}
          </a>
        ),
      }));
    }
    return [];
  }, [latestRevision, router, url]);

  return (
    <>
      <div className="text-xs font-thin text-primary-7">Name</div>
      <div className="flex flex-row gap-5 items-center">
        <div className="font-bold text-xl text-primary-7">{detail?.name}</div>
        <Dropdown menu={{ items }} placement="bottom" trigger={['click']}>
          <Button type="ghost">
            <div className="flex flex-row gap-4 items-center text-primary-7">
              Revision {detail._rev} {latestRevision === detail._rev ? '(latest)' : ''}
              <DownOutlined />
            </div>
          </Button>
        </Dropdown>
      </div>
    </>
  );
}
