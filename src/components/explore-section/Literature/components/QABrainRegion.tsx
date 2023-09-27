import { useAtomValue } from 'jotai';
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import usePathname from '@/hooks/pathname';
import { classNames } from '@/util/utils';
import { SelectedBrainRegionPerQuestion } from '@/types/literature';
import { BrainIcon } from '@/components/icons';
import { literatureSelectedBrainRegionAtom } from '@/state/brain-regions';

export function QABrainRegionPerQuestion({ id, title }: SelectedBrainRegionPerQuestion) {
  return (
    <div
      id={`brain-region-${id}`}
      className="inline-flex items-center justify-between w-full min-w-full gap-2 px-4 py-2 rounded-sm bg-neutral-1 text-primary-8"
    >
      <BrainIcon />
      <div title={title} className="flex-1 w-full text-base font-bold line-clamp-1">
        {title}
      </div>
    </div>
  );
}

function QAContextBrainRegion() {
  const selectedBrainRegion = useAtomValue(literatureSelectedBrainRegionAtom);
  const isSelectedBrainRegionExists = Boolean(selectedBrainRegion?.id);

  return (
    <div
      className={classNames(
        'flex justify-between gap-2 px-4 py-4 rounded-sm',
        isSelectedBrainRegionExists ? 'bg-primary-0 text-primary-8' : 'bg-neutral-1 text-primary-8'
      )}
    >
      <div
        title={!isSelectedBrainRegionExists ? 'All regions' : selectedBrainRegion?.title}
        className="flex-1 text-lg font-bold line-clamp-1"
        data-testid="selected-brain-region"
      >
        {!isSelectedBrainRegionExists ? 'All regions' : selectedBrainRegion?.title}
      </div>
      <InfoCircleOutlined className="text-lg text-primary-8" />
    </div>
  );
}

function QABrainRegion() {
  const pathname = usePathname();
  const isBuildSection = pathname?.startsWith('/build');
  const router = useRouter();

  if (!isBuildSection) return null;
  return (
    <div className="px-4">
      <Button
        onClick={() => router.back()}
        className="rounded-none flex items-center text-primary-8 py-6 mb-6"
      >
        <ArrowLeftOutlined /> Back to configuration
      </Button>
      <div className="mb-2 text-lg font-medium text-primary-8">Current context of search: </div>
      <QAContextBrainRegion />
    </div>
  );
}

export default QABrainRegion;
