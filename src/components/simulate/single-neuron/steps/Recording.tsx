import { Select, Form, InputNumber, Button } from 'antd';
import { useAtomValue } from 'jotai';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';

import CustomPopover from '@/components/simulate/single-neuron/molecules/Popover';
import { secNamesAtom } from '@/state/simulate/single-neuron';
import { useRecordingSourceForSimulation } from '@/state/simulate/categories';
import { RecordLocation } from '@/types/simulation/single-neuron';
import { classNames } from '@/util/utils';

type RecordItemProps = {
  index: number;
  name: number | string;
  disable: boolean;
  disableDelete: boolean;
  sections: Array<string>;
  onAddSource: (index: number, updatedLocation: Partial<RecordLocation>) => void;
  onRemove: (idx: number) => void;
};

function RecordItem({
  index,
  name,
  disable,
  disableDelete,
  sections,
  onAddSource,
  onRemove,
}: RecordItemProps) {
  return (
    <div className="w-full [&:last-of-type_div.divider]:hidden">
      <div className="flex w-full flex-col items-start justify-start">
        <h3 className="mb-1 text-lg uppercase text-neutral-4">Recording {index + 1}</h3>
        <div className="grid w-full grid-cols-[1fr_max-content_max-content_.5fr] items-start justify-center gap-2">
          <Form.Item className="mb-2 w-full" name={[name, 'section']} rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="Section name"
              onChange={(v) => onAddSource(index, { section: v })}
              options={sections.map((sec) => ({ label: sec, value: sec }))}
              className="w-full [&_.ant-select-selection-item]:!text-left [&_.ant-select-selection-item]:font-bold [&_.ant-select-selection-item]:!text-primary-8"
              placement="bottomLeft"
              disabled={disable}
              size="large"
            />
          </Form.Item>
          <div className="flex h-11 items-center justify-center align-middle text-base text-neutral-4">
            <span className="mr-2 uppercase">offset</span>
            <CustomPopover
              message="The recording position relative to the section. 0 being the start of the section and 1 being the end."
              placement="bottomRight"
              when={['hover']}
            >
              <InfoCircleOutlined className="cursor-pointer" />
            </CustomPopover>
          </div>
          <Form.Item
            className="mb-2"
            name={[name, 'offset']}
            rules={[
              { required: true, message: 'Requireed field' },
              {
                type: 'number',
                min: 0,
                max: 1,
                message: 'Section offset should be between 0 and 1',
              },
            ]}
          >
            <InputNumber<number>
              min={0}
              max={1}
              step={0.01}
              className="w-full [&_.ant-input-number-input]:font-bold [&_.ant-input-number-input]:!text-primary-8"
              onChange={(v) => {
                if (v) {
                  onAddSource(index, { offset: v });
                }
              }}
              size="large"
              disabled={disable}
            />
          </Form.Item>
          <div className="mb-2 flex h-11  items-center justify-end">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              disabled={disableDelete}
              onClick={() => onRemove(index)}
            />
          </div>
        </div>
      </div>
      <div className="divider my-4 h-px w-full bg-neutral-3" />
    </div>
  );
}

export default function Recording() {
  const {
    setSource,
    add: addRecordLocation,
    remove: removeRecordLocation,
  } = useRecordingSourceForSimulation();
  const sectionNames = useAtomValue(secNamesAtom);

  return (
    <div className="flex w-full flex-col items-start">
      <Form.List name="recordFrom">
        {(fields) =>
          fields.map((f, index) => (
            <RecordItem
              key={`recording-${f.name}`}
              index={index}
              name={f.name}
              disable={!sectionNames.length}
              disableDelete={fields.length <= 1}
              onAddSource={setSource}
              sections={sectionNames}
              onRemove={removeRecordLocation}
            />
          ))
        }
      </Form.List>
      <button
        title="Add new Record Location"
        onClick={() => {
          addRecordLocation({
            section: sectionNames[0],
            offset: 0.5,
          });
        }}
        disabled={!sectionNames.length}
        type="button"
        className={classNames(
          'mt-4 border border-primary-8 bg-white px-6 py-3 text-lg font-bold text-primary-8',
          'hover:border-neutral-4 hover:bg-neutral-4 hover:text-white',
          'disabled:pointer-events-none disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-400'
        )}
      >
        Add recording
      </button>
    </div>
  );
}
