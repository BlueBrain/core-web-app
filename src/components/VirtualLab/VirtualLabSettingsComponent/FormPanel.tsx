import { ReactNode, useReducer, useState } from 'react';
import debounce from 'lodash/debounce';
import { Button, ConfigProvider, Form, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { ConfigProviderProps } from 'antd/lib/config-provider';
import { FormProps } from 'antd/lib/form/Form';
import type { FormItemProps } from 'antd/lib/form/FormItem';
import type { InputProps } from 'antd/lib/input/Input';
import type { TextAreaProps } from 'antd/lib/input/TextArea';

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
  placeholder,
  style,
  title,
  type, // TODO: Is this being used?
}) => {
  return (
    <Input
      className={disabled ? '' : 'font-bold'}
      disabled={disabled}
      placeholder={placeholder}
      required
      style={{ ...style, border: 'none' }}
      title={title}
      type={type}
    />
  );
};

export const renderTextArea: (props: TextAreaProps) => ReactNode = ({
  // className,
  disabled,
  placeholder,
  style,
  title,
}) => {
  return (
    <Input.TextArea
      autoSize
      className={disabled ? '' : 'font-bold'}
      disabled={disabled}
      placeholder={placeholder}
      required
      style={{ ...style, border: 'none' }}
      title={title}
    />
  );
};

function SettingsFormItem({
  children,
  className,
  label,
  name,
  required,
  // rules,
  validateStatus,
}: Omit<FormItemProps, 'children'> & {
  children: (props: InputProps & TextAreaProps) => ReactNode;
}) {
  const [disabled, dispatch] = useReducer(
    (state: boolean, { type }: { type: 'toggle' }): boolean => {
      return type === 'toggle' ? !state : state;
    },
    true // Disabled by default
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultGhostColor: disabled ? '#69C0FF' : 'white',
            defaultGhostBorderColor: 'transparent',
          },
        },
      }}
    >
      <div
        className={classNames(
          `border-b-1 flex w-full items-center justify-between gap-4 border border-x-0 border-t-0 pt-8`,
          disabled ? 'border-primary-3' : 'border-white',
          className
        )}
      >
        <Form.Item
          name={name}
          label={required ? `${label}*` : label}
          // validateTrigger="onBlur" // TODO: Remove this?
          // rules={[{ ...rules, required }]} // TODO: Remove this?
          required={required}
          style={{ width: '100%' }}
          hasFeedback={validateStatus === 'validating'}
          validateStatus={validateStatus}
        >
          {children({
            disabled,
            name,
            placeholder: `${label}...`,
          })}
        </Form.Item>
        <Button ghost icon={<EditOutlined />} onClick={() => dispatch({ type: 'toggle' })} />
      </div>
    </ConfigProvider>
  );
}

function getValidateStatusFromValues(
  values: Partial<VirtualLab>,
  status: 'error' | 'validating'
): Record<keyof VirtualLab, 'error' | 'validating'> {
  const entries = Object.entries(values).map(([k]) => [k, status]);

  return Object.fromEntries(entries);
}

function SettingsForm({
  children,
  className,
  ...formProps
}: FormProps & {
  theme?: ConfigProviderProps['theme'];
}) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorBgContainer: '#00B212',
            colorBgContainerDisabled: '#00B212', // Same as colorBgContainer
            // colorBorder: 'transparent', TODO: Figure-out how to remove the border
            colorTextDisabled: '#262626',
            defaultShadow: 'none',
          },
          Form: {
            controlHeight: 22, // Removing this will cause labels to jump when toggling disabled
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
      }}
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
  const [validateStatus, setValidateStatus] = useState<Record<
    keyof VirtualLab,
    'error' | 'validating'
  > | null>(null);

  const [serverError, setServerError] = useState<string | null>(null);

  const [form] = Form.useForm<InformationForm>();

  const notification = useNotification();

  const formItems = items.map(({ name: formItemName, ...formItemProps }) => (
    <SettingsFormItem
      key={formItemName}
      name={formItemName}
      validateStatus={
        validateStatus && !!formItemName ? validateStatus[formItemName as keyof VirtualLab] : ''
      }
      {...formItemProps} // eslint-disable-line react/jsx-props-no-spreading
    />
  ));

  return (
    <div className="flex flex-col gap-5">
      <SettingsForm
        className={className}
        form={form}
        initialValues={initialValues}
        labelAlign="left"
        name={name} // TODO: Check whether this prop is necessary.
        onValuesChange={debounce(async (values: Partial<VirtualLab>) => {
          const validating = getValidateStatusFromValues(values, 'validating');

          setValidateStatus(validating);

          return onValuesChange(values)
            .then(() => {
              const entries = Object.entries(values);

              entries.forEach(([k, v]) => notification.success(`${k} was updated to ${v}.`));

              setServerError(null); // Remove error
              setValidateStatus(null); // Reset validateStatus
            })
            .catch((error) => {
              setServerError(error.message);

              const newValidateStatus = error.cause
                ? getValidateStatusFromValues(error.cause, 'error')
                : null;

              setValidateStatus(newValidateStatus);
            });
        }, 600)}
      >
        {formItems}
      </SettingsForm>
      {!!serverError && <p className="self-end px-8 text-xl text-error">{serverError}</p>}
    </div>
  );
}
