import { useState } from 'react';

import { Button } from '../../../sub-components/Button';
import { Select } from '../../../sub-components/Select';
import { Form } from '../../../sub-components/Form';
import { ROLES } from '../../../constants';
import { NewMember, useNewMember } from './new-member-hook';
import IconPlus from '@/components/icons/Plus';
import { classNames } from '@/util/utils';
import { VirtualLabMember } from '@/services/virtual-lab/types';

import styles from './add-member.module.css';

export interface AddMemberProps {
  className?: string;
  onNew(member: VirtualLabMember): void;
}

export function AddMember({ className, onNew }: AddMemberProps) {
  const [valid, setValid] = useState(false);
  const [member, update, reset] = useNewMember();
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
      <Button onClick={handleClick} disabled={!valid}>
        <IconPlus /> <div>Add new member</div>
      </Button>
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
