import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { contributorsDataFamily } from '@/state/explore-section/detail-view-atoms';
import ListField from '@/components/explore-section/Fields/ListField';
import { useLoadableValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { Contributor as DeltaContributor } from '@/types/explore-section/delta-contributor';

import { Contributor as ESContributor } from '@/types/explore-section/es-properties';
import { IdLabelWithType, normalizeContributors } from '@/util/explore-section/sort-contributors';

export const formatContributors = (contributor: DeltaContributor | null): IdLabelWithType => {
  if (!contributor) return {};

  const { name, familyName, givenName, '@id': id, '@type': type } = contributor;

  if (name) return { id, type, label: name };

  if (familyName && givenName) return { id, type, label: `${givenName} ${familyName}` };

  return { id, type };
};

export const formatEsContributors = (contributor: ESContributor | null): IdLabelWithType => {
  if (!contributor) return {};

  const { '@id': id, '@type': type, label } = contributor;

  if (label) return { id, type, label };

  return { id, type };
};

export const contributorLabelParser = (contributors: DeltaContributor[] | null) => {
  if (!contributors) return null;

  const result = normalizeContributors<DeltaContributor>(contributors, formatContributors);

  return result.length > 0 ? result : null;
};

export default function Contributors() {
  const resourceInfo = useResourceInfoFromPath();
  const contributors = useLoadableValue(contributorsDataFamily(resourceInfo));

  if (contributors.state === 'loading') return <Spin indicator={<LoadingOutlined />} />;

  if (contributors.state === 'hasData')
    return <ListField<IdLabelWithType> items={contributorLabelParser(contributors.data)} />;

  return <>Not Found</>;
}
