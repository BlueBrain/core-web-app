import dynamic from 'next/dynamic';
import { ConfigProvider, Select } from 'antd';
import { useState } from 'react';
import { FileDistribution } from '@/types/explore-section/es-properties';

const DynamicPDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
});

type AnalysisPDF = FileDistribution & { name?: string };

type AnalysisType = 'all' | 'trace' | 'score' | 'distribution';

interface Props {
  distributions: AnalysisPDF[];
}

export function PDFViewerContainer({ distributions }: Props) {
  const [type, setType] = useState<AnalysisType>('all');

  return (
    <div>
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
        <Select
          options={options}
          defaultValue="all"
          onChange={(value: AnalysisType) => setType(value)}
          popupMatchSelectWidth={false}
          className="m-3 w-44"
        />
      </ConfigProvider>
      {distributions
        .filter((distribution) => matchesType(distribution, type))
        .map((pdf) => (
          <DynamicPDFViewer
            url={pdf.contentUrl}
            key={pdf.contentUrl}
            name={pdf.name ?? pdf.label}
          />
        ))}
    </div>
  );
}

const options = [
  {
    label: 'All analysis',
    value: 'all',
  },
  {
    label: 'Trace',
    value: 'trace',
  },
  {
    label: 'Scores',
    value: 'score',
  },
  {
    label: 'Distribution',
    value: 'distribution',
  },
];

const matchesType = (distribution: AnalysisPDF, type: AnalysisType) => {
  if (distribution.encodingFormat !== 'application/pdf') {
    return false;
  }

  if (type === 'all') {
    return true;
  }

  const name = distribution.name ?? distribution.label;
  return name.toLowerCase().includes(type);
};
