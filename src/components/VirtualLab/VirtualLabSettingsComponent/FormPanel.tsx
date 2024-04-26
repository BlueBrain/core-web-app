import { ReactNode, useState } from 'react';
import { Button, ConfigProvider, Form, Input, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button/button';
import { FormProps } from 'antd/lib/form/Form';
import type { FormItemProps } from 'antd/lib/form/FormItem';
import type { InputProps } from 'antd/lib/input/Input';
import type { TextAreaProps } from 'antd/lib/input/TextArea';

import { VirtualLab } from '@/types/virtual-lab/lab';
import { classNames } from '@/util/utils';

type RenderInputProps = Omit<FormItemProps, 'children'> & {
  children: (props: InputProps & TextAreaProps) => ReactNode;
  type?: string;
};

type InformationForm = { name: string; description: string; reference_email: string };

export const renderInput: (props: InputProps) => ReactNode = ({
  disabled,
  placeholder,
  style,
  title,
  type,
  // value,
}) => {
  return (
    <Input
      className={disabled ? '' : 'font-bold'}
      disabled={disabled}
      placeholder={placeholder}
      required
      style={style}
      title={title}
      type={type}
    />
  );
};

export const renderTextArea: (props: TextAreaProps) => ReactNode = ({
  className,
  disabled,
  placeholder,
  style,
  title,
  // value,
}) => {
  return (
    <Input.TextArea
      autoSize
      className={classNames(className, disabled ? '' : 'font-bold')}
      disabled={disabled}
      placeholder={placeholder}
      required
      style={style}
      title={title}
    />
  );
};

function SettingsFormItem({
  children,
  className,
  disabled,
  name,
  label,
  required,
  rules,
}: Omit<FormItemProps, 'children'> & {
  children: (props: InputProps & TextAreaProps) => ReactNode;
}) {
  return (
    <Form.Item
      name={name}
      label={required ? `${label}*` : label}
      validateTrigger="onBlur"
      rules={[{ ...rules, required }]}
      className={classNames(`w-full pb-1 pt-8`, className)}
      required={required}
    >
      {children({
        disabled,
        placeholder: `${label}...`,
      })}
    </Form.Item>
  );
}

function SettingsFormButton({ children, className, disabled, htmlType, onClick }: ButtonProps) {
  return (
    <Button
      className={classNames('h-14 rounded-none font-semibold', className)}
      disabled={disabled}
      htmlType={htmlType}
      title="Save Changes"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function SettingsForm({ children, className, form, initialValues }: FormProps) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorBgContainer: '#00B212',
            colorBgContainerDisabled: '#00B212', // Same as colorBgContainer
            colorTextDisabled: '#262626',
            defaultShadow: 'none',
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
        className={classNames('divide-y px-[28px]', className)}
        layout="vertical"
        form={form}
        requiredMark={false}
        initialValues={initialValues}
      >
        {children}
      </Form>
    </ConfigProvider>
  );
}

export default function FormPanel({
  className,
  initialValues,
  items,
  onFinish,
}: Omit<FormProps, 'onFinish'> & {
  items: Array<RenderInputProps>;
  onFinish: (values: Partial<VirtualLab>) => Promise<void>;
}) {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [form] = Form.useForm<InformationForm>();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }

  if (error) {
    return <p className="text-error">Something went wrong.</p>;
  }

  const formItems = items.map(({ name, ...props }) => (
    <SettingsFormItem
      {...props} // eslint-disable-line react/jsx-props-no-spreading
      key={name}
      disabled={disabled}
      name={name}
      // value={form.getFieldValue(name)}
    />
  ));

  const submitBlock = (
    <div className="col-span-2 my-4 flex items-center justify-end gap-2">
      <SettingsFormButton
        className="bg-neutral-3 text-neutral-7"
        htmlType="button"
        onClick={() => {
          form.resetFields();

          setDisabled(true);
        }}
      >
        Cancel
      </SettingsFormButton>
      <Form.Item>
        <SettingsFormButton
          className="text-primary-8"
          disabled={disabled}
          htmlType="submit"
          onClick={() => {
            setLoading(true);
            // form.submit(); TODO: Investigate the form submit on Monday.
          }}
        >
          Save
        </SettingsFormButton>
      </Form.Item>
    </div>
  );

  const editBlock = (
    <div className="col-span-2 flex items-center justify-end gap-2 py-4">
      <SettingsFormButton
        className="bg-neutral-3 text-neutral-7"
        htmlType="button"
        onClick={() => setDisabled(false)}
      >
        Edit virtual lab information
      </SettingsFormButton>
    </div>
  );

  if (disabled) {
    return (
      <SettingsForm className="divide-white" form={form} initialValues={initialValues}>
        <>
          {formItems}
          {editBlock}
        </>
      </SettingsForm>
    );
  }

  return (
    <SettingsForm
      className={classNames(className, 'divide-primary-3')}
      form={form}
      initialValues={initialValues}
      onFinish={(values) =>
        onFinish(values)
          .then(() => {
            setError(false);
          })
          .catch(() => {
            setError(true);
            form.resetFields();
          })
          .finally(() => {
            setLoading(false);
            setDisabled(true);
          })
      }
    >
      <>
        {formItems}
        {submitBlock}
      </>
    </SettingsForm>
  );
}
