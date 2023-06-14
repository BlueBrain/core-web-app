import { useForm } from 'antd/es/form/Form';
import { Form, Select } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai/index';
import {
  DimensionValue,
  OtherDimensionBoxEditFormProps,
} from '@/components/explore-section/Simulations/types';
import { simulationCampaignDimensionsAtom } from '@/state/explore-section/simulation-campaign';
import { modifyDimensionValue } from '@/components/explore-section/Simulations/state';
import './styles.scss';

export default function OtherDimensionBoxEditForm({
  dimension,
  setEditMode,
}: OtherDimensionBoxEditFormProps) {
  const [form] = useForm();
  const { Option } = Select;
  const simulationCampaignDimensions = useAtomValue(simulationCampaignDimensionsAtom);
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
      <Form
        form={form}
        id="other-dimension-box-edit-form"
        initialValues={{ 'input-value': buildInitialValue() }}
      >
        <Form.Item className="flex-1 w-20" name="input-value">
          <Select
            className="bg-primary-5"
            value={form.getFieldValue('input-value')}
            onChange={submitForm}
            dropdownStyle={{ backgroundColor: '#E6F7FF', borderRadius: 0 }}
          >
            {dimensionConfig.map((val) => (
              <Option key={val} value={val} style={{ color: '#0050B3', fontWeight: 'bold' }}>
                {val}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
}
