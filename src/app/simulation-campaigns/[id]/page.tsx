'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import moment from 'moment';

import { useSession } from 'next-auth/react';
import Link from '@/components/Link';
import { Dimension, Campaign } from '@/types/nexus';
import CampaignDetails from '@/components/observatory/CampaignDetails';
import DimensionFilter from '@/components/observatory/DimensionFilter';
import SpikeRaster from '@/components/observatory/SpikeRaster';
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

  const [reportData, setReportData] = useState({
    analysis_report_self: { value: '' },
  });
  const [rasterImage, setRasterImage] = useState('');

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
      const sparqUrl = `https://staging.nise.bbp.epfl.ch/nexus/v1/views/${campaign.org}/${campaign.project}/graph/sparql`;
      const reportInfo = fetch(sparqUrl, {
        method: 'POST',
        body: analysisSparqlQuery,
        headers: {
          'Content-Type': 'application/sparql-query',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }).then((res) => res.json());

      const responses = await Promise.all([reportInfo]);
      setReportData(responses[0].results.bindings[0]);
    }
    fetchReportData();
  }, [session, campaign]);

  useEffect(() => {
    if (!reportData?.analysis_report_self?.value || !session?.user || !campaign.id) return;
    async function fetchImageData() {
      const reportSelf = reportData.analysis_report_self.value;
      const assetPromise = await fetch(reportSelf, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const assetInfo = await assetPromise.json();

      if (!assetInfo.hasPart.distribution.contentUrl['@id']) return;

      const imageUuid = assetInfo.hasPart.distribution.contentUrl['@id'].split('/').pop();
      const imageUrl = `https://staging.nise.bbp.epfl.ch/nexus/v1/files/${campaign.org}/${campaign.project}/${imageUuid}`;

      const imagePromise = await fetch(imageUrl, {
        method: 'GET',
        headers: {
          'Content-Type': '*/*',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const imageInfo = await imagePromise.blob();
      const blob = URL.createObjectURL(imageInfo);
      setRasterImage(blob);
    }

    fetchImageData();
  }, [session, campaign, reportData]);

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

  return (
    <div className="flex h-screen" style={{ background: '#d1d1d1' }}>
      <div className="bg-primary-9 text-light w-10">
        <Link
          href="/observatory"
          className="block text-sm"
          style={{ transform: 'translate(-37%, 100px) rotate(-90deg)', width: 'max-content' }}
        >
          Simulation Observatory
        </Link>
      </div>
      <div className="bg-primary-8 text-light w-10">
        <Link
          href="/simulation-campaigns"
          className="block text-sm"
          style={{ transform: 'translate(-37%, 100px) rotate(-90deg)', width: 'max-content' }}
        >
          Simulation Campaign
        </Link>
      </div>

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
          <div className="flex abosolute flex-row pt-4">
            {rasterImage && <SpikeRaster rasterImage={rasterImage} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Observatory;
