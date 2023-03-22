'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import moment from 'moment';

import { useSession } from 'next-auth/react';
import { Dimension, Campaign, SideLink } from '@/types/observatory';
import CampaignDetails from '@/components/observatory/CampaignDetails';
import DimensionFilter from '@/components/observatory/DimensionFilter';
import SpikeRaster from '@/components/observatory/SpikeRaster';
import CampaignVideo from '@/components/observatory/CampaignVideo';
import Sidebar from '@/components/observatory/Sidebar';
import { nexus } from '@/config';

import REPORT_SPARQL_QUERY from '@/constants/observatory';

function Observatory() {
  const [campaign, setCampaign] = useState<Campaign>({
    id: '',
    self: '',
    name: '',
    org: '',
    project: '',
    status: '',
    updatedAt: '',
    updatedBy: '',
    createdAt: '',
    description: '',
  });

  const [reportData, setReportData] = useState([
    {
      analysis_report_self: { value: '' },
    },
  ]);

  const [campaignImages, setCampaignImages] = useState<string[]>([]);
  const [campaignVideos, setCampaignVideos] = useState<string[]>([]);

  const { data: session } = useSession();

  const path = usePathname();

  useEffect(() => {
    async function fetchSimCampaign() {
      const parts = path?.split('/');
      if (!session?.user || !path || parts === undefined) return;
      const id = atob(parts[parts.length - 1]);

      if (!id || !path) return;

      const simCampaignResponse = await fetch(`${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      const simCampaignInfo = await simCampaignResponse.json();
      if (!simCampaignInfo._self) return;

      const transformedCampaign = {
        id: simCampaignInfo['@id'],
        self: simCampaignInfo._self,
        name: simCampaignInfo.name,
        org: simCampaignInfo._self.split('/')[6],
        status: simCampaignInfo.status,
        project: simCampaignInfo._project.split('/').pop(),
        description: simCampaignInfo.description,
        createdAt: moment(simCampaignInfo._createdAt).format('MMM Do YY'),
        updatedAt: moment(simCampaignInfo._updatedAt).format('MMM Do YY'),
        updatedBy:
          simCampaignInfo._updatedBy && simCampaignInfo._updatedBy !== ''
            ? simCampaignInfo._updatedBy.split('/').pop()
            : '',
      };
      setCampaign(transformedCampaign);
    }
    fetchSimCampaign();
  }, [session, path]);

  useEffect(() => {
    if (!campaign.id || !session?.user) return;
    async function fetchReportData() {
      const analysisSparqlQuery = REPORT_SPARQL_QUERY.replaceAll('{resourceId}', campaign.id);
      const sparqUrl = `${nexus.url}/views/${campaign.org}/${campaign.project}/graph/sparql`;
      const reportInfo = fetch(sparqUrl, {
        method: 'POST',
        body: analysisSparqlQuery,
        headers: {
          'Content-Type': 'application/sparql-query',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }).then((res) => res.json());

      const responses = await Promise.all([reportInfo]);

      if (responses && responses[0]?.results?.bindings)
        setReportData(responses[0].results.bindings);
    }
    fetchReportData();
  }, [campaign]);

  useEffect(() => {
    if (!reportData[0]?.analysis_report_self?.value || !session?.user || !campaign.id) return;
    const imagesArray: string[] = [];
    const videosArray: string[] = [];
    async function fetchImageData() {
      await Promise.all(
        reportData.map(async (report) => {
          const reportSelf = report.analysis_report_self.value;
          const reportInfoResponse = await fetch(reportSelf, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.accessToken}`,
            },
          });
          const reportInfo = await reportInfoResponse.json();
          if (!reportInfo.hasPart.distribution.contentUrl['@id']) return;

          const assetUuid = reportInfo.hasPart.distribution.contentUrl['@id'].split('/').pop();
          const assetUrl = `${nexus.url}/files/${campaign.org}/${campaign.project}/${assetUuid}`;

          const distributionAssetResponse = await fetch(assetUrl, {
            method: 'GET',
            headers: {
              'Content-Type': '*/*',
              Authorization: `Bearer ${session?.accessToken}`,
            },
          });
          const assetBlob = await distributionAssetResponse.blob();

          const blob = URL.createObjectURL(assetBlob);
          if (assetBlob.type.includes('image')) imagesArray.push(blob);
          if (assetBlob.type.includes('video')) videosArray.push(blob);
        })
      );
    }

    fetchImageData().then(() => {
      setCampaignImages(imagesArray);
      setCampaignVideos(videosArray);
    });
  }, [reportData]);

  const dimensions: Dimension[] = [
    {
      key: '1',
      dimensionValues: 'Dimension Values',
      startedAt: '4 days ago',
      endedAt: '3 days ago',
      status: 'Completed',
    },
    {
      key: '2',
      dimensionValues: 'Dimension Values',
      startedAt: '4 days ago',
      endedAt: '3 days ago',
      status: 'Completed',
    },
  ];
  const links: Array<SideLink> = [{ url: '/simulation-campaigns', title: 'Simulation Campaigns' }];

  return (
    <div className="flex h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar links={links} />

      <div className="w-full h-full flex flex-col">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {campaign.id !== '' && campaign.self !== '' && <CampaignDetails {...campaign} />}
        <div className="bg-white p-7 text-primary-7 font-bold">
          Total simulations in campaign: 4000
        </div>
        <div className="w-full flex-initial pl-4 pt-4">
          {dimensions && <DimensionFilter dimensions={dimensions} />}
        </div>
        <div className="w-full h-full flex-1 bg-white p-4">
          <h1 className="text-xl font-bold mt-4 text-primary-7">Raster Images</h1>
          <div className="flex flex-row pt-4">
            {campaignImages.map((imageSrc) => (
              <SpikeRaster key={imageSrc} rasterImage={imageSrc} />
            ))}
            {campaignVideos.map((videoSrc) => (
              <CampaignVideo key={videoSrc} campaignVideo={videoSrc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Observatory;
