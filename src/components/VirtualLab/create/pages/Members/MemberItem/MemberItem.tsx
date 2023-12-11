import React from 'react';
import { DeleteFilled } from '@ant-design/icons';

import { Avatar } from '../../../sub-components/Avatar';
import { ROLES } from '../../../constants';
import { classNames } from '@/util/utils';
import { VirtualLabMember } from '@/services/virtual-lab/types';

import styles from './member-item.module.css';

export interface MemberItemProps {
  className?: string;
  value: VirtualLabMember;
  readonly?: boolean;
  onDelete(value: VirtualLabMember): void;
}

export function MemberItem({ className, value, readonly = false, onDelete }: MemberItemProps) {
  return (
    <div className={classNames(styles.main, className)}>
      <Avatar email={value.email} />
      <div className={styles.name}>{value.name}</div>
      <div className={styles.email}>{value.email}</div>
      <div className={styles.role}>{ROLES[value.role]}</div>
      {!readonly && (
        <button type="button" onClick={() => onDelete(value)} aria-label="Delete member">
          <DeleteFilled />
        </button>
      )}
    </div>
  );
}
