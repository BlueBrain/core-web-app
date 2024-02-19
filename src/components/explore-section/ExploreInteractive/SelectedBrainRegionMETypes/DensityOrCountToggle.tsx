import * as Switch from '@radix-ui/react-switch';
import { DensityOrCount } from './types';
import { classNames } from '@/util/utils';

export function DensityOrCountToggle({
  densityOrCount,
  selectDensityOrCount,
}: {
  densityOrCount: DensityOrCount;
  selectDensityOrCount: (densityOrCount: DensityOrCount) => void;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      <span className="font-light">Display:</span>
      <div className="flex items-center">
        <span className={classNames(densityOrCount === 'count' && 'font-bold')}>count</span>
        <Switch.Root
          className="group relative mx-4 flex h-[16px] w-8 items-center rounded-full border border-white data-[state=checked]:bg-white"
          title="density or count"
          onCheckedChange={(checked) => {
            if (checked) {
              selectDensityOrCount('density');
            } else {
              selectDensityOrCount('count');
            }
          }}
        >
          <Switch.Thumb
            className={`block h-[10px] w-[10px] translate-x-[2px] rounded-full transition-transform duration-100 will-change-transform
              group-[data-disabled]:bg-gray-500 data-[state=checked]:translate-x-4
              data-[state=checked]:bg-black
              data-[state=unchecked]:bg-white`}
          />
        </Switch.Root>
        <span className={classNames(densityOrCount === 'density' && 'font-bold')}>density</span>
      </div>
    </div>
  );
}
