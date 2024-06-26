'use client';

import { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { useSession } from 'next-auth/react';
import { useForm } from 'antd/es/form/Form';
import postIssue from 'src/api/jira';
import useNotification from '@/hooks/notifications';

import styles from './feedback.module.scss';

export default function Feedback() {
  const [feedbackButton, setFeedbackButton] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const notify = useNotification();
  const { data: session } = useSession();

  const [form] = useForm();

  const handleCancel = () => {
    setFeedbackButton(true);
    setDescription('');
    setTitle('');
    form.resetFields();
  };

  const handleSubmit = async () => {
    const { pathname } = window.location;

    let userInfo = '';
    if (session?.user.username) userInfo += `Reported by: [~${session.user.username}]\n`;
    if (session?.user.email) userInfo += `email: ${session.user.email}\n\n`;

    const res = await postIssue({
      description: `${userInfo}path: ${pathname}\n\n${description}`,
      summary: title,
    });

    if (!res.ok) {
      notify.error("An error ocurred, couldn't post the issue");
      return;
    }

    handleCancel();
  };

  return (
    <>
      {!!feedbackButton && (
        <button
          type="button"
          onClick={() => setFeedbackButton(false)}
          className={styles.feedbackButton}
        >
          Feedback
        </button>
      )}

      <Modal
        open={!feedbackButton}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText="Submit"
        className={styles.feedbackModal}
      >
        <div style={{ maxWidth: '95%' }}>
          <Form form={form}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'The title is required.' }]}
            >
              <Input onChange={(v) => setTitle(v.currentTarget.value)} value={title} />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'The description is required.' }]}
            >
              <Input.TextArea
                className={styles.feedbackTextarea}
                onChange={(v) => setDescription(v.currentTarget.value)}
                value={description}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}
