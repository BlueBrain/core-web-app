import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { AnalysisReport, CumulativeAnalysisReportWContrib } from './types';
import SimulationsDisplayGrid from './SimulationsDisplayGrid';
import DimensionSelector from './DimensionSelector';
import { fetchFileByUrl, fetchResourceById } from '@/api/nexus';
import { useSessionAtomValue, useUnwrappedValue } from '@/hooks/hooks';
import {
  ESResponseRaw,
  Simulation,
  SimulationCampaignResource,
} from '@/types/explore-section/resources';

import { detailFamily } from '@/state/explore-section/detail-view-atoms';
import { getResourceInfoFromPath } from '@/state/explore-section/simulation-campaign';
import { AnalysisReportWithImage } from '@/types/explore-section/es-analysis-report';

export default function CustomAnalysisReport({
  cumulativeReport,
}: {
  cumulativeReport: CumulativeAnalysisReportWContrib;
}) {
  const session = useSessionAtomValue();
  const [fetching, setFetching] = useState(true);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [reports, setReports] = useState<AnalysisReportWithImage[]>([]);

  const resource = useUnwrappedValue(
    detailFamily(getResourceInfoFromPath())
  ) as SimulationCampaignResource;

  useEffect(() => {
    (async () => {
      if (!session) return;
      const fetchedAnalysisReports = await Promise.all(
        (cumulativeReport.hasPart ?? []).map((r) =>
          fetchResourceById<AnalysisReport>(r['@id'], session)
        )
      );
      const fetchedsims = await Promise.all(
        (fetchedAnalysisReports ?? []).map((ar) => {
          return fetchResourceById<ESResponseRaw['_source']>(ar.derivation.entity['@id'], session);
        })
      );

      const sims = fetchedsims.map((simulation) => {
        return {
          title: simulation.name,
          completedAt: simulation.endedAtTime,
          dimensions: simulation.parameter?.coords,
          id: simulation['@id'],
          project: simulation._project,
          startedAt: simulation.startedAtTime,
          status: simulation.status,
          createdBy: simulation._createdBy,
        };
      }) as Simulation[];

      const analysisReports = (await Promise.all(
        fetchedAnalysisReports.map(async (r) => ({
          ...r,
          blob: await fetchFileByUrl(r.distribution.contentUrl, session).then((res) => res.blob()),
          simulation: r.derivation.entity['@id'],
        }))
      )) as unknown as AnalysisReportWithImage[];

      setSimulations(sims);
      setReports(analysisReports);

      setFetching(false);
    })();
  }, [cumulativeReport, session, setFetching]);

  return (
    <>
      {fetching && (
        <div className="flex justify-center items-center" style={{ height: 200 }}>
          <Spin indicator={<LoadingOutlined />} />
        </div>
      )}
      {!fetching && (
        <>
          <DimensionSelector coords={resource.parameter?.coords} />
          <SimulationsDisplayGrid
            status="Done"
            simulations={simulations}
            analysisReports={reports}
          />
        </>
      )}
    </>
  );
}
