'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { useAtom } from 'jotai';
import { useState } from 'react';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { campaignNameAtom, campaignDescriptionAtom } from '@/state/experiment-designer';
import { BrainConfigSelector } from '@/components/simulate';
import { BrainModelConfigResource } from '@/types/nexus';
import { classNames } from '@/util/utils';
import Link from '@/components/Link';

const expDesBaseUrl = '/experiment-designer/experiment-setup';

export default function BrainConfigSelectorPage() {
  const [campaignName, setCampaignName] = useAtom(campaignNameAtom);
  const [campaignDescription, setCampaignDescription] = useAtom(campaignDescriptionAtom);
  const [expDesUrl, setExpDesUrl] = useState('');

  const onCircuitSelect = (selectedConfig: BrainModelConfigResource) => {
    const id = selectedConfig['@id'].split('/').pop();
    setExpDesUrl(`${expDesBaseUrl}?brainModelConfigId=${id}`);
  };

  return (
    <div className="flex flex-col grow">
      <div className="max-w-2xl">
        <div className="mb-14">
          <span className="block text-xl font-bold mb-2">Campaign Name</span>
          <input
            defaultValue={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            type="text"
            placeholder="My campaign name..."
            className="block border-b border-b-primary-1 placeholder-primary-3 bg-primary-9 h-7 py-5 w-full"
          />
        </div>
        <div className="mb-14">
          <span className="block text-xl font-bold mb-2">Campaign Description</span>
          <textarea
            defaultValue={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            placeholder="Simulation campaign description..."
            className="block w-full min-h-10 p-3 text-black"
            rows={4}
          />
        </div>
      </div>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="grow">
          <BrainConfigSelector onSelect={onCircuitSelect} />
        </div>
      </ErrorBoundary>

      <Link
        href={expDesUrl}
        className={classNames(
          expDesUrl ? 'bg-secondary-2 ' : 'bg-slate-400 cursor-not-allowed',
          'flex text-white h-12 px-8 fixed bottom-4 right-4 items-center'
        )}
      >
        Confirm
      </Link>
    </div>
  );
}
