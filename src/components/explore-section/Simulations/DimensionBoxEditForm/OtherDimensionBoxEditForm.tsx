import { useForm } from 'antd/es/form/Form';
import { ConfigProvider, Form, Select } from 'antd';
import { useSetAtom } from 'jotai';
import {
  DimensionValue,
  OtherDimensionBoxEditFormProps,
} from '@/components/explore-section/Simulations/types';
import { simCampaignDimensionsFamily } from '@/state/explore-section/simulation-campaign';
import { modifyDimensionValue } from '@/components/explore-section/Simulations/state';
import selectorTheme from '@/components/explore-section/Simulations/DimensionBoxEditForm/antd-theme';
import { useEnsuredPath, useUnwrappedValue } from '@/hooks/hooks';

export default function OtherDimensionBoxEditForm({
  dimension,
  setEditMode,
}: OtherDimensionBoxEditFormProps) {
  const [form] = useForm();
  const { Option } = Select;
  const path = useEnsuredPath();
  const simulationCampaignDimensions = useUnwrappedValue(simCampaignDimensionsFamily(path));

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
          <Form.Item className="w-20 flex-1" name="input-value">
            <Select value={form.getFieldValue('input-value')} onChange={submitForm}>
              {dimensionConfig.map((val: number) => (
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
