import { Checkbox, ConfigProvider, Radio, Space, CheckboxProps } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import capitalize from 'lodash/capitalize';

import { variantLabel } from './constants';
import { variantNamesLoadableAtom } from './state';
import { configPayloadLoadableAtom } from '@/state/brain-model-config/micro-connectome';
import { useLoadable } from '@/hooks/hooks';

type ColoredBoxProps = {
  color?: string;
  size?: number;
};

function ColoredCheckbox({ color, children, ...rest }: CheckboxProps & { color: string }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: color,
          borderRadiusSM: 0,
        },
      }}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Checkbox checked className="mr-2" {...rest}>
        <span style={{ color }}>{children}</span>
      </Checkbox>
    </ConfigProvider>
  );
}

function ColoredBox({ color = '#dadada', size = 16 }: ColoredBoxProps) {
  return (
    <div
      className="inline-block mr-2 mb-[-2px]"
      style={{
        height: `${size}px`,
        width: `${size}px`,
        backgroundColor: color,
      }}
    />
  );
}

type VariantEntryProps = {
  variantName: string;
  checked: boolean;
  editable: boolean;
  onChange: (variantName: string, checked: boolean) => void;
  color: string;
};

function VariantEntry({ variantName, checked, editable, color, onChange }: VariantEntryProps) {
  const onChangeLocal = (e: CheckboxChangeEvent) => onChange(variantName, e.target.checked);

  return editable ? (
    <ColoredCheckbox color={color} className="mr-2" checked={checked} onChange={onChangeLocal}>
      {variantLabel[variantName] ?? variantName}
    </ColoredCheckbox>
  ) : (
    <>
      <ColoredBox color={color} />
      {variantLabel[variantName] ?? variantName}
    </>
  );
}

type MicroConnectomeViewSelectorProps = {
  // A string representation of the current view selection, possible values:
  // 'variant' or 'param.<variantName>.<paramName>'
  value: string;
  onChange: (value: string) => void;
  variantColorMap: Map<string, string>;
  variantExcludeSet: Set<string>;
  onVariantExcludeSetChange: (variantExcludeSet: Set<string>) => void;
};

export default function MicroConnectomeViewSelector({
  value,
  onChange,
  variantColorMap,
  variantExcludeSet,
  onVariantExcludeSetChange,
}: MicroConnectomeViewSelectorProps) {
  const configPayload = useLoadable(configPayloadLoadableAtom, null);
  const variantNames = useLoadable(variantNamesLoadableAtom, []);

  const variantCheckboxesEditable = value === 'variant';

  const onVariantCheckChange = (variantName: string, checked: boolean) => {
    const updatedVariantExcludeSet = new Set(variantExcludeSet);
    if (checked) {
      updatedVariantExcludeSet.delete(variantName);
    } else {
      updatedVariantExcludeSet.add(variantName);
    }

    onVariantExcludeSetChange(updatedVariantExcludeSet);
  };

  return (
    <>
      <Radio.Group value={value} onChange={(e) => onChange(e.target.value)}>
        <Space direction="vertical">
          <Radio value="variant">Algorithm</Radio>
        </Space>
      </Radio.Group>

      <h3 className="mt-5 mb-3" style={{ color: 'slategray' }}>
        <VariantEntry
          variantName="disabled"
          checked={!variantExcludeSet.has('disabled')}
          editable={variantCheckboxesEditable}
          color="slategray"
          onChange={onVariantCheckChange}
        />
      </h3>

      {variantNames.map((variantName) => (
        <div key={variantName}>
          <h3 className="mt-5 mb-3" style={{ color: variantColorMap.get(variantName) ?? 'gray' }}>
            <VariantEntry
              variantName={variantName}
              checked={!variantExcludeSet.has(variantName)}
              editable={variantCheckboxesEditable}
              color={variantColorMap.get(variantName) ?? 'gray'}
              onChange={onVariantCheckChange}
            />
          </h3>

          <Radio.Group value={value} onChange={(e) => onChange(e.target.value)}>
            <Space direction="vertical">
              {Object.keys(configPayload?.variants[variantName].params ?? {})
                .sort()
                .map((paramName) => (
                  <Radio key={paramName} value={`param.${variantName}.${paramName}`}>
                    {capitalize(paramName).replace('_', ' ')}
                  </Radio>
                ))}
            </Space>
          </Radio.Group>
        </div>
      ))}
    </>
  );
}
