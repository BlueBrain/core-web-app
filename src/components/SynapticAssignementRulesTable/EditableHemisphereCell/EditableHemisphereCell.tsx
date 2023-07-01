/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';

import { SynapticAssignementRule } from '../types';
import HemiSphereButton from './HemiSphereButton';
import RightHemisphere from '@/components/right-hemisphere';
import LeftHemisphere from '@/components/left-hemisphere';
import Style from './editable-hemisphere-cell.module.css';

interface EditableHemisphereProps {
  editing: boolean;
  field: keyof SynapticAssignementRule;
  rule: SynapticAssignementRule | null;
  content: string | null;
}

// eslint-disable-next-line react/function-component-definition
export default function EditableHemisphereCell({
  editing,
  field,
  rule,
  content,
}: EditableHemisphereProps) {
  const [value, setValue] = useState('<INIT>');
  useEffect(() => {
    if (!rule) {
      setValue('<null>');
      return;
    }
    setValue(rule[field] ?? '');
  }, [rule, field]);
  const update = (newValue: 'left' | 'right') => {
    setValue(newValue);
    // eslint-disable-next-line no-param-reassign
    if (rule) rule[field] = newValue;
  };
  if (!rule || !editing) {
    return (
      <div className={Style.editableHemisphereCell}>
        <div className={content === 'left' ? Style.selected : Style.unselected}>
          <LeftHemisphere />
        </div>
        <div className={content === 'right' ? Style.selected : Style.unselected}>
          <RightHemisphere />
        </div>
      </div>
    );
  }
  return (
    <div className={Style.editableHemisphereCell}>
      <HemiSphereButton type="left" value={value} onClick={update} />
      <HemiSphereButton type="right" value={value} onClick={update} />
    </div>
  );
}
