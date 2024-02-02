import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAtomValue, useSetAtom } from 'jotai';
import { useLoadable } from '@/hooks/hooks';

import {
  applyEditsAtom,
  writingConfigAtom,
} from '@/state/brain-model-config/macro-connectome/setters';
import { editsLoadableAtom } from '@/state/brain-model-config/macro-connectome';
import {
  editNameAtom,
  offsetAtom,
  multiplierAtom,
  currentEditIdxAtom,
} from '@/components/connectome-definition/macro/state';

export default function MatrixModificationHistoryList() {
  const applyEdits = useSetAtom(applyEditsAtom);
  const edits = useLoadable(editsLoadableAtom, []);
  const writingConfig = useAtomValue(writingConfigAtom);
  const setEditName = useSetAtom(editNameAtom);
  const setOffset = useSetAtom(offsetAtom);
  const setMultiplier = useSetAtom(multiplierAtom);
  const setCurrentEdit = useSetAtom(currentEditIdxAtom);

  return (
    <div>
      <div className="text-lg font-bold">
        Modified connections
        {edits.length > 0 && (
          <span className="ml-3 inline-block text-base">
            {edits.length} <span className="ml-0.5 inline-block text-neutral-4">modifications</span>
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
                    onClick={() => applyEdits(edits.filter((_, idx) => idx !== i))}
                  />
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
