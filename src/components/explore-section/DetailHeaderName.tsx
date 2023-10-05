import { Dropdown, MenuProps, Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import range from 'lodash/range';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { loadable } from 'jotai/utils';
import { latestRevisionAtom } from '@/state/explore-section/detail-view-atoms';
import { DeltaResource } from '@/types/explore-section/resources';
import Link from '@/components/Link';
import { InteractiveViewIcon } from '@/components/icons';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import usePathname from '@/hooks/pathname';

export default function DetailHeaderName({
  detail,
  url,
  withRevision,
}: {
  detail: DeltaResource;
  url?: string | null;
  withRevision?: boolean;
}) {
  const resourceInfo = useResourceInfoFromPath();
  const path = usePathname();
  const latestRevision = useAtomValue(
    useMemo(() => loadable(latestRevisionAtom(resourceInfo)), [resourceInfo])
  );
  const simCampMatch = path?.match(/\/explore\/simulation-campaigns\/[a-zA-Z0-9=]*/g);
  const isSimCampDetail = simCampMatch && path === simCampMatch[0];

  // revisions builder
  const items: MenuProps['items'] = useMemo(() => {
    if (latestRevision.state === 'hasData' && latestRevision.data && url) {
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
      <div className="flex  justify-between">
        <div className="flex items-center gap-5">
          <div className="font-bold text-xl">{detail?.name}</div>
          {withRevision && (
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
          )}
        </div>
        {isSimCampDetail && (
          <div className="flex gap-2">
            <Link href={`${path}/experiment-interactive`} className="flex items-center gap-2">
              Browse through interactive view
              <div className="border border-neutral-4 p-2 text-primary-7">
                <InteractiveViewIcon />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
