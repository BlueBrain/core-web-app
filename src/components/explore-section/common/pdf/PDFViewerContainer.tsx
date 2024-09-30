import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { ConfigProvider, Select, Button } from 'antd';
import { PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import groupBy from 'lodash/groupBy';
import { AnalysisFileType, AnalysisPDF, AnalysisType } from './types';
import EModelAnalysisLauncher from '@/components/explore-section/EModel/DetailView/EModelAnalysisLauncher';
import { useAnalyses } from '@/app/explore/(content)/simulation-campaigns/shared';
import Link from '@/components/Link';

const DynamicPDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
});

const fileTypeToType: { [key in AnalysisFileType]: AnalysisType } = {
  [AnalysisFileType.Traces]: AnalysisType.Traces,
  [AnalysisFileType.Scores]: AnalysisType.Scores,
  [AnalysisFileType.Distribution]: AnalysisType.Distribution,
  [AnalysisFileType.Thumbnail]: AnalysisType.Thumbnail,
  [AnalysisFileType.Currentscape]: AnalysisType.Other,
};

interface Props {
  distributions: AnalysisPDF[];
}

const VIEWABLE_FORMATS = ['application/pdf', 'image/png'];

const isViewable = (distribution: AnalysisPDF) => {
  return VIEWABLE_FORMATS.includes(distribution.encodingFormat);
};

export function PDFViewerContainer({ distributions }: Props) {
  const [type, setType] = useState<AnalysisType>(AnalysisType.All);
  const [analyses] = useAnalyses('EModel');
  const [analysis, setAnalysis] = useState('');

  const viewableDistributions = distributions.filter(isViewable);

  const currentDistributions = viewableDistributions.filter((distribution) =>
    matchesType(distribution, type)
  );

  const groupedDistributions = groupBy(currentDistributions, (distribution: AnalysisPDF) =>
    nameToType(distribution.name ?? distribution.label)
  );

  const groupedDistributionsAll = groupBy(viewableDistributions, (distribution: AnalysisPDF) =>
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

  const canScrollLeft = type === AnalysisType.All && scrollPosition > 0;
  const canScrollRight =
    type === AnalysisType.All &&
    scrollPosition <
      (scrollContainerRef.current?.scrollWidth ?? 0) -
        (scrollContainerRef.current?.clientWidth ?? 0) -
        5;

  return (
    <div className="w-full">
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
        <div className="flex flex-wrap items-center justify-between pl-2">
          <div className="my-4 flex flex-wrap gap-x-10 gap-y-4">
            {Object.values(AnalysisType).map((option) => (
              <button
                type="button"
                key={option}
                className={`cursor-pointer capitalize text-primary-8 focus:outline-none ${type === option ? 'font-bold' : ''}`}
                onClick={() => setType(option)}
              >
                {option}
                <span className="pl-1 text-neutral-4">
                  (
                  {option === AnalysisType.All
                    ? currentDistributions.length
                    : groupedDistributionsAll[option]?.length || 0}
                  )
                </span>
              </button>
            ))}
          </div>

          {(canScrollLeft || canScrollRight) && (
            <div className="flex gap-2">
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
          )}

          <Link
            className="flex items-center gap-2 text-primary-9"
            href="/simulate/experiment-analysis?targetEntity=EModel"
            aria-label="Add analysis"
          >
            Add analysis
            <span className="flex h-8 w-8 items-center justify-center border">
              <PlusOutlined className="text-md" />
            </span>
          </Link>
        </div>

        <div ref={scrollContainerRef} onScroll={onScroll} className="w-full overflow-x-auto">
          {type !== AnalysisType.Custom ? (
            <div className="flex gap-x-16" style={{ minWidth: 'min-content' }}>
              {Object.entries(groupedDistributions).map(([pdfType, groupedDistribution]) => (
                <div style={{ minWidth: '30%', flexGrow: 1 }} key={pdfType}>
                  {groupedDistribution.map((pdf, index) => {
                    return (
                      <DynamicPDFViewer
                        url={pdf.contentUrl}
                        type={index === 0 ? pdfType : undefined}
                        key={pdf.contentUrl}
                      />
                    );
                  })}
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

        <EModelAnalysisLauncher analysis={analyses.find((a) => a['@id'] === analysis)} />
      </ConfigProvider>
    </div>
  );
}

const matchesType = (distribution: AnalysisPDF, type: AnalysisType) => {
  if (
    distribution.encodingFormat !== 'application/pdf' &&
    distribution.encodingFormat !== 'image/png'
  ) {
    return false;
  }

  if (type === AnalysisType.All) {
    return true;
  }

  const name = distribution.name ?? distribution.label;
  const lowerCaseName = name.toLowerCase();

  if (type === AnalysisType.Other) {
    return !(
      lowerCaseName.endsWith(AnalysisFileType.Distribution) ||
      lowerCaseName.endsWith(AnalysisFileType.Traces) ||
      lowerCaseName.endsWith(AnalysisFileType.Thumbnail) ||
      lowerCaseName.endsWith(AnalysisFileType.Scores)
    );
  }

  return lowerCaseName.includes(type);
};

const nameToType = (name: string): AnalysisType => {
  const lowerCaseName = name.toLowerCase();

  for (const fileTypeValue of Object.values(AnalysisFileType)) {
    if (lowerCaseName.endsWith(fileTypeValue.toLowerCase())) {
      return fileTypeToType[fileTypeValue];
    }
  }

  return AnalysisType.Other;
};
