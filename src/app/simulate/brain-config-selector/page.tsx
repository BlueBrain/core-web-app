'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { useAtom } from 'jotai';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { campaignNameAtom, campaignDescriptionAtom } from '@/state/experiment-designer';
import { BrainConfigSelector, ConfirmBtn } from '@/components/simulate';
import { BrainModelConfigResource } from '@/types/nexus';
import { idAtom as brainModelConfigId } from '@/state/brain-model-config';

function RequiredMessage({ text, fieldName }: { text: string; fieldName: string }) {
  const message = `This field is required. Please enter the campaign ${fieldName}`;
  return <div className="text-[#F46060] text-sm py-1 h-6">{text.length ? '' : message}</div>;
}

export default function BrainConfigSelectorPage() {
  const [campaignName, setCampaignName] = useAtom(campaignNameAtom);
  const [campaignDescription, setCampaignDescription] = useAtom(campaignDescriptionAtom);
  const [currentId, setId] = useAtom(brainModelConfigId);

  const onCircuitSelect = (selectedConfig: BrainModelConfigResource) => {
    setId(selectedConfig['@id']);
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
          <RequiredMessage text={campaignName} fieldName="name" />
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
          <RequiredMessage text={campaignDescription} fieldName="description" />
        </div>
      </div>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="grow">
          <BrainConfigSelector onSelect={onCircuitSelect} />
        </div>
      </ErrorBoundary>

      <ConfirmBtn
        brainModelConfigId={currentId}
        campaignName={campaignName}
        campaignDescription={campaignDescription}
      />
    </div>
  );
}
