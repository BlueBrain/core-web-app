import { useForm } from 'antd/es/form/Form';
import { ConfigProvider, Form, Select } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { unwrap } from 'jotai/utils';
import {
  DimensionValue,
  OtherDimensionBoxEditFormProps,
} from '@/components/explore-section/Simulations/types';
import { simulationCampaignDimensionsAtom } from '@/state/explore-section/simulation-campaign';
import { modifyDimensionValue } from '@/components/explore-section/Simulations/state';
import selectorTheme from '@/components/explore-section/Simulations/DimensionBoxEditForm/antd-theme';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

export default function OtherDimensionBoxEditForm({
  dimension,
  setEditMode,
}: OtherDimensionBoxEditFormProps) {
  const resourceInfo = useResourceInfoFromPath();

  const [form] = useForm();
  const { Option } = Select;
  const simulationCampaignDimensions = useAtomValue(
    useMemo(() => unwrap(simulationCampaignDimensionsAtom(resourceInfo)), [resourceInfo])
  );
  const dimensionValueModified = useSetAtom(modifyDimensionValue);

  const dimensionConfig =
    simulationCampaignDimensions && simulationCampaignDimensions[dimension?.id];

  if (!dimensionConfig) {
    return null;
  }

  const submitForm = () => {
    form.validateFields(['input-value']).then(() => {
      const values = form.getFieldsValue();
      const dimensionValue: DimensionValue = {
        type: 'value',
        value: values['input-value'].toString(),
      };
      dimensionValueModified(dimension.id, dimensionValue);
      setEditMode(false);
    });
  };

  const buildInitialValue = () => {
    if (dimension.value.type === 'value') {
      return dimension.value.value.split(',')[0];
    }
    return dimension.value.minValue;
  };

  return (
    <div className="mt-3">
      <ConfigProvider theme={selectorTheme}>
        <Form
          form={form}
          id="other-dimension-box-edit-form"
          initialValues={{ 'input-value': buildInitialValue() }}
        >
          <Form.Item className="flex-1 w-20" name="input-value">
            <Select value={form.getFieldValue('input-value')} onChange={submitForm}>
              {dimensionConfig.map((val: string) => (
                <Option key={val} value={val}>
                  {val}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
}
