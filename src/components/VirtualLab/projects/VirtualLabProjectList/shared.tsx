import { Form, Input } from 'antd';
import { ComponentProps, ReactElement } from 'react';
import { atom } from 'jotai';

export type InvitedMember = {
  email: string;
  role: 'admin' | 'member';
};

export const selectedMembersAtom = atom<InvitedMember[]>([]);

// This type extends the Form.Item props to make children a render-prop,
// and to require both the label and name props.
type ModalInputProps = Omit<ComponentProps<typeof Form.Item>, 'children' | 'label' | 'name'> & {
  children: (
    props: ComponentProps<typeof Input | typeof Input.TextArea>
  ) => ReactElement<typeof Input | typeof Input.TextArea>;
  label: string;
  name: string;
};

export const formItems: Array<ModalInputProps> = [
  {
    children: (props) => <Input maxLength={80} {...(props as ComponentProps<typeof Input>)} />, // eslint-disable-line react/jsx-props-no-spreading
    label: 'PROJECT NAME',
    name: 'name',
    required: true,
  },
  {
    children: (props) => (
      <Input.TextArea maxLength={288} {...(props as ComponentProps<typeof Input.TextArea>)} /> // eslint-disable-line react/jsx-props-no-spreading
    ),
    label: 'PROJECT DESCRIPTION',
    name: 'description',
  },
];

export function NewProjectModalInput({
  children,
  label,
  name,
  required,
}: ModalInputProps): ReactElement<typeof Form.Item> {
  return (
    <Form.Item
      key={name}
      name={name}
      label={label}
      style={{ borderBottom: 'solid 1px #69C0FF' }}
      required
    >
      {children({
        name,
        required,
        placeholder: `Type the ${label?.toLowerCase()} here...`,
      })}
    </Form.Item>
  );
}
