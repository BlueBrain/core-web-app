import { Select, Form, InputNumber } from 'antd';
import { useAtomValue } from 'jotai';

import { secNamesAtom } from '@/state/simulate/single-neuron';
import { useRecordingSourceForSimulation } from '@/state/simulate/categories';

export default function Recording() {
  const { state, setSource } = useRecordingSourceForSimulation();
  const sectionNames = useAtomValue(secNamesAtom);

  // TODO: Allow adding multiple form items if multiple recording location feature should be supported
  return (
    <Form.List name="recordForm" initialValue={state}>
      {(fields) => {
        return fields.map((f, indx) => {
          return (
            <div key={f.key} className="grid grid-cols-[1fr_1fr_40px_40px] gap-x-2">
              <Form.Item className="mb-2" name={[f.name, 'section']} label="Section">
                <Select<string>
                  showSearch
                  placeholder="Section name"
                  onChange={(v) => setSource(indx, { section: v })}
                  options={sectionNames.map((sec) => ({ label: sec, value: sec }))}
                />
              </Form.Item>
              <Form.Item
                label="Segment Offset"
                className="mb-2"
                name={[f.name, 'segmentOffset']}
                rules={[
                  { required: true },
                  {
                    type: 'number',
                    min: 0,
                    max: 1,
                    message: 'Segment offset should be between 0 and 1',
                  },
                ]}
              >
                <InputNumber<number>
                  className="w-full"
                  onChange={(v) => {
                    if (v) {
                      setSource(indx, { segmentOffset: v });
                    }
                  }}
                />
              </Form.Item>
            </div>
          );
        });
      }}
    </Form.List>
  );
}
