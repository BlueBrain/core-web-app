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

function FeatureCard({ id, title, description }: RoadmapFeatureCardProps) {
  const queryParams = useSearchParams();
  const params = useParams<{ 'feature-id': string }>();
  const selected = params?.['feature-id'] === id;

  return (
    <div
      id={`feature-${id}`}
      className={classNames(
        'relative flex h-full flex-col items-stretch justify-stretch gap-2 border-x backdrop-blur-[2px] hover:shadow-md',
        selected ? 'pointer-events-none bg-primary-8' : 'bg-[#0027661a]'
      )}
    >
      <div className="h-9 w-full bg-primary-8" />
      <div className="flex h-full w-full flex-col content-stretch items-stretch p-4">
        <h3 className="line-clamp-2 py-2 text-xl font-bold text-primary-8">{title}</h3>
        <p className="line-clamp-4 text-sm font-light text-primary-8">{description}</p>
        <Link
          href={{ pathname: `/about/roadmap/feature/${id}`, query: queryParams?.toString() }}
          className="relative mt-auto flex w-max flex-col items-center px-2 text-base font-normal text-primary-8"
        >
          Read more
          <div className="absolute bottom-0 h-[2px] w-4/5 bg-primary-8" />
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
      <div className="pb-5 pl-12 pt-9">
        <h1 className="pr-4 text-4xl font-bold text-primary-8">Next steps</h1>
        <div className="inline-flex w-full items-center gap-2 py-5 pr-4">
          <h3 className="w-full max-w-max text-2xl font-bold text-primary-8">{time}</h3>
          <div className="h-[2px] w-full bg-primary-8" />
        </div>
      </div>
      <div className="inline-flex w-full items-center justify-start gap-4 pl-12">
        <div className="font-base w-full max-w-max text-base text-primary-8">
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
              '[&>.ant-select-selector>.ant-select-selection-item]:!mr-3 [&>.ant-select-selector]:!rounded-none [&>.ant-select-selector]:!border-0 [&>.ant-select-selector]:!border-b [&>.ant-select-selector]:!border-neutral-2'
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
    <div className="bg-white py-4 pl-12 pr-4">
      <div
        className="no-scrollbar grid w-full snap-x snap-mandatory gap-3 overflow-x-scroll overscroll-x-contain"
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
