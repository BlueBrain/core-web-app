import { Select, Form } from 'antd';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { segNamesAtom } from '@/state/simulate/single-neuron';
import { useRecordingSourceForSimulation } from '@/state/simulate/categories';

export default function Recording() {
  const { setSource } = useRecordingSourceForSimulation();
  const segNames = useAtomValue(segNamesAtom);
  const options = useMemo(() => {
    return segNames.map((secName) => ({ value: secName, label: secName }));
  }, [segNames]);

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
        onChange={setSource}
        mode="multiple"
        options={options}
      />
    </Form.Item>
  );
}
