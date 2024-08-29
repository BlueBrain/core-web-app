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
        rules={[
          { required: true, message: 'Please input the project name!' },
          { max: 80, message: 'Project name cannot exceed 80 characters' },
        ]}
        required
      >
        <Input name="name" placeholder="Enter project name" />
      </Form.Item>

      <Form.Item
        className={styles.inputField}
        name="description"
        label="PROJECT DESCRIPTION"
        style={{ borderBottom: 'solid 1px #69C0FF' }}
        rules={[{ max: 280, message: 'Project description cannot exceed 280 characters' }]}
      >
        <Input.TextArea name="description" placeholder="Enter project description" />
      </Form.Item>
    </>
  );
}
