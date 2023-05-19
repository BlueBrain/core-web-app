import { PrimitiveAtom, useAtom } from 'jotai';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';

import { useRef, useState } from 'react';
import { ExpDesignerGroupParameter } from '@/types/experiment-designer';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerGroupParameter>;
};

const groupNameStyle = `mx-[10px] my-[5px] text-primary-7 bg-primary-1 p-2 font-bold grow truncate rounded`;

export default function NameGroupEditor({ paramAtom }: Props) {
  const [groupInfo, setGroupInfo] = useAtom(paramAtom);
  const [isEditing, setIsEditing] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const onChanged = () => {
    if (!nameRef.current) return;

    const name = nameRef.current.value;
    setGroupInfo((oldAtomData) => ({
      ...oldAtomData,
      name,
    }));
  };

  return (
    <div className="flex w-1/2">
      {!isEditing && (
        <>
          <div className={groupNameStyle}>{groupInfo.name}</div>
          <button type="button" onClick={() => setIsEditing(true)}>
            <EditOutlined />
          </button>
        </>
      )}
      {isEditing && (
        <>
          <div className={groupNameStyle}>
            <input type="text" defaultValue={groupInfo.name} ref={nameRef} />
          </div>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              onChanged();
            }}
          >
            <CheckOutlined />
          </button>
        </>
      )}
    </div>
  );
}
