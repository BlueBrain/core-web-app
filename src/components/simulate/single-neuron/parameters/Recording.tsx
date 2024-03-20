import { Select, Form } from 'antd';
import { useAtomValue } from 'jotai';

import { SimAction } from '@/types/simulate/single-neuron';
import { segNamesAtom } from '@/state/simulate/single-neuron';

type Props = {
  onChange: (action: SimAction) => void;
};

export default function Recording({ onChange }: Props) {
  const segNames = useAtomValue(segNamesAtom);

  return (
    <Form.Item
      name="recordFrom"
      label="Recording locations"
      rules={[{ required: true }]}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Select
        showSearch
        placeholder="Select recording locations"
        onChange={(newVal) =>
          onChange({ type: 'CHANGE_PARAM', payload: { key: 'recordFrom', value: newVal } })
        }
        mode="multiple"
        options={segNames.map((secName) => ({ value: secName, label: secName }))}
      />
    </Form.Item>
  );
}
