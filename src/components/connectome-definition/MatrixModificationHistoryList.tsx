import { RollbackOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAtomValue, useSetAtom } from 'jotai';
import { useLoadable } from '@/hooks/hooks';

import {
  deleteEditsAtom,
  writingConfigAtom,
} from '@/state/brain-model-config/macro-connectome/setters';
import { editsLoadableAtom } from '@/state/brain-model-config/macro-connectome';

export default function MatrixModificationHistoryList({
  setSelected,
}: {
  setSelected: (selected: Set<string>) => void;
}) {
  const deleteEdits = useSetAtom(deleteEditsAtom);
  const edits = useLoadable(editsLoadableAtom, []);
  const writingConfig = useAtomValue(writingConfigAtom);

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
          for (let j = i + 1; j < edits.length; j += 1) {
            deletedEdits.push(j);
          }

          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="flex justify-between">
              <button onClick={() => setSelected(new Set(edit.selected))} type="button">
                {edit.name}
              </button>
              <div>
                {writingConfig && <LoadingOutlined className="mr-5" />}
                {i < edits.length - 1 && !writingConfig && (
                  <RollbackOutlined
                    className="mr-3"
                    onClick={() => deletedEdits.length > 0 && deleteEdits(deletedEdits)}
                  />
                )}

                {!writingConfig && (
                  <DeleteOutlined
                    className="mr-5"
                    onClick={() => {
                      deletedEdits.unshift(i);
                      deleteEdits(deletedEdits);
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
