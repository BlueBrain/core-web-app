import { Dropdown, MenuProps, Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { DownloadOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import range from 'lodash/range';
import { loadable } from 'jotai/utils';
import { useParams } from 'next/navigation';
import BookmarkButton from './BookmarkButton';
import { latestRevisionFamily } from '@/state/explore-section/detail-view-atoms';
import Link from '@/components/Link';
import { InteractiveViewIcon } from '@/components/icons';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import usePathname from '@/hooks/pathname';
import fetchArchive from '@/api/archive';
import sessionAtom from '@/state/session';
import { ExperimentTypeNames } from '@/constants/explore-section/data-types/experiment-data-types';
import { EntityResource } from '@/types/nexus';

export default function DetailHeaderName({
  detail,
  url,
  withRevision,
}: {
  detail: EntityResource;
  url?: string | null;
  withRevision?: boolean;
}) {
  const resourceInfo = useResourceInfoFromPath();
  const path = usePathname();
  const latestRevision = useAtomValue(
    useMemo(() => loadable(latestRevisionFamily(resourceInfo)), [resourceInfo])
  );
  const simCampMatch = path?.match(/\/explore\/simulation-campaigns\/[a-zA-Z0-9=]*/g);
  const isSimCampDetail = simCampMatch && path === simCampMatch[0];

  const session = useAtomValue(sessionAtom);
  const [fetching, setFetching] = useState<boolean>(false);

  const { virtualLabId, projectId, experimentType } = useParams<{
    virtualLabId?: string;
    projectId?: string;
    experimentType?: ExperimentTypeNames;
  }>();

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
      <div className="text font-thin">Name</div>
      <div className="flex  justify-between">
        <div className="flex items-center gap-5">
          <div className="text-2xl font-bold">{detail?.name}</div>
          {withRevision && (
            <Dropdown
              menu={{ items }}
              placement="bottom"
              trigger={['click']}
              disabled={items.length < 2}
            >
              <button
                type="button"
                className="flex w-fit items-center gap-2 border border-primary-7 px-4 py-2"
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
        {session && (
          <div className="flex">
            {virtualLabId && projectId && experimentType && (
              <BookmarkButton
                virtualLabId={virtualLabId}
                projectId={projectId}
                resourceId={detail['@id']}
                experimentType={experimentType}
              />
            )}
            <div className="flex items-center gap-2">
              Download
              {fetching ? (
                <Spin
                  className="border border-neutral-2 px-3 py-2"
                  indicator={<LoadingOutlined />}
                />
              ) : (
                <DownloadOutlined
                  className="border border-neutral-2 px-4 py-3"
                  onClick={() => {
                    setFetching(true);
                    fetchArchive([detail._self], session, () => setFetching(false));
                  }}
                />
              )}
            </div>
          </div>
        )}

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
