import { Button } from 'antd';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { loadingAtom } from '@/components/ConnectomeModelAssignment/state';
import Styles from './actions.module.css';

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
  if (loading) return null;

  if (!editingRuleKey) {
    return (
      <div className={Styles.actions}>
        <CopyOutlined onClick={() => onDuplicate(ruleKey)} />
        <EditOutlined onClick={() => onStartEditing(ruleKey)} />
        <DeleteOutlined onClick={() => onDelete(ruleKey)} />
      </div>
    );
  }

  if (editingRuleKey === ruleKey) {
    return (
      <Button type="primary" onClick={onValidateEdition}>
        Confirm
      </Button>
    );
  }

  return (
    <Button type="link" onClick={onCancel}>
      Cancel
    </Button>
  );
}
