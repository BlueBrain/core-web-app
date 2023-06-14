import { useAtomValue } from 'jotai';

import { idAtom as simCampUIConfigId } from '@/state/experiment-designer';
import Link from '@/components/Link';
import { classNames } from '@/util/utils';

const exploreBaseUrl = '/explore/simulation-campaigns/test';

type Props = {
  className?: string;
};

export default function ViewResultsBtn({ className }: Props) {
  const currentSimCampUIConfigId = useAtomValue(simCampUIConfigId);
  const collapsedId = currentSimCampUIConfigId?.split('/').pop();

  const style = classNames(className, 'border border-primary-3 bg-transparent text-primary-3');

  return (
    <Link href={`${exploreBaseUrl}?simCampaignId=${collapsedId}`} className={style}>
      View Results
    </Link>
  );
}
