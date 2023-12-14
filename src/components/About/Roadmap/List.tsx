'use client';

import { ConfigProvider, Select } from 'antd';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { classNames } from '@/util/utils';

export type RoadmapFeature = {
  id: string;
  title: string;
  description: string;
  category: string;
};

type RoadmapFeatureCardProps = Omit<RoadmapFeature, 'category'>;

export function FeatureCard({ id, title, description }: RoadmapFeatureCardProps) {
  const queryParams = useSearchParams();
  const params = useParams<{ 'feature-id': string }>();
  const selected = params?.['feature-id'] === id;

  return (
    <div
      id={`feature-${id}`}
      className={classNames(
        'flex flex-col justify-stretch items-stretch relative h-full gap-2 border-x backdrop-blur-[2px] hover:shadow-md',
        selected ? 'bg-primary-8 pointer-events-none' : 'bg-[#0027661a]'
      )}
    >
      <div className="bg-primary-8 h-9 w-full" />
      <div className="flex flex-col content-stretch items-stretch w-full p-4 h-full">
        <h3 className="text-xl font-bold text-primary-8 line-clamp-2 py-2">{title}</h3>
        <p className="text-sm font-light text-primary-8 line-clamp-4">{description}</p>
        <Link
          href={{ pathname: `/about/roadmap/feature/${id}`, query: queryParams?.toString() }}
          className="text-base font-normal relative w-max px-2 flex flex-col items-center text-primary-8 mt-auto"
        >
          Read more
          <div className="h-[2px] bg-primary-8 w-4/5 absolute bottom-0" />
        </Link>
      </div>
    </div>
  );
}

export function Metadata({
  time,
  categories,
}: {
  time: string;
  categories: Array<{ label: string; value: string }>;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const selectCategory = params?.get('category') ?? 'all';

  const onSelectCategory = (value: string) => router.replace(`/about/roadmap?category=${value}`);

  return (
    <>
      <div className="pl-12 pt-9 pb-5">
        <h1 className="text-4xl font-bold text-primary-8 pr-4">Next steps</h1>
        <div className="inline-flex items-center w-full gap-2 pr-4 py-5">
          <h3 className="text-2xl text-primary-8 font-bold w-full max-w-max">{time}</h3>
          <div className="h-[2px] w-full bg-primary-8" />
        </div>
      </div>
      <div className="inline-flex items-center justify-start gap-4 pl-12 w-full">
        <div className="text-primary-8 text-base font-base w-full max-w-max">
          Show only steps of:{' '}
        </div>
        <ConfigProvider theme={{ hashed: false }}>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            placeholder="Select category"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={categories}
            className={classNames(
              'w-full max-w-[200px]',
              '[&>.ant-select-selector]:!border-0 [&>.ant-select-selector]:!border-b [&>.ant-select-selector]:!border-neutral-2 [&>.ant-select-selector]:!rounded-none [&>.ant-select-selector>.ant-select-selection-item]:!mr-3'
            )}
            defaultValue={selectCategory}
            value={selectCategory}
            onSelect={onSelectCategory}
          />
        </ConfigProvider>
      </div>
    </>
  );
}

export default function CardList({ allFeatures }: { allFeatures: Array<RoadmapFeature> }) {
  const params = useSearchParams();
  const selectedCategory = params?.get('category');
  const features =
    !selectedCategory || selectedCategory === 'all'
      ? allFeatures
      : allFeatures.filter((feat) => feat.category === selectedCategory);

  return (
    <div className="pl-12 py-4 pr-4 bg-white">
      <div
        className="w-full overflow-x-scroll no-scrollbar snap-x snap-mandatory overscroll-x-contain grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${features.length}, 20vw)`,
        }}
      >
        {features.map(({ id, title, description }) => (
          <FeatureCard key={`release-${id}`} {...{ id, title, description }} />
        ))}
      </div>
    </div>
  );
}
