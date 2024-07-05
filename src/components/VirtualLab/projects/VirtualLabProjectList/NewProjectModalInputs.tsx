import { Form, Input } from 'antd';
import styles from './new-project-modal-inputs.module.scss';

export default function NewProjectModalInputs() {
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
        <Input maxLength={80} name="name" placeholder="Type the project name here..." />
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
