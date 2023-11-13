import { ReactNode, useState } from 'react';
import { useAtomValue } from 'jotai';
import fetchArchive from '@/api/archive';
import sessionAtom from '@/state/session';
import { RenderButtonProps } from '@/components/explore-section/ExploreSectionListingView/WithRowSelection';
import { Btn } from '@/components/Btn';

export function ExploreDownloadButton({
  children,
  clearSelectedRows,
  selectedRows,
}: RenderButtonProps & { children: ReactNode }) {
  const session = useAtomValue(sessionAtom);

  const [fetching, setFetching] = useState<boolean>(false);

  return session ? (
    <Btn
      className="bg-primary-8 sticky bottom-0 ml-auto fit-content w-fit"
      loading={fetching}
      ariaLabel="download-resources-button"
      onClick={() => {
        if (selectedRows.length) {
          setFetching(true);
          fetchArchive(
            selectedRows.map((x) => x._source._self),
            session,
            () => {
              setFetching(false);
              clearSelectedRows();
            }
          );
        }
      }}
    >
      {children}
    </Btn>
  ) : null;
}
