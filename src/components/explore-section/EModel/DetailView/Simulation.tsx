import { ReactNode } from 'react';
import { Empty } from 'antd';
import Image, { StaticImageData } from 'next/image';
import locationMockImg from './mock/location.png';
import stimulusMockImg from './mock/stimulus.png';
import recordingMockImg from './mock/recording.png';
import { FilterBtn } from 'src/components/explore-section/ExploreSectionListingView/FilterControls';
import SortAlternate from '@/components/icons/SortAlternate';
import { classNames } from '@/util/utils';

type Data = {
  charts: Array<{
    label: string;
    value: string | StaticImageData;
    meta?: { range: { value: Array<number>; unit: string }; steps: number; stepsSize: number };
  }>;
  description: string;
  locations: Array<{ label: string; value: string | StaticImageData }>;
  name: string;
  other: Array<{ label: string; value: number | string }>;
  statistics: Array<{ label: string; unit: string; value: number | string }>;
};

const data = new Array<Data>(3).fill({
  charts: [
    {
      label: 'Stimulus',
      value: stimulusMockImg,
      meta: {
        range: {
          value: [1.2, 2.3],
          unit: 'pA',
        },
        steps: 12,
        stepsSize: 1.3,
      },
    },
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

function WithMeta({ children, meta }: { children: ReactNode; meta: Data['charts'][0]['meta'] }) {
  return meta ? (
    <div className="flex gap-5">
      {children}
      <div className="flex-grow">
        {Object.entries(meta).map<ReactNode>(([k, v]) => {
          const value: ReactNode =
            typeof v === 'object' ? ( // ex. k === "range"
              <span className="flex gap-1 text-primary-7">
                <span className="font-bold">
                  {(v as { value: Array<number>; unit: string }).value.map((num, i, arr) =>
                    i < arr.length - 1 ? `${num} \u2014 ` : num
                  )}
                </span>
                {(v as { value: Array<number>; unit: string }).unit}
              </span>
            ) : (
              <span className="font-bold text-primary-7">{v as number}</span>
            );

          return (
            <div className="flex items-center justify-between gap-1" key={k}>
              <span className="font-light capitalize text-neutral-7">
                {
                  k.replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase to Sentence case
                }
              </span>
              {value}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    children
  );
}

const DISABLED = true;

export default function Simulation() {
  return (
    <div className="flex flex-col gap-5">
      <div className="item-center flex justify-between">
        <button
          aria-label="Sort simulations by Voltage Initial"
          className={classNames(
            'flex max-h-[3rem] items-center justify-between gap-10 rounded-md border border-neutral-2 px-2 py-2',
            DISABLED ? 'cursor-not-allowed bg-neutral-100' : 'bg-white'
          )}
          type="button"
          disabled={DISABLED}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-light text-neutral-7">Sort by</span>
            <span className="text-sm font-bold leading-5 text-primary-8">Voltage Initial</span>
          </div>
          <SortAlternate className="h-4 text-primary-8" />
        </button>
        <FilterBtn disabled>
          <div className="flex items-center gap-1">
            <span className="rounded bg-primary-8 px-2.5 py-1 text-sm font-bold text-white">1</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold leading-5 text-primary-8">Filters</span>
              <span className="text-xs font-semibold leading-5 text-neutral-4">
                8 Active Columns
              </span>
            </div>
          </div>
        </FilterBtn>
      </div>
      <div className="flex flex-col divide-y divide-primary-8 border border-primary-8">
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
              <button
                type="button"
                className="mt-auto w-fit bg-primary-7 px-7 py-2 text-center text-base text-white"
              >
                Open in Simulate
              </button>
            </div>
            <div className="flex-grow">
              {charts.map(({ label, meta, value }) => (
                <div className="flex flex-col gap-3" key={label}>
                  <div className="text-lg font-bold text-primary-8">{label}</div>
                  {value ? (
                    <WithMeta meta={meta}>
                      <Image alt={label} height={265} key={label} src={value} width={420} />
                    </WithMeta>
                  ) : (
                    <Empty imageStyle={{ height: 265, width: 420 }} key="label" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
