import { useState } from 'react';

import { NewMember, useNewMember } from './new-member-hook';
import { ROLES } from '@virtual-lab-create/constants';
import { Button } from '@virtual-lab-create/sub-components/Button';
import { Select } from '@virtual-lab-create/sub-components/Select';
import { Form } from '@virtual-lab-create/sub-components/Form';
import IconPlus from '@/components/icons/Plus';
import { classNames } from '@/util/utils';
import { VirtualLabMember } from '@/services/virtual-lab/types';

import styles from './add-member.module.css';

export interface AddMemberProps {
  className?: string;
  currentMembersEmails: string[];
  onNew(member: VirtualLabMember): void;
}

export function AddMember({ className, currentMembersEmails, onNew }: AddMemberProps) {
  const [valid, setValid] = useState(false);
  const [member, update, reset] = useNewMember();
  const emailAlreadyExists = currentMembersEmails.includes(member.email);
  const handleClick = () => {
    const newMember = makeVirtualLabMember(member);
    onNew(newMember);
    reset();
  };
  return (
    <Form
      className={classNames(styles.main, className)}
      value={member}
      onChange={update}
      onValidityChange={setValid}
      fields={FIELDS}
    >
      <Select
        label="Role"
        placeholder="Member's role"
        value={member.role}
        onChange={(role) => update({ role })}
        options={ROLES}
      />
      <Button onClick={handleClick} disabled={emailAlreadyExists || !valid}>
        <IconPlus /> <div>Add new member</div>
      </Button>
      {emailAlreadyExists && (
        <div className={styles.error}>There is already a member with this email!</div>
      )}
    </Form>
  );
}

const RX_NAME = '[\\p{L}].*';

const FIELDS = {
  firstname: {
    label: 'First Name',
    required: true,
    placeholder: "Member's first name",
    pattern: RX_NAME,
  },
  lastname: {
    label: 'Last Name',
    required: true,
    placeholder: "Member's last name",
    pattern: RX_NAME,
  },
  email: { type: 'email', label: 'EMail', required: true, placeholder: "Member's email" },
};

function makeVirtualLabMember(member: NewMember): VirtualLabMember {
  return {
    name: `${member.firstname} ${member.lastname}`.trim(),
    email: member.email,
    role: member.role,
  };
}
