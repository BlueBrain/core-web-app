import { Tag } from 'antd';
import { Campaign } from '@/types/nexus';

export default function CampaignDetails(campaign: Campaign) {
  const currentCampaign = campaign;
  return (
    <div className="p-7 bg-white">
      <div className="text-xs text-primary-7">Simulation Campaign</div>
      <div className="font-bold text-xl text-primary-7">{currentCampaign.name}</div>
      <div className="flex justify-between mt-10">
        <div className="flex-1 text-primary-7 text-xs mr-4">
          <div className="uppercase text-neutral-4">Description</div>
          <div className="mt-3">{currentCampaign.description}</div>
        </div>

        <div className="flex-1 text-primary-7 text-xs mr-4">
          <div className="text-xs uppercase text-neutral-4">Brain Configuration</div>
          <div className="mt-3">Release 23.01</div>
        </div>
        <div className="flex-1 text-primary-7 text-xs mr-4">
          <div className="text-xs uppercase text-neutral-4">Dimensions</div>
          <div className="mt-3">
            <ul>
              <li>Name of dimension 1</li>
              <li>Name of dimension 2</li>
              <li>Name of dimension 3</li>
            </ul>
          </div>
        </div>
        <div className="flex-1 text-primary-7 text-xs mr-4">
          <div className="text-xs uppercase text-neutral-4">Attribute</div>
          <div className="mt-3">Attribute</div>
        </div>
        <div className="flex-1 text-primary-7 text-xs mr-4">
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
        <div className="flex-1 text-primary-7 text-xs mr-4">
          <div className="text-xs uppercase text-neutral-4">Status</div>
          <div className="mt-3">{currentCampaign.status}</div>
        </div>
      </div>
      <div className="flex mt-10">
        <div className="text-primary-7 text-xs mr-10">
          <div className="text-xs uppercase text-neutral-4">User</div>
          <div className="mt-3 capitalize">{currentCampaign.updatedBy}</div>
        </div>
        <div className="text-primary-7 text-xs mr-4">
          <div className="text-xs uppercase text-neutral-4">Updated at</div>
          <div className="mt-3">{currentCampaign.updatedAt}</div>
        </div>
      </div>
    </div>
  );
}
