import { HTMLProps, ReactNode, useState } from 'react';
import { useAtomValue } from 'jotai';
import Spinner from '@/components/Spinner';
import fetchArchive from '@/api/archive';
import sessionAtom from '@/state/session';
import { ESResponseRaw } from '@/types/explore-section/resources';

export default function DownloadButton({
  children,
  fetching,
  onClick,
}: HTMLProps<HTMLButtonElement> & { fetching: boolean }) {
  return (
    <div className="sticky bottom-0 flex justify-end">
      <button
        className="bg-primary-8 flex gap-2 items-center justify-between font-bold px-7 py-4 rounded-none text-white"
        onClick={onClick}
        type="button"
      >
        {children}
        {fetching && <Spinner className="h-6 w-6" />}
      </button>
    </div>
  );
}

export type RenderButtonProps = {
  selectedRows: ESResponseRaw[];
  clearSelectedRows: () => void;
};

export function ExploreDownloadButton({
  children,
  clearSelectedRows,
  selectedRows,
}: RenderButtonProps & { children: ReactNode }) {
  const session = useAtomValue(sessionAtom);

  const [fetching, setFetching] = useState<boolean>(false);

  return session ? (
    <DownloadButton
      fetching={fetching}
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
    </DownloadButton>
  ) : null;
}
