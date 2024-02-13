import { Tag } from 'antd';
import { Campaign } from '@/types/explore-section/resources';

export default function CampaignDetails(campaign: Campaign) {
  const currentCampaign = campaign;
  return (
    <div className="bg-white p-7">
      <div className="text-xs text-primary-7">Simulation Campaign</div>
      <div className="text-xl font-bold text-primary-7">{currentCampaign.name}</div>
      <div className="mt-10 flex justify-between">
        <div className="mr-4 flex-1 text-xs text-primary-7">
          <div className="uppercase text-neutral-4">Description</div>
          <div className="mt-3">{currentCampaign.description}</div>
        </div>

        <div className="mr-4 flex-1 text-xs text-primary-7">
          <div className="text-xs uppercase text-neutral-4">Brain Configuration</div>
          <div className="mt-3">Release 23.01</div>
        </div>
        <div className="mr-4 flex-1 text-xs text-primary-7">
          <div className="text-xs uppercase text-neutral-4">Dimensions</div>
          <div className="mt-3">
            <ul>
              <li>Name of dimension 1</li>
              <li>Name of dimension 2</li>
              <li>Name of dimension 3</li>
            </ul>
          </div>
        </div>
        <div className="mr-4 flex-1 text-xs text-primary-7">
          <div className="text-xs uppercase text-neutral-4">Attribute</div>
          <div className="mt-3">Attribute</div>
        </div>
        <div className="mr-4 flex-1 text-xs text-primary-7">
          <div className="text-xs uppercase text-neutral-4">Tags</div>
          <div className="mt-3">
            <Tag>Tag 1</Tag>
            <Tag>Tag 2</Tag>
            <Tag>Tag 3</Tag>
            <Tag>Tag 4</Tag>
            <Tag>Tag 5</Tag>
            <Tag>Tag 6</Tag>
          </div>
        </div>
        <div className="mr-4 flex-1 text-xs text-primary-7">
          <div className="text-xs uppercase text-neutral-4">Status</div>
          <div className="mt-3">{currentCampaign.status}</div>
        </div>
      </div>
      <div className="mt-10 flex">
        <div className="mr-10 text-xs text-primary-7">
          <div className="text-xs uppercase text-neutral-4">User</div>
          <div className="mt-3 capitalize">{currentCampaign.updatedBy}</div>
        </div>
        <div className="mr-4 text-xs text-primary-7">
          <div className="text-xs uppercase text-neutral-4">Updated at</div>
          <div className="mt-3">{currentCampaign.updatedAt}</div>
        </div>
      </div>
    </div>
  );
}
