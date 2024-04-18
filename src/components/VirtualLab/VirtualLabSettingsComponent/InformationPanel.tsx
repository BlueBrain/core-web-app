import type { InputProps } from 'antd/lib/input/Input';
import type { TextAreaProps } from 'antd/lib/input/TextArea';
import { Button, ConfigProvider, Form, Input, Spin } from 'antd';
import type { FormItemProps } from 'antd/lib/form/FormItem';
import { ReactNode, useEffect, useState } from 'react';
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
  onSubmit: (update: Partial<VirtualLab>) => Promise<void>;
};

type InformationForm = { name: string; description: string; reference_email: string };

export const renderInput: (props: InputProps) => ReactNode = ({
  className,
  disabled,
  placeholder,
  readOnly,
  style,
  title,
  type,
  value,
}) => {
  return (
    <Input
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      readOnly={readOnly}
      required
      style={style}
      title={title}
      type={type}
      value={value}
    />
  );
};

export const renderTextArea: (props: TextAreaProps) => ReactNode = ({
  className,
  disabled,
  placeholder,
  readOnly,
  style,
  title,
  value,
}) => {
  return (
    <Input.TextArea
      disabled={disabled}
      placeholder={placeholder}
      autoSize
      required
      className={className}
      title={title}
      value={value}
      style={style}
      readOnly={readOnly}
    />
  );
};

export default function InformationPanel({
  allowEdit,
  className,
  initialValues,
  items,
  onSubmit,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [submittable, setSubmittable] = useState(true);
  const [form] = Form.useForm<InformationForm>();

  const showEditPrompts = allowEdit && !editMode; // if editting is allowed, and user is not only in editting mode, we show edit prompts.

  const onSave = () => {
    setSavingChanges(true);

    const { name, description, reference_email: referenceEmail } = form.getFieldsValue();

    onSubmit({
      name,
      description,
      reference_email: referenceEmail,
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
              Button: {
                colorBgContainer: '#00B212',
                colorBgContainerDisabled: '#00B212', // Same as colorBgContainer
                colorTextDisabled: '#262626',
              },
              Form: {
                labelColor: '#69C0FF',
                itemMarginBottom: 3,
                verticalLabelPadding: 0,
              },
              Input: {
                activeBg: 'transparent',
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
            className={classNames(
              'divide-y px-[28px]',
              editMode ? 'divide-white' : 'divide-primary-3',
              className
            )}
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
                    className={classNames(`w-full pb-1 pt-8`, editMode ? '' : '', itemClassName)}
                    required={required}
                  >
                    {children({
                      className: `${editMode ? 'font-bold' : ''}`,
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

            {editMode ? (
              <Form.Item className="col-span-2">
                <div className="my-4 flex items-center justify-end gap-2">
                  <Button
                    className="h-14 rounded-none bg-neutral-3 font-semibold text-neutral-7"
                    htmlType="button"
                    onClick={() => {
                      form.resetFields();
                      setEditMode(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="h-14 rounded-none font-semibold text-primary-8"
                    disabled={!submittable}
                    title="Save Changes"
                    htmlType="submit"
                    onClick={onSave}
                  >
                    Save
                  </Button>
                </div>
              </Form.Item>
            ) : (
              <div className="col-span-2 flex items-center justify-end gap-2 py-4">
                <Button
                  className="h-14 rounded-none bg-neutral-3 font-semibold text-neutral-7"
                  htmlType="button"
                  onClick={() => setEditMode(true)}
                >
                  Edit virtual lab information
                </Button>
              </div>
            )}
          </Form>
        </ConfigProvider>
      )}
    </ConfigProvider>
  );
}
