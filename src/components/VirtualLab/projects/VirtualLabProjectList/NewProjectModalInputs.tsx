import { Form, Input } from 'antd';
import authFetch from '@/authFetch';
import { virtualLabApi } from '@/config';
import styles from './new-project-modal-inputs.module.scss';

export default function NewProjectModalInputs({ vlabId }: { vlabId: string }) {
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
          {
            validator: async (_: any, name: string) => {
              const res = await authFetch(
                `${virtualLabApi.url}/virtual-labs/${vlabId}/projects/_check?q=${name}`
              );

              if (res.ok) {
                const data = await res.json();

                if (data.data.exist) {
                  return Promise.reject(new Error(`A project by the name ${name} already exists`));
                }
                return Promise.resolve();
              }
            },
          },
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
