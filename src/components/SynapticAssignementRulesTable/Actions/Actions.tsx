import { Button } from 'antd';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { SynapticAssignementRule } from '../types';
import Styles from './actions.module.css';

export interface ActionsProps {
  rule: SynapticAssignementRule;
  ruleIndex: number;
  editing: boolean;
  rules: SynapticAssignementRule[];
  onRulesChange(rules: SynapticAssignementRule[]): void;
  onStartEditing(ruleIndex: number): void;
  onValidateEdition(ruleIndex: number): void;
}

export default function Actions({
  rule,
  ruleIndex,
  editing,
  rules,
  onRulesChange,
  onStartEditing,
  onValidateEdition,
}: ActionsProps) {
  if (editing) {
    return (
      <Button type="primary" onClick={() => onValidateEdition(ruleIndex)}>
        Confirm
      </Button>
    );
  }

  return (
    <div className={Styles.actions}>
      <CopyOutlined
        onClick={() =>
          onRulesChange([...rules.slice(0, ruleIndex), rule, ...rules.slice(ruleIndex)])
        }
      />
      <EditOutlined onClick={() => onStartEditing(ruleIndex)} />
      <DeleteOutlined
        onClick={() => onRulesChange(rules.filter((_rule, index) => ruleIndex !== index))}
      />
    </div>
  );
}
