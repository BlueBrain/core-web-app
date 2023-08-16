/* eslint-disable jsx-a11y/label-has-associated-control */

import { useAtom } from 'jotai';
import { InfoCircleOutlined } from '@ant-design/icons';

import { Switch } from 'antd';
import usePathname from '@/hooks/pathname';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { classNames } from '@/util/utils';

function QABrainRegion() {
  const pathname = usePathname();
  const isBuildSection = pathname?.startsWith('/build');
  const [selectedBrainRegion, updateSelectedBrainRegion] = useAtom(selectedBrainRegionAtom);
  const isSelectedBrainRegionExists = Boolean(selectedBrainRegion?.id);
  const onToggleAllBrainRegion = () => updateSelectedBrainRegion(null);

  if (!isBuildSection) return null;
  return (
    <div className="px-4">
      <div className="mb-2 text-lg font-medium text-primary-8">Current context of search: </div>
      <div
        className={classNames(
          'flex justify-between gap-2 px-4 py-4 rounded-sm',
          isSelectedBrainRegionExists
            ? 'bg-primary-0 text-primary-8'
            : 'bg-neutral-1 text-primary-8'
        )}
      >
        <div
          title={!isSelectedBrainRegionExists ? 'All regions' : selectedBrainRegion?.title}
          className="flex-1 text-lg font-bold line-clamp-1"
        >
          {!isSelectedBrainRegionExists ? 'All regions' : selectedBrainRegion?.title}
        </div>
        <InfoCircleOutlined className="text-lg text-primary-8" />
      </div>
      <label
        htmlFor="select-all-brains"
        className="inline-flex items-center gap-2 my-2 cursor-pointer"
      >
        <Switch
          id="select-all-brains"
          size="small"
          disabled={!isSelectedBrainRegionExists}
          className="text-sm bg-primary-8"
          checked={!isSelectedBrainRegionExists}
          onChange={onToggleAllBrainRegion}
        />
        <span className="text-base text-primary-8">Search in all brain regions</span>
      </label>
    </div>
  );
}

export default QABrainRegion;
