import { useMemo, useState } from 'react';
import { AnalysisReportLink, CumulativeAnalysisReportWContrib } from './types';
import SimulationsDisplayGrid from './SimulationsDisplayGrid';
import DimensionSelector from './DimensionSelector';
import { useEnsuredPath, useUnwrappedValue } from '@/hooks/hooks';
import { SimulationCampaignResource } from '@/types/explore-section/resources';

import { detailFamily } from '@/state/explore-section/detail-view-atoms';
import { getAnalysisReportsAtom } from '@/state/explore-section/simulation-campaign';
import { AnalysisReportWithImage } from '@/types/explore-section/es-analysis-report';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

export default function CustomAnalysisReport({
  cumulativeReport,
}: {
  cumulativeReport: CumulativeAnalysisReportWContrib;
}) {
  const path = useEnsuredPath();
  const resourceInfo = useResourceInfoFromPath();
  const [customReports, setCustomReports] = useState<AnalysisReportWithImage[]>([]);
  const analysisReports = useUnwrappedValue(getAnalysisReportsAtom(path));

  const resource = useUnwrappedValue(detailFamily(resourceInfo)) as
    | SimulationCampaignResource
    | undefined;

  useMemo(() => {
    const customReportsById =
      cumulativeReport.hasPart?.reduce((acc: Record<string, AnalysisReportLink>, cr) => {
        acc[cr['@id']] = cr;
        return acc;
      }, {}) ?? {};

    const filteredReports = analysisReports?.filter((r) => r['@id'] in customReportsById);
    setCustomReports(filteredReports || []);
  }, [cumulativeReport, analysisReports]);

  return (
    resource && (
      <>
        <DimensionSelector coords={resource.parameter?.coords} />
        <SimulationsDisplayGrid status="Done" customAnalysisReports={customReports} />
      </>
    )
  );
}
