import { Select, Form, InputNumber, Button } from 'antd';
import { useAtomValue } from 'jotai';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

import { secNamesAtom } from '@/state/simulate/single-neuron';
import { useRecordingSourceForSimulation } from '@/state/simulate/categories';

export default function Recording() {
  const { setSource, add: addRecordLocation, remove: removeRecordLocation, state } = useRecordingSourceForSimulation();
  const sectionNames = useAtomValue(secNamesAtom);

  return (
    <Form.List name="recordFrom">
      {(fields, { add, remove }) => {
        return (
          <div className='w-full'>
            {!!state.length && <div className='grid items-start justify-start grid-cols-[1fr_1fr_80px] w-full'>
              <div className='font-normal text-primary-8 text-base mb-2 text-left'>Section</div>
              <div className='font-normal text-primary-8 text-base mb-2 text-left'>Offset</div>
              <div />
            </div>}
            {fields.map((f, indx) => {
              return (
                <div key={f.key} className="grid grid-cols-[1fr_1fr_80px] gap-x-2 items-center justify-center w-full">
                  <Form.Item
                    className="mb-2"
                    name={[f.name, 'section']}
                    rules={[{ required: true }]}
                  >
                    <Select<string>
                      showSearch
                      placeholder="Section name"
                      onChange={(v) => setSource(indx, { section: v })}
                      options={sectionNames.map((sec) => ({ label: sec, value: sec }))}
                    />
                  </Form.Item>
                  <Form.Item
                    className="mb-2"
                    name={[f.name, 'offset']}
                    rules={[
                      { required: true },
                      {
                        type: 'number',
                        min: 0,
                        max: 1,
                        message: 'Secton offset should be between 0 and 1',
                      },
                    ]}
                  >
                    <InputNumber<number>
                      className="w-full"
                      onChange={(v) => {
                        if (v) {
                          setSource(indx, { offset: v });
                        }
                      }}
                    />
                  </Form.Item>
                  <div className='flex items-center gap-2'>
                    {state.length > 1 && <Button
                      title='Remove Record Location'
                      disabled={state.length <= 1}
                      onClick={() => {
                        removeRecordLocation(indx);
                        remove(indx);
                      }}
                      icon={<MinusOutlined />}
                      type="text"
                      htmlType="button"
                    />}
                    <Button
                      title='Add new Record Location'
                      onClick={() => {
                        addRecordLocation({
                          section: sectionNames[0],
                          offset: .5,
                        });
                        add();
                      }}
                      icon={<PlusOutlined />}
                      type="text"
                      htmlType="button"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )
      }}
    </Form.List>
  );
}
