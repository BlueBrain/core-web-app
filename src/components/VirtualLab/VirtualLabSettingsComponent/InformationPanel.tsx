'use client';

import { Button, ConfigProvider, Form, Input, Spin } from 'antd';
import { useEffect, useState } from 'react';
import EditIcon from '@/components/icons/Edit';
import { VirtualLab } from '@/services/virtual-lab/types';
import { VALID_EMAIL_REGEXP } from '@/util/utils';

type Props = {
  virtualLab: VirtualLab;
  allowEdit: boolean;
  save: (update: Partial<VirtualLab>) => Promise<void>;
};

type InformationForm = { name: string; description: string; referenceEMail: string };

export default function InformationPanel({ virtualLab, allowEdit, save }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [submittable, setSubmittable] = useState(true);
  const [form] = Form.useForm<InformationForm>();

  const showEditPrompts = allowEdit && !editMode; // if editting is allowed, and user is not only in editting mode, we show edit prompts.

  const editButton = showEditPrompts && (
    <Button
      shape="circle"
      onClick={() => setEditMode(true)}
      icon={<EditIcon className="ml-2" style={{ color: '#BFBFBF' }} />}
      className="mt-1 border-none"
      title="Edit virtual lab information"
      aria-label="Edit virtual lab information"
    />
  );

  const onSave = () => {
    setSavingChanges(true);
    const { name, description, referenceEMail } = form.getFieldsValue();
    save({
      name,
      description,
      referenceEMail,
    })
      .then(() => {
        setSaveError(false);
      })
      .catch(() => {
        setSaveError(true);
        form.resetFields();
      })
      .finally(() => {
        setSavingChanges(false);
        setEditMode(false);
      });
  };

  const values = Form.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        setSubmittable(true);
      })
      .catch(() => {
        setSubmittable(false);
      });
  }, [form, values]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: 'transparent',
          colorBgContainerDisabled: 'transparent',
          colorBorder: 'transparent',
          colorTextDisabled: '#003A8C',
          colorText: '#003A8C',
          controlPaddingHorizontal: 0,
          lineWidth: 0,
          borderRadius: 0,
        },
        components: {
          Form: {
            verticalLabelPadding: 0,
            labelColor: '#BFBFBF',
          },
          Input: {
            paddingInline: 0,
            paddingBlock: 1,
            hoverBorderColor: 'transparent',
            addonBg: 'transparent',
            // Antd uses `fontSizeLG` when no suffix/prefix icons are shown, and `fontSize` when these icons are shown. In both these cases, we want the same font size for our UI.
            fontSize: 20,
            fontSizeLG: 20,
          },
          Button: {
            defaultShadow: 'none',
          },
        },
      }}
    >
      {savingChanges ? (
        <Spin data-testid="Saving changes" />
      ) : (
        <Form
          layout="vertical"
          form={form}
          requiredMark={false}
          initialValues={{
            name: virtualLab.name,
            referenceEMail: virtualLab.referenceEMail,
            description: virtualLab.description,
          }}
        >
          {saveError && <p className="text-error">There was an error in saving information.</p>}
          <Form.Item
            name="name"
            label="Lab Name"
            validateTrigger="onBlur"
            rules={[{ required: true }]}
            className={`w-full ${editMode ? 'border-b' : ''}`}
          >
            <Input
              readOnly={!editMode}
              className={`rounded-none font-bold ${editMode ? 'border border-gray-200 px-3' : ''}`}
              style={{ width: showEditPrompts ? `50%` : '100%' }}
              title={form.getFieldValue('name')}
              addonAfter={editButton}
              required
            />
          </Form.Item>

          <div className="flex items-center">
            <Form.Item name="description" label="Description" className="w-1/2">
              <Input.TextArea
                readOnly={!editMode}
                style={{
                  maxWidth: '700px',
                }}
                className={`rounded-none ${editMode ? 'border border-gray-200 px-3' : ''}`}
                title={form.getFieldValue('description')}
                placeholder="description"
                autoSize
              />
            </Form.Item>
            {editButton}
          </div>
          <Form.Item
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                pattern: VALID_EMAIL_REGEXP,
                message: 'Entered value is not the correct email format',
              },
            ]}
            name="referenceEMail"
            label="Reference Contact"
            className={`w-full ${editMode ? 'border-b' : ''}`}
          >
            <Input
              readOnly={!editMode}
              className={`rounded-none font-bold ${editMode ? 'border border-gray-200 px-3' : ''}`}
              style={{
                width: showEditPrompts ? `50%` : '100%',
              }}
              addonAfter={editButton}
              title={form.getFieldValue('referenceEmail')}
              type="email"
            />
          </Form.Item>

          {editMode && (
            <Form.Item>
              <div className="flex items-center justify-end">
                <Button
                  htmlType="button"
                  onClick={() => {
                    form.resetFields();
                    setEditMode(false);
                  }}
                  className="font-semibold text-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!submittable}
                  type="primary"
                  title="Save Changes"
                  htmlType="submit"
                  onClick={onSave}
                  className="h-14 w-40 rounded-none bg-green-600 font-semibold hover:bg-green-700"
                >
                  Save
                </Button>
              </div>
            </Form.Item>
          )}
        </Form>
      )}
    </ConfigProvider>
  );
}
