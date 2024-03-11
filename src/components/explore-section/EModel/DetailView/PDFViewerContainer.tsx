import dynamic from 'next/dynamic';
import { ConfigProvider, Select } from 'antd';
import { useState } from 'react';
import { FileDistribution } from '@/types/explore-section/delta-properties';
import EModelAnalysisLauncher from '@/components/explore-section/EModel/DetailView/EModelAnalysisLauncher';
import { useAnalyses } from '@/app/explore/(content)/simulation-campaigns/shared';

const DynamicPDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
});

type AnalysisPDF = FileDistribution & { name?: string };

type AnalysisType = 'all' | 'trace' | 'score' | 'distribution' | 'custom';

interface Props {
  distributions: AnalysisPDF[];
}

export function PDFViewerContainer({ distributions }: Props) {
  const [type, setType] = useState<AnalysisType>('all');
  const [analyses] = useAnalyses('EModel');
  const [analysis, setAnalysis] = useState('');

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
      {type !== 'custom' &&
        distributions
          .filter((distribution) => matchesType(distribution, type))
          .map((pdf) => (
            <DynamicPDFViewer
              url={pdf.contentUrl}
              key={pdf.contentUrl}
              type={nameToType(pdf.name ?? pdf.label)}
            />
          ))}

      {type === 'custom' && (
        <Select
          className="m-3 w-44"
          options={analyses.map((a) => ({
            label: a.name,
            value: a['@id'],
          }))}
          onChange={(value: string) => setAnalysis(value)}
        />
      )}

      <EModelAnalysisLauncher analysis={analyses.find((a) => a['@id'] === analysis)} />
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
  return name.toLowerCase().includes(type);
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
