import { ReactNode, useCallback, useReducer, useState } from 'react';
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
import { useDebouncedCallback } from '@/hooks/hooks';

type RenderInputProps = Omit<FormItemProps, 'children'> & {
  children: (props: InputProps & TextAreaProps) => ReactNode;
  maxLength?: number;
  type?: string;
};

type InformationForm = { name: string; description: string; reference_email: string };

export const renderInput = ({
  disabled,
  maxLength,
  onClick,
  placeholder,
  style,
  title,
  type,
}: InputProps) => {
  return (
    <Input
      addonAfter={<Button ghost icon={<EditOutlined />} onClick={onClick} />}
      className={classNames('!bg-transparent', disabled ? '' : 'font-bold')}
      disabled={disabled}
      maxLength={maxLength} // Used in conjunction with "rules"
      placeholder={placeholder}
      style={style}
      title={title}
      type={type}
      variant="borderless"
    />
  );
};

export const renderTextArea: (props: TextAreaProps) => ReactNode = ({
  disabled,
  maxLength,
  name,
  onClick,
  placeholder,
  style,
  title,
}) => {
  return (
    <Input.Group className="flex items-center">
      <Form.Item name={name} noStyle>
        <Input.TextArea
          className={classNames('!h-auto !bg-transparent', disabled ? '' : 'font-bold')}
          disabled={disabled}
          maxLength={maxLength}
          placeholder={placeholder}
          required
          rows={2}
          style={{ ...style, height: 'auto' }}
          title={title}
          variant="borderless"
        />
      </Form.Item>
      <Button ghost icon={<EditOutlined />} onClick={onClick} />
    </Input.Group>
  );
};

function SettingsFormItem({
  children,
  className,
  label,
  maxLength,
  name,
  required,
  rules,
  type,
  validateStatus,
}: RenderInputProps) {
  const [disabled, dispatch] = useReducer(
    (state: boolean, { action }: { action: 'toggle' }): boolean => {
      return action === 'toggle' ? !state : state;
    },
    true // Disabled by default
  );

  const onClick = useCallback(() => {
    dispatch({ action: 'toggle' });
  }, []);

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
          hasFeedback={validateStatus === 'validating'}
          label={required ? `${label}*` : label}
          name={name}
          required={required}
          rules={rules} // Used in conjunction with "maxLength"
          style={{ width: '100%' }}
          validateStatus={validateStatus}
        >
          {children({
            disabled,
            maxLength, // Used in conjunction with "rules"
            name, // Used for TextArea, not for Input
            onClick,
            placeholder: `${label}...`,
            type,
          })}
        </Form.Item>
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
            activeShadow: 'none',
            colorBgContainer: 'transparent',
            colorText: '#fff',
            colorTextDisabled: '#fff',
            colorTextPlaceholder: '#8C8C8C',
            // Antd uses `fontSizeLG` when no suffix/prefix icons are shown, and `fontSize` when these icons are shown. In both these cases, we want the same font size for our UI.
            fontSize: 16,
            fontSizeLG: 16,
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
  const [validateStatus, setValidateStatus] = useState<Partial<
    Record<keyof VirtualLab, 'error' | 'validating'>
  > | null>();

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

  const debouncedOnValuesChange = useDebouncedCallback(
    async (values: Partial<VirtualLab>) => {
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
    },
    [onValuesChange, notification],
    600
  );

  return (
    <div className="flex flex-col gap-5">
      <SettingsForm
        className={className}
        form={form}
        initialValues={initialValues}
        labelAlign="left"
        name={name} // This will prefix any input IDs with the form name. Not sure whether necessary right now.
        onValuesChange={debouncedOnValuesChange}
      >
        {formItems}
      </SettingsForm>
      {!!serverError && <p className="self-end px-8 text-xl text-error">{serverError}</p>}
    </div>
  );
}
