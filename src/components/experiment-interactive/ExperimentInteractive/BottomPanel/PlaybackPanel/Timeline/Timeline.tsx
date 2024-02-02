import TimeRange from './TimeRange';
import TimeMarkers from './TimeMarkers';
import TimeSlider from './TimeSlider';
import { classNames } from '@/util/utils';

export default function Timeline({ disabled = false }: { disabled: boolean }) {
  return (
    <div
      className={classNames(
        'w-8/12 grow transition-all duration-500',
        disabled && 'pointer-events-none opacity-60 grayscale'
      )}
    >
      <div className="w-full overflow-hidden">
        <div className="flex flex-col px-3 pt-1">
          <TimeMarkers />
          <TimeSlider />
          <TimeRange />
        </div>
      </div>
    </div>
  );
}
