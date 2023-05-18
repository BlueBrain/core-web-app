import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAtomValue, useSetAtom } from 'jotai';
import { useLoadable } from '@/hooks/hooks';

import {
  setEditsAtom,
  writingConfigAtom,
} from '@/state/brain-model-config/macro-connectome/setters';
import {
  editsLoadableAtom,
  editNameAtom,
  offsetAtom,
  multiplierAtom,
  currentEditAtom,
} from '@/state/brain-model-config/macro-connectome';

export default function MatrixModificationHistoryList() {
  const setEdits = useSetAtom(setEditsAtom);
  const edits = useLoadable(editsLoadableAtom, []);
  const writingConfig = useAtomValue(writingConfigAtom);
  const setEditName = useSetAtom(editNameAtom);
  const setOffset = useSetAtom(offsetAtom);
  const setMultiplier = useSetAtom(multiplierAtom);
  const setCurrentEdit = useSetAtom(currentEditAtom);

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
        // eslint-disable-next-line arrow-body-style
        edits.map((edit, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="flex justify-between">
              <button
                onClick={() => {
                  setEditName(edit.name);
                  setOffset(edit.offset);
                  setMultiplier(edit.multiplier);
                  setCurrentEdit(i);
                }}
                type="button"
              >
                {edit.name}
              </button>
              <div>
                {writingConfig && <LoadingOutlined className="mr-5" />}

                {!writingConfig && (
                  <DeleteOutlined
                    className="mr-5"
                    onClick={() => {
                      const updatedEdits = [
                        ...edits.slice(0, i),
                        ...edits.slice(i + 1, edits.length),
                      ];
                      setEdits(updatedEdits);
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
