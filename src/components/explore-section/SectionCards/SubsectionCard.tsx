'use client';

import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import { loadable } from 'jotai/utils';
import { useMemo } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { getTotalByType } from './hooks';
import { EyeIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import { DataType } from '@/constants/explore-section/list-views';

// TYPE
type SectionCardsProps = {
  subsection: {
    name: string;
    type: DataType;
    url: string;
  };
  cardIndex: number;
};

export function SubsectionCard({ subsection, cardIndex }: SectionCardsProps) {
  const totalAtom = useMemo(() => loadable(getTotalByType(subsection.type)), [subsection.type]);
  const total = useAtomValue(totalAtom);

  const getTotalDataset = () => {
    if (total.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (total.state === 'hasError') {
      return `Error: ${total.error}`;
    }

    return total.data;
  };

  const dataset = getTotalDataset();
  return (
    <Link
      href={subsection.url}
      key={`explore-section-card-${subsection.name}`}
      className={classNames(
        'flex w-full flex-row items-center justify-between bg-transparent px-8 py-4 leading-tight transition-all duration-300 ease-linear hover:bg-transparentBlack 2xl:px-16',
        cardIndex !== 0 ? 'border-t border-solid border-t-primary-7' : ''
      )}
    >
      <div className="flex flex-col text-white transition-colors duration-300 ease-linear">
        <h3 className="text-2xl font-bold">{subsection.name}</h3>
        {dataset && <div className="text-sm font-light">{dataset} datasets</div>}
      </div>

      <div className="block">
        <EyeIcon className="h-3 w-auto text-white" />
      </div>
    </Link>
  );
}
