'use client';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import {
  NeuronViwer,
  SynaptomeConfigurationForm,
} from '@/components/build-section/virtual-lab/synaptome';
import { MEModelResource } from '@/types/me-model';
import { useModel } from '@/hooks/useModel';
import { Content, Label, LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { generateLabUrl } from '@/util/virtual-lab/urls';
import SideMenu from '@/components/SideMenu';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

function Synaptome({ params: { virtualLabId, projectId } }: Props) {
  const { id } = useResourceInfoFromPath();
  const { loading, resource } = useModel<MEModelResource>({ modelId: id, org: virtualLabId, project: projectId });
  const labUrl = generateLabUrl(virtualLabId);

  const labProjectUrl = `${labUrl}/project/${projectId}`;

  if (loading || !resource) {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  return (
    <div className="grid max-h-screen grid-cols-[min-content_auto] overflow-hidden bg-white">
      <SideMenu
        links={[
          {
            key: LinkItemKey.Build,
            href: `${labProjectUrl}/build`,
            content: Content.Build,
            styles: 'rounded-full bg-primary-5 py-3 text-primary-9 w-2/3',
          },
        ]}
        lab={{
          key: LinkItemKey.VirtualLab,
          id: virtualLabId,
          label: Label.VirtualLab,
          href: `${labUrl}/overview`,
        }}
        project={{
          key: LinkItemKey.Project,
          id: projectId,
          virtualLabId,
          label: Label.Project,
          href: `${labProjectUrl}/home`,
        }}
      />
      <div className="grid w-full grid-cols-2">
        <div className="flex items-center justify-center bg-black">
          <DefaultLoadingSuspense>
            <NeuronViwer useEvents useActions modelSelfUrl={resource._self} />
          </DefaultLoadingSuspense>
        </div>
        <div className="secondary-scrollbar h-screen w-full overflow-y-auto p-8">
          <SynaptomeConfigurationForm
            {...{
              resource,
              org: virtualLabId,
              project: projectId,
              resourceLoading: loading,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Synaptome;
