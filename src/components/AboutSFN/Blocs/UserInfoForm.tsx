import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';

import downloadFileByHref from '@/util/downloadFileByHref';
import { SingleDocumentProps } from '@/types/about/document-download';
import { classNames } from '@/util/utils';
import { basePath } from '@/config';

type ContactData = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function UserInfoForm({
  content,
  setFormOpen,
}: {
  content: SingleDocumentProps;
  setFormOpen: (value: boolean) => void;
}) {
  const [form] = Form.useForm();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (values: ContactData) => {
    setStatus('loading');
    try {
      const response = await fetch(`${basePath}/api/marketing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        }),
      });

      if (response.ok) {
        setStatus('success');
        downloadFileByHref(content.url, `${content.file}.pdf`);
        form.resetFields();
        setFormOpen(false);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <Form
      form={form}
      name="marketing-form"
      className="relative flex h-full w-full flex-col justify-between bg-white"
      layout="vertical"
      requiredMark={false}
      onFinish={handleSubmit}
    >
      <div className="relative flex flex-col gap-y-6">
        <header className="relative mb-8 flex w-full flex-col md:mb-4 xl:mb-8">
          <div className="mb-2 text-4xl font-bold text-primary-8">Download {content.name}</div>
          <p className="font-sans text-lg font-light leading-normal text-primary-8">
            {content.description}
          </p>
        </header>
        <div className="flex flex-col gap-y-8">
          <div className="relative contents w-full grid-cols-2 gap-x-12 font-sans xl:grid">
            <Form.Item
              label={
                <span className="relative text-base font-light uppercase tracking-wide text-primary-8">
                  First name
                  <span className="text-red-600"> *</span>
                </span>
              }
              rules={[{ required: true, message: 'Please provide the first name!' }]}
              validateTrigger="onBlur"
              name="firstName"
            >
              <Input
                type="text"
                placeholder="First name"
                size="large"
                className="rounded-none border-0 !border-b border-neutral-3 !font-bold !text-primary-8  placeholder:!font-light"
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: 'Please provide the last name!' }]}
              validateTrigger="onBlur"
              name="lastName"
              label={
                <span className="relative text-base font-light uppercase tracking-wide text-primary-8">
                  Last name
                  <span className="text-red-600"> *</span>
                </span>
              }
            >
              <Input
                type="text"
                placeholder="Last name"
                size="large"
                className="rounded-none border-0 !border-b border-neutral-3 !font-bold !text-primary-8  placeholder:!font-light"
              />
            </Form.Item>
          </div>
          <Form.Item
            rules={[{ required: true, message: 'Please provide an email!' }]}
            validateTrigger="onBlur"
            name="email"
            label={
              <span className="relative text-base font-light uppercase tracking-wide text-primary-8">
                Last name
                <span className="text-red-600"> *</span>
              </span>
            }
          >
            <Input
              type="email"
              placeholder="obp@example.ch"
              size="large"
              className="rounded-none border-0 !border-b border-neutral-3 !font-light !text-primary-8  placeholder:!font-light"
            />
          </Form.Item>
        </div>
      </div>
      <div className="relative mt-4 flex flex-col gap-y-2 md:mt-10 xl:mt-4">
        <p className="font-sans text-base font-light leading-normal text-primary-8">
          By submitting this form, you agree to receive information from the Blue Brain Project.
        </p>
        <button
          type="submit"
          className={classNames(
            'relative bg-primary-8 py-6 text-base font-bold uppercase tracking-wider text-white',
            'flex items-center justify-center gap-4'
          )}
        >
          {status === 'loading' && <LoadingOutlined spin className="text-white" />}
          <span>Download PDF</span>
        </button>
        {status === 'error' && (
          <p className="font-light text-red-600">
            We encountered an issue with your submission. Please verify the form, and try again. If
            the problem persists, feel free to contact us.
          </p>
        )}
      </div>
    </Form>
  );
}
