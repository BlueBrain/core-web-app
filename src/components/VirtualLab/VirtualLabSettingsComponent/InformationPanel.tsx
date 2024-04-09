import { Button, ConfigProvider, Form, Spin } from 'antd';
import type { FormItemProps } from 'antd/lib/form/FormItem';
import type { InputProps } from 'antd/lib/input/Input';
import type { TextAreaProps } from 'antd/lib/input/TextArea';
import { ReactNode, useEffect, useState } from 'react';
import EditIcon from '@/components/icons/Edit';
import { classNames } from '@/util/utils';
import { MockBilling, VirtualLab } from '@/types/virtual-lab/lab';

type RenderInputProps = Omit<FormItemProps, 'children'> & {
  children: (props: InputProps & TextAreaProps) => ReactNode;
  type?: string;
};

type Props = {
  allowEdit: boolean;
  className?: string;
  initialValues: Partial<VirtualLab> | MockBilling;
  items: Array<RenderInputProps>;
  save: (update: Partial<VirtualLab>) => Promise<void>;
};

type InformationForm = { name: string; description: string; reference_email: string };

export default function InformationPanel({
  allowEdit,
  className,
  initialValues,
  items,
  save,
}: Props) {
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, description, reference_email } = form.getFieldsValue();
    save({
      name,
      description,
      reference_email,
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
        components: {
          Button: {
            defaultShadow: 'none',
          },
        },
      }}
    >
      {savingChanges ? (
        <Spin data-testid="Saving changes" />
      ) : (
        <ConfigProvider
          theme={{
            components: {
              Form: {
                labelColor: '#69C0FF',
                itemMarginBottom: 3,
                verticalLabelPadding: 0,
              },
              Input: {
                activeBg: 'transparent',
                addonBg: 'transparent',
                borderRadius: 0,
                colorBgContainer: 'transparent',
                colorBorder: 'transparent',
                colorText: '#fff',
                colorTextDisabled: '#fff',
                colorTextPlaceholder: '#8C8C8C',
                // Antd uses `fontSizeLG` when no suffix/prefix icons are shown, and `fontSize` when these icons are shown. In both these cases, we want the same font size for our UI.
                fontSize: 16,
                fontSizeLG: 16,
                hoverBorderColor: 'transparent',
                paddingInline: 0,
                paddingBlock: 0,
              },
            },
          }}
        >
          <Form
            className={classNames('divide-y divide-primary-3 px-[28px]', className)}
            layout="vertical"
            form={form}
            requiredMark={false}
            initialValues={initialValues}
          >
            {saveError && <p className="text-error">There was an error in saving information.</p>}
            {items.map(
              ({ className: itemClassName, children, label, name, required, rules, type }) => {
                return (
                  <Form.Item
                    key={name}
                    name={name}
                    label={required ? `${label}*` : label}
                    validateTrigger="onBlur"
                    rules={[{ ...rules, required }]}
                    className={classNames(
                      `w-full pb-1 pt-8`,
                      editMode ? 'border-b' : '',
                      itemClassName
                    )}
                    required={required}
                  >
                    {children({
                      addonAfter: editButton,
                      className: `${editMode ? 'font-bold border border-gray-200 px-3' : ''}`,
                      disabled: !editMode,
                      placeholder: `${label}...`, // TODO: Come up with a system for more intelligent placeholder text
                      readOnly: !editMode,
                      style: { fontWeight: 'light', width: showEditPrompts ? `50%` : '100%' }, // TODO: Check whether this breaks the layout
                      title: form.getFieldValue(name),
                      type, // TODO: I'm not sure that "type" is actually being attached to the rendered Input (see "email")
                    })}
                  </Form.Item>
                );
              }
            )}

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
        </ConfigProvider>
      )}
    </ConfigProvider>
  );
}
