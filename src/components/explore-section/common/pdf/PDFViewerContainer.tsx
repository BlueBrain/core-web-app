import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { ConfigProvider, Select, Button } from 'antd';
import { PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import groupBy from 'lodash/groupBy';
import { FileDistribution } from '@/types/explore-section/delta-properties';
import EModelAnalysisLauncher from '@/components/explore-section/EModel/DetailView/EModelAnalysisLauncher';
import { useAnalyses } from '@/app/explore/(content)/simulation-campaigns/shared';
import Link from '@/components/Link';

const DynamicPDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
});

type AnalysisPDF = FileDistribution & { name?: string };

type AnalysisType = 'all' | 'traces' | 'scores' | 'distribution' | 'other' | 'custom';

interface Props {
  distributions: AnalysisPDF[];
}

export function PDFViewerContainer({ distributions }: Props) {
  const [type, setType] = useState<AnalysisType>('all');
  const [analyses] = useAnalyses('EModel');
  const [analysis, setAnalysis] = useState('');

  const filteredDistributions = distributions.filter((distribution) =>
    matchesType(distribution, type)
  );

  const groupedDistributions = groupBy(filteredDistributions, (distribution: AnalysisPDF) =>
    nameToType(distribution.name ?? distribution.label)
  );

  const groupedDistributionsAll = groupBy(distributions, (distribution: AnalysisPDF) =>
    nameToType(distribution.name ?? distribution.label)
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const onScroll = () => {
    setScrollPosition(scrollContainerRef.current?.scrollLeft || 0);
  };

  const scroll = (scrollOffset: number) => {
    scrollContainerRef.current?.scrollBy({
      top: 0,
      left: scrollOffset,
      behavior: 'smooth',
    });
  };

  const canScrollLeft = type === 'all' && scrollPosition > 0;
  const canScrollRight =
    type === 'all' &&
    scrollPosition <
      (scrollContainerRef.current?.scrollWidth ?? 0) -
        (scrollContainerRef.current?.clientWidth ?? 0) -
        5;

  return (
    <div style={{ width: '90vw' }}>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 0,
            colorBorder: '#003A8C',
            colorText: '#003A8C',
            colorTextQuaternary: '#003A8C',
          },
        }}
      >
        <div className="flex items-center justify-between pl-2">
          <div className="flex space-x-10">
            {options.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`cursor-pointer text-primary-8 focus:outline-none ${type === option.value ? 'font-bold' : ''}`}
                onClick={() => setType(option.value)}
              >
                {option.label}
                <span className="pl-1 text-neutral-4">
                  (
                  {option.value === 'all'
                    ? distributions.length
                    : groupedDistributionsAll[option.label]?.length || 0}
                  )
                </span>
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            <Button
              type="text"
              icon={<LeftOutlined className={!canScrollLeft ? 'text-neutral-4' : ''} />}
              disabled={!canScrollLeft}
              onClick={() => scroll(-300)}
            />
            <Button
              type="text"
              icon={<RightOutlined className={!canScrollRight ? 'text-neutral-4' : ''} />}
              disabled={!canScrollRight}
              onClick={() => scroll(300)}
            />
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={onScroll}
          className="overflow-x-auto"
          style={{ width: '100%', overflowX: 'scroll' }}
        >
          {type !== 'custom' ? (
            <div className="flex gap-x-16" style={{ minWidth: 'min-content' }}>
              {Object.entries(groupedDistributions).map(([pdfType, groupedDistribution]) => (
                <div style={{ minWidth: '30%' }} key={pdfType}>
                  {groupedDistribution.map((pdf, index) => (
                    <DynamicPDFViewer
                      url={pdf.contentUrl}
                      type={index === 0 ? pdfType : undefined}
                      key={pdf.contentUrl}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <Select
              className="m-3 inline-block w-44"
              options={analyses.map((a) => ({
                label: a.name,
                value: a['@id'],
              }))}
              onChange={(value: string) => setAnalysis(value)}
            />
          )}
        </div>
        <Link
          className="ml-2 inline-flex items-center"
          href="/simulate/experiment-analysis?targetEntity=EModel"
          aria-label="Add analysis"
        >
          <PlusOutlined className="mr-3 inline-block border" />
          Add analysis
        </Link>

        <EModelAnalysisLauncher analysis={analyses.find((a) => a['@id'] === analysis)} />
      </ConfigProvider>
    </div>
  );
}

type Option = {
  label: string;
  value: AnalysisType;
};

const options: Option[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Traces',
    value: 'traces',
  },
  {
    label: 'Scores',
    value: 'scores',
  },
  {
    label: 'Distribution',
    value: 'distribution',
  },
  {
    label: 'Other',
    value: 'other',
  },
  { label: 'Custom', value: 'custom' },
];

const matchesType = (distribution: AnalysisPDF, type: AnalysisType) => {
  if (distribution.encodingFormat !== 'application/pdf') {
    return false;
  }

  if (type === 'all') {
    return true;
  }

  const name = distribution.name ?? distribution.label;
  const lowerCaseName = name.toLowerCase();

  if (type === 'other') {
    return !(
      lowerCaseName.endsWith('distribution.pdf') ||
      lowerCaseName.endsWith('traces.pdf') ||
      lowerCaseName.endsWith('scores.pdf')
    );
  }

  return lowerCaseName.includes(type);
};

const nameToType = (name: string) => {
  if (name.toLowerCase().endsWith('distribution.pdf')) {
    return 'Distribution';
  }
  if (name.toLowerCase().endsWith('traces.pdf')) {
    return 'Traces';
  }
  if (name.toLowerCase().endsWith('scores.pdf')) {
    return 'Scores';
  }
  return 'Other';
};
