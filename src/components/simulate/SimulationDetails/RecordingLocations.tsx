import { InfoCircleOutlined } from '@ant-design/icons';
import CustomPopover from '../single-neuron/molecules/Popover';
import { RecordLocation } from '@/types/simulation/single-neuron';

type Props = {
  recordingLocations: RecordLocation[];
};

export default function RecordingLocations({ recordingLocations }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {recordingLocations?.map((r, ind) => (
        <div key={`${r.section}_${r.offset}`} className="flex flex-col">
          <div className="uppercase text-gray-400">Recording {ind + 1}</div>
          <div className="flex max-w-max items-center justify-start gap-3 border border-gray-100">
            <span className="text-base font-bold capitalize text-primary-8">{r.section}</span>
            <div className="ml-14 flex items-center gap-2">
              <span className="text-sm uppercase text-gray-400">offset</span>
              <CustomPopover
                message="The recording position relative to the section. 0 being the start of the section and 1 being the end."
                when={['hover']}
              >
                <InfoCircleOutlined className="cursor-pointer text-gray-400" />
              </CustomPopover>
              <span className="py-1 text-base font-bold text-primary-8">{r.offset}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
