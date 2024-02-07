import { Empty } from 'antd';
import Image, { StaticImageData } from 'next/image';
import locationMockImg from './mock/location.png';
import stimulusMockImg from './mock/stimulus.png';
import recordingMockImg from './mock/recording.png';

type Data = {
  charts: Array<{ label: string; value: string | StaticImageData }>;
  description: string;
  locations: Array<{ label: string; value: string | StaticImageData }>;
  name: string;
  other: Array<{ label: string; value: number | string }>;
  statistics: Array<{ label: string; unit: string; value: number | string }>;
};

const data: Data[] = new Array(3).fill({
  charts: [
    { label: 'Stimulus', value: stimulusMockImg },
    { label: 'Recording', value: recordingMockImg },
  ],
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  locations: [
    { label: 'location: 1.01', value: locationMockImg },
    { label: 'location: 1.02', value: '' },
    { label: 'location: 1.03', value: '' },
    { label: 'location: 1.04', value: '' },
  ],
  name: 'my-sim_neuron-01',
  other: [{ label: 'Injection location', value: 'Soma' }],
  statistics: [
    { label: 'Temperature', unit: '°C', value: 34 },
    { label: 'Time step', unit: 'ms', value: 0.05 },
    { label: 'Voltage initial', unit: 'mV', value: -73 },
    { label: 'Holding current', unit: 'nA', value: 0 },
  ],
});

export default function Simulation() {
  return (
    <div className="-mt-7 flex h-full flex-col divide-y divide-primary-8 border border-primary-8">
      {data.map(({ charts, description, locations, name, other, statistics }) => (
        <div className="flex gap-12 p-10" key="name">
          <div className="flex basis-3/6 flex-col gap-3">
            <div className="flex flex-col">
              <div className="text-md text-neutral-4">Name</div>
              <div className="text-xl font-bold text-primary-8">{name}</div>
            </div>
            <div className="text-md font-light text-primary-8">{description}</div>
            <div className="flex justify-between">
              {statistics.map(({ label, value, unit }) => (
                <div className="flex flex-col" key="label">
                  <div className="text-neutral-4">{label}</div>
                  <div className="text-primary-8">
                    <span className="text-lg font-bold">{value}</span>
                    <span className="text-md">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
            {other.map(({ label, value }) => (
              <div
                className="text-md border-b border-t border-neutral-2 py-3.5 text-neutral-4"
                key="label"
              >
                {label}: <span className="font-bold text-primary-8">{value}</span>
              </div>
            ))}
            <div>
              <div className="font-bold text-primary-8">Recording locations</div>
              <div className="flex justify-between">
                {locations.map(({ label, value }) =>
                  value ? (
                    <Image alt={label} height={134} key={label} src={value} width={140} />
                  ) : (
                    <Empty imageStyle={{ height: 134, width: 140 }} key={label} />
                  )
                )}
              </div>
            </div>
          </div>
          <div>
            {charts.map(({ label, value }) => (
              <div className="flex flex-col gap-3" key={label}>
                <div className="text-lg font-bold text-primary-8">{label}</div>
                {value ? (
                  <Image alt={label} height={265} key={label} src={value} width={420} />
                ) : (
                  <Empty imageStyle={{ height: 265, width: 420 }} key="label" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
