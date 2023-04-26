import { Edit } from '@/types/connectome';

export default function MatrixModificationHistoryList({ edits }: { edits: Edit[] }) {
  console.log(edits);
  return (
    <div>
      <div>Modified connections</div>
      {edits.length === 0 && <div>(No modification saved yet)</div>}

      {edits.length > 0 &&
        edits.map((edit, i) => (
          <div key={i}>{edit.name}</div> // eslint-disable-line react/no-array-index-key
        ))}
    </div>
  );
}
