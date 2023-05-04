import { RollbackOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import { MacroConnectomeEditEntry as Edit } from '@/types/connectome';

import { deleteEdits as deleteEditsAtom } from '@/state/brain-model-config/macro-connectome/setters';

export default function MatrixModificationHistoryList({ edits }: { edits: Edit[] }) {
  const deleteEdits = useSetAtom(deleteEditsAtom);

  return (
    <div>
      <div className="text-lg font-bold">
        Modified connections
        {edits.length > 0 && (
          <span className="inline-block text-base ml-3">
            {edits.length} <span className="inline-block ml-0.5 text-neutral-4">modifications</span>
          </span>
        )}
      </div>
      {edits.length === 0 && <div>(No modification saved yet)</div>}

      {edits.length > 0 &&
        edits.map((edit, i) => {
          const deletedEdits: number[] = [];
          for (let j = i; j < edits.length; j += 1) {
            deletedEdits.push(j);
          }

          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i}>
              {edit.name}
              <RollbackOutlined className="float-right" onClick={() => deleteEdits(deletedEdits)} />
            </div>
          );
        })}
    </div>
  );
}
