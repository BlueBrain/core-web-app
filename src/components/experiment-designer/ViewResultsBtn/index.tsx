import { useAtomValue } from 'jotai';

import { idAtom as simCampUIConfigId } from '@/state/experiment-designer';
import Link from '@/components/Link';
import { classNames } from '@/util/utils';
import GenericButton from '@/components/Global/GenericButton';

const exploreBaseUrl = '/explore/simulation-campaigns/test';

type Props = {
  className?: string;
};

export default function ViewResultsBtn({ className }: Props) {
  const currentSimCampUIConfigId = useAtomValue(simCampUIConfigId);
  const collapsedId = currentSimCampUIConfigId?.split('/').pop();

  const style = classNames(className, 'border-primary-3 bg-transparent text-primary-3');

  return (
    <Link href={`${exploreBaseUrl}?simCampaignId=${collapsedId}`}>
      <GenericButton text="View Results" className={style} />
    </Link>
  );
}
