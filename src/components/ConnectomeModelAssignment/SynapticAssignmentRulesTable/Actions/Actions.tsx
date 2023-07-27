import { Button, Tooltip } from 'antd';

import { CopyOutlined, DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { isConfigEditableAtom } from '@/state/brain-model-config';
import { loadingAtom } from '@/components/ConnectomeModelAssignment/state';
import style from './actions.module.css';

export interface ActionsProps {
  ruleKey: string;
  editingRuleKey: string | undefined;
  onCancel(): void;
  onDuplicate(ruleKey: string): void;
  onDelete(ruleKey: string): void;
  onStartEditing(ruleKey: string): void;
  onValidateEdition(): void;
}

export default function Actions({
  ruleKey,
  editingRuleKey,
  onCancel,
  onDuplicate,
  onDelete,
  onStartEditing,
  onValidateEdition,
}: ActionsProps) {
  const loading = useAtomValue(loadingAtom);
  const isConfigEditable = useAtomValue(isConfigEditableAtom);

  let content = (
    <Button type="link" onClick={onCancel}>
      Cancel
    </Button>
  );

  if (editingRuleKey === ruleKey) {
    content = (
      <Button type="primary" onClick={onValidateEdition}>
        Confirm
      </Button>
    );
  } else if (!editingRuleKey) {
    content = (
      <div className={style.actions}>
        {isConfigEditable && (
          <>
            <CopyOutlined onClick={() => onDuplicate(ruleKey)} />
            <EditOutlined onClick={() => onStartEditing(ruleKey)} />
            <DeleteOutlined onClick={() => onDelete(ruleKey)} />
          </>
        )}
        {!isConfigEditable && (
          <Tooltip title="You can't modify rules on another user's configuration">
            <StopOutlined />
          </Tooltip>
        )}
      </div>
    );
  }

  return loading ? null : content;
}
