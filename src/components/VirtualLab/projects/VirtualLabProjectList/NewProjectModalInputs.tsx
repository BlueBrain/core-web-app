import { Form, Input } from 'antd';
import { useSetAtom } from 'jotai';
import { useAssertAtomInitialized } from '@/state/state';
import styles from './new-project-modal-inputs.module.scss';

export default function NewProjectModalInputs() {
  const atom = useAssertAtomInitialized<boolean>('new-project-submit-disabled');
  const setSubmitButtonDisabled = useSetAtom(atom);

  return (
    <>
      <Form.Item
        className={styles.inputField}
        name="name"
        label="PROJECT NAME"
        style={{ borderBottom: 'solid 1px #69C0FF', position: 'relative' }}
        rules={[{ required: true, message: 'Please input the project name!' }]}
        required
      >
        <Input
          maxLength={80}
          name="name"
          placeholder="Type the project name here..."
          onInput={(e) => setSubmitButtonDisabled(!e.currentTarget.value)}
        />
      </Form.Item>

      <Form.Item
        className={styles.inputField}
        name="description"
        label="PROJECT DESCRIPTION"
        style={{ borderBottom: 'solid 1px #69C0FF' }}
      >
        <Input.TextArea
          maxLength={288}
          name="description"
          placeholder="Type the project description here..."
        />
      </Form.Item>
    </>
  );
}
