import { Dispatch, SetStateAction } from 'react';
import { useAtomValue } from 'jotai';
import fetchArchive from '@/api/archive';
import Spinner from '@/components/Spinner';
import { ESResponseRaw } from '@/types/explore-section/resources';
import sessionAtom from '@/state/session';

type Props = {
  setFetching: Dispatch<SetStateAction<boolean>>;
  selectedRows: ESResponseRaw[];
  clearSelectedRows: () => void;
  fetching: boolean;
};

export default function DownloadButton({
  setFetching,
  selectedRows,
  clearSelectedRows,
  fetching,
}: Props) {
  const session = useAtomValue(sessionAtom);
  if (!session || selectedRows.length < 1) return null;

  return (
    <div className="sticky bottom-0 flex justify-end">
      <button
        className="bg-primary-8 flex gap-2 items-center justify-between font-bold px-7 py-4 rounded-none text-white"
        onClick={() => {
          setFetching(true);

          fetchArchive(
            selectedRows.map((x) => x._source._self),
            session,
            clearSelectedRows
          );
        }}
        type="button"
      >
        <span>{`Download ${selectedRows.length === 1 ? 'Resource' : 'Resources'} (${
          selectedRows.length
        })`}</span>
        {fetching && <Spinner className="h-6 w-6" />}
      </button>
    </div>
  );
}
