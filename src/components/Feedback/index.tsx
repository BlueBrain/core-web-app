import { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { useSession } from 'next-auth/react';
import postIssue from 'src/api/jira';
import useNotification from '@/hooks/notifications';

import styles from './feedback.module.scss';

export default function Feedback() {
  const [feedbackButton, setFeedbackButton] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const notify = useNotification();
  const { data: session } = useSession();

  const handleCancel = () => {
    setFeedbackButton(true);
    setDescription('');
    setTitle('');
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
          <Form initialValues={{ remember: false }}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please input the title' }]}
            >
              <Input onChange={(v) => setDescription(v.currentTarget.value)} value={title} />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Description required' }]}
            >
              <Input.TextArea
                className={styles.feedbackTextarea}
                onChange={(v) => setTitle(v.currentTarget.value)}
                value={description}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}
