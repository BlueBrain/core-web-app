import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useMemo } from 'react';
import { DeltaResource } from '@/types/explore-section/resources';
import { IdLabel } from '@/types/explore-section/fields';
import { contributorsDataAtom } from '@/state/explore-section/detail-view-atoms';
import ListField from '@/components/explore-section/Fields/ListField';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

/**
 * DeltaResource is the raw data interface recived from a reequest to nexus
 * DetailAtomResource used by the detailAtom variable extends DeltaResource using response from formatContributors
 * @param {import("./types/explore-section").DeltaResource} contributor
 */
export const formatContributors = (contributor: DeltaResource | null): IdLabel => {
  if (!contributor) return {};

  const { name, familyName, givenName, '@id': id } = contributor;

  if (name) return { id, label: name };
  if (familyName && givenName) return { id, label: `${givenName} ${familyName}` };

  return { id };
};

/**
 * Takes array of contributor Delta resources and returns an array of names
 * @param {import("./types/explore-section").DeltaResource[]} contributors
 */
export const contributorLabelParser = (contributors: DeltaResource[] | null) => {
  if (!contributors) return null;
  const result = contributors
    .map((contributor) => formatContributors(contributor))
    .filter((contributor) => !!contributor.label);
  return result.length > 0 ? result : null;
};

export default function Contributors() {
  const resourceInfo = useResourceInfoFromPath();

  const contributors = useAtomValue(
    useMemo(() => loadable(contributorsDataAtom(resourceInfo)), [resourceInfo])
  );

  if (contributors.state === 'loading') return <Spin indicator={<LoadingOutlined />} />;

  if (contributors.state === 'hasData')
    return <ListField items={contributorLabelParser(contributors.data)} />;

  return <>Not Found</>;
}
