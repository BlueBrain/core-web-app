import TimeRange from './TimeRange';
import TimeMarkers from './TimeMarkers';
import TimeSlider from './TimeSlider';
import { classNames } from '@/util/utils';

export default function Timeline({ disabled = false }: { disabled: boolean }) {
  return (
    <div
      className={classNames(
        'w-8/12 transition-all duration-500 grow',
        disabled && 'pointer-events-none opacity-60 grayscale'
      )}
    >
      <div className="w-full overflow-hidden">
        <div className="flex flex-col pt-1 px-3">
          <TimeMarkers />
          <TimeSlider />
          <TimeRange />
        </div>
      </div>
    </div>
  );
}
