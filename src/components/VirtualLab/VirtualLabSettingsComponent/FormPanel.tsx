import { ReactNode, useState } from 'react';
import { Button, ConfigProvider, Form, Input, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ConfigProviderProps } from 'antd/lib/config-provider';
import { ButtonProps } from 'antd/lib/button/button';
import { FormProps } from 'antd/lib/form/Form';
import type { FormItemProps } from 'antd/lib/form/FormItem';
import type { InputProps } from 'antd/lib/input/Input';
import type { TextAreaProps } from 'antd/lib/input/TextArea';
import merge from 'lodash/merge';

import useNotification from '@/hooks/notifications';
import { VirtualLab } from '@/types/virtual-lab/lab';
import { classNames } from '@/util/utils';

type RenderInputProps = Omit<FormItemProps, 'children'> & {
  children: (props: InputProps & TextAreaProps) => ReactNode;
  type?: string;
};

type InformationForm = { name: string; description: string; reference_email: string };

export const renderInput: (props: InputProps) => ReactNode = ({
  disabled,
  name,
  placeholder,
  style,
  title,
  type,
}) => {
  return (
    <Input
      className={disabled ? '' : 'font-bold'}
      disabled={disabled}
      name={name}
      placeholder={placeholder}
      required
      style={{ ...style, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
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
}) => {
  return (
    <Input.TextArea
      autoSize
      className={classNames(className, disabled ? '' : 'font-bold')}
      disabled={disabled}
      placeholder={placeholder}
      required
      style={{ ...style, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
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
  disabled: InputProps['disabled'];
}) {
  return (
    <Form.Item
      name={name}
      label={required ? `${label}*` : label}
      validateTrigger="onBlur"
      rules={[{ ...rules, required }]}
      className={classNames(`w-full pt-8`, className)}
      required={required}
    >
      {children({
        disabled,
        name,
        placeholder: `${label}...`,
      })}
    </Form.Item>
  );
}

function SettingsFormButton({ children, className, ...buttonProps }: ButtonProps) {
  return (
    <Button
      className={classNames('h-14 rounded-none font-semibold', className)}
      title="Save Changes"
      {...buttonProps} // eslint-disable-line react/jsx-props-no-spreading
    >
      {children}
    </Button>
  );
}

function SettingsForm({
  children,
  className,
  theme,
  ...formProps
}: FormProps & {
  theme?: ConfigProviderProps['theme'];
}) {
  return (
    <ConfigProvider
      theme={merge(
        {
          components: {
            Button: {
              colorBgContainer: '#00B212',
              colorBgContainerDisabled: '#00B212', // Same as colorBgContainer
              colorTextDisabled: '#262626',
              defaultShadow: 'none',
            },
            Form: {
              labelColor: '#69C0FF',
              itemMarginBottom: 0,
              verticalLabelPadding: 0,
            },
            Input: {
              activeBg: 'transparent',
              borderRadius: 0,
              colorBgContainer: 'transparent',
              colorText: '#fff',
              colorTextDisabled: '#fff',
              colorTextPlaceholder: '#8C8C8C',
              // Antd uses `fontSizeLG` when no suffix/prefix icons are shown, and `fontSize` when these icons are shown. In both these cases, we want the same font size for our UI.
              fontSize: 16,
              fontSizeLG: 16,
              hoverBorderColor: 'transparent',
              paddingInline: 0,
              paddingBlock: 10,
            },
          },
        },
        theme
      )}
    >
      <Form
        className={classNames('px-[28px]', className)}
        layout="vertical"
        requiredMark={false}
        {...formProps} // eslint-disable-line react/jsx-props-no-spreading
      >
        {
          children as ReactNode // TODO: Find-out why this type-casting is necessary.
        }
      </Form>
    </ConfigProvider>
  );
}

export default function FormPanel({
  className,
  initialValues,
  items,
  name,
  onValuesChange,
}: Omit<FormProps, 'onFinish'> & {
  items: Array<RenderInputProps>;
  onValuesChange: (values: Partial<VirtualLab>) => Promise<void>; // Modify typing to allow for Promise return.
}) {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [form] = Form.useForm<InformationForm>();

  const notification = useNotification();

  const formItems = items.map(({ name: formItemName, ...formItemProps }) => (
    <SettingsFormItem
      key={formItemName}
      disabled={disabled}
      name={formItemName}
      {...formItemProps} // eslint-disable-line react/jsx-props-no-spreading
    />
  ));

  const submitBlock = (
    <div className="col-span-2 flex items-center justify-end gap-2 py-4">
      <SettingsFormButton
        className="bg-neutral-3 text-neutral-7"
        disabled={loading}
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
          disabled={disabled || loading}
          htmlType="submit"
          onClick={() => {
            setLoading(true);

            // form.submit();
          }}
        >
          {loading ? <Spin size="small" indicator={<LoadingOutlined />} /> : 'Save'}
        </SettingsFormButton>
      </Form.Item>
    </div>
  );

  const editBlock = (
    <div className="col-span-2 flex items-center justify-end gap-2 py-4">
      {!!serverError && <p className="text-white">{`Something went wrong. ${serverError}`}</p>}
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
      <SettingsForm
        className={className}
        form={form}
        initialValues={initialValues}
        name={name} // TODO: Check whether this prop is necessary.
        theme={{
          components: {
            Input: { colorBorder: 'white' },
          },
        }}
      >
        {formItems}
        {editBlock}
      </SettingsForm>
    );
  }

  return (
    <SettingsForm
      className={className}
      form={form}
      initialValues={initialValues}
      name={name} // TODO: Check whether this prop is necessary.
      onValuesChange={async (values) => {
        return onValuesChange(values)
          .then(() => {
            setServerError(null);
            notification.success(`Virtual Lab has been updated.`);
          })
          .catch((error) => {
            setServerError(error);
            form.resetFields();
          })
          .finally(() => {
            setLoading(false);
            setDisabled(true);
          });
      }}
      theme={{
        components: {
          Input: { colorBorder: '#69C0FF' },
        },
      }}
    >
      {formItems}
      {submitBlock}
    </SettingsForm>
  );
}
