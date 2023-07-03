import { Button } from 'antd';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import Styles from './actions.module.css';

export interface ActionsProps {
  ruleIndex: number;
  editing: boolean;
  onDuplicate(ruleIndex: number): void;
  onDelete(ruleIndex: number): void;
  onStartEditing(ruleIndex: number): void;
  onValidateEdition(): void;
}

export default function Actions({
  ruleIndex,
  editing,
  onDuplicate,
  onDelete,
  onStartEditing,
  onValidateEdition,
}: ActionsProps) {
  if (editing) {
    return (
      <Button type="primary" onClick={() => onValidateEdition()}>
        Confirm
      </Button>
    );
  }

  return (
    <div className={Styles.actions}>
      <CopyOutlined onClick={() => onDuplicate(ruleIndex)} />
      <EditOutlined onClick={() => onStartEditing(ruleIndex)} />
      <DeleteOutlined onClick={() => onDelete(ruleIndex)} />
    </div>
  );
}
