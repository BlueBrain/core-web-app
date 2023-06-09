import { PrimitiveAtom, useAtom } from 'jotai';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ExpDesignerGroupParameter } from '@/types/experiment-designer';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerGroupParameter>;
  namePrefix: string;
  groupIndex: number;
};

const groupNameStyle = `mx-[10px] my-[5px] text-primary-7 bg-primary-1 p-2 font-bold grow truncate rounded`;

export default function NameGroupEditor({ paramAtom, namePrefix, groupIndex }: Props) {
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

  // get the new name if above or below group was deleted or the manual setted one.
  const groupName = useMemo(() => {
    const base1Index = groupIndex + 1;
    if (
      groupInfo.name === '' ||
      groupInfo.name === namePrefix + (base1Index + 1) ||
      groupInfo.name === namePrefix + (base1Index - 1)
    ) {
      return namePrefix + base1Index;
    }
    return groupInfo.name;
  }, [groupInfo.name, groupIndex]);

  useEffect(() => {
    if (groupInfo.name === groupName) return;

    setGroupInfo((oldAtomData) => ({
      ...oldAtomData,
      name: groupName,
    }));
  }, [groupName, groupInfo.name, setGroupInfo]);

  return (
    <div className="flex w-1/2">
      {!isEditing && (
        <>
          <div className={groupNameStyle}>{groupName}</div>
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
